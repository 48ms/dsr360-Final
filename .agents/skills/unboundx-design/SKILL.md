---
name: unboundx-design
description: Use when creating UNBOUNDX-branded posters, social covers, key visuals, business cards, employee badges, event materials, UI mockups, or other visual deliverables that must match the company’s dark, minimalist, orange-accent brand system and bundled brand assets.
---

# UNBOUNDX Design

Use this skill whenever the output must look unmistakably like UNBOUNDX.

## Quick Start

1. Identify the deliverable and final format: poster, social cover, badge, business card, key visual, UI mockup, or campaign graphic.
2. Read `references/brand-asset-inventory.md` first.
3. If the task matches a common scenario, read `references/scenario-playbooks.md`.
4. Start from the nearest asset in `assets/materials/svg/` or `assets/templates/` instead of redrawing from zero.
5. Deliver editable source first when possible (`.svg`, `.html`, or layered vector-friendly output), then export raster if requested.

## Brand Core

- Vibe: hard-tech, precise, minimalist, confident, game-changer.
- Default theme: deep dark mode only. Never switch to pure black `#000000`.
- Primary accent: `#F26122` (`Aerospace Orange`) for highlights, CTA points, key data, and selective emphasis.
- Core dark neutrals: `#050505`, `#101012`, `#1A1A1E`.
- Primary text: `#FFFFFF`; secondary text: `#A0A0A5`; tertiary text: `#606065`.
- Typography: `Outfit` for English, numbers, headlines, and UI utility text; `Noto Sans SC` for Chinese.

## Composition Rules

- Use strong negative space and asymmetric tension. Avoid “everything centered, everything boxed.”
- Prefer `1px` borders and structural lines over heavy cards, thick shadows, or decorative chrome.
- Let dark space dominate; orange should punctuate, not flood the canvas.
- Use the symbol mark on compact square surfaces; use the full lockup on wide brand-forward layouts; use the stacked lockup when height is available but width is tight.
- Keep the logo away from edges and noisy copy blocks. Preserve generous breathing room.
- Mix oversized headlines with compact utility text, timestamps, labels, or metadata.

## Anti-Patterns

- No glassmorphism.
- No blue/purple “AI gradients.”
- No soft bubbly cards, glow halos, or generic futuristic UI clichés.
- No over-rounded shapes unless the scene explicitly demands them.
- No orange-drenched layouts; the base should still feel obsidian-first.

## Asset Routing

- Logo system: `assets/logos/`
- Existing brand compositions: `assets/materials/`
- New starter templates for reusable scenarios: `assets/templates/`

## Scenario Routing

- **Event poster / meetup / workshop / salon**: use `assets/templates/unboundx-ai-meetup-poster.svg` or adapt `assets/materials/svg/unboundx-poster.svg`
- **Social cover / announcement banner**: start from `assets/materials/svg/unboundx-social-cover.svg`
- **Key visual / hero graphic**: start from `assets/materials/svg/unboundx-key-visual.svg`
- **App splash / launch frame**: start from `assets/materials/svg/unboundx-app-splash.svg`
- **Business card**: start from `assets/templates/unboundx-business-card.svg`
- **Employee badge / work card / event pass**: start from `assets/templates/unboundx-employee-badge.svg`

## Output Expectations

- Match the requested aspect ratio, medium, and resolution.
- Use editable vector output whenever the artifact is primarily graphic.
- If the user asks for a visual draft first, keep text/placeholders editable and clearly labeled.
- Report which logo variant, starter asset, and color strategy were used.
- If information is missing, use obvious placeholders rather than inventing sensitive details.
