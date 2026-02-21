import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BedDouble, HeartPulse, Wind, MapPin, Phone, Clock,
    Search, ArrowLeft, AlertCircle, CheckCircle, AlertTriangle, Info
} from "lucide-react";

// ── Hardcoded hospital data ──────────────────────────────────────────────────
const HOSPITALS = [
    {
        id: 1,
        name: "City General Hospital",
        location: "Downtown, Hyderabad",
        phone: "+91-40-2345-6789",
        distance: "1.2 km",
        type: "Government",
        beds: 88,
        icu: 91,
        ventilator: 75,
        hsi: 86,
        emergency: true,
        openNow: true,
    },
    {
        id: 2,
        name: "Apollo Spectra Hospital",
        location: "Banjara Hills, Hyderabad",
        phone: "+91-40-3456-7890",
        distance: "3.4 km",
        type: "Private",
        beds: 42,
        icu: 38,
        ventilator: 30,
        hsi: 38,
        emergency: true,
        openNow: true,
    },
    {
        id: 3,
        name: "KIMS Hospitals",
        location: "Secunderabad, Hyderabad",
        phone: "+91-40-4567-8901",
        distance: "5.1 km",
        type: "Private",
        beds: 67,
        icu: 72,
        ventilator: 65,
        hsi: 68,
        emergency: true,
        openNow: true,
    },
    {
        id: 4,
        name: "Yashoda Hospitals",
        location: "Somajiguda, Hyderabad",
        phone: "+91-40-5678-9012",
        distance: "6.8 km",
        type: "Private",
        beds: 55,
        icu: 60,
        ventilator: 48,
        hsi: 55,
        emergency: false,
        openNow: true,
    },
    {
        id: 5,
        name: "Care Hospitals",
        location: "Nampally, Hyderabad",
        phone: "+91-40-6789-0123",
        distance: "2.7 km",
        type: "Private",
        beds: 93,
        icu: 96,
        ventilator: 90,
        hsi: 93,
        emergency: true,
        openNow: false,
    },
    {
        id: 6,
        name: "Gandhi Hospital",
        location: "Musheerabad, Hyderabad",
        phone: "+91-40-7890-1234",
        distance: "4.0 km",
        type: "Government",
        beds: 28,
        icu: 22,
        ventilator: 18,
        hsi: 24,
        emergency: true,
        openNow: true,
    },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function getHSIStatus(hsi) {
    if (hsi >= 85) return {
        label: "CRITICAL",
        color: "#ef4444",
        bg: "rgba(239,68,68,0.12)",
        border: "rgba(239,68,68,0.3)",
        icon: <AlertCircle size={16} />,
        advice: "Extremely overcrowded — seek another hospital if possible.",
        tag: "Avoid if possible",
        tagBg: "#7f1d1d",
        tagText: "#fca5a5",
    };
    if (hsi >= 70) return {
        label: "HIGH",
        color: "#f97316",
        bg: "rgba(249,115,22,0.12)",
        border: "rgba(249,115,22,0.3)",
        icon: <AlertTriangle size={16} />,
        advice: "High patient load — expect longer wait times.",
        tag: "Long wait expected",
        tagBg: "#92400e",
        tagText: "#fcd34d",
    };
    if (hsi >= 50) return {
        label: "MODERATE",
        color: "#eab308",
        bg: "rgba(234,179,8,0.12)",
        border: "rgba(234,179,8,0.3)",
        icon: <Info size={16} />,
        advice: "Moderate load — normal wait times.",
        tag: "Moderate capacity",
        tagBg: "#713f12",
        tagText: "#fde68a",
    };
    return {
        label: "AVAILABLE",
        color: "#22c55e",
        bg: "rgba(34,197,94,0.12)",
        border: "rgba(34,197,94,0.3)",
        icon: <CheckCircle size={16} />,
        advice: "Low stress — good availability for new patients.",
        tag: "Recommended",
        tagBg: "#14532d",
        tagText: "#86efac",
    };
}

function ResourceBar({ icon: Icon, label, value, color }) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1"><Icon size={12} /> {label}</span>
                <span style={{ color }}>{value}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-700 rounded-full">
                <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${value}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
}

