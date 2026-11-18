---
name: Serambi Al Ikhlash
colors:
  surface: '#F3F8F5'
  surface-dim: '#c8e0d1'
  surface-bright: '#e8fff0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e1f9ea'
  surface-container: '#dcf4e4'
  surface-container-high: '#d6eede'
  surface-container-highest: '#d0e8d9'
  on-surface: '#0b1f16'
  on-surface-variant: '#404941'
  inverse-surface: '#20352a'
  inverse-on-surface: '#dff7e7'
  outline: '#707a71'
  outline-variant: '#bfc9bf'
  surface-tint: '#206b43'
  primary: '#004325'
  on-primary: '#ffffff'
  primary-container: '#0b5d36'
  on-primary-container: '#8ad4a2'
  inverse-primary: '#8cd7a5'
  secondary: '#7b5800'
  on-secondary: '#ffffff'
  secondary-container: '#fdbf35'
  on-secondary-container: '#6e4f00'
  tertiary: '#66242a'
  on-tertiary: '#ffffff'
  tertiary-container: '#833a40'
  on-tertiary-container: '#ffafb2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a8f3c0'
  primary-fixed-dim: '#8cd7a5'
  on-primary-fixed: '#00210f'
  on-primary-fixed-variant: '#00522e'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#fabc33'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4200'
  tertiary-fixed: '#ffdada'
  tertiary-fixed-dim: '#ffb3b6'
  on-tertiary-fixed: '#3d050e'
  on-tertiary-fixed-variant: '#763036'
  background: '#e8fff0'
  on-background: '#0b1f16'
  surface-variant: '#d0e8d9'
  surface-card: '#FFFFFF'
  border-divider: '#DDE8E1'
  text-primary: '#1A2E24'
  text-muted: '#526B5E'
  income-green: '#138A4E'
  expense-red: '#D9383A'
  gold-light: '#FEF8E7'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system embodies the warmth, clarity, and communal spirit of a modern neighborhood mosque portal. Grounded in the civic identity of Muhammadiyah, the aesthetic combines the cheerful accessibility of everyday Indonesian mobile lifestyle apps (such as Gojek and Kitabisa) with the organized simplicity of Google Calendar.

Key principles guiding this experience:
- **Warm & Welcoming (Ukhuwah):** The UI feels approachable and trustworthy for all generations—from senior congregation elders checking prayer times to youths coordinating weekend study circles.
- **Radical Transparency (Amanah):** Mosque finance ledgers and donation progress are showcased with crisp, legible tables, transparent metrics, and affirmative visual feedback.
- **Mobile-First Utility:** Built specifically for one-handed operation on low-to-mid tier smartphones, featuring prominent tap targets, generous hit zones, and low cognitive overhead.

The design movement is **Modern Tactile Minimalism**—clean white and tinted sage-mint containers defined by friendly 16px radii, soft green ambient drop shadows, and lively golden-amber callouts.

## Colors

The color palette centers on **Muhammadiyah Green (`#0B5D36`)**, evoking growth, tradition, and calm spirituality. 

- **Primary (`#0B5D36`):** Anchors headers, primary interactive buttons, verified badges, active navigation indicators, and prominent branding elements.
- **Secondary / Accent (`#F5B82E`):** A warm, energetic amber-yellow used sparingly for high-priority donation CTAs, prayer time countdown chips, and highlight badges.
- **Neutral / Text Primary (`#1A2E24`):** A deep evergreen charcoal offering contrast that is gentler than pure black while meeting WCAG AAA legibility over white surfaces.
- **Surface (`#F3F8F5`):** A light mint-tinted neutral background that softens harsh screen glare under outdoor sunlight.
- **Card Background (`#FFFFFF`):** Crisp pure white applied to cards and sheets to lift content cleanly off the surface.
- **Income (`#138A4E`) & Expense (`#D9383A`):** Semantic colors reserved for financial statements and cash balance records.

## Typography

The design system exclusively employs **Plus Jakarta Sans**, chosen for its friendly geometric curves, high x-height, and legibility on mobile viewports.

Key hierarchy guidelines:
- **Display & Large Headlines:** Used for mosque naming, prayer schedule highlight times (e.g., Maghrib 18:04), and major financial balances (Saldo Kas).
- **Headlines & Titles:** Set in semi-bold and bold weights to anchor section breaks, activity dates, and agenda headlines.
- **Body Text:** Balanced line heights ensure effortless readability of sermon descriptions, mosque announcements, and transaction narratives.
- **Labels & Numbers:** Tabular figures are used for nominal monetary amounts (`Rp ...`) to ensure numerical alignment in cash balance lists.

## Layout & Spacing

The layout is built around a mobile-first philosophy that seamlessly widens into responsive centered containers on tablets and desktop management dashboards.

