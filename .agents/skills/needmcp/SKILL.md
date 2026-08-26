---
name: needmcp
description: Expert skill for NeedMCP (https://needmcp.com) - UI design system, style locking, and wireframe blueprinting via Model Context Protocol (MCP). Use when designing, styling, or scaffolding UI components, dashboards, enterprise CRM layouts, and Design Token systems. Combines visual styles (themes, typography, palettes) and wireframes (layout grids, data density, interactive states) with Impeccable design quality and Next.js / Tailwind CSS best practices.
version: 1.0.0
---

# NeedMCP — AI-Powered UI Components & Style Blueprints

NeedMCP is an open standard MCP server and UI component design framework providing production-grade styles, component design tokens, and wireframe blueprints.

## Core Pillars: Styles vs Wireframes

| Aspect | Styles (Visual Themes) | Wireframes (UI Blueprints) |
|---|---|---|
| **Focus** | Visual aesthetics, brand identity, color harmony, typography. | Layout hierarchy, scanability, interaction flow, data density. |
| **Tokens** | Shell Red (`#DD1D21`), Shell Yellow (`#FFD100`), Slate darks, border-radius, shadows. | 44px tap targets, multi-column dashboard grids, sticky mobile action bars, quick-debrief modals. |
| **Combined** | **Production-Ready Enterprise Industrial UI**: High contrast for factory visits, thumb-friendly for mobile sales reps. |

## NeedMCP MCP Server Configuration

To connect directly to the NeedMCP remote MCP server:

### Endpoint & Auth
- **Server URL**: `https://needmcp.com/mcp`
- **Header**: `X-API-Key: sk-need-xxxxxxxxxxxx`
- **Protocol**: Model Context Protocol (MCP)

### Configuration (`mcp_config.json` / Claude Desktop / Windsurf / Cursor):
```json
{
  "mcpServers": {
    "needmcp": {
      "command": "npx",
      "args": ["-y", "needmcp", "serve"],
      "env": {
        "NEEDMCP_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

## Available NeedMCP Tools Reference

1. `get-styles-tool`: Browse curated design systems (Enterprise, Industrial, Dark Mode, Minimalist, Dashboard).
2. `select-style-tool`: Runtime style locking to guarantee design cohesion and zero token hallucination.
3. `get-style-details-tool`: Deep inspection of palettes, typography scales, border radii, elevation, and shadows.
4. `get-wireframes-tool`: UI structural skeletons for CRM, Analytics, Customer 360°, and Field Sales.
5. `get-wireframe-details-tool`: Layout blueprint, component placement, and column responsive specs.
6. `get-components-tool`: Ready-to-use framework-agnostic Design Tokens (Buttons, KPI Cards, Dossier Sheets, Modals).
7. `export-design-system-tool`: Generates a fully formatted `DESIGN.md` design system for the repository.

## Synergy with Impeccable & DSR360
When building and auditing DSR360 interfaces:
1. **NeedMCP** defines the **Structural Wireframe & Style Theme** (Industrial B2B Lubricants CRM, High Contrast, 44px Tap Targets).
2. **Impeccable** runs the **Design Detector, Heuristic Critique & Visual Polish** (`/impeccable audit`, `/impeccable critique`, `/impeccable polish`).
3. **Hermes & Gemini** generate the **Intelligence & Dynamic Field Insights** (Morning Briefing, Quota Meters, Shell Specs, Forensics).
