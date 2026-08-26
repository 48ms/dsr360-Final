# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are B2B Industrial Lubricant Sales Representatives (DSR - Distributor Sales Representative) of PT Harapan Utama Motor (Authorized Distributor Shell Lubricants Jawa Barat & Jawa Tengah), actively managing industrial plant accounts, purchasing managers, and mechanical heads across industrial estates in West Java and Central Java.

## Product Purpose

DSR360 is an autonomous, mobile-first sales super-app and CRM designed to eliminate field sales friction. It transforms administrative delays (manual price calculations, waiting for office SPH drafts, fragmented visit notes) into an instant workflow: real-time floor price & fee calculation for 223+ Shell SKUs, instant official SPH PDF generation with authentic PT HUM stamps, live GPS branch tagging, Hermes AI route optimization, and an interconnected 5-pillar sales ecosystem.

## Positioning

The only B2B sales co-pilot engineered specifically for Shell Authorized Lubricant Distributors. Unlike generic CRMs (Salesforce, HubSpot), DSR360 hardcodes authentic distributor pricing mathematics (PT HUM 52% markup divisor, PPh Selisih 25%, and TER Golongan 1–7 incentive tables) alongside official letterhead formats and industrial POPSA sales playbooks.

## Operating Context

- **Work Environments**: Industrial corridors (Cikarang, Karawang, Cimahi, Bandung, Rancaekek, Sukoharjo, Solo), factories, boiler rooms, maintenance depots, and remote plant visits.
- **Hardware & Form Factors**: High-mobility smartphones, field tablets, and desktop workstations.
- **Customer Interactions**: In-person plant technical assessments, purchasing price negotiations, and rapid WhatsApp B2B quotation sharing.

## Capabilities and Constraints

- **Official Shell Pricing Database**: 223+ SKUs spanning Engine Oils (Rimula), Hydraulic Fluids (Tellus), Gear Oils (Omala), Compressor Oils (Corena), Greases (Gadus), and Coolants with exact MSP and unit packaging (`DRUM 209L`, `PAIL 20L`, `BULK`, `GALON 4L`).
- **Compensation & Price Simulation**:
  - Mode 1: Skema Fee Pihak Ketiga: $\text{Floor Price} = \text{ROUNDUP}\left(\text{MSP} + \frac{\text{Fee}}{0.52}, 0\right)$
  - Mode 2: Skema Insentif Standar DSR (Tabel TER Gol 1–7).
- **Official SPH Document Engine**: Isolated A4 print sandbox generating authentic 1-page quotations with PT HUM kop surat, 6-column pricing tables, clauses, and Bima Maulana Saputra official signature stamp (`/images/sph/bima_signature_stamp.png`).
- **5-Pillar Cross-Tab Autonomous Engine**:
  1. *SPH ➔ Pipeline & Follow-Up*: Creating an SPH automatically generates a `QUOTATION` deal and schedules an H+3 follow-up task.
  2. *Quick Visit ➔ Auto-Clear Follow-Up*: Completing a visit auto-resolves prior overdue and pending follow-ups for that customer.
  3. *Live GPS Check-in ➔ Auto-Pin Cabang*: Field check-ins auto-save factory coordinates to customer branch profiles.
  4. *Hermes Rute Cerdas ➔ Intelligent Territory Prioritization*: Prioritizes customers with active SPH quotes and overdue tasks on optimal geographic paths.
  5. *Deal WON ➔ Auto Customer Upgrade*: Winning a deal auto-upgrades customer status to `ACTIVE` and updates monthly volume quotas.

## Brand Commitments

- **Corporate Identity**: PT. Harapan Utama Motor & Shell Lubricants Authorised Distributor.
- **Representative Profile**: Bima Maulana Saputra (Distributor Sales Representative - Jawa Barat, `085315513609`).
- **Visual Tone**: Precision industrial excellence, crisp typography, clean dark/amber/red/emerald palettes, and zero visual clutter.

## Evidence on Hand

- Google Doc SPH Template (`/images/sph/header_kop_surat.jpg`, `/images/sph/footer_polos.jpg`, `/images/sph/official_header_complete.png`, `/images/sph/official_footer_complete.png`).
- Official PT Harapan Utama Motor Price Calculator Sheets (`lib/constants/shell-pricing-database.ts`).
- Authentic PT HUM Solo Stamp & Bima Signature (`public/images/sph/bima_signature_stamp.png`).

## Product Principles

1. **Zero Field Friction**: 1-minute quick visits, 1-tap WhatsApp quotes, and zero manual calculation overhead.
2. **Mathematical Precision**: Strict adherence to PT HUM Floor Price formulas and distributor margin retention.
3. **Autonomous Data Flow**: Actions in any module instantly propagate across Pipeline, Tasks, Customers, and Route Planning.
4. **Authentic Office Deliverables**: Generated SPH documents must be 100% faithful to corporate standards and single-page A4 print constraints.
