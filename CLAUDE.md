# CLAUDE.md — Squared Landing Page Build Guide

This file governs every decision made when building the Squared landing page.
Read this before touching any code. Follow it exactly.

---

## 1. DESIGN SYSTEM

### 1.1 Color Palette

| Role              | Hex       | Usage                                                      |
|-------------------|-----------|------------------------------------------------------------|
| Orange (Primary)  | `#F67A3E` | Hero bg, nav pill bg, primary CTA buttons, key highlights  |
| Cream (Primary)   | `#FFF1E0` | Text on dark bg, card backgrounds, light section bg        |
| Dark (Background) | `#0E0E0E` | Page background (matches Bean Studio's dark body)          |
| Blue (Accent)     | `#99B8F1` | Accent highlights, one feature card, tags                  |
| Pink (Accent)     | `#EF97BF` | Accent highlights, one feature card, inline text highlights|
| Yellow (Accent)   | `#FCCA59` | Accent highlights, one feature card, Member of Month badge |
| Green (Accent)    | `#74A68B` | Accent highlights, one feature card                        |

**Color rules:**
- Orange + Cream are the dominant pairing. They appear together most often.
- The dark background (`#0E0E0E`) is the canvas for most of the page.
- Accent colors are used ONE AT A TIME — one per card or highlight, never stacked.
- Never use white (`#FFFFFF`). Use Cream (`#FFF1E0`) instead.
- Text on dark bg: Cream or `rgba(255,241,224,0.8)` for muted text.
- Text on Orange bg: Dark (`#0E0E0E`) or Black.
- Border/divider lines: `rgba(255,241,224,0.15)` (cream at low opacity).

### 1.2 Typography

**Font:** Use `'Geist'` or `'Inter'` loaded via Google Fonts / CDN. Tight tracking throughout.

| Level            | Size (desktop) | Size (mobile) | Weight       | Tracking           |
|------------------|---------------|---------------|--------------|-------------------|
| Display / Hero   | 9rem (144px)  | 3.75rem (60px)| 900 (black)  | -0.04em (tight)   |
| Section Heading  | 3.75rem (60px)| 2.5rem (40px) | 800 (extrabold) | -0.03em         |
| Sub-heading      | 1.5rem (24px) | 1.25rem (20px)| 700 (bold)   | -0.02em           |
| Body             | 1.125rem (18px)| 1rem (16px)  | 400          | -0.01em           |
| Small / Label    | 0.75rem (12px)| 0.75rem (12px)| 400          | 0.05em (wide)     |

**Typography rules:**
- All headings use extremely tight letter-spacing (`-tracking-wider` equivalent).
- Large display text often has words on separate lines for dramatic effect.
- Inline accent: wrap key words in a colored `<span>` with bg highlight (like Bean Studio's pink highlight on "Talented.").
- Uppercase labels use wide tracking and small size (nav labels, footer).

### 1.3 Spacing & Layout

- **Max-width container:** `max-w-7xl mx-auto` — always padded `px-8` desktop, `px-5` mobile.
- **Section padding:** `py-20` desktop, `py-12` mobile.
- **Large inner rounding:** `rounded-4xl` (2.5rem) on desktop, `rounded-2xl` (1rem) on mobile — used on hero panels, nav pill, cards.
- **Card rounding:** `rounded-xl` (0.75rem).
- **Gap between major sections:** `gap-16` or `mt-20`.
- **Grid:** Flexbox-first. Use CSS Grid only for multi-column card layouts.

### 1.4 Nav Style

Modeled directly after Bean Studio's floating pill nav:

- `position: fixed; top: 0; width: 100%; z-index: 50`
- Outer wrapper: full width with `p-8` padding
- Inner pill: `background: #F67A3E; color: #0E0E0E; border-radius: 2.5rem; padding: 1.25rem 1.75rem`
- Three zones: left (nav links), center (logo/wordmark), right (CTA button)
- Nav links: letter-by-letter hover slide animation (each letter has a clone that slides up from below)
- Logo: bold wordmark "Squared" centered
- CTA button: `border: 2px solid #0E0E0E; background: #0E0E0E; color: #FFF1E0; border-radius: 9999px; padding: 0.5rem 1.5rem`
- On mobile: show only logo centered, hide nav links, keep CTA

### 1.5 Button Styles

| Type         | Style                                                                            |
|--------------|----------------------------------------------------------------------------------|
| Primary CTA  | `bg-[#0E0E0E] text-[#FFF1E0] rounded-full border-2 border-[#0E0E0E] px-10 py-3`|
| Secondary    | `bg-transparent text-[#FFF1E0] rounded-full border border-[#FFF1E0]/40 px-10 py-3`|
| Hero CTA     | Large, `text-4xl md:text-6xl border-2 border-[#0E0E0E] rounded-full bg-[#FFF1E0] text-[#0E0E0E]` with `hover:-rotate-2` effect |

**Button rules:**
- All buttons are `border-radius: 9999px` (fully rounded pill shape).
- Hover: slight rotation (`-2deg`) and smooth transition (`300ms ease-in-out`).
- Never use sharp-cornered buttons.

### 1.6 Animation & Motion

All animations modeled after Bean Studio's scroll-reveal approach. Implement with vanilla JS `IntersectionObserver` + CSS transitions (no heavy GSAP dependency unless preferred).

| Animation          | Trigger        | Implementation                                              |
|--------------------|----------------|-------------------------------------------------------------|
| Fade + slide up    | Scroll into view | `opacity: 0; transform: translateY(40px)` → `opacity: 1; transform: translateY(0)` |
| Letter reveal      | Scroll into view | Each letter wrapped in `<span>`, staggered delay `0.03s` per letter |
| Word reveal        | Scroll into view | Each word animates from `translateY(80px) opacity:0` with stagger |
| Marquee ticker     | Auto           | Infinite CSS animation, alternating directions              |
| Card stack scroll  | Scroll         | Cards stack on top of each other as user scrolls (position: sticky + opacity/transform) |
| Nav link hover     | Hover          | Letter-slot flip: original slides up, clone slides in from below |
| Button hover       | Hover          | `-2deg` rotation, smooth 300ms transition                   |
| Loading screen     | Page load      | Full-screen Orange overlay slides up to reveal page         |

**Transition defaults:**
- Duration: `500ms` for scroll reveals, `200ms` for hover
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out expo feel)

### 1.7 Marquee / Ticker

- One horizontal scrolling ticker between sections
- Text: community-related words/phrases from Squared's world
- Text style: `text-6xl md:text-9xl font-semibold tracking-tight text-[#FFF1E0]/30`
- Two marquee rows — one going left, one going right (alternating directions)
- Gradient fade on left/right edges using the dark bg color

### 1.8 Texture / Background Effects

- Main background: flat `#0E0E0E` (no grain needed — keep it clean like Bean Studio)
- Hero section: `#F67A3E` (solid orange panel, large rounded corners)
- Section dividers: thin `border-top: 1px solid rgba(255,241,224,0.15)`
- Cards on dark bg: `background: rgba(255,241,224,0.04); border: 1px solid rgba(255,241,224,0.12)`
- Feature cards: each gets its OWN accent color as bg (blue, pink, yellow, green)

### 1.9 Cursor (Optional Enhancement)
- Small custom dot cursor following mouse — `position: fixed; width: 20px; height: 20px; border-radius: 50%; background: #F67A3E; opacity: 0.8; pointer-events: none; z-index: 9999`
- Smooth lag effect via JS lerp

---

## 2. BRAND RULES FOR SQUARED

### 2.1 Voice & Tone
- Casual, direct, warm. Like a friend talking to you — not a brand talking at you.
- Use second person ("you", "your squad") constantly.
- Short punchy sentences. Fragment sentences are fine.
- No corporate speak. No jargon. No "synergy."
- Emoji are part of the brand — use sparingly but don't avoid them.
- "Covenant" is the founder's name — reference it by name in CTA sections.

### 2.2 Brand Concept
- Squared = productivity community for young Nigerians / young people
- Not toxic grind culture. Fun + accountability coexist.
- The unit is the SQUAD (5 people). This is the core social unit.
- Focus sessions (90 min, 3x/week) are the main ritual.
- Price: ₦4,000/month

### 2.3 Key Phrases to Use (straight from the content)
- "Show up consistently"
- "Fighting procrastination"
- "People who actually care"
- "Productive without pressure"
- "By young people, for young people"
- "Your squad has your back"
- "This is where the magic happens"
- "The energy is contagious"
- "Go from member to builder"
- "Keep showing up"

### 2.4 What NOT to Do
- Don't make it look corporate or overly polished/sterile
- Don't use stock photos
- Don't use the word "platform" — it's a community
- Don't over-explain. Trust the reader.
- Don't use generic productivity clichés ("unlock your potential", "level up", etc.)

---

## 3. LANDING PAGE SECTIONS

The following 10 sections form the complete page, in order.

### Section 1: NAV
- Fixed floating pill in Orange
- Left: "How It Works" + "Join" links
- Center: "Squared" wordmark (bold, tracked tight)
- Right: "Join Now" CTA button (dark pill)
- Letter-by-letter hover animation on links

### Section 2: HERO
- Full-height Orange panel with large rounded corners (inside the dark page)
- Massive display heading: multi-line, e.g.:
  - "Show Up."
  - "Get Stuff Done."
  - "Together." ← this word gets a Cream bg highlight or different treatment
- Sub-copy: 1–2 sentences from the brand voice ("Productivity community for young people. No pressure. Just people who get it.")
- Large pill CTA button: "Join Squared" (cream bg, dark text)
- Possibly a secondary line: "₦4,000/month · Mon, Thu, Fri · 8PM"

### Section 3: MARQUEE TICKER
- Two rows, infinite scroll, opposite directions
- Words: "Weekly Goals · Accountability · Squad · Focus Sessions · Show Up · Community · Consistency · No Pressure · Young People · Real Talk · 90 Minutes · Market Square"
- Text very large, low opacity cream on dark bg

### Section 4: HOW IT WORKS (Scroll-Stack Cards)
- Left column: sticky heading + intro text
- Right column: scroll-triggered stacking cards, one per feature
- 4 cards, each with its own accent color background:
  1. 🎯 Weekly Goals → Blue (`#99B8F1`) bg
  2. 👥 Squads → Pink (`#EF97BF`) bg
  3. 🧘 Focus Sessions → Yellow (`#FCCA59`) bg
  4. 🏆 Squad Rankings → Green (`#74A68B`) bg
- Each card: icon/emoji, title (large), short description, maybe 2-3 bullet points
- Card text color: dark (`#0E0E0E`) since accent bgs are all mid-tone

### Section 5: THE VIBE (IS / ISN'T)
- Two-column layout or a single centered block
- Big heading: "What Squared IS and ISN'T"
- ✅ Left/top column: IS list (with cream checkmarks)
- ❌ Right/bottom column: ISN'T list (with orange X marks)
- Keep the copy verbatim from the content — it's very good as-is
- Dark section background, cream text

### Section 6: COMMUNITY PERKS
- Three smaller feature callouts in a row or a bento grid:
  1. 📢 Market Square Sessions — monthly X Space
  2. 🏆 Member of the Month — ₦10,000 cash
  3. 📚 Learning & Resource Sharing
- Style: dark cards with accent color top border or accent emoji, cream text
- Keep descriptions brief — link to the detail in the community doc

### Section 7: ROLES
- Section heading: "Go From Member to Builder"
- Four role cards in a 2×2 grid:
  1. 🎖️ Squad Leader
  2. 🤝 Support Board
  3. 📢 Brand & Media
  4. ⚙️ Operations Lead
- Each card: role name, one-line summary, time commitment
- Style: semi-transparent dark cards with cream text, accent color border
- End with: "DM Covenant to apply" CTA

### Section 8: PRICING / JOIN CTA
- Full-width section, Orange background panel (large rounded corners)
- Big heading: "Ready to Join?" or "Stop Scrolling. Start Showing Up."
- Price callout: "₦4,000 / month" — large, prominent
- 3 quick bullet points of what you get
- Big CTA button: "Join Squared" (dark pill)
- Secondary note: "Payment by the 5th of each month"

### Section 9: FAQ
- Clean accordion or static Q&A list
- 6 questions from the content (verbatim):
  1. What if I can't make a focus session?
  2. What if I don't hit my goals?
  3. Can I change my goals mid-week?
  4. What if my Squad isn't vibing?
  5. How do I cancel or pause my membership?
  6. Who do I contact if I have questions?
- Dark bg, cream text, orange accent on question labels

### Section 10: FOOTER
- Thin `border-top: 1px solid rgba(255,241,224,0.15)`
- Left: "Covenant, Founder · Squared"
- Center or right: Social links (X/Twitter), WhatsApp contact
- Bottom: "2025 © Squared. All rights reserved." — uppercase, tiny, wide tracking
- Same layout pattern as Bean Studio footer (compact, two-column)

---

## 4. SECTION-BY-SECTION BUILD PLAN

Build in this exact order. Each section is a standalone chunk. Complete and verify before moving to next.

| Step | Section             | Key Technical Challenge                                      |
|------|---------------------|--------------------------------------------------------------|
| 1    | Base HTML + CSS setup | Font import, CSS variables for colors, reset, container class |
| 2    | Nav                 | Fixed pill, letter-by-letter hover JS, responsive collapse   |
| 3    | Hero                | Orange panel, large rounded, display type, CTA button hover  |
| 4    | Marquee ticker      | Pure CSS infinite scroll animation, two-row alternating      |
| 5    | How It Works cards  | Sticky left col, scroll-stack right col, 4 accent-bg cards   |
| 6    | The Vibe            | Two-column IS/ISN'T layout, scroll reveal                    |
| 7    | Community Perks     | 3-card row or bento, scroll reveal                           |
| 8    | Roles               | 2×2 card grid, scroll reveal                                 |
| 9    | Pricing / Join CTA  | Orange panel (mirrors Hero), large type, price callout       |
| 10   | FAQ                 | Simple accordion or static list                              |
| 11   | Footer              | Two-column, border-top, uppercase small text                 |
| 12   | Scroll animations   | IntersectionObserver pass over all `.reveal` elements        |
| 13   | Loading screen      | Orange overlay, slides up on load                            |
| 14   | Custom cursor       | Optional — small dot, JS lerp follow                         |
| 15   | Mobile polish       | Responsive pass: breakpoints, font sizes, nav collapse       |

---

## 5. FILE STRUCTURE

```
Squared Website/
├── index.html          ← single HTML file (all sections)
├── style.css           ← all styles (no framework — plain CSS or Tailwind CDN)
├── script.js           ← scroll animations, nav hover, marquee, cursor, loader
├── CLAUDE.md           ← this file
└── squared-content.md  ← source of truth for all copy
```

Single-file approach preferred for simplicity. Keep CSS and JS in separate files.
Use Tailwind CDN only if it speeds things up — otherwise plain CSS is fine.

---

## 6. TECHNICAL CONSTRAINTS

- **No frameworks.** Vanilla HTML, CSS, JS only (or Tailwind CDN).
- **No images required** for MVP. Use emoji, colored shapes, and typography as visual elements.
- **Fonts:** Load via Google Fonts CDN — `Geist` if available, otherwise `Inter`.
- **Smooth scroll:** Use CSS `scroll-behavior: smooth` or lightweight Lenis if desired.
- **Scroll animations:** `IntersectionObserver` API — no GSAP unless specifically requested.
- **Responsive breakpoints:** Mobile-first. Key breakpoint: `768px` (md).
- **Accessibility:** All interactive elements keyboard-accessible. Semantic HTML (`<nav>`, `<section>`, `<h1>`–`<h3>`, etc.).

---

## 7. DO NOT

- Do not invent copy. Use text verbatim from `squared-content.md`.
- Do not add sections not listed in this plan without asking.
- Do not use colors outside the defined palette.
- Do not use sharp-cornered elements — everything is rounded.
- Do not make the page feel corporate or sterile.
- Do not write a single line of code without this CLAUDE.md being approved.
