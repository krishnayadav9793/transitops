---
name: TransitOps Design System
colors:
  surface: '#f8faf6'
  surface-dim: '#d8dbd7'
  surface-bright: '#f8faf6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f0'
  surface-container: '#eceeea'
  surface-container-high: '#e7e9e5'
  surface-container-highest: '#e1e3df'
  on-surface: '#191c1a'
  on-surface-variant: '#404943'
  inverse-surface: '#2e312f'
  inverse-on-surface: '#eff1ed'
  outline: '#707973'
  outline-variant: '#bfc9c1'
  surface-tint: '#2c694e'
  primary: '#0f5238'
  on-primary: '#ffffff'
  primary-container: '#2d6a4f'
  on-primary-container: '#a8e7c5'
  inverse-primary: '#95d4b3'
  secondary: '#86530d'
  on-secondary: '#ffffff'
  secondary-container: '#fdb96c'
  on-secondary-container: '#774700'
  tertiary: '#47474a'
  on-tertiary: '#ffffff'
  tertiary-container: '#5f5e62'
  on-tertiary-container: '#dbd8dc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b1f0ce'
  primary-fixed-dim: '#95d4b3'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#0e5138'
  secondary-fixed: '#ffddbb'
  secondary-fixed-dim: '#fdb96c'
  on-secondary-fixed: '#2b1700'
  on-secondary-fixed-variant: '#673d00'
  tertiary-fixed: '#e4e1e6'
  tertiary-fixed-dim: '#c8c5ca'
  on-tertiary-fixed: '#1b1b1e'
  on-tertiary-fixed-variant: '#47464a'
  background: '#f8faf6'
  on-background: '#191c1a'
  surface-variant: '#e1e3df'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  headline-sm:
    fontFamily: Sora
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  kpi-lg:
    fontFamily: IBM Plex Sans
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.01em
  kpi-md:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  container-max: 1440px
  sidebar-width: 260px
---

## Brand & Style
The design system is engineered for executive-level transit operations management, prioritizing high information density without sacrificing aesthetic clarity. The brand personality is authoritative, precise, and sophisticated—moving away from stereotypical "tech blue" in favor of a grounded, organic palette that reflects physical infrastructure and environmental stewardship.

The design style is **Modern Enterprise Minimalism**, blending the structural rigor of a high-end ERP with the refined polish of contemporary SaaS leaders like Stripe or Linear. The aesthetic leverages generous whitespace within containerized "modules," using subtle depth and a neutral foundation to allow operational data and status indicators to remain the primary focus. 

Key attributes:
- **Sophisticated Utility:** Functional density meets premium editorial layouts.
- **Organic Professionalism:** A professional atmosphere established through earth-toned primaries and warm neutrals.
- **Executive Clarity:** High-contrast typography and clear visual hierarchies for rapid decision-making.

## Colors
The palette is rooted in a warm, sophisticated professional spectrum. 

- **Primary (Emerald Green):** Used for primary actions, brand presence, and positive growth metrics. It reflects sustainability and operational "Go" states.
- **Accent (Warm Bronze):** Used sparingly for secondary highlights, active selection states, and premium interface details to provide a warm counterpoint to the green.
- **Sidebar (Deep Charcoal):** A high-contrast anchor for navigation, providing a clear frame for the lighter content area.
- **Background & Surface:** The UI uses a "layered white" approach. A warm off-white foundation (`#F7F7F5`) serves as the canvas, while pure white (`#FFFFFF`) is reserved for high-elevation cards and input fields to create a crisp, readable hierarchy.
- **Status Tones:** Muted but clear. Danger is a sophisticated burgundy-red rather than a bright neon, maintaining the professional "Modern ERP" tone.

## Typography
This design system employs a tri-font strategy to optimize for different cognitive tasks:

1.  **Sora (Headings):** Used for structural wayfinding and page titles. Its geometric nature adds a modern, tech-forward feel.
2.  **Inter (Body):** The workhorse for all UI labels, descriptions, and long-form text. Selected for its exceptional legibility and neutral tone.
3.  **IBM Plex Sans (Data/Numbers):** Specifically utilized for KPIs, data tables, and metrics. Its technical, structured curves ensure that numbers remain distinct and readable even at high density.

**Hierarchy Rules:**
- Use `label-caps` for table headers and section overlines.
- Use `kpi-lg` for primary dashboard metrics.
- Maintain a minimum of 14px for all standard body text to ensure accessibility in data-heavy views.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. The primary navigation sidebar is fixed at 260px, while the main content area utilizes a fluid grid that caps at 1440px to prevent excessive line lengths on ultra-wide monitors.

**Grid Philosophy:**
- **Desktop:** 12-column grid with 24px gutters.
- **Margins:** 32px page margins for internal dashboard views.
- **Density:** In data tables and lists, vertical padding is reduced to 8px (`sm`) to allow for maximum information visibility without scrolling.
- **Breakpoints:** 
    - Mobile: < 768px (Sidebar collapses to a hamburger menu; 4-column grid).
    - Tablet: 768px - 1024px (Sidebar collapses to icons-only rail; 8-column grid).
    - Desktop: > 1024px (Full sidebar; 12-column grid).

## Elevation & Depth
Depth is created through **Tonal Layering** and **Soft Ambient Shadows**. The system avoids harsh borders, opting for subtle contrast between surfaces.

- **Level 0 (Background):** `#F7F7F5`. The base "ground" of the application.
- **Level 1 (Cards/Modules):** Pure white `#FFFFFF` with a very soft, diffused shadow (`0px 4px 20px rgba(0, 0, 0, 0.03)`). These house the primary content and data visualizations.
- **Level 2 (Dropdowns/Modals):** Pure white with a more defined shadow (`0px 10px 32px rgba(0, 0, 0, 0.08)`) and a 1px border in a light grey-taupe to ensure separation from Level 1 cards.
- **Interactions:** Hover states on cards should subtly increase the shadow spread and lift the element by 1-2px, providing a tactile, responsive feel.

## Shapes
The shape language is "Substantial & Soft." Standard components use a **12px - 16px corner radius** (Level 2/Rounded) to soften the industrial nature of transport data and create a modern, approachable SaaS aesthetic.

- **Standard Cards:** 16px radius.
- **Buttons/Inputs:** 8px radius.
- **Small Components (Chips/Badges):** 4px or fully pill-shaped depending on context.
- **Selection States:** Use a 4px vertical bar on the left side of sidebar items or list items to indicate active state, combined with the 12px rounded corner on the background highlight.

## Components
- **Buttons:** Primary buttons are Solid Emerald (`#2D6A4F`) with white text. Secondary buttons use a subtle "Ghost" style: a 1px border in a light neutral with a hover state that fills with a very light tint of the primary color.
- **Data Cards:** Large white containers with 16px padding. Titles are set in `headline-sm` (Sora).
- **KPI Modules:** Feature a large `kpi-lg` value in IBM Plex Sans, accompanied by a small trend indicator (e.g., +12% in Emerald Green).
- **Inputs:** Fields use a 1px border in `#E5E5E1` (Warm Grey) which transitions to the Emerald Green on focus. Labels are `body-sm` (Inter) in a medium-grey color.
- **Data Tables:** High-density, no vertical borders. Horizontal dividers are 1px in a very light grey. The header row uses the `label-caps` typography style with a subtle grey background tint.
- **Status Badges:** Low-saturation backgrounds with high-saturation text. For example, a "Success" badge uses a light mint background with dark Emerald Green text.
- **Sidebar Nav:** Deep Charcoal background with light-grey text. Active items use a White text color and a subtle Warm Bronze left-accent bar.