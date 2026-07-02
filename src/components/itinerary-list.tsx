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
            <div className="p-5 bg-paper ring-1 ring-summit/15 rounded-lg shadow-[0_1px_0_rgba(9,9,11,0.04)] text-center">
                <p className="text-sm text-mute leading-relaxed">
                    No routes found for these dates. Try a different start date or pace.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <h2 className="section-mono">Route options</h2>

            <div className="flex flex-col gap-2 max-h-[55vh] overflow-y-auto">
                {results.slice(0, 10).map((itin, idx) => {
                    const selected = selectedIndex === idx;

                    return (
                        <button
                            key={idx}
                            onClick={() => onSelect(idx)}
                            className={`group block w-full text-left p-5 rounded-lg transition-all shadow-[0_1px_0_rgba(9,9,11,0.04)] ${
                                selected
                                    ? "bg-paper ring-1 ring-summit"
                                    : "bg-paper ring-1 ring-summit/15 hover:ring-summit/30"
                            }`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-[10px] font-mono font-bold text-faint uppercase tracking-widest">
                                        Option {String(idx + 1).padStart(2, "0")}
                                    </span>
                                    <h3 className="text-lg font-semibold leading-tight mt-0.5">
                                        <span className="data-mono font-medium">{itin.total_days} d</span>
                                        <span className="text-faint font-mono text-sm mx-1.5">·</span>
                                        <span className="data-mono font-medium">{itin.total_km} km</span>
                                    </h3>
                                </div>
                                <span className="tag-mono text-glacier font-medium">
                                    {itin.days.length} stages
                                </span>
                            </div>

                            <div className="flex flex-col gap-1.5 border-t border-summit/5 pt-3">
                                {itin.days.map((day) => (
                                    <div key={day.day} className="flex justify-between gap-2 text-xs">
                                        <span className="text-mute min-w-0 truncate">
                                            <span className="font-mono text-faint tracking-widest mr-1.5">
                                                {String(day.day).padStart(2, "0")}
                                            </span>
                                            <span className="font-mono text-summit">→</span>{" "}
                                            {day.to.name}
                                        </span>
                                        <span className="font-mono text-faint shrink-0">
                                            {day.distance_km} km
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