- **Mobile Viewports (<640px):** Single-column stacked cards with a consistent `1rem` (16px) outer edge margin. Navigation is anchored via a persistent bottom bar containing the five core sections: Beranda, Kas, Donasi, Kegiatan, and Pengurus.
- **Tablet & Desktop Viewports (≥640px to 1024px+):** Constrained to a max width of `720px` for congregation portal views (preserving focused readability) or expands to a 12-column grid (`gutter: 1.5rem`, `margin: 2rem`) for the takmir administration dashboard.
- **Rhythm:** Spacing follows an 8pt base grid (`space-sm: 8px`, `space-md: 16px`, `space-lg: 24px`, `space-xl: 32px`). Touch elements feature a minimum touch target height of 48px to accommodate congregation members of all ages.

## Elevation & Depth

Visual hierarchy relies on soft, green-tinted ambient shadows and crisp surface separation rather than heavy borders or generic grey drop-shadows.

- **Level 0 (Flat / Canvas):** Applied to the main background canvas `#F3F8F5`. May include a subtle, 4% opacity repeating Muhammadiyah emblem watermarked into hero containers.
- **Level 1 (Card & Content Blocks):** White background `#FFFFFF` with a 1px border of `#DDE8E1` and an ambient tinted shadow:
  `box-shadow: 0px 4px 16px -2px rgba(11, 93, 54, 0.06), 0px 1px 3px rgba(11, 93, 54, 0.04);`
- **Level 2 (Floating Action & Highlight Cards):** Active prayer card, ongoing donation goal, or bottom navigation bar:
  `box-shadow: 0px 8px 24px -4px rgba(11, 93, 54, 0.12), 0px 2px 6px rgba(11, 93, 54, 0.06);`
- **Level 3 (Modals & Bottom Sheets):** Takmir entry dialogs and donation transfer QR sheets:
  `box-shadow: 0px 16px 36px -6px rgba(26, 46, 36, 0.20);`

## Shapes

The shape system blends structured organization with welcoming softness:

- **Cards & Modal Containers:** Use a uniform `16px` (`rounded-lg` / `1rem`) corner radius, creating friendly, approachable tiles that feel native to modern mobile platforms.
- **Buttons & Form Fields:** Set to a crisp `12px` (`0.75rem`) border radius, balancing touch-target clickability with neat alignment.
- **Pills & Chips:** Fully rounded (`9999px`) for status tags (e.g., `Terverifikasi`, `Pemasukan`, `Menunggu`), prayer category filters, and calendar date markers.
- **Avatars & Masjid Logo Badges:** Rounded squares (`12px`) or full circles (`50%`) with clean borders.

## Components

### Buttons
- **Primary Button:** Background `#0B5D36`, text `#FFFFFF`, radius `12px`, height `48px`. Hover/active state deepens to `#084528`.
- **Accent / Donation Button:** Background `#F5B82E`, text `#1A2E24` (bold), radius `12px`, with slight warm elevation for high-priority engagement.
- **Secondary / Outlined Button:** Transparent background, 1.5px border `#0B5D36`, text `#0B5D36`, radius `12px`.
- **Admin Download Button:** Tinted green button with an icon prefix (Excel/PDF), strictly visible to Takmir.

### Cards
- **Overview Stat Cards:** Applied to total cash inflow, outflow, and balance. White background, `16px` radius, subtle green shadow, with small top-right pill indicators.
- **Kegiatan / Agenda Card:** Left-side date box (mint background `#E2EFE7`, green date number) paired with agenda title, speaker badge, and time on the right.
- **Pengurus Card:** Horizontal or vertical layout with a circular or soft-square profile photo, name in `headline-sm`, and role tag in primary green.

### Chips & Badges
- **Status Badges:**
  - `Pemasukan`: Soft mint background (`#E6F5EC`) with dark green text (`#138A4E`).
  - `Pengeluaran`: Soft red background (`#FDEBEB`) with deep red text (`#D9383A`).
  - `Menunggu`: Warm amber background (`#FEF8E7`) with dark golden text (`#9C6C08`).
  - `Terverifikasi`: Primary tint (`#E2EFE7`) with primary text (`#0B5D36`).

### Input Fields & Controls
- **Inputs:** `48px` height, `12px` radius, background `#FFFFFF`, border `1.5px solid #DDE8E1`. Active focus state triggers a `#0B5D36` border with a 3px soft green glow (`rgba(11, 93, 54, 0.12)`).
- **Search & Filters:** Search bar with an inset search glass icon, accompanied by a horizontal scrolling carousel of pill chips for transaction categories.

### Tables (Financial Report)
- Striped or separated card rows on mobile, transforming into clean tabular format on desktop. 
- Row borders colored `#DDE8E1`. Positive figures marked with a small `+` in green, and negative figures marked with `-` in red.