# SSP AOV Dashboard - Design Reference

> Source: https://ssp-aov-dashboard.vercel.app/
> Scraped: 2026-03-21
> Purpose: Design quality benchmark for the Open Brain dashboard

---

## 1. Overall Layout Structure

### Page Container
```css
max-width: 1440px;
margin: 0 auto;
padding: 32px 16px;           /* py-8 px-4 (mobile) */
padding: 32px 32px;           /* md:py-8 md:px-8 */
padding: 32px 48px;           /* lg:py-8 lg:px-12 */
min-height: 100vh;
```

### Section Spacing
- **Between major sections:** `margin-bottom: 40px` (mb-10 = 10 * 4px)
- **Between section header and content:** `margin-bottom: 24px` (mb-6)
- **Between card rows:** `gap: 24px` (gap-6)
- **Between KPI cards (top row):** `gap: 16px` (gap-4)

### Grid Layouts
| Section | Mobile | Tablet (48rem+) | Desktop (64rem+) |
|---------|--------|------------------|-------------------|
| KPI cards (top row) | 2 cols | 3 cols | 5 cols |
| Charts (middle row) | 1 col | 1 col | 3 cols (2:1 split via lg:col-span-2) |
| Charts (lower row) | 1 col | 2 cols | 3 cols |
| Detail tables | 1 col (full width) | 1 col (full width) | 1 col (full width) |
| Bottom cards | 1 col | 2 cols | 2 cols |

---

## 2. Color Palette

### CSS Custom Properties (Tailwind Theme)
```css
:root {
  /* Brand Colors */
  --color-pg-orange: #FD3300;          /* Primary accent / hero metric */
  --color-pg-ui-gray: #7B726C;        /* Muted text, secondary labels */
  --color-pg-stone: #B3AAA3;          /* Label text, column headers */
  --color-pg-pebble: #DFD9D5;         /* Body text, table cell text */
  --color-pg-fog: #F4F2F0;            /* Body text (set on body element) */
  --color-pg-mist: #FCFAFA;           /* Bright text, metric values */
  --color-pg-forest: #2E4734;         /* Success/complete green */
  --color-pg-sky: #B2C6EB;            /* Info badges (subscription) */
  --color-pg-indigo: #4F41D5;         /* Secondary chart color */

  /* Surface Colors */
  --color-surface-base: #0D0C0C;      /* Page background */
  --color-surface-elevated: #1F1C1C;  /* Card background, progress bar track */
  --color-surface-hover: #2A2626;     /* Table row hover */

  /* Utility Colors */
  --color-green-400: #05DF72;         /* OTP badge text */
  --color-green-500: #00C758;         /* Status indicators */
}
```

### Color Usage Pattern
| Purpose | Color | Hex |
|---------|-------|-----|
| Page background | surface-base | #0D0C0C |
| Card background | Glass gradient (see below) | #171515 -> #1F1C1C |
| Primary accent (hero number, highlights) | pg-orange | #FD3300 |
| Bright metric values | pg-mist | #FCFAFA |
| Section headings | pg-mist | #FCFAFA |
| Card label text (uppercase) | pg-stone | #B3AAA3 |
| Subtitle / description text | pg-ui-gray | #7B726C |
| Table body text | pg-pebble | #DFD9D5 |
| Muted secondary values | pg-ui-gray | #7B726C |
| Card borders | pg-stone at 8% opacity | #B3AAA314 |
| Card hover border | pg-orange at 15% | #FD330026 |
| Accent border (hero card) | pg-orange at 20% | #FD330033 |

---

## 3. Card Design (glass-card)

### Base Card
```css
.glass-card {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: linear-gradient(135deg, rgba(23, 21, 21, 0.9) 0%, rgba(31, 28, 28, 0.7) 100%);
  border: 1px solid rgba(179, 170, 163, 0.08);    /* #B3AAA314 */
  border-radius: 1rem;                              /* rounded-2xl = 16px */
  padding: 24px;                                     /* p-6 = 6 * 4px */
  transition: border-color 0.3s, box-shadow 0.3s;
}

.glass-card:hover {
  border-color: rgba(253, 51, 0, 0.15);             /* #FD330026 */
  box-shadow: 0 0 30px rgba(253, 51, 0, 0.04);      /* #FD33000A */
}
```

