---
name: Executive Logistics Logic
colors:
  surface: '#f9f9f7'
  surface-dim: '#dadad8'
  surface-bright: '#f9f9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f2'
  surface-container: '#eeeeec'
  surface-container-high: '#e8e8e6'
  surface-container-highest: '#e2e3e1'
  on-surface: '#1a1c1b'
  on-surface-variant: '#404943'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
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
  background: '#f9f9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e2e3e1'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  kpi-value:
    fontFamily: IBM Plex Sans
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: IBM Plex Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
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
  gutter: 24px
  sidebar-width: 280px
---

## Brand & Style

The design system is engineered for high-stakes logistics environments, where clarity and speed of decision-making are paramount. It adopts a **Premium Enterprise SaaS** aesthetic that bridges the gap between traditional ERP reliability and modern digital sophistication. 

The visual narrative is built on a foundation of **Modern Minimalism** with a focus on high information density that does not compromise on elegance. The interface avoids "tech-hype" trends like heavy gradients or glassmorphism in favor of a grounded, authoritative presence. It evokes an emotional response of organized control, precision, and executive-level oversight, utilizing "Quiet Luxury" design principles: generous white space within components, precise typography, and a sophisticated, earth-toned palette.

## Colors

The color strategy uses a "Natural Professional" palette. The **Emerald Green** primary color establishes a sense of growth and stability, while the **Warm Bronze** accent is reserved for specific call-outs and high-level interactive elements, adding a layer of premium distinction.

The background uses a **Warm Off White** to reduce eye strain during long operational shifts, departing from the clinical coldness of pure white #FFFFFF (which is reserved exclusively for card surfaces and interactive containers). The **Deep Charcoal** is utilized for the primary navigation (sidebar), providing a strong structural anchor to the application. Semantic colors are slightly muted to remain cohesive with the sophisticated brand tone, avoiding neon or overly saturated "gamified" alerts.

## Typography

This design system employs a tri-font strategy to delineate function through form. 

1. **Sora** is used for headings and brand moments, providing a modern, geometric character that feels premium and structured.
2. **Inter** handles the bulk of the UI's functional text, chosen for its exceptional legibility at small sizes and its neutral, systematic feel.
3. **IBM Plex Sans** is specifically deployed for numerical data, KPI values, and table content. Its technical, slightly industrial structure ensures that numbers are distinct and easy to scan, critical for logistics monitoring.

For mobile, large displays scale down to ensure no horizontal overflow, while body sizes remain constant to preserve accessibility.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. The primary navigation sidebar is fixed at 280px, while the main content area utilizes a 12-column fluid grid with a maximum cap of 1440px to prevent excessive line lengths on ultra-wide monitors.

Information density is managed through a strict 4px baseline grid. While data tables and lists use compact spacing (`sm` to `md`), the macro-layout uses generous margins (`xl` to `3xl`) to separate high-level functional groups. This "density where it matters" approach allows for massive amounts of data to be visible without the UI feeling cluttered.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Ambient Shadows** rather than stark borders. The primary canvas (Off White) serves as the "floor," while operational cards (White) sit at a subtle +1 elevation.

Shadows are exceptionally soft, using a multi-layered approach with a hint of the primary Emerald Green color in the shadow's tint to maintain warmth. 
- **Level 1 (Static Cards):** 0px 4px 20px rgba(45, 106, 79, 0.04).
- **Level 2 (Hover/Modals):** 0px 12px 32px rgba(45, 106, 79, 0.08).

Low-contrast outlines (#E5E7EB) are used to define the edges of white cards against the off-white background, ensuring structural clarity even on uncalibrated displays.

## Shapes

The design system utilizes a **Rounded** shape language to soften the density of enterprise data. 

- **Primary Cards & Containers:** Use `rounded-lg` (16px) to create a soft, modern frame for complex data.
- **Buttons & Inputs:** Use `rounded-md` (8px) for a more precise, professional interactive feel.
- **Badges & Chips:** Use `pill` styling (full radius) to distinguish them from functional inputs.

The contrast between the soft outer containers (16px) and the sharper internal elements (8px) creates a nested hierarchy that feels intentional and architectural.

## Components

### Buttons & Inputs
Buttons utilize a solid weight for primary actions (Emerald Green) and a subtle ghost or outlined style for secondary actions. Input fields use a 1px border (#E5E7EB) that transitions to Primary Green on focus, with a subtle 4px glow.

### Metric Cards (KPIs)
The hero of the dashboard. These feature a large **IBM Plex Sans** value, a small **Sora** label, and a trend indicator (Success Green or Danger Red). They sit on a pure white surface with a 16px radius.

### Tables & Data Grids
Designed for high density. Row heights are tight (40px or 48px), using `data-mono` IBM Plex Sans for all cell values. Alternating row stripes are avoided; instead, a 1px bottom border is used for horizontal separation to maintain a clean aesthetic.

### Sidebar & Navigation
The sidebar uses **Deep Charcoal** with an "active state" marked by a 4px Emerald Green vertical bar on the left and a subtle white opacity change for the text.

### Status Badges
Small, pill-shaped markers with low-opacity background fills (e.g., 10% opacity of the semantic color) and high-contrast text for maximum readability without visual noise.

### Feedback Elements
Loading skeletons should mirror the 16px card radius and 8px component radius to maintain the layout's "ghost" structure during data fetching.