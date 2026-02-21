import React, { useState, useEffect } from "react";
import { UserButton } from "@clerk/clerk-react";
import { BedDouble, HeartPulse, Wind } from "lucide-react";
import ResourceCard from "../components/ResourceCard";
import UsageChart from "../components/UsageChart";
import InputCard from "../components/InputCard";
import StressHeatmap from "../components/StressHeatmap";
import HSIChart from "../components/HSIChart";
import HSIGauge from "../components/HSIGauge";
import ForecastChart from "../components/ForecastChart";
import AlertPanel from "../components/AlertPanel";

export default function Dashboard() {
  const BASE_URL = import.meta.env.VITE_API_URL;

  /* ================= STATES ================= */

  const [history, setHistory] = useState([]);
  const [hsiTrend, setHsiTrend] = useState([]);
  const [forecastData, setForecastData] = useState([]);

  const [filteredHistory, setFilteredHistory] = useState([]);
  const [filteredHSI, setFilteredHSI] = useState([]);

  const [beds, setBeds] = useState(0);
  const [icu, setIcu] = useState(0);
  const [ventilator, setVentilator] = useState(0);
  const [hsi, setHsi] = useState(0);

  const [tempBeds, setTempBeds] = useState(0);
  const [tempIcu, setTempIcu] = useState(0);
  const [tempVentilator, setTempVentilator] = useState(0);

  const [usageFrom, setUsageFrom] = useState("");
  const [usageTo, setUsageTo] = useState("");

  const [hsiFrom, setHsiFrom] = useState("");
  const [hsiTo, setHsiTo] = useState("");

  const [inputs, setInputs] = useState({});

  const safeNumber = (val) => {
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  };

  /* ================= LOAD USAGE TREND ================= */

  useEffect(() => {
    fetch(`${BASE_URL}/trend`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(item => ({
          day: item.day,
          beds: item.beds,
          icu: item.icu,
          ventilator: item.ventilator
        }));

        setHistory(formatted);
        setFilteredHistory(formatted);
      })
      .catch(err => console.error("Trend error:", err));
  }, []);

  /* ================= LOAD HSI TREND ================= */

  useEffect(() => {
    fetch(`${BASE_URL}/hsi_trend`)
      .then(res => res.json())
      .then(data => {
        setHsiTrend(data);
        setFilteredHSI(data);
      })
      .catch(err => console.error("HSI error:", err));
  }, []);

  /* ================= LOAD FORECAST ================= */

  const fetchForecast = (bedsVal = 70, icuVal = 65, ventVal = 60) => {
    fetch(`${BASE_URL}/forecast?beds=${bedsVal}&icu=${icuVal}&vent=${ventVal}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setForecastData(data);
        }
      })
      .catch(err => console.error("Forecast error:", err));
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  /* ================= AUTO CALCULATE HSI ================= */

  useEffect(() => {
    const value =
      0.35 * beds +
      0.25 * icu +
      0.2 * ventilator +
      0.2 * 50;

    setHsi(Number(value.toFixed(2)));
  }, [beds, icu, ventilator]);

  /* ================= USAGE FILTER ================= */

  const applyUsageFilter = () => {
    if (!usageFrom || !usageTo) {
      alert("Select both usage dates");
      return;
    }

    const filtered = history.filter(
      row => row.day >= usageFrom && row.day <= usageTo
    );

    setFilteredHistory(filtered);
  };

  /* ================= HSI FILTER ================= */

  const applyHSIFilter = () => {
    if (!hsiFrom || !hsiTo) {
      alert("Select both HSI dates");
      return;
    }

    const filtered = hsiTrend.filter(
      row => row.Date >= hsiFrom && row.Date <= hsiTo
    );

    setFilteredHSI(filtered);
  };

  /* ================= MANUAL INPUT UPDATE ================= */

  const handleManualUpdate = () => {
    const bedsUsage = safeNumber(inputs.bedRate ?? beds);
    const icuUsage = safeNumber(inputs.icuRate ?? icu);
    const ventUsage = safeNumber(inputs.ventRate ?? ventilator);

    setBeds(bedsUsage);
    setIcu(icuUsage);
    setVentilator(ventUsage);

    setTempBeds(bedsUsage);
    setTempIcu(icuUsage);
    setTempVentilator(ventUsage);

    setFilteredHistory(prev => [
      ...prev,
      {
        day: "Manual",
        beds: bedsUsage,
        icu: icuUsage,
        ventilator: ventUsage
      }
    ]);

    // Re-fetch forecast using updated resource values
    fetchForecast(bedsUsage, icuUsage, ventUsage);
  };

  /* ================= MERGE HISTORY + FORECAST ================= */

  const combinedUsage = [
    ...filteredHistory,
    ...forecastData.map(d => ({
      day: d.ds,
      beds: d.beds,
      icu: d.icu,
      ventilator: d.ventilator
    }))
  ];

  const combinedHSI = [
    ...filteredHSI,
    ...forecastData.map(d => ({
      Date: d.ds,
      HSI: d.yhat
    }))
  ];

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-4xl font-bold">Hospital Resource Dashboard</h1>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>

      <div className="mt-8">
        <InputCard
          inputs={inputs}
          setInputs={setInputs}
          onUpdate={handleManualUpdate}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        <ResourceCard
          title="Beds Usage"
          tempValue={tempBeds}
          setTempValue={setTempBeds}
          actualValue={beds}
          icon={BedDouble}
          color="bg-yellow-500"
        />
        <ResourceCard
          title="ICU Usage"
          tempValue={tempIcu}
          setTempValue={setTempIcu}
          actualValue={icu}
          icon={HeartPulse}
          color="bg-orange-500"
        />
        <ResourceCard
          title="Ventilator Usage"
          tempValue={tempVentilator}
          setTempValue={setTempVentilator}
          actualValue={ventilator}
          icon={Wind}
          color="bg-blue-500"
        />
      </div>

      <HSIGauge value={hsi} />

      {hsi > 80 && (
        <div className="mt-4 text-red-500 font-bold animate-pulse">
          CRITICAL SHORTAGE RISK
        </div>
      )}
      {hsi > 60 && hsi <= 80 && (
        <div className="mt-4 text-orange-400 font-bold animate-pulse">
          HIGH STRESS LEVEL
        </div>
      )}
      {hsi <= 60 && (
        <div className="mt-4 text-green-400 font-semibold">
          System operating within normal limits
        </div>
      )}

      <AlertPanel beds={beds} icu={icu} ventilator={ventilator} />

      {/* Usage Trend Date Filter */}
      <div className="mt-10 bg-[#111827] border border-gray-700 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Usage Trends — Date Range</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">From</label>
            <input
              type="date"
              value={usageFrom}
              onChange={e => setUsageFrom(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">To</label>
            <input
              type="date"
              value={usageTo}
              onChange={e => setUsageTo(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={applyUsageFilter}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-5 py-2 rounded-lg text-sm transition"
          >
            Apply
          </button>
          <button
            onClick={() => { setUsageFrom(""); setUsageTo(""); setFilteredHistory(history); }}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2 rounded-lg text-sm transition"
          >
            Reset
          </button>
        </div>
      </div>

      <UsageChart history={combinedUsage} />


      {/* HSI Trend Date Filter */}
      <div className="mt-10 bg-[#111827] border border-gray-700 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Hospital Stress Index Trend — Date Range</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">From</label>
            <input
              type="date"
              value={hsiFrom}
              onChange={e => setHsiFrom(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">To</label>
            <input
              type="date"
              value={hsiTo}
              onChange={e => setHsiTo(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={applyHSIFilter}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-5 py-2 rounded-lg text-sm transition"
          >
            Apply
          </button>
          <button
            onClick={() => { setHsiFrom(""); setHsiTo(""); setFilteredHSI(hsiTrend); }}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2 rounded-lg text-sm transition"
          >
            Reset
          </button>
        </div>
      </div>

      <HSIChart data={combinedHSI} rangeFrom={hsiFrom} rangeTo={hsiTo} />

      <ForecastChart data={forecastData} />

      <StressHeatmap data={forecastData} />
    </div>
  );
}