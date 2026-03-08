"use client";

import { useState } from "react";
import TrailMap from "@/components/map/trail-map";
import PlannerInput from "@/components/planner-input";
import ItineraryList from "@/components/itinerary-list";
import { findItineraries, Itinerary } from "@/lib/planner";
import trailData from "@/data/trail-data.json";
import mockAvailability from "@/data/mock-availability.json";

// Prepare data once
const availability: Record<string, Record<string, string>> = {};
for (const [hutId, dates] of Object.entries(mockAvailability)) {
  availability[hutId] = {};
  for (const [date, info] of Object.entries(dates)) {
    availability[hutId][date] = (info as any).status;
  }
}

const huts = trailData
  .filter((h: any) => h.accommodation !== null || h.id === "lago_di_braies" || h.id === "la_pissa")
  .map((h: any) => ({
    id: h.id,
    name: h.name,
    km_from_start: h.km_from_start,
  }));

export default function Home() {
  const [results, setResults] = useState<Itinerary[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  function handlePlan(startDate: string, maxKm: number, minKm: number) {
    const itineraries = findItineraries(huts, availability, startDate, maxKm, minKm);
    setResults(itineraries);
    setSelectedIndex(itineraries.length > 0 ? 0 : null);
    setHasSearched(true);
  }

  const selectedItinerary = selectedIndex !== null ? results[selectedIndex] : null;

  return (
    <main className="relative w-full h-screen">
      {/* Full-screen map */}
      <TrailMap selectedItinerary={selectedItinerary} />

      {/* Sidebar overlay */}
      <div className="absolute top-4 left-4 w-80 flex flex-col gap-4 z-10">
        <PlannerInput onPlan={handlePlan} />

        {hasSearched && (
          <ItineraryList
            results={results}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
        )}
      </div>
    </main>
  );
}