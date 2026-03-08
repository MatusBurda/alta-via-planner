"use client";

import { useState } from "react";

interface PlannerInputProps {
    onPlan: (startDate: string, maxKm: number, minKm: number) => void;
}

export default function PlannerInput({ onPlan }: PlannerInputProps) {
    const [startDate, setStartDate] = useState("2026-07-14");
    const [pace, setPace] = useState("moderate");

    const paceSettings: Record<string, { maxKm: number; minKm: number; label: string }> = {
        relaxed: { maxKm: 14, minKm: 6, label: "Relaxed (6-14 km/day)" },
        moderate: { maxKm: 18, minKm: 8, label: "Moderate (8-18 km/day)" },
        strong: { maxKm: 25, minKm: 10, label: "Strong (10-25 km/day)" },
    };

    return (
        <div className="flex flex-col gap-4 p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-lg font-bold">Plan your Alta Via 1</h2>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Start date</label>
                <input
                    type="date"
                    value={startDate}
                    min="2026-06-15"
                    max="2026-09-10"
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Pace</label>
                <select
                    value={pace}
                    onChange={(e) => setPace(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm"
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
                className="bg-emerald-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
            >
                Find routes
            </button>
        </div>
    );
}
