# Scenario Playbooks

Use the closest playbook first, then adapt scale, copy, and composition to the brief.

## 1. Offline AI Meetup Poster

### Best starter

- `assets/templates/unboundx-ai-meetup-poster.svg`
- fallback: `assets/materials/svg/unboundx-poster.svg`

### Mandatory content blocks

- UNBOUNDX logo
- event title
- 1-line positioning or subtitle
- date and time
- venue / city
- organizer
- registration CTA or QR area

### Optional blocks

- speakers
- short agenda
- partner logos
- serial number or edition tag

### Layout formula

- top: brand mark + event tag
- middle: very large title with strong line breaks
- lower-middle: subtitle and short intro
- bottom: date / venue / CTA in a structured info rail
- background: restrained arc motif or low-opacity symbol reuse

### Prompt template

Create a UNBOUNDX-branded offline event poster for an AI meetup.
Use the visual system from `references/brand-asset-inventory.md`.
Start from `assets/templates/unboundx-ai-meetup-poster.svg`.
Keep the background Deep Void (`#050505`) with sparse Aerospace Orange (`#F26122`) accents.
Include: {event_title}, {subtitle}, {date_time}, {venue}, {city}, {organizer}, {cta_or_qr_label}.
Mood: hard-tech, precise, premium, no generic AI gradients.

## 2. Social Cover / Announcement Banner

### Best starter

- `assets/materials/svg/unboundx-social-cover.svg`

### Good use cases

- event announcement
- hiring post
- feature launch
- partnership banner
- conference recap cover

### Layout formula

- wide lockup
- single dominant headline
- one short supporting line
- date / tag / CTA in small utility copy

### Prompt template

Create a wide UNBOUNDX social cover using `assets/materials/svg/unboundx-social-cover.svg` as the starter.
Use one high-contrast headline, one support line, and compact metadata.
Keep the composition dark, spacious, and asymmetric.

## 3. Business Card

### Best starter

- `assets/templates/unboundx-business-card.svg`

### Mandatory content blocks

- name
- title
- email
- website or phone
- UNBOUNDX logo

### Layout formula

- logo block in one corner
- large name on the opposite side
- orange for role highlight only
- utility contact text aligned in a tight vertical rhythm

### Prompt template

Create a UNBOUNDX business card from `assets/templates/unboundx-business-card.svg`.
Replace placeholder identity fields with: {name}, {title}, {email}, {website}, {phone}.
Keep the result restrained, premium, and print-friendly.

## 4. Employee Badge / Work Card

### Best starter

- `assets/templates/unboundx-employee-badge.svg`

### Mandatory content blocks

- employee name
- role / team
- company
- employee ID or badge code
- scannable area (QR / NFC placeholder)

### Optional blocks

- portrait
- validity window
- access level
- emergency contact

### Layout formula

- top: lockup and badge type
- middle: portrait or placeholder panel
- lower: identity data in a structured stack
- bottom: QR area + access or validity strip

### Prompt template

Create a UNBOUNDX employee badge using `assets/templates/unboundx-employee-badge.svg`.
Replace placeholders with {name}, {role}, {team}, {employee_id}, {valid_until}, and {qr_label}.
Preserve a sharp, security-tech feel without adding decorative clutter.

## 5. Key Visual / Hero Graphic

### Best starter

- `assets/materials/svg/unboundx-key-visual.svg`

### Use when

- event landing page hero
- campaign KV
- launch screen
- deck cover

### Layout formula

- dramatic headline
- minimal supporting copy
- large field of negative space
- symbol or arc motif as structure, not decoration

### Prompt template

Create a UNBOUNDX key visual starting from `assets/materials/svg/unboundx-key-visual.svg`.
Use a large brand statement, restrained metadata, and minimal but high-tension geometry.

## General Production Notes

- When information is missing, keep placeholders obvious: `EVENT TITLE`, `DATE TBD`, `SCAN TO RSVP`.
- For review-first workflows, keep everything editable in SVG.
- Raster export should happen only after the composition and copy are stable.
- For print artifacts, check margins and keep crucial text away from edges.

