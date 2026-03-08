console.log("FILE IS RUNNING");

import trailData from "@/data/trail-data.json";
import mockAvailability from "@/data/mock-availability.json";

// Transform availability: extract just the status string
const availability: Record<string, Record<string, string>> = {};
for (const [hutId, dates] of Object.entries(mockAvailability)) {
  availability[hutId] = {};
  for (const [date, info] of Object.entries(dates)) {
    availability[hutId][date] = (info as any).status;
  }
}

// trailData IS the array — no .huts needed
const huts = trailData
  .filter((h: any) => h.accommodation !== null) // skip food-only stops & trailheads with no beds
  .map((h: any) => ({
    id: h.id,
    name: h.name,
    km_from_start: h.km_from_start,
  }));

// Add start and end points back (they need to be in the list)
const start = { id: "lago_di_braies", name: "Lago di Braies (START)", km_from_start: 0 };
const end = { id: "la_pissa", name: "La Pissa (END)", km_from_start: 120 };

const allPoints = [start, ...huts, end];

const results = findItineraries(allPoints, availability, "2026-05-14", 18, 6);

console.log(`Found ${results.length} possible itineraries`);
results.slice(0, 5).forEach((itin, idx) => {
  console.log(`\nOption ${idx + 1}: ${itin.total_days} days, ${itin.total_km}km`);
  itin.days.forEach(day => {
    console.log(`  Day ${day.day} (${day.date}): ${day.from.name} → ${day.to.name} (${day.distance_km}km)`);
  });
});

// The simplest possible types
export interface Hut {
  id: string;
  name: string;
  km_from_start: number;
}

export interface DayPlan {
  day: number;
  date: string;
  from: Hut;
  to: Hut;
  distance_km: number;
}

export interface Itinerary {
  days: DayPlan[];
  total_days: number;
  total_km: number;
}

function balanceScore(itinerary: Itinerary): number {
    // Calculate how "uneven" the daily distances are
    // Lower score = more balanced = better
    const distances = itinerary.days.map(d => d.distance_km);
    const avg = distances.reduce((a, b) => a + b, 0) / distances.length;
    
    // Standard deviation — measures spread from average
    const variance = distances.reduce((sum, d) => sum + Math.pow(d - avg, 2), 0) / distances.length;
    return Math.sqrt(variance);
  }
  

export function findItineraries(
  huts: Hut[],                    // ordered by km_from_start
  availability: Record<string, Record<string, string>>,  // hutId -> date -> status
  startDate: string,              // "2026-07-14"
  maxKmPerDay: number,             // from fitness preset
  minKmPerDay: number             // from fitness preset

): Itinerary[] {

  const results: Itinerary[] = [];

  // Recursive function: from a given hut on a given day,
  // find all ways to reach the end
  function explore(
    currentHutIndex: number,
    currentDate: string,
    currentDay: number,
    pathSoFar: DayPlan[]
  ) {
    const currentHut = huts[currentHutIndex];
    

    // BASE CASE: we reached the last hut. We found a complete itinerary!
    if (currentHutIndex === huts.length - 1) {
      results.push({
        days: [...pathSoFar],
        total_days: pathSoFar.length,
        total_km: pathSoFar.reduce((sum, d) => sum + d.distance_km, 0)
      });
      return;
    }

    // Try every hut ahead of us as tonight's destination
    for (let i = currentHutIndex + 1; i < huts.length; i++) {
      const candidateHut = huts[i];
      const distance = candidateHut.km_from_start - currentHut.km_from_start;

      // ADD THIS — skip huts that are too close
      if (distance < minKmPerDay) continue;  // ← new line
      
      // Can we physically get there today?
      if (distance > maxKmPerDay) break;  // too far, and everything beyond is even farther

      // Is there a bed?
      const status = availability[candidateHut.id]?.[currentDate];
      if (status === "full") continue;  // skip this hut, try the next one

      // This hut works! Add it to the path and keep going tomorrow.
      const nextDate = addOneDay(currentDate);

      

      pathSoFar.push({
        day: currentDay,
        date: currentDate,
        from: currentHut,
        to: candidateHut,
        distance_km: distance
      });

      explore(i, nextDate, currentDay + 1, pathSoFar);

      pathSoFar.pop();  // backtrack to try other options
    }
  }

  // Start exploring from hut 0 on the start date
  explore(0, startDate, 1, []);

  results.sort((a, b) => {
    // First: prefer fewer total days (within reason)
    // A 7-day trip is generally better than a 12-day trip
    // But don't make this the ONLY factor
    
    // Primary: balance score (lower is better)
    const balanceDiff = balanceScore(a) - balanceScore(b);
    
    // If balance is similar (within 1km std dev), prefer fewer days
    if (Math.abs(balanceDiff) < 1) {
      return a.total_days - b.total_days;
    }
    
    return balanceDiff;
  });

  return results;
}

// Helper
function addOneDay(dateStr: string): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

/*
// Quick test — delete this later
const testHuts: Hut[] = [
    { id: "start",  name: "Start",     km_from_start: 0 },
    { id: "hut_a",  name: "Hut A",     km_from_start: 10 },
    { id: "hut_b",  name: "Hut B",     km_from_start: 14 },
    { id: "hut_c",  name: "Hut C",     km_from_start: 22 },
    { id: "hut_d",  name: "Hut D",     km_from_start: 30 },
    { id: "end",    name: "End",       km_from_start: 38 },
  ];
  
  const testAvailability = {
    "hut_a": { "2026-07-14": "available", "2026-07-15": "available" },
    "hut_b": { "2026-07-14": "full",      "2026-07-15": "full" },
    "hut_c": { "2026-07-15": "available", "2026-07-16": "available" },
    "hut_d": { "2026-07-16": "available", "2026-07-17": "available" },
    "end":   { "2026-07-17": "available", "2026-07-18": "available" },
  };
  
  const results = findItineraries(testHuts, testAvailability, "2026-07-14", 8);
  
  console.log(`Found ${results.length} possible itineraries:`);
  results.forEach((itin, idx) => {
    console.log(`\nOption ${idx + 1}: ${itin.total_days} days, ${itin.total_km}km`);
    itin.days.forEach(day => {
      console.log(`  Day ${day.day} (${day.date}): ${day.from.name} → ${day.to.name} (${day.distance_km}km)`);
    });
  });
  */