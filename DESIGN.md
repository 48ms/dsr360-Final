# DSR360 Design System (NeedMCP Industrial Theme + Impeccable Quality)

## 1. Aesthetic Vision: Enterprise Industrial Precision
DSR360 marries the high-reliability aesthetics of industrial equipment telemetry with the streamlined speed of modern B2B SaaS. It is tailored for high sunlight visibility, rapid thumb navigation, and clear data density.

## 2. Color Palette & Design Tokens

### Primary Brand (Shell Identity)
- **Shell Red (Primary Accent / Danger / Urgent Callout)**: `#DD1D21` (`hsl(359, 76%, 49%)` / Tailwind `red-600`)
- **Shell Warm Gold / Warning Glow**: `#FFD100` (`hsl(49, 100%, 50%)` / Tailwind `amber-400`)
- **Shell Primary Amber Action**: `#F59E0B` (`amber-500`)

### Surface & Neutral Hierarchy (High Contrast Slate)
- **App Canvas (Background)**: `#090D16` / `#0B0F19` (Deep Obsidian Slate)
- **Card Surface (Base)**: `#111827` (Zinc-900 / Slate-900)
- **Card Surface (Elevated / Interactive)**: `#1E293B` (Slate-800) with `border-slate-800/80`
- **Card Surface (Active / Highlighted)**: `#1E2235` with subtle `amber-500/20` border

### Text & Typographic Hierarchy
- **Heading 1 / KPI Figures**: `text-white font-bold tracking-tight text-xl md:text-2xl`
- **Primary Body**: `text-slate-200 font-medium text-sm md:text-base`
- **Secondary / Metadata**: `text-slate-400 text-xs md:text-sm`
- **Micro-labels / Badges**: `text-[11px] font-semibold uppercase tracking-wider text-slate-300`

### Status & Semantic Accents
- **Won / Healthy / High Probability**: `#10B981` (Emerald-500)
- **In Progress / Hot Pipeline**: `#F59E0B` (Amber-500)
- **At Risk / Churn / Urgent Overdue**: `#EF4444` (Red-500)
- **Intelligence / AI Copilot**: `#8B5CF6` (Violet-500) / `#6366F1` (Indigo-500)

## 3. Ergonomic & Usability Rules (Impeccable & NeedMCP Standards)

1. **44px Minimum Tap Targets**:
   - All interactive touch targets (action buttons, tabs, modal close icons, dropdown items) MUST have a minimum bounding box of 44x44px (`min-h-[44px]` or `p-3`).
2. **Factory Sunlight Contrast Ratio**:
   - Contrast ratio for body and key KPI text must exceed 4.5:1 (WCAG AA) against dark card backgrounds.
3. **PWA Mobile-First Viewport**:
   - Clean spacing with `px-4 py-4 md:px-6 md:py-6`, safe area insets `pb-24` on mobile to prevent floating bar overlap.
4. **Haptic & Visual Feedback**:
   - Buttons must provide active depression feedback (`active:scale-[0.98] transition-all duration-150`).
5. **No Data-Drop / Instant Loading**:
   - Loading skeletons and fallback UI states must match the exact height and layout of rendered cards.