### Hero Card (first KPI card, highlighted)
```css
/* Additional class: glow-orange + border-pg-orange/20 */
.glow-orange {
  box-shadow: 0 0 20px rgba(253, 51, 0, 0.1), 0 0 60px rgba(253, 51, 0, 0.05);
}
border-color: rgba(253, 51, 0, 0.2);                /* border-pg-orange/20 */
```

---

## 4. Typography

### Font Families
```css
:root {
  --font-sans: "ABC Repro", system-ui, -apple-system, sans-serif;
  --font-mono: "ABC Repro Mono", "SF Mono", monospace;
}
```

**Note:** ABC Repro is a custom/commercial font. For the Open Brain dashboard, substitute with:
- Body/headings: `Inter` or `system-ui` (closest free alternative)
- Monospace/metrics: `JetBrains Mono`, `SF Mono`, or `ui-monospace`

### @font-face Declarations
```css
@font-face { font-family: "ABC Repro"; src: url(/fonts/repro/ABCRepro-Regular.woff2); font-weight: 400; }
@font-face { font-family: "ABC Repro"; src: url(/fonts/repro/ABCRepro-Medium.woff2); font-weight: 500; }
@font-face { font-family: "ABC Repro"; src: url(/fonts/repro/ABCRepro-Bold.woff2); font-weight: 700; }
@font-face { font-family: "ABC Repro Mono"; src: url(/fonts/repro-mono/ABCReproMono-Regular.woff2); font-weight: 400; }
@font-face { font-family: "GT Super Text"; src: url(/fonts/gt-super-text/GT-Super-Text-Book.woff2); font-weight: 400; }
```

