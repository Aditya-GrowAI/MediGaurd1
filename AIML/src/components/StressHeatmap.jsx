import React from "react";

// Returns background color based on HSI value
function getStressColor(value) {
    if (value >= 85) return { bg: "#7f1d1d", text: "#fca5a5", label: "CRITICAL" };
    if (value >= 70) return { bg: "#92400e", text: "#fcd34d", label: "HIGH" };
    if (value >= 50) return { bg: "#713f12", text: "#fde68a", label: "MODERATE" };
    return { bg: "#14532d", text: "#86efac", label: "NORMAL" };
}

export default function StressHeatmap({ data }) {
    if (!data || data.length === 0) return null;

    return (
        <div className="mt-10 bg-[#111827] p-6 rounded-2xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">Calendar View of Hospital Stress</h2>

            {/* Legend */}
            <div className="flex gap-4 mb-6 flex-wrap">
                {[
                    { label: "Normal", bg: "#14532d", text: "#86efac" },
                    { label: "Moderate", bg: "#713f12", text: "#fde68a" },
                    { label: "High", bg: "#92400e", text: "#fcd34d" },
                    { label: "Critical", bg: "#7f1d1d", text: "#fca5a5" },
                ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                        <div
                            style={{ backgroundColor: item.bg, width: 16, height: 16, borderRadius: 4 }}
                        />
                        <span style={{ color: item.text, fontSize: "0.8rem" }}>{item.label}</span>
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                    gap: "10px",
                }}
            >
                {data.map((d) => {
                    const value = d.yhat ?? d.HSI ?? 0;
                    const { bg, text, label } = getStressColor(value);
                    const dateStr = d.ds ?? d.Date ?? "";
                    const dateObj = new Date(dateStr);
                    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
                    const dateFormatted = dateObj.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    });

                    return (
                        <div
                            key={dateStr}
                            style={{
                                backgroundColor: bg,
                                borderRadius: "10px",
                                padding: "12px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "4px",
                                border: `1px solid ${text}33`,
                            }}
                        >
                            <span style={{ color: "#9ca3af", fontSize: "0.7rem" }}>{dayName}</span>
                            <span style={{ color: "white", fontWeight: 700, fontSize: "0.9rem" }}>
                                {dateFormatted}
                            </span>
                            <span
                                style={{ color: text, fontWeight: 800, fontSize: "1.3rem", lineHeight: 1 }}
                            >
                                {Number(value).toFixed(0)}
                            </span>
                            <span
                                style={{ color: text, fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.05em" }}
                            >
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
