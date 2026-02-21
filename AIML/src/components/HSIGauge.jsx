import React from "react";
import Plot from "react-plotly.js";

export default function HSIGauge({ value }) {

  return (
    <div className="mt-8 bg-[#111827] p-6 rounded-2xl border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">
        Hospital Stress Index
      </h2>

      <Plot
        data={[
          {
            type: "indicator",
            mode: "gauge+number",
            value: value,
            gauge: {
              axis: { range: [0, 100] },
              bar: { color: "#00c6ff" },
              steps: [
                { range: [0, 50], color: "#14532d" },
                { range: [50, 70], color: "#713f12" },
                { range: [70, 85], color: "#92400e" },
                { range: [85, 100], color: "#7f1d1d" }
              ]
            }
          }
        ]}
        layout={{
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          font: { color: "white" },
          height: 350,
          margin: { t: 20, r: 20, b: 20, l: 20 }
        }}
        style={{ width: "100%" }}
        config={{ displayModeBar: false }}
      />
    </div>
  );
}
