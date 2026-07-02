---
name: Alta Via.OS
description: Hut-to-hut alpine trek planner with expedition-terminal aesthetics
colors:
  summit: "#09090b"
  ink: "#18181b"
  base: "#fafafa"
  paper: "#f4f4f5"
  line: "#e4e4e7"
  mute: "#71717a"
  faint: "#a1a1aa"
  glacier: "#047857"
  warn: "#b45309"
  alert: "#b91c1c"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(3rem, 5vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.625rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.1em"
  data:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.025em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "10px"
spacing:
  card: "20px"
  section: "24px"
  page: "24px"
components:
  button-primary:
    backgroundColor: "{colors.summit}"
    textColor: "{colors.base}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.base}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.summit}"
    rounded: "{rounded.lg}"
    padding: "{spacing.card}"
  tag-difficulty-warn:
    backgroundColor: "rgba(180, 83, 9, 0.1)"
    textColor: "{colors.warn}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  tag-difficulty-alert:
    backgroundColor: "rgba(185, 28, 28, 0.1)"
    textColor: "{colors.alert}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
---

## Overview

**Creative North Star: The Expedition Terminal**

A monochrome alpine instrument panel — graph paper beneath, data up front. Design reads like mountaineering club software or a precision navigation tool, not a consumer travel site. Mood: calm, technical, expert confidence. The topo grid background (`topo-grid`) is the signature texture; flat paper surfaces with hairline rings replace drop shadows.

Anti-references: emerald hiking-app CTAs, heavy card shadows, warm cream body backgrounds, decorative gradients, eyebrow kickers on every section.

Layout: landing page uses `max-w-7xl` centered content; planner is map-first with a frosted left sidebar (`bg-base/90 backdrop-blur-md topo-grid`).

## Colors

Monochrome base with three semantic status accents (Altimeter.OS palette):

| Token | Role |
|-------|------|
| `summit` (#09090b) | Primary text, buttons, strong rings |
| `ink` (#18181b) | Button hover |
| `base` (#fafafa) | Page background |
| `paper` (#f4f4f5) | Cards, panels, ghost buttons |
| `line` (#e4e4e7) | Borders |
| `mute` (#71717a) | Secondary text, nav |
| `faint` (#a1a1aa) | Tertiary labels, stat labels |
| `glacier` (#047857) | Available / stable / success |
| `warn` (#b45309) | Low availability, challenging difficulty |
| `alert` (#b91c1c) | Sold out, strenuous difficulty |

Selection is inverted: `background: summit; color: base`.

Difficulty tags use tinted backgrounds at 10% opacity with matching ring at 20%.

## Typography

**Inter** for UI prose and titles; **JetBrains Mono** for labels, metadata, stats, and form fields.

| Role | Utility / pattern | Notes |
|------|-------------------|-------|
| Logo | `font-mono text-sm font-semibold tracking-tighter uppercase` | Diamond mark + wordmark |
| Section heading | `section-mono` | 14px uppercase mono, semibold, muted |
| Metadata / eyebrow | `meta-mono` | 10px uppercase, wide tracking |
| Form labels | `label-mono` | 10px uppercase, faint |
| Stats / data | `data-mono` | 14px mono, medium weight |
| Tags | `tag-mono` | 10px uppercase |
| Hero title | Inter semibold, `text-5xl md:text-6xl tracking-tight leading-none` | Max ~22ch width |
| Body copy | Inter, `text-lg text-mute leading-relaxed` | Max ~56ch width |

Inter uses `font-feature-settings: "ss01", "cv11"`. Font variables: `--font-inter`, `--font-jetbrains-mono` on `<html>`.

## Elevation

Flat by design. No drop shadows on cards. Surfaces use:

- `ring-1 ring-summit/15` — default card border
- `ring-1 ring-summit/30` — hover state
- `ring-1 ring-summit` — selected/active state
- `shadow-[0_1px_0_rgba(9,9,11,0.04)]` — optional 1px bottom highlight only

Dividers: `border-t border-summit/5` (very subtle, 5% opacity).

Background texture: `topo-grid` — 40px grid at 3% summit opacity.

## Components

### Primary button
`text-sm font-medium bg-summit text-base px-4 py-2.5 rounded-sm ring-1 ring-summit hover:bg-ink transition-colors`

### Ghost / disabled button
`tag-mono text-faint bg-base px-4 py-2.5 rounded-sm ring-1 ring-summit/5`

### Route card
Paper panel with grid layout: region + difficulty tag on row 1; content left, square map right on row 2; full-width CTA below. Map panel: `aspect-square rounded-sm ring-1 ring-summit/5 object-cover`.

### Planner sidebar
Fixed left column, 384px (`w-96`), frosted topo grid, border-right `border-summit/5`.

### Form inputs
`field-input` utility: mono text, base bg, `ring-summit/10`, focus `ring-summit/30`, `rounded-sm`.

### Live indicator
`size-1.5 rounded-full bg-glacier animate-pulse` beside "Live hut feed" header tag.

## Do's and Don'ts

**Do**
- Use mono uppercase labels for metadata, stats, and tags
- Use ring borders instead of box shadows
- Keep border radius small (4–10px) — instrument-like, not bubbly
- Use semantic glacier/warn/alert for availability and difficulty
- Cap hero titles at ~22ch; body copy at ~56ch
- Apply `topo-grid` to page shells and sidebar

**Don't**
- Use emerald/green as primary CTA color (summit black is primary)
- Add drop shadows (`shadow-lg`) to panels
- Put uppercase mono eyebrows above every section reflexively
- Use side-stripe colored borders on cards
- Default to warm cream/sand body backgrounds
- Mix decorative gradients or gradient text
