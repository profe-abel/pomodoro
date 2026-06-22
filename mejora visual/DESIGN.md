---
name: Vibrant Zen Dark
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#95d3ba'
  on-secondary: '#003829'
  secondary-container: '#0b513d'
  on-secondary-container: '#83c2a9'
  tertiary: '#ffb3af'
  on-tertiary: '#650911'
  tertiary-container: '#fc7c78'
  on-tertiary-container: '#711419'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#b0f0d6'
  secondary-fixed-dim: '#95d3ba'
  on-secondary-fixed: '#002117'
  on-secondary-fixed-variant: '#0b513d'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3af'
  on-tertiary-fixed: '#410005'
  on-tertiary-fixed-variant: '#842225'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
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
  unit: 4px
  container-max: 1200px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
This design system is a sophisticated, high-contrast evolution of minimalist principles tailored for deep-mode environments. It targets users who value focus, clarity, and a premium aesthetic, particularly in productivity and high-performance tools. 

The design style combines **Minimalism** with subtle **Glassmorphism**. It utilizes expansive dark surfaces to reduce eye strain, while the singular vibrant accent provides a rhythmic "pulse" to the interface. The emotional response is one of calm authority and hyper-focus, achieved through generous whitespace (even in the dark), precise typography, and a "less-is-more" approach to decorative elements.

## Colors
The palette is rooted in a "Pure Black" foundation to maximize contrast and OLED efficiency. 

- **Primary Emerald (#10b981):** Used sparingly for critical actions, active states, and focus indicators.
- **Surface Tiers:** Backgrounds are set to absolute black (#050505), with primary surfaces at a deep charcoal (#121212). This creates a natural hierarchy through value rather than color.
- **Functional Grays:** Text scales from Slate-50 for high-readability body copy down to Slate-400 for secondary metadata. 
- **Accent Glow:** Where depth is required, the primary color is used in ultra-low opacity (5-10%) as a backglow or "bloom" effect behind key interactive elements.

## Typography
The typography system uses a tri-font approach to balance modernity, utility, and technical precision.

- **Headlines (Manrope):** Chosen for its geometric but friendly structure. It maintains high legibility in dark mode by using slightly tighter letter-spacing and heavier weights to prevent "thining" against black backgrounds.
- **Body (Inter):** The workhorse for long-form content. Its neutral, systematic nature ensures that the interface remains unobtrusive.
- **Labels (JetBrains Mono):** Used for micro-copy, status indicators, and data points. The monospaced nature adds a "pro-tool" feel and aligns with the Zen-like precision of the brand.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop to preserve whitespace "voids," which are essential to the Zen aesthetic. 

- **Grid:** A 12-column grid with generous 24px gutters. Content should ideally be centered with wide margins to create a focused reading column.
- **Rhythm:** An 8px linear scale drives all padding and margins. 
- **Mobile:** On smaller screens, margins shrink to 20px, and the grid collapses to a single column. Vertical "stack" spacing is increased slightly to ensure touch targets are isolated and clear.

## Elevation & Depth
In this dark-mode system, traditional shadows are replaced by **Tonal Layers** and **Low-contrast Outlines**.

- **Surface Tiers:** Depth is communicated by lighter shades of gray. The "higher" an object is in the Z-space, the lighter its background color becomes (e.g., Background #050505 -> Card #121212 -> Popover #1E1E1E).
- **Outlines:** Instead of shadows, use 1px solid borders. For resting cards, use #262626. For active or hovered states, use the primary Emerald at 30% opacity.
- **Glassmorphism:** For overlays like navigation bars or modals, use a backdrop filter blur (20px) with a semi-transparent fill of the surface color (alpha 70%). This maintains the sense of space and context.

## Shapes
The shape language is "Rounded," striking a balance between organic softness and architectural precision.

- **Base Radius:** 8px (0.5rem) for standard components like buttons and input fields.
- **Large Radius:** 16px (1rem) for containers and cards.
- **Interactive States:** On hover, shapes do not change their radius, but the border-weight can feel more pronounced through color shifts.

## Components
- **Buttons:** Primary buttons are solid Emerald (#10b981) with black text. Secondary buttons are "Ghost" style with a Slate-700 border and Emerald text on hover.
- **Inputs:** Fields use the deep surface color (#121212) with a subtle 1px border. The focus state transitions the border to solid Emerald with a 2px outer glow of the same color at 10% opacity.
- **Chips:** Small, pill-shaped indicators using the Monospace label font. Use a dark green background (#064e3b) with Emerald text for "Active" states.
- **Cards:** Cards should have no shadow. They are defined by their #121212 surface color against the #050505 background.
- **Lists:** Clean separation using horizontal rules in #1E1E1E. High contrast for primary list text and Slate-400 for secondary descriptions.
- **Progress Bars:** Use a thin 4px track in #1E1E1E with a solid Emerald fill, creating a sharp, neon-like line against the darkness.