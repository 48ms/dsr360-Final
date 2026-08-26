---
name: DSR360 Design System
description: Executive Luxury B2B Sales Telemetry & CRM for Shell Authorized Distributors
colors:
  primary: "#DD1D21"
  primary-hover: "#C01418"
  amber: "#D97706"
  amber-gold: "#F59E0B"
  amber-hover: "#B45309"
  emerald: "#10B981"
  dark-bg: "#0B0F19"
  card-base: "#111827"
  card-elevated: "#1E293B"
  neutral-bg: "#FFFFFF"
  neutral-subtle: "#FDFBF7"
  neutral-border: "#EAE4D9"
  text-primary: "#0F172A"
  text-secondary: "#64748B"
  black: "#000000"
  white: "#FFFFFF"
typography:
  display:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.025em"
  caption:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.01em"
  micro:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "10px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.02em"
  nano:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "9px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.02em"
rounded:
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "44px"
  button-danger:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "44px"
  card-surface:
    backgroundColor: "{colors.neutral-bg}"
    rounded: "{rounded.xl}"
    padding: "20px"
---

# DSR360 Design System

## Overview

DSR360 marries the high-reliability aesthetics of industrial equipment telemetry with the streamlined speed of modern B2B SaaS. It is tailored for high sunlight readability, rapid thumb navigation, and clear data density across mobile devices and desktop workstations.

## Colors

- **Primary Accent (Shell Red)**: `{colors.primary}` (`#DD1D21`) — used for critical actions, loss indicators, and authorized distributor brand marks.
- **Action & Focus (Shell Amber)**: `{colors.amber}` (`#F59E0B`) — used for primary interactive buttons, in-progress stages, and active highlights.
- **Success & Won (Emerald)**: `{colors.emerald}` (`#10B981`) — indicates won deals, GPS lock confirmation, completed follow-ups, and positive margins.
- **Surfaces & Neutrals**: High contrast hierarchy from `{colors.neutral-bg}` to `{colors.card-base}` and `{colors.dark-bg}`.

## Typography

- **Display & Titles**: Bold, geometric sans-serif with tight letter-spacing for high scannability in field environments.
- **Body & Metadata**: High legibility sans-serif with generous x-height and clear numeric tabular data rendering.
- **Micro-labels & Badges**: Uppercase semibold typography for status tags (`WON`, `QUOTATION`, `OVERDUE`).

## Layout

- **Mobile-First Container**: PWA layout with `px-4 py-4 md:px-6 md:py-6`, safe-area insets (`pb-24` on mobile), and sticky action bars.
- **Grid Density**: Responsive 12-column grid scaling cleanly from single-column mobile views to multi-pane analytical dashboards.

## Elevation & Depth

- **Subtle Layering**: Flat-to-subtle elevation model using `shadow-2xs` and `shadow-xs` paired with crisp 1px borders (`border-neutral-200` / `border-neutral-800`).
- **Focus States**: 2px focus rings with transparent color offsets (`focus:ring-2 focus:ring-amber-500/30`).

## Shapes

- **Radius Hierarchy**: Generous `rounded-3xl` (24px) for cards, `rounded-xl` (12px) for inputs and interactive buttons, and `rounded-full` for chips and avatars.

## Components

- **Card (`components/ui/card.tsx`)**: Modular surface primitive supporting `default`, `dark`, `amber`, and `outline` variants.
- **Button (`components/ui/button.tsx`)**: High-contrast interactive triggers with 44px minimum tap targets and haptic depression feedback (`active:scale-[0.98]`).
- **Modal Sandboxes**: Isolated modal layers with backdrop blur and independent print rendering containers.

## Do's and Don'ts

### Do's
- Always maintain 44px minimum tap target sizes for thumb accessibility in mobile field use.
- Use explicit color contrast (>4.5:1 WCAG AA) for all text against backgrounds.
- Keep SPH print layouts strictly bound to single-sheet portrait A4 boundaries.

### Don'ts
- Don't use washed-out gray text on colored backgrounds (`gray-on-color`).
- Don't hardcode arbitrary inline pixel widths that break mobile viewports.
- Don't allow modal or navigation chrome to bleed into document print outputs.