function HospitalCard({ hospital }) {
    const status = getHSIStatus(hospital.hsi);

    return (
        <div
            style={{
                background: "#111827",
                border: `1px solid ${status.border}`,
                borderRadius: 16,
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: `0 0 20px ${status.bg}`,
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-bold text-white leading-tight">{hospital.name}</h3>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                        <MapPin size={11} />
                        <span>{hospital.location}</span>
                        <span className="mx-1">·</span>
                        <span>{hospital.distance}</span>
                    </div>
                </div>

                {/* HSI Badge */}
                <div className="text-center shrink-0">
                    <div
                        style={{
                            background: status.bg,
                            border: `1px solid ${status.border}`,
                            borderRadius: 10,
                            padding: "6px 12px",
                        }}
                    >
                        <div style={{ color: status.color, fontSize: "1.6rem", fontWeight: 900, lineHeight: 1 }}>
                            {hospital.hsi}
                        </div>
                        <div style={{ color: status.color, fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.08em" }}>
                            HSI
                        </div>
                    </div>
                </div>
            </div>

            {/* Status row */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div
                    className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ color: status.color, background: status.bg }}
                >
                    {status.icon}
                    {status.label}
                </div>

                <div className="flex gap-2 flex-wrap">
                    <span
                        className="text-xs px-2.5 py-1 rounded-full font-semibold"
                        style={{ background: status.tagBg, color: status.tagText }}
                    >
                        {status.tag}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${hospital.openNow ? "bg-green-900/50 text-green-400" : "bg-gray-700 text-gray-400"
                        }`}>
                        <Clock size={10} className="inline mr-1" />
                        {hospital.openNow ? "Open now" : "Closed"}
                    </span>
                    {hospital.emergency && (
                        <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-red-900/40 text-red-400">
                            🚨 Emergency
                        </span>
                    )}
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-gray-700 text-gray-300">
                        {hospital.type}
                    </span>
                </div>
            </div>

            {/* Advice */}
            <p className="text-xs text-gray-400 italic">💡 {status.advice}</p>

            {/* Resource bars */}
            <div className="flex flex-col gap-2.5">
                <ResourceBar icon={BedDouble} label="Beds" value={hospital.beds}
                    color={hospital.beds >= 85 ? "#ef4444" : hospital.beds >= 70 ? "#f97316" : "#22c55e"} />
                <ResourceBar icon={HeartPulse} label="ICU" value={hospital.icu}
                    color={hospital.icu >= 85 ? "#ef4444" : hospital.icu >= 70 ? "#f97316" : "#22c55e"} />
                <ResourceBar icon={Wind} label="Ventilators" value={hospital.ventilator}
                    color={hospital.ventilator >= 85 ? "#ef4444" : hospital.ventilator >= 70 ? "#f97316" : "#22c55e"} />
            </div>

            {/* Contact */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 border-t border-gray-700 pt-3">
                <Phone size={11} />
                <span>{hospital.phone}</span>
            </div>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function PatientView() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("all"); // all | available | critical

    const sorted = [...HOSPITALS].sort((a, b) => a.hsi - b.hsi);

    const filtered = sorted.filter(h => {
        const matchQuery = h.name.toLowerCase().includes(query.toLowerCase()) ||
            h.location.toLowerCase().includes(query.toLowerCase());
        const matchFilter =
            filter === "all" ? true :
                filter === "available" ? h.hsi < 70 :
                    filter === "critical" ? h.hsi >= 85 : true;
        return matchQuery && matchFilter;
    });

    const counts = {
        recommended: HOSPITALS.filter(h => h.hsi < 50).length,
        moderate: HOSPITALS.filter(h => h.hsi >= 50 && h.hsi < 70).length,
        high: HOSPITALS.filter(h => h.hsi >= 70 && h.hsi < 85).length,
        critical: HOSPITALS.filter(h => h.hsi >= 85).length,
    };

    return (
        <div style={{ minHeight: "100vh", background: "#0b0f1a", color: "white", padding: "2rem" }}>

            {/* Back button */}
            <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition"
            >
                <ArrowLeft size={16} /> Back to Dashboard
            </button>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Find a Hospital
                </h1>
                <p className="text-gray-400 mt-2">
                    Real-time stress index across nearby hospitals — find the best availability for your care.
                </p>
            </div>

            {/* Summary Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Recommended", count: counts.recommended, color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)" },
                    { label: "Moderate", count: counts.moderate, color: "#eab308", bg: "rgba(234,179,8,0.1)", border: "rgba(234,179,8,0.2)" },
                    { label: "High Load", count: counts.high, color: "#f97316", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.2)" },
                    { label: "Critical", count: counts.critical, color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" },
                ].map(s => (
                    <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: "16px 20px" }}>
                        <div style={{ color: s.color, fontSize: "2rem", fontWeight: 900 }}>{s.count}</div>
                        <div style={{ color: s.color, fontSize: "0.75rem", fontWeight: 600 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="flex flex-wrap gap-3 mb-8 items-center">
                <div className="relative flex-1 min-w-60">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search hospital or area..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                    />
                </div>

                {["all", "available", "critical"].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className="px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition"
                        style={{
                            background: filter === f ? "#3b82f6" : "#1f2937",
                            color: filter === f ? "white" : "#9ca3af",
                            border: "1px solid",
                            borderColor: filter === f ? "#3b82f6" : "#374151",
                        }}
                    >
                        {f === "all" ? "All Hospitals" : f === "available" ? "Available (HSI < 70)" : "Critical (HSI ≥ 85)"}
                    </button>
                ))}
            </div>

            {/* Hospital Cards Grid */}
            {filtered.length === 0 ? (
                <div className="text-center text-gray-500 py-16">No hospitals match your search.</div>
            ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map(h => <HospitalCard key={h.id} hospital={h} />)}
                </div>
            )}

            {/* Legend footer */}
            <div className="mt-12 flex flex-wrap gap-6 justify-center text-xs text-gray-500">
                <span>HSI = Hospital Stress Index (0–100)</span>
                <span className="text-green-400">● &lt; 50 Recommended</span>
                <span className="text-yellow-400">● 50–69 Moderate</span>
                <span className="text-orange-400">● 70–84 High</span>
                <span className="text-red-400">● 85+ Critical</span>
            </div>
        </div>
    );
}
