"use client";

import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import trailData from "@/data/trail-data.json";

// @ts-ignore
import * as toGeoJSON from "@tmcw/togeojson";

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

    // Display markers for ALL huts from trail-data.json
    map.current.on("load", () => {
      const m = map.current;
      if (!m) return;

      const bounds = new mapboxgl.LngLatBounds();
      let boundsHasPoint = false;

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

      (trailData.huts ?? []).forEach((hut) => {
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
            ↗ ${hut.detour_km}km detour${
                hut.detour_duration_min ? ` (${hut.detour_duration_min} min)` : ""
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
              ${hut.altitude_m ?? ""}m · ${hut.type ?? ""}${
          typeof hut.km_from_start === "number" ? ` · km ${hut.km_from_start}` : ""
        }
            </p>
            ${detourInfo}
          </div>
        `);

        // Add marker to map
        new mapboxgl.Marker({ color })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(m);

        bounds.extend([lng, lat]);
        boundsHasPoint = true;
      });

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