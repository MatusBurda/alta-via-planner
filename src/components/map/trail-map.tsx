"use client";

import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import trailData from "@/data/trail-data.json";
import { Itinerary } from "@/lib/planner";

// @ts-ignore
import * as toGeoJSON from "@tmcw/togeojson";

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
if (mapboxToken) {
  mapboxgl.accessToken = mapboxToken;
}

// Change the component signature:
interface TrailMapProps {
  selectedItinerary: Itinerary | null;
}

export default function TrailMap({ selectedItinerary }: TrailMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());


  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;

    // Initialize map centered on the Dolomites
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [12.0, 46.5],
      zoom: 10,
      pitch: 45,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Display markers for ALL huts from trail-data.json
    map.current.on("load", () => {
      const m = map.current;
      if (!m) return;

      const bounds = new mapboxgl.LngLatBounds();
      let boundsHasPoint = false;
      const hutFeatures: any[] = [];

      const extendBoundsDeep = (coords: unknown) => {
        if (!coords) return;
        if (Array.isArray(coords)) {
          // Base case: [lng, lat, ...]
          if (typeof coords[0] === "number" && typeof coords[1] === "number") {
            bounds.extend([coords[0], coords[1]]);
            boundsHasPoint = true;
            return;
          }
          // Recursive case: nested coordinates
          for (const c of coords) extendBoundsDeep(c);
        }
      };

      // Support both: root-level array of huts OR { trail, huts, segments }
      type HutItem = {
        id?: string;
        name?: string;
        type?: string;
        lat?: number;
        lng?: number;
        altitude_m?: number;
        km_from_start?: number;
        on_trail?: boolean;
        detour_km?: number | null;
        detour_duration_min?: number | null;
      };
      const data = trailData as HutItem[] | { huts?: HutItem[] };
      const huts: HutItem[] = Array.isArray(data) ? data : (data?.huts ?? []);

      huts.forEach((hut) => {
        // Make sure hut has coordinates
        const lat = typeof hut.lat === "number" ? hut.lat : Number(hut.lat);
        const lng = typeof hut.lng === "number" ? hut.lng : Number(hut.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

        // Choose marker color based on type
        let color = "#f59e0b"; // default: rifugio/other amber
        if (hut.type === "trailhead") color = "#10b981"; // green
        else if (hut.type === "hotel") color = "#6366f1"; // purple

        // Show if this hut is a detour
        const detourInfo =
          hut.on_trail === false && hut.detour_km
            ? `<p style="margin: 4px 0 0 0; font-size: 11px; color: #f59e0b;">
            ↗ ${hut.detour_km}km detour${hut.detour_duration_min ? ` (${hut.detour_duration_min} min)` : ""
            }
            </p>`
            : "";

        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 8px; font-family: sans-serif;">
            <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600;">
              ${hut.name}
            </h3>
            <p style="margin: 0; font-size: 12px; color: #666;">
              ${hut.altitude_m ?? ""}m · ${hut.type ?? ""}${typeof hut.km_from_start === "number" ? ` · km ${hut.km_from_start}` : ""
          }
            </p>
            ${detourInfo}
          </div>
        `);

        // Add marker to map
        const marker = new mapboxgl.Marker({ color })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(m);

        if (hut.id) {
          markersRef.current.set(hut.id, marker);
        }

        bounds.extend([lng, lat]);
        boundsHasPoint = true;

        hutFeatures.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          properties: {
            id: hut.id,
            name: hut.name,
            type: hut.type,
            altitude_m: hut.altitude_m,
            km_from_start: hut.km_from_start,
            on_trail: hut.on_trail,
          },
        });
      });

      // Add a circle layer for huts so they are clearly visible even when zoomed out
      if (hutFeatures.length) {
        if (m.getLayer("huts-circle")) {
          m.removeLayer("huts-circle");
        }
        if (m.getSource("huts")) {
          m.removeSource("huts");
        }
        m.addSource("huts", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: hutFeatures,
          },
        });
        m.addLayer({
          id: "huts-circle",
          type: "circle",
          source: "huts",
          paint: {
            "circle-radius": 5,
            "circle-color": [
              "match",
              ["get", "type"],
              "trailhead",
              "#10b981", // green
              "hotel",
              "#6366f1", // purple
              "#f59e0b", // amber default
            ],
            "circle-stroke-width": 1,
            "circle-stroke-color": "#111827",
          },
        });
      }

      // Ensure all huts are visible initially
      if (boundsHasPoint) {
        m.fitBounds(bounds, { padding: 60, maxZoom: 12, duration: 0, pitch: 45 });
      }

      // After hut markers, fetch and render GPX track
      (async () => {
        try {
          const res = await fetch("/data/alta-via-1.gpx");
          let gpxText = await res.text();
          gpxText = gpxText.replace(
            /\s+xmlns="http:\/\/www\.topografix\.com\/GPX\/1\/1"/,
            ""
          );
          const parser = new DOMParser();
          const xml = parser.parseFromString(gpxText, "application/xml");
          const geojson = toGeoJSON.gpx(xml);

          if (geojson?.features?.length) {
            if (m.getLayer("gpx-trail")) {
              m.removeLayer("gpx-trail");
            }
            if (m.getSource("gpx-trail")) {
              m.removeSource("gpx-trail");
            }
            m.addSource("gpx-trail", {
              type: "geojson",
              data: geojson,
            });
            m.addLayer({
              id: "gpx-trail",
              type: "line",
              source: "gpx-trail",
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#ef4444", // Tailwind red-500
                "line-width": 3,
                "line-opacity": 0.72,
              },
            });

            // Re-fit bounds to include the GPX line too (plus huts)
            for (const f of geojson.features) {
              extendBoundsDeep((f as any)?.geometry?.coordinates);
            }
            if (boundsHasPoint) {
              m.fitBounds(bounds, { padding: 60, maxZoom: 12, duration: 600, pitch: 45 });
            }
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error("Failed to load or parse GPX:", e);
        }
      })();
    });

    // Cleanup on unmount
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Build set of active hut IDs from selected itinerary
    const activeHutIds = new Set<string>();
    if (selectedItinerary) {
      // Add the starting point
      if (selectedItinerary.days.length > 0) {
        activeHutIds.add(selectedItinerary.days[0].from.id);
      }
      // Add every overnight stop
      selectedItinerary.days.forEach((day) => {
        activeHutIds.add(day.to.id);
      });
    }

    // Update individual markers: active = full color, inactive = faded
    markersRef.current.forEach((marker, hutId) => {
      const el = marker.getElement();
      if (!selectedItinerary) {
        // No selection — show all markers normally
        el.style.opacity = "1";
        el.style.filter = "none";
      } else if (activeHutIds.has(hutId)) {
        // This hut is in the selected route
        el.style.opacity = "1";
        el.style.filter = "none";
      } else {
        // This hut is NOT in the selected route — grey it out
        el.style.opacity = "0.3";
        el.style.filter = "grayscale(100%)";
      }
    });

    // Update the circle layer too
    const m = map.current;
    if (m.getLayer("huts-circle")) {
      if (!selectedItinerary) {
        // No selection — all circles normal
        m.setPaintProperty("huts-circle", "circle-opacity", 1);
        m.setPaintProperty("huts-circle", "circle-color", [
          "match",
          ["get", "type"],
          "trailhead", "#10b981",
          "hotel", "#6366f1",
          "#f59e0b",
        ]);
      } else {
        // Fade out non-selected huts
        m.setPaintProperty("huts-circle", "circle-opacity", [
          "match",
          ["get", "id"],
          [...activeHutIds],
          1,
          0.2,
        ]);
        // Grey out non-selected, keep color for selected
        m.setPaintProperty("huts-circle", "circle-color", [
          "match",
          ["get", "id"],
          [...activeHutIds],
          // Active: use type-based color
          ["match", ["get", "type"],
            "trailhead", "#10b981",
            "hotel", "#6366f1",
            "#f59e0b"
          ],
          // Inactive: grey
          "#9ca3af",
        ]);
      }
    }
  }, [selectedItinerary]);



  if (!mapboxToken) {
    return (
      <div className="flex w-full h-screen items-center justify-center bg-gray-100 p-6 text-center">
        <div>
          <p className="font-semibold text-gray-800">Mapbox token missing</p>
          <p className="mt-2 text-sm text-gray-600">
            Add <code className="rounded bg-gray-200 px-1">NEXT_PUBLIC_MAPBOX_TOKEN</code> to{" "}
            <code className="rounded bg-gray-200 px-1">.env.local</code> and restart the dev server.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Get a token at{" "}
            <a
              href="https://account.mapbox.com/access-tokens/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              account.mapbox.com
            </a>
          </p>
        </div>
      </div>
    );
  }



  return (
    <div
      ref={mapContainer}
      className="w-full h-screen"
    />
  );
}