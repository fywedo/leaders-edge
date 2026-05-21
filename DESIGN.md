# Design Brief

## Direction

Executive Luxury — premium digital products for leaders, powered by true navy blue and rich warm gold palette with refined typography and spacious composition. Hue 232 for navy (not blue-violet), saturated gold for decisive CTAs.

## Tone

Refined, understated confidence. Not flashy or decorative — pure elegance and intentional silence signal premium status and VIP access.

## Differentiation

Strategic gold accents on interactive elements and section dividers create a VIP signal without excess; executive-grade typography and spacing speak to leaders.

## Color Palette

| Token      | OKLCH         | Role                                    |
| ---------- | ------------- | --------------------------------------- |
| background | 0.16 0.04 232 | Deep true navy primary background       |
| foreground | 0.94 0.008 60 | Warm off-white, gold-tinted text        |
| card       | 0.20 0.045 232| Slightly lighter navy for card surfaces |
| primary    | 0.72 0.18 52  | Rich warm gold — buttons, CTAs, accents |
| accent     | 0.72 0.18 52  | Gold accent for highlights, dividers    |
| muted      | 0.28 0.035 232| Mid-navy for disabled/secondary         |
| border     | 0.32 0.04 232 | Subtle navy borders for structure       |

## Typography

- Display: Fraunces (serif) — hero text, section headings, VIP tone setting
- Body: General Sans (sans-serif) — product descriptions, UI labels, body copy
- Scale: hero `text-6xl font-bold tracking-tight`, h2 `text-3xl font-bold`, label `text-sm font-semibold uppercase`, body `text-base leading-relaxed`

## Elevation & Depth

Minimal surface hierarchy through subtle navy gradations and restrained shadows (`shadow-subtle`, `shadow-elevated`). Cards elevate from background via 2–4px background shifts, not dramatic shadows.

## Structural Zones

| Zone    | Background       | Border             | Notes                                       |
| ------- | ---------------- | ------------------ | ------------------------------------------- |
| Header  | navy card layer  | gold accent 2px    | Executive branding, navigation             |
| Content | navy background  | —                  | Alternating card layers, 1:1 aspect grid  |
| Footer  | navy secondary   | gold accent top    | Legal links, brand statement                |

## Spacing & Rhythm

Generously spaced sections (64px gaps) with 16–24px internal padding create breathing room and executive feel. Product cards use 1:1 aspect ratio with centered content. Labels uppercase, 2px letter-spacing.

## Component Patterns

- Buttons: gold background, dark navy text, rounded-md, hover scales 1.02 with shadow-elevated
- Cards: navy card background, gold top 2px border, subtle shadow, hover lifts with shadow-elevated
- Badges: dark grey background, light text, rounded-full, 8px horizontal padding

## Motion

- Entrance: fade-in over 300ms on page load
- Hover: button and card scale 1.02 with shadow transition
- Decorative: none — clarity and restraint over movement

## Constraints

- No gradients, no animated backgrounds, no decorative flourishes
- Gold used sparingly — accents only, never backgrounds
- Uppercase labels only for section tags and button text
- Container max-width 1200px for comfortable reading

## Signature Detail

Gold top border (2px) on product cards signals premium positioning; combined with generous navy spacing and Fraunces serif headings, creates instantly recognizable executive aesthetic.
