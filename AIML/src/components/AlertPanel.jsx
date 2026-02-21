import React from "react";
import { AlertTriangle, AlertCircle, CheckCircle, Info } from "lucide-react";

function getResourceAlert(label, value) {
    if (value >= 90) {
        return {
            level: "critical",
            icon: <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />,
            border: "border-red-700",
            bg: "bg-red-950/40",
            badge: "bg-red-600 text-white",
            badgeText: "CRITICAL",
            message: `${label} at ${value}% — severely overcapacity.`,
            suggestion: `Immediately procure additional ${label.toLowerCase()} units. Activate emergency overflow protocols and consider patient transfers to nearby facilities.`
        };
    }
    if (value >= 75) {
        return {
            level: "high",
            icon: <AlertTriangle size={18} className="text-orange-400 shrink-0 mt-0.5" />,
            border: "border-orange-700",
            bg: "bg-orange-950/40",
            badge: "bg-orange-600 text-white",
            badgeText: "HIGH",
            message: `${label} at ${value}% — approaching critical threshold.`,
            suggestion: `Plan to add more ${label.toLowerCase()} capacity within 24–48 hours. Review pending admissions and prioritize discharge of stable patients.`
        };
    }
    if (value >= 60) {
        return {
            level: "moderate",
            icon: <Info size={18} className="text-yellow-400 shrink-0 mt-0.5" />,
            border: "border-yellow-700",
            bg: "bg-yellow-950/30",
            badge: "bg-yellow-600 text-black",
            badgeText: "MODERATE",
            message: `${label} at ${value}% — moderate usage, monitor closely.`,
            suggestion: `Monitor ${label.toLowerCase()} allocation daily. Schedule preventive maintenance and staff planning for potential surge.`
        };
    }
    return {
        level: "normal",
        icon: <CheckCircle size={18} className="text-green-400 shrink-0 mt-0.5" />,
        border: "border-green-800",
        bg: "bg-green-950/20",
        badge: "bg-green-700 text-white",
        badgeText: "NORMAL",
        message: `${label} at ${value}% — within safe limits.`,
        suggestion: `No immediate action needed. Continue routine monitoring.`
    };
}

export default function AlertPanel({ beds, icu, ventilator }) {
    const resources = [
        { label: "Beds", value: beds },
        { label: "ICU", value: icu },
        { label: "Ventilators", value: ventilator },
    ];

    const alerts = resources.map(r => ({ ...r, ...getResourceAlert(r.label, r.value) }));
    const hasCritical = alerts.some(a => a.level === "critical");
    const hasHigh = alerts.some(a => a.level === "high");

    return (
        <div className="mt-10 bg-[#111827] border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-semibold">Resource Alerts & Suggestions</h2>
                {hasCritical && (
                    <span className="text-xs font-bold bg-red-600 text-white px-3 py-1 rounded-full animate-pulse">
                        ⚠ CRITICAL ALERT
                    </span>
                )}
                {!hasCritical && hasHigh && (
                    <span className="text-xs font-bold bg-orange-600 text-white px-3 py-1 rounded-full">
                        ⚠ HIGH ALERT
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-4">
                {alerts.map((a) => (
                    <div
                        key={a.label}
                        className={`rounded-xl border ${a.border} ${a.bg} p-4 flex flex-col gap-2`}
                    >
                        <div className="flex items-start gap-3">
                            {a.icon}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-white">{a.label}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.badge}`}>
                                        {a.badgeText}
                                    </span>
                                    <span className="text-gray-400 text-sm ml-auto">{a.value}%</span>
                                </div>
                                <p className="text-sm text-gray-300">{a.message}</p>
                                <p className="text-xs text-gray-400 mt-1 italic">💡 {a.suggestion}</p>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="h-1.5 w-full bg-gray-700 rounded-full mt-1">
                            <div
                                className="h-1.5 rounded-full transition-all duration-500"
                                style={{
                                    width: `${a.value}%`,
                                    backgroundColor:
                                        a.level === "critical" ? "#ef4444" :
                                            a.level === "high" ? "#f97316" :
                                                a.level === "moderate" ? "#eab308" : "#22c55e",
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
