"use client";

import { Itinerary } from "@/lib/planner";

interface ItineraryListProps {
    results: Itinerary[];
    selectedIndex: number | null;
    onSelect: (index: number) => void;
}

export default function ItineraryList({ results, selectedIndex, onSelect }: ItineraryListProps) {
    if (results.length === 0) {
        return (
            <div className="p-6 bg-white rounded-xl shadow-lg text-center text-gray-500">
                No routes found for these dates. Try a different start date or pace.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
            {results.slice(0, 10).map((itin, idx) => (
                <button
                    key={idx}
                    onClick={() => onSelect(idx)}
                    className={`text-left p-4 rounded-xl shadow transition ${selectedIndex === idx
                            ? "bg-emerald-50 border-2 border-emerald-600"
                            : "bg-white border border-gray-200 hover:border-emerald-400"
                        }`}
                >
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-sm">
                            Option {idx + 1} — {itin.total_days} days
                        </span>
                        <span className="text-xs text-gray-500">
                            {itin.total_km} km total
                        </span>
                    </div>

                    <div className="flex flex-col gap-1">
                        {itin.days.map((day) => (
                            <div key={day.day} className="flex justify-between text-xs text-gray-600">
                                <span>
                                    Day {day.day}: {day.to.name}
                                </span>
                                <span className="text-gray-400">
                                    {day.distance_km} km
                                </span>
                            </div>
                        ))}
                    </div>
                </button>
            ))}
        </div>
    );
}