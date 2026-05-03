# MK11 Korean Patch: Design System

## Concept

Dark luxury style inspired by the official Mortal Kombat 11 UI language.
Black-based background with gold accents and restrained red highlights.

---

## Color Tokens

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#0a0a0a` | Page background |
| `--color-surface` | `#111111` | Card / section background |
| `--color-surface-raised` | `#1a1a1a` | Hover state, input background |
| `--color-border` | `#2a2a2a` | Dividers, borders |
| `--color-gold` | `#c9a84c` | Primary accent (CTA, heading highlight) |
| `--color-gold-bright` | `#f0c040` | Gold highlight on hover |
| `--color-gold-dim` | `#7a6030` | Inactive gold |
| `--color-text-primary` | `#f0ece0` | Body text |
| `--color-text-secondary` | `#888880` | Secondary text, captions |
| `--color-danger` | `#cc3333` | Warnings, errors |
| `--color-overlay` | `rgba(0,0,0,0.7)` | Modal overlay |

---

## Typography

Fonts: `'Noto Sans KR'` (Korean body) + `'Bebas Neue'` (English headings)

| Token | Size | Weight | Usage |
|---|---|---|---|
| `--text-display` | `3.5rem` | 700 | Hero title |
| `--text-heading` | `1.75rem` | 600 | Section heading |
| `--text-subheading` | `1.25rem` | 500 | Card title |
| `--text-body` | `1rem` | 400 | Body text |
| `--text-caption` | `0.875rem` | 400 | Captions, labels |
| `--text-small` | `0.75rem` | 400 | Footnotes, version text |

---

## Spacing Scale

4px base multiplier.

| Token | Value | Usage |
|---|---|---|
| `--space-1` | `4px` | Icon inner padding |
| `--space-2` | `8px` | Inline gap |
| `--space-3` | `12px` | Input field padding |
| `--space-4` | `16px` | Card inner padding |
| `--space-6` | `24px` | Section inner padding |
| `--space-8` | `32px` | Component spacing |
| `--space-12` | `48px` | Section spacing |
| `--space-16` | `64px` | Page top margin |

---

## Border & Radius

| Token | Value |
|---|---|
| `--radius-sm` | `2px` |
| `--radius-md` | `4px` |
| `--radius-lg` | `8px` |
| `--border-gold` | `1px solid var(--color-gold-dim)` |
| `--border-surface` | `1px solid var(--color-border)` |

---

## Components (Landing Page)

| Component | Description |
|---|---|
| **Hero** | Full-width background + title + subtitle + CTA button |
| **Screenshot Gallery** | Horizontal scroll snap slider, 4:3 aspect ratio |
| **Download CTA** | Gold button, GitHub Release link, download count badge |
| **Feedback Form** | Category select + textarea + submit button |
| **Footer** | Version info, disclaimer, links |

---

## Installer UI

PyInstaller + pywebview. `background_color: #0a0a0a`.

| Item | Value |
|---|---|
| Window size | `720 × 620px` (installer), `500 × 440px` (manager) |
| Background | `#0a0a0a` |
| Accent | `#c9a84c` |
| Font | NanumSquare Neo (Korean), Kombat11 (English headings) |

---

## Voice & Tone

- **Concise and direct.** No unnecessary qualifiers.
- **Korean-first.** Technical terms may include original notation (e.g. `Coalesced.CHS`).
- **Formal but accessible.** Written for gamers.
