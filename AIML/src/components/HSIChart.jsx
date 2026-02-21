import React from "react";
import Plot from "react-plotly.js";

export default function HSIChart({ data, rangeFrom, rangeTo }) {

  if (!data || data.length === 0) return null;

  const dates = data.map(d => d.Date || d.ds);
  const values = data.map(d => d.HSI || d.yhat);

  // Build xaxis range — zoom when a range is selected, show all otherwise
  const xaxisRange = rangeFrom && rangeTo
    ? [rangeFrom, rangeTo]
    : undefined;

  return (
    <div className="mt-10 bg-[#111827] p-6 rounded-2xl border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">
        Hospital Stress Index Trend
        {rangeFrom && rangeTo && (
          <span className="ml-3 text-sm font-normal text-yellow-400">
            {rangeFrom} → {rangeTo}
          </span>
        )}
      </h2>

      <Plot
        data={[
          {
            x: dates,
            y: values,
            type: "scatter",
            mode: "lines+markers",
            line: { color: "#00c6ff", width: 2 },
            marker: { size: 4 },
            fill: "tozeroy",
            fillcolor: "rgba(0,198,255,0.08)",
          }
        ]}
        layout={{
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          font: { color: "white" },
          height: 400,
          xaxis: {
            gridcolor: "#1f2937",
            ...(xaxisRange ? { range: xaxisRange } : {}),
          },
          yaxis: {
            gridcolor: "#1f2937",
            rangemode: "tozero",
          },
          margin: { t: 20, r: 20, b: 50, l: 50 },
        }}
        config={{ responsive: true, scrollZoom: true, displayModeBar: false }}
        style={{ width: "100%" }}
      />
    </div>
  );
}