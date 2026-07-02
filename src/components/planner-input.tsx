"use client";

import { useState } from "react";

interface PlannerInputProps {
    onPlan: (startDate: string, maxKm: number, minKm: number) => void;
}

export default function PlannerInput({ onPlan }: PlannerInputProps) {
    const [startDate, setStartDate] = useState("2026-07-14");
    const [pace, setPace] = useState("moderate");

    const paceSettings: Record<string, { maxKm: number; minKm: number; label: string }> = {
        relaxed: { maxKm: 14, minKm: 6, label: "Relaxed · 6–14 km/day" },
        moderate: { maxKm: 18, minKm: 8, label: "Moderate · 8–18 km/day" },
        strong: { maxKm: 25, minKm: 10, label: "Strong · 10–25 km/day" },
    };

    return (
        <div className="flex flex-col gap-5 p-5 bg-paper ring-1 ring-summit/15 rounded-lg shadow-[0_1px_0_rgba(9,9,11,0.04)]">
            <div>
                <p className="meta-mono mb-1">Region: Dolomites · IT</p>
                <h2 className="section-mono">Plan expedition</h2>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="label-mono">Start date</label>
                <input
                    type="date"
                    value={startDate}
                    min="2026-06-15"
                    max="2026-09-10"
                    onChange={(e) => setStartDate(e.target.value)}
                    className="field-input"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="label-mono">Pace</label>
                <select
                    value={pace}
                    onChange={(e) => setPace(e.target.value)}
                    className="field-input"
                >
                    {Object.entries(paceSettings).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                    ))}
                </select>
            </div>

            <button
                onClick={() => {
                    const { maxKm, minKm } = paceSettings[pace];
                    onPlan(startDate, maxKm, minKm);
                }}
                className="text-sm font-medium bg-summit text-base px-4 py-2.5 rounded-sm ring-1 ring-summit hover:bg-ink transition-colors"
            >
                Find routes
            </button>
        </div>
    );
}
