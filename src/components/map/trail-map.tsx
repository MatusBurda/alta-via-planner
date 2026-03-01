"use client";

import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import trailData from "@/data/trail-data.json";

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
if (mapboxToken) {
  mapboxgl.accessToken = mapboxToken;
}

export function TrailMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

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

    // Add markers for each hut
    map.current.on("load", () => {
      trailData.huts.forEach((hut) => {
        if (!hut.lat || !hut.lng || !map.current) return;

        // Choose marker color based on type
        const color =
          hut.type === "trailhead"
            ? "#10b981"   // green
            : hut.type === "hotel"
            ? "#6366f1"   // purple
            : "#f59e0b";  // amber for rifugios

        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 8px; font-family: sans-serif;">
            <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600;">
              ${hut.name}
            </h3>
            <p style="margin: 0; font-size: 12px; color: #666;">
              ${hut.altitude_m}m · ${hut.type} · km ${hut.km_from_start}
            </p>
            ${
              !hut.on_trail
                ? `<p style="margin: 4px 0 0 0; font-size: 11px; color: #f59e0b;">
                    ↗ ${hut.detour_km}km detour (${hut.detour_duration_min} min)
                   </p>`
                : ""
            }
          </div>
        `);

        // Add marker to map
        new mapboxgl.Marker({ color })
          .setLngLat([hut.lng, hut.lat])
          .setPopup(popup)
          .addTo(map.current!);
      });
    });

    // Cleanup on unmount
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

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