# FlipGuard UI Brand Guidelines

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg` | `#1b2d2a` | Page background (Jet Black) |
| `--color-surface` | `#223733` | Card/panel surface |
| `--color-surface-2` | `#2b3a4a` | Elevated surface |
| `--color-surface-3` | `#414066` | Secondary block (Twilight Indigo) |
| `--color-border` | `rgba(130, 129, 109, 0.35)` | Subtle borders |
| `--color-border-strong` | `#82816d` | Emphasized borders (Grey Olive) |
| `--color-ink` | `#f7f9ee` | Primary text |
| `--color-muted` | `#c8c79b` | Secondary/muted text |

## Brand Accents

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-brand` | `#ceff1a` | Primary brand (Chartreuse) |
| `--color-brand-hover` | `#bde817` | Hover state |
| `--color-brand-contrast` | `#1b2d2a` | Text on brand color |
| `--color-accent` | `#aaa95a` | Secondary accent (Palm Leaf) |
| `--color-accent-contrast` | `#1b2d2a` | Text on accent color |

## Status Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-safe` | `#ceff1a` | Safe/accepted states |
| `--color-warn` | `#eab308` | Warning states |
| `--color-threat` | `#f43f5e` | Blocked/malicious states |

## Typography

- **Sans:** Inter (system fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`)
- **Display:** Syne
- **Gradient text:** `linear-gradient(90deg, #f7f9ee, #ceff1a 50%, #aaa95a)`

## Buttons

- **Primary:** `background: #ceff1a`, `color: #1b2d2a`, `font-weight: 800`
- **Shadow:** `0 4px 18px 0 rgba(206, 255, 26, 0.28)`
- **Hover:** `background: #bde817`, `filter: brightness(1.05)`

## Focus

- `outline: 2px solid #ceff1a`, `outline-offset: 2px`, `border-radius: 6px`

## Animations

- **Marquee:** `24s linear infinite` scroll, pauses on hover
- **Pulse dot:** `1.6s ease-in-out infinite`
- Respects `prefers-reduced-motion`

## Color Scheme

- Dark mode only (`color-scheme: dark`)