### Type Scale
| Element | Size | Weight | Color | Letter Spacing | Extra |
|---------|------|--------|-------|----------------|-------|
| Page title (h1) | `text-3xl` (1.875rem / 30px), `md:text-4xl` (2.25rem / 36px) | 700 (bold) | pg-mist (#FCFAFA) | tight (-0.025em) | — |
| Page subtitle | `text-sm` (0.875rem / 14px) | 400 | pg-stone (#B3AAA3) | normal | — |
| Section heading (h2) | `text-lg` (1.125rem / 18px) | 600 (semibold) | pg-mist (#FCFAFA) | tight (-0.025em) | — |
| Section subtitle | `text-sm` (0.875rem / 14px) | 400 | pg-ui-gray (#7B726C) | normal | margin-top: 4px |
| KPI label | `text-xs` (0.75rem / 12px) | 500 (medium) | pg-stone (#B3AAA3) | widest (0.1em) | uppercase |
| KPI value | `text-3xl` (1.875rem / 30px) | 700 (bold) | pg-orange or pg-mist | -0.02em | font-mono, tabular-nums |
| KPI subtitle | `text-xs` (0.75rem / 12px) | 400 | pg-ui-gray (#7B726C) | normal | font-mono |
| Table header | `text-xs` (0.75rem / 12px) | 500 (medium) | pg-stone (#B3AAA3) | widest (0.1em) | uppercase |
| Table body | `text-sm` (0.875rem / 14px) | 400 or 500 | pg-pebble / pg-mist | normal | — |
| Metric values (all) | inherits size | varies | varies | -0.02em | font-mono, tabular-nums |

### Metric Value Class
```css
.metric-value {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}
```

---

## 5. Data Presentation Patterns

### KPI Cards (Top Row)
- **Layout:** 5-column grid at desktop, each card is `glass-card rounded-2xl p-6`
- **Structure:** Label (xs, uppercase, tracking-widest) -> Value (3xl, bold, mono) -> Subtitle (xs, mono)
- **Spacing:** Label mb-3, Value to subtitle mt-2
- **Hero card:** First card gets `glow-orange` class + `border-pg-orange/20` + orange value text
- **Other cards:** Default glass-card + mist-colored values

### Progress Bars (Funnel Conversion)
```css
/* Track */
height: 10px;                    /* h-2.5 */
background: var(--color-surface-elevated);  /* #1F1C1C */
border-radius: 9999px;           /* rounded-full */
overflow: hidden;

/* Fill */
height: 100%;
border-radius: 9999px;
transition: all 1s;              /* duration-1000 */
/* Width set dynamically via inline style */
/* Color varies per step: #FD3300, #DB2C00, #4F41D5, #B2C6EB */
```

### Charts (Recharts)
- Container heights: `h-[300px]` (main chart), `h-[280px]` (secondary charts), `h-[240px]` (pie/donut)
- Uses Recharts responsive container (`width: 100%; height: 100%`)
- Chart colors from the palette: `#FD3300`, `#DB2C00`, `#4F41D5`, `#B2C6EB`, `#B3AAA3`, `#7B726C`

### Legend Items (below charts)
```css
/* Color swatch */
width: 10px;                     /* w-2.5 */
height: 10px;                    /* h-2.5 */
border-radius: 0.25rem;          /* rounded-sm */

/* Layout: flex justify-between items-center text-xs */
/* Label: text-pg-stone */
/* Value: metric-value text-pg-pebble */
/* Spacing between items: space-y-2 (8px) */
```

### Tables
```css
/* Table */
width: 100%;
font-size: 0.875rem;            /* text-sm */

/* Header row */
border-bottom: 1px solid rgba(179, 170, 163, 0.1);  /* border-pg-stone/10 */

/* Header cells */
text-align: left;
padding: 12px 16px;             /* py-3 px-4 */
font-size: 0.75rem;             /* text-xs */
text-transform: uppercase;
letter-spacing: 0.1em;          /* tracking-widest */
color: var(--color-pg-stone);
font-weight: 500;

/* Body rows */
border-bottom: 1px solid rgba(179, 170, 163, 0.03);  /* border-pg-stone/5 */
transition: background-color 0.15s;

/* Body row hover */
background-color: rgba(42, 38, 38, 0.5);  /* surface-hover/50 */

/* Body cells */
padding: 12px 16px;             /* py-3 px-4 */

/* Total/summary row */
background-color: rgba(31, 28, 28, 0.5);  /* surface-elevated/50 */
font-weight: 700;
```

### Badges / Pills
```css
/* Subscription badge */
font-size: 0.75rem;             /* text-xs */
padding: 2px 8px;               /* px-2 py-0.5 */
border-radius: 9999px;          /* rounded-full */
background: rgba(79, 65, 213, 0.15);   /* bg-pg-indigo/15 */
color: var(--color-pg-sky);              /* #B2C6EB */

/* OTP badge */
background: rgba(46, 71, 52, 0.2);     /* bg-pg-forest/20 */
color: var(--color-green-400);           /* #05DF72 */
```

### Sankey / Flow Diagram (Buyer Flow Map)
- Full-width SVG with `viewBox="0 0 900 420"`
- Column headers: uppercase, tracking-widest, 9px mono font
- Bars: 14px wide, 3px border-radius, stroke `rgba(255,255,255,0.15)` at 0.5px
- Active bars: filled with brand colors
- Inactive ("No UP") bars: `#1F1C1C` fill, `rgba(179,170,163,0.1)` stroke
- Flow paths: colored fills at 25% opacity, transition-opacity on hover
- Labels: 11px sans-serif for names, 9px mono for order counts

---

## 6. Background & Texture

### Grid Background
```css
.grid-bg {
  background-image:
    linear-gradient(rgba(179, 170, 163, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(179, 170, 163, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

---

## 7. Animations & Transitions

### Fade-In-Up Entry Animation
```css
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  opacity: 0;
  animation: 0.5s ease-out forwards fadeInUp;
}

/* Staggered delays */
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
.delay-4 { animation-delay: 0.4s; }
.delay-5 { animation-delay: 0.5s; }
```

### Card Hover
```css
.glass-card {
  transition: border-color 0.3s, box-shadow 0.3s;
}
.glass-card:hover {
  border-color: rgba(253, 51, 0, 0.15);
  box-shadow: 0 0 30px rgba(253, 51, 0, 0.04);
}
```

### Table Row Hover
```css
transition: color, background-color, border-color /* ... */ 0.15s cubic-bezier(0.4, 0, 0.2, 1);
/* hover state: */
background-color: rgba(42, 38, 38, 0.5);   /* surface-hover/50 */
```

### Progress Bar Fill
```css
transition: all 1s;   /* duration-1000 - smooth width animation on load */
```

### SVG Path Hover (Sankey diagram)
```css
transition: opacity 0.2s;
/* Paths highlight on hover via opacity changes */
```

---

## 8. Scrollbar Styling
```css
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: var(--color-surface-base);   /* #0D0C0C */
}
::-webkit-scrollbar-thumb {
  background: rgba(179, 170, 163, 0.2);   /* #B3AAA333 */
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(179, 170, 163, 0.35);  /* #B3AAA359 */
}
```

---

## 9. Header Structure

```
[Logo (SVG icon 48x18)] [Logo wordmark (SVG)]

# SwingSmooth Pro                           [Date Range Badge]
AOV Intelligence Dashboard                  [Updated timestamp]
```

- Logo: Two SVG images (symbol + wordmark), `flex items-center gap-4 mb-3`
- Title: `text-3xl md:text-4xl font-bold text-pg-mist tracking-tight`
- Subtitle: `text-sm text-pg-stone`
- Date range: displayed on the right side at md+ breakpoints (`md:flex-row md:items-end md:justify-between`)
- Header margin-bottom: `mb-10` (40px)

---

## 10. Footer Structure

```
[Divider line: border-t border-pg-stone/10]

"Performance Golf -- SwingSmooth Pro AOV Intelligence"    [Built with badges]

"Data source: NLS AOV Benchmarks . All orders (gross) . Benchmarks: Brain Niche & Blood Sugar Niche"
```

- Footer text: `text-xs text-pg-stone/40` (stone at 40% opacity)
- Methodology note: smaller text, italic where needed
- Top border: `border-t border-pg-stone/10`

---

## 11. Page Section Order (Top to Bottom)

1. **Header** - Logo, title, subtitle, date range
2. **KPI Cards** - 5-column grid of metric cards
3. **Charts Row 1** - AOV Contribution (2/3 width) + Funnel Conversion (1/3 width)
4. **Charts Row 2** - Primary SKU Mix + AOV vs Benchmarks + Upsell Take Rates (3 equal cols)
5. **Buyer Flow Map** - Full-width Sankey diagram
6. **Funnel Step Detail** - Full-width data table
7. **Primary SKU Detail** - Full-width data table
8. **Bottom Cards** - Order Status + Paid Shipping (2 cols)
9. **Footer** - Attribution and methodology

---

## 12. Key Design Principles to Replicate

1. **Dark, premium aesthetic** - Near-black background (#0D0C0C) with warm gray tones, not cold/blue
2. **Glass morphism cards** - Subtle gradient backgrounds with backdrop-filter blur and ultra-thin borders
3. **Restrained accent color** - Orange (#FD3300) used sparingly: only the hero metric value and highlighted data points
4. **Typography hierarchy through weight and opacity** - Not size. Most text is 12-14px; hierarchy comes from color brightness and font weight
5. **Monospace for all numbers** - Every metric, percentage, and dollar value uses the mono font with tabular-nums
6. **Uppercase tracking-widest labels** - Card labels and table headers use 12px uppercase with 0.1em letter-spacing
7. **Subtle grid texture** - 40x40px grid lines at 3% opacity give depth without distraction
8. **Staggered entrance animations** - Cards fade in from below with 100ms stagger delays
9. **Minimal hover effects** - Cards get a faint orange glow on hover; table rows get a barely-visible background change
10. **Generous whitespace** - 40px between sections, 24px card padding, 16px cell padding
11. **Warm color temperature** - All grays are warm (stone/pebble/fog) not cool/blue

---

## 13. Tailwind v4 Configuration Reference

The SSP dashboard uses Tailwind CSS v4 with CSS-first configuration. All custom values are defined as CSS custom properties in the `@layer theme` block rather than a tailwind.config.js file. Key custom additions:

```css
@layer theme {
  :root {
    --font-sans: "ABC Repro", system-ui, -apple-system, sans-serif;
    --font-mono: "ABC Repro Mono", "SF Mono", monospace;
    --color-pg-orange: #FD3300;
    --color-pg-ui-gray: #7B726C;
    --color-pg-stone: #B3AAA3;
    --color-pg-pebble: #DFD9D5;
    --color-pg-fog: #F4F2F0;
    --color-pg-mist: #FCFAFA;
    --color-pg-forest: #2E4734;
    --color-pg-sky: #B2C6EB;
    --color-pg-indigo: #4F41D5;
    --color-surface-base: #0D0C0C;
    --color-surface-elevated: #1F1C1C;
    --color-surface-hover: #2A2626;
  }
}
```

These are then used as Tailwind utility classes like `text-pg-orange`, `bg-surface-base`, `border-pg-stone/10`, etc.
