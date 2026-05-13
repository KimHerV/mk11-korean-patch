# MK11 Korean Patch: Design System

## Concept

Dark luxury style inspired by the official Mortal Kombat 11 UI language.
Black-based background with gold accents and restrained red highlights.

The single source of truth for design tokens is `landing/shared/design-system.css`.
All contexts (landing page, installer) reference this file directly.

---

## Color Tokens

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#0a0a0a` | Page background |
| `--color-surface` | `#111111` | Card, section, banner background |
| `--color-surface-raised` | `#1a1a1a` | Hover state, input background |
| `--color-border` | `#2a2a2a` | Dividers, borders |
| `--color-gold` | `#c9a84c` | Primary accent: CTA, heading highlight, links |
| `--color-gold-bright` | `#f0c040` | Gold on hover |
| `--color-gold-dim` | `#7a6030` | Inactive gold, subtle borders |
| `--gradient-gold` | `linear-gradient(to bottom, #f0dea0, #ceac5e)` | Gold gradient (buttons, headings) |
| `--color-text-primary` | `#f0ece0` | Body text |
| `--color-text-secondary` | `#888880` | Captions, labels, secondary info |
| `--color-danger` | `#cc3333` | Errors, warnings |
| `--color-success` | `#4a9a5a` | Success states |
| `--color-warning` | `#c47a20` | Warning states |

Short aliases (`--gold`, `--bg`, `--surface`, etc.) are also defined for app contexts.

---

## Typography

| Token | Size | Usage |
|---|---|---|
| `--text-display` | `3.5rem` | Hero title |
| `--text-heading` | `1.75rem` | Section heading |
| `--text-subheading` | `1.25rem` | Card title, footer title |
| `--text-body` | `1rem` | Body text |
| `--text-caption` | `0.875rem` | Captions, labels, links |
| `--text-small` | `0.75rem` | Footnotes, version text, legal |

**Fonts loaded per context:**
- `NanumSquare Neo` — Korean UI body font (landing + installer)
- `Kombat11` — English display/heading font (landing only, decorative)

---

## Spacing Scale

4px base multiplier. Only discrete values are defined — intermediate values (`--space-5`, `--space-7`, etc.) are intentionally absent and will fall back to `initial` if referenced.

| Token | Value |
|---|---|
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |
| `--space-12` | `48px` |
| `--space-16` | `64px` |

---

## Border & Radius

| Token | Value |
|---|---|
| `--radius-sm` | `2px` |
| `--radius-md` | `4px` |
| `--radius-lg` | `8px` |

---

## Components (Landing Page)

| Component | Description |
|---|---|
| **Announcement Banner** | Thin strip at top. Config-driven via `landing/data/banner.js`. Gold text on dark surface, no close button. |
| **Hero** | Full-viewport video background, title, subtitle, scroll CTA |
| **Stats Bar** | Download count, translation stats, live sparkle animation |
| **Screenshot Carousel** | Horizontal scroll snap, 6 slides, dot nav + arrow controls |
| **Install Cards** | Two-card selector: GUI (recommended, gold border when selected) / CLI (alternative). On mobile: horizontal swipe carousel with peek. Action zone below swaps CTA and steps per selection. |
| **FAQ** | Accordion by category. Frosted glass manifest table inside DLL FAQ item. |
| **Foundation Visualizer** | D3 force graph of 37-character speech register system |
| **Feedback Form** | Category + character pair selector + textarea + submit |
| **Music Player** | Fixed bottom bar. Desktop: info + play + progress + volume. Mobile: info + play + full-bleed 3px progress line. |
| **Footer** | Single-column centered. Title (Kombat11 font) / byline + meta / links / legal. |

---

## Installer UI

Wails-based single EXE. Shares `design-system.css` tokens via embedded frontend.

| Item | Value |
|---|---|
| Background | `#0a0a0a` |
| Accent | `#c9a84c` |
| Font | NanumSquare Neo |
| Modes | install / manager / uninstall (branch on launch args) |

---

## Voice & Tone

- **Concise and direct.** No unnecessary qualifiers.
- **Korean-first.** Technical terms may include original notation (e.g. `Coalesced.CHS`).
- **Formal but accessible.** Written for gamers.
- **No em-dashes.** Use `:` for title/subtitle separation, `.` or `,` for sentence breaks.
