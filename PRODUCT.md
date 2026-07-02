# Product

## Register

product

## Users

Independent hut-to-hut trekkers planning multi-day alpine routes (Alta Via 1, Tour du Mont Blanc, GR20). They plan months ahead, juggle fixed start dates with limited refuge capacity, and need confidence that a full traverse is actually bookable before committing time and money. Context: at home on a laptop, comparing date ranges and pace options, often after reading forum horror stories about sold-out rifugi.

## Product Purpose

Alta Via.OS answers one question fast: **can this hut-to-hut trip work on these dates?** Refuges book out early and must be reserved in sequence along the route — a gap on day 4 breaks the whole plan. The planner generates feasible day stages from the user's start date and pace, checks simulated hut availability, and surfaces workable itineraries on a map. When beds run out, the system should rebalance stages and route via nearby hotels with short detours off the main trail.

Success looks like: a trekker enters dates, sees within seconds whether the route is possible, picks an itinerary, and knows exactly where they'll sleep each night.

## Brand Personality

Precise, calm, expert. An alpine expedition terminal — not a consumer travel app. Think mountaineering club software or a field instrument panel: monochrome, data-dense, trustworthy. Voice is direct and technical; no hype, no adventure-bro energy.

Three words: **precise · alpine · instrument**

## Anti-references

- Generic outdoor/travel SaaS (emerald green CTAs, white cards with heavy drop shadows, rounded "app" chrome)
- AllTrails / booking-site aesthetic (photo-heavy hero, consumer-friendly pastels)
- AI-default warm cream/sand body backgrounds and decorative gradient text
- Eyebrow kickers on every section ("FEATURED ROUTES" above every heading as default scaffolding)
- Side-stripe accent borders on cards and alerts

Reference feel: [Altimeter.OS](https://alpine-zen.lovable.app) — Swiss/technical typographic style, topo grid, ring borders, semantic status colors.

## Design Principles

1. **Feasibility first** — Every screen should help the user answer "is this trip possible?" before anything else.
2. **Sequential truth** — Hut availability is a chain; the UI must reflect that nights depend on prior nights, not isolated picks.
3. **Instrument, not brochure** — Design serves data and decisions; decoration is earned, not default.
4. **Calm under scarcity** — Sold-out and low-availability states should inform without alarming; use semantic color, not panic red everywhere.
5. **Show the route** — The map is the anchor; lists and forms support spatial understanding.

## Accessibility & Inclusion

Target WCAG 2.1 AA. Body text must maintain ≥4.5:1 contrast against backgrounds (especially `text-mute` on `bg-base`). Respect `prefers-reduced-motion` for pulsing live indicators and any future animations. Form inputs need visible focus rings (already using `ring-summit/30`). Placeholder and faint label text must not fall below contrast minimums.
