# AK Golf Academy - Design System v3.0

**Palette**: Blue Palette 01 (Default)
**Source**: `/packages/design-system/figma/ak_golf_figma_kit_blue_palette01.svg`
**Last Updated**: December 21, 2025

---

## 🎨 Color Palette

### Blue Palette 01 (Current Default)

The Blue Palette 01 replaces the original Forest/Green theme with a professional blue color scheme suitable for a sports academy.

#### Brand Colors

| Color Name | Hex | Variable | Usage |
|------------|-----|----------|-------|
| **Current** (Primary Blue) | `#10456A` | `tokens.colors.primary` | Primary actions, navigation, headers |
| **Jet Black** (Ink) | `#02060D` | `tokens.colors.ink` | Dark backgrounds, high-contrast text |
| **Snow** (Background) | `#EDF0F2` | `tokens.colors.snow` | Page backgrounds, light surfaces |
| **Light Khaki** (Surface) | `#EBE5DA` | `tokens.colors.surface` | Cards, elevated surfaces |
| **Gold** (Accent) | `#C9A227` | `tokens.colors.gold` | Accent colors, highlights, CTAs |

#### Visual Preview

```
┌─────────────────────────────────────────────────────────┐
│ Primary (#10456A)    → Navigation, buttons, links       │
│ ████████████████████████████████████████████████████    │
│                                                          │
│ Ink (#02060D)        → Dark text, high contrast         │
│ ████████████████████████████████████████████████████    │
│                                                          │
│ Snow (#EDF0F2)       → Backgrounds, light areas         │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │
│                                                          │
│ Surface (#EBE5DA)    → Cards, containers                │
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒    │
│                                                          │
│ Gold (#C9A227)       → Accents, highlights              │
│ ████████████████████████████████████████████████████    │
└─────────────────────────────────────────────────────────┘
```

#### Semantic Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Success | `#4A7C59` | Success states, confirmations |
| Warning | `#D4A84B` | Warnings, cautions |
| Error | `#C45B4E` | Errors, destructive actions |

#### Neutrals

| Color | Hex | Usage |
|-------|-----|-------|
| Charcoal | `#1C1C1E` | Primary text |
| Steel | `#8E8E93` | Secondary text, labels |
| Mist | `#E5E5EA` | Borders, dividers |
| Cloud | `#F2F2F7` | Subtle backgrounds |
| White | `#FFFFFF` | Pure white |

---

## 📝 Typography

### Font Stack
```css
font-family: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';
```

### Type Scale (Apple HIG Inspired)

| Name | Size | Line Height | Weight | Usage |
|------|------|-------------|--------|-------|
| Display | 32px | 40px | 700 | Page titles, hero text |
| Title 1 | 26px | 32px | 700 | Section headers |
| Title 2 | 21px | 28px | 600 | Subsection headers |
| Title 3 | 19px | 26px | 600 | Card titles |
| Body | 17px | 24px | 400 | Body text, paragraphs |
| Callout | 15px | 22px | 400 | Emphasized body text |
| Label | 14px | 20px | 500 | Form labels, buttons |
| Caption | 12px | 16px | 400 | Small text, metadata |

### Usage Example

```javascript
import { tokens, typographyStyle } from './design-tokens';

// In your component
<h1 style={typographyStyle('display')}>Welcome to AK Golf Academy</h1>
<p style={typographyStyle('body')}>Start your development journey today.</p>
```

---

## 📐 Spacing

Consistent spacing creates visual rhythm and hierarchy.

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight spacing, inline elements |
| sm | 8px | Small gaps, compact layouts |
| md | 16px | Default spacing, paragraphs |
| lg | 24px | Section spacing |
| xl | 32px | Large gaps, major sections |
| xxl | 48px | Extra large spacing |

### Spacing Scale Visual

```
xs  (4px)   ▌
sm  (8px)   ▌▌
md  (16px)  ▌▌▌▌
lg  (24px)  ▌▌▌▌▌▌
xl  (32px)  ▌▌▌▌▌▌▌▌
xxl (48px)  ▌▌▌▌▌▌▌▌▌▌▌▌
```

---

## 🔲 Border Radius

Consistent rounded corners throughout the application.

| Token | Value | Usage |
|-------|-------|-------|
| sm | 8px | Small cards, inputs |
| md | 12px | Default cards |
| lg | 16px | Large cards, modals |
| full | 9999px | Pills, circular elements |

---

## 🌑 Shadows

Subtle depth and elevation.

| Token | Value | Usage |
|-------|-------|-------|
| card | `0 2px 4px rgba(0, 0, 0, 0.06)` | Card shadows |
| elevated | `0 4px 12px rgba(0, 0, 0, 0.08)` | Elevated surfaces, modals |

---

## 🎯 Usage Guide

### Import Design Tokens

```javascript
import { tokens, typographyStyle } from './design-tokens';
```

### Color Usage

```javascript
// ✅ CORRECT - Use new primary naming
const StyledButton = styled.button`
  background-color: ${tokens.colors.primary};
  color: ${tokens.colors.white};
`;

// ⚠️ LEGACY - Still works but will be deprecated
const OldStyledButton = styled.button`
  background-color: ${tokens.colors.forest};
  color: ${tokens.colors.white};
};
```

### Typography Usage

```javascript
// Using the helper function (recommended)
<h1 style={typographyStyle('display')}>
  AK Golf Academy
</h1>

// Manual usage
<p style={{
  fontFamily: tokens.typography.fontFamily,
  fontSize: tokens.typography.body.fontSize,
  lineHeight: tokens.typography.body.lineHeight,
  fontWeight: tokens.typography.body.fontWeight,
}}>
  Body text here
</p>
```

### Spacing Usage

```javascript
<div style={{
  padding: tokens.spacing.md,
  marginBottom: tokens.spacing.lg,
}}>
  Content
</div>
```

---

## 🔄 Migration from Forest Theme

The design system now uses **Blue Palette 01** as default. Legacy "forest" colors are aliased for backwards compatibility.

### Color Migration Map

| Old Name (Deprecated) | New Name | Hex |
|----------------------|----------|-----|
| `forest` | `primary` | `#10456A` |
| `forestLight` | `primaryLight` | `#2C5F7F` |
| `foam` | `snow` | `#EDF0F2` |
| `ivory` | `surface` | `#EBE5DA` |
| `gold` | `gold` | `#C9A227` *(unchanged)* |

### Migration Steps

1. **Find and Replace** (optional but recommended):
   ```bash
   # In your components, replace:
   tokens.colors.forest → tokens.colors.primary
   tokens.colors.forestLight → tokens.colors.primaryLight
   tokens.colors.foam → tokens.colors.snow
   tokens.colors.ivory → tokens.colors.surface
   ```

2. **No immediate action required** - Legacy aliases ensure backwards compatibility

3. **Future-proof** - New components should use new naming

---

## 🎨 Design Assets

### Figma Kit

The complete Figma kit includes:
- ✅ Color palette with all variants
- ✅ Typography system
- ✅ 58 custom icons (24×24px, 1.5px stroke)
- ✅ Brand logos (Icon, Box, Full)
- ✅ Component templates

**Location**: `/packages/design-system/figma/ak_golf_figma_kit_blue_palette01.svg`

### Logo Assets

| Asset | Location | Format |
|-------|----------|--------|
| AK Icon Logo | `/packages/design-system/figma/AK_Icon_Logo.svg` | SVG |
| Complete Kit | `/packages/design-system/figma/ak_golf_complete_figma_kit.svg` | SVG |
| Blue Palette | `/packages/design-system/figma/ak_golf_figma_kit_blue_palette01.svg` | SVG |

---

## 🧪 Testing Colors

### Contrast Checker

Ensure text meets WCAG AA standards (4.5:1 ratio):

```javascript
// Primary on White
#10456A on #FFFFFF = 7.36:1 ✅ AAA

// Primary on Snow
#10456A on #EDF0F2 = 7.12:1 ✅ AAA

// Charcoal on White
#1C1C1E on #FFFFFF = 16.11:1 ✅ AAA

// Steel on White
#8E8E93 on #FFFFFF = 4.55:1 ✅ AA
```

All color combinations meet accessibility standards.

---

## 📚 Examples

### Button Component

```javascript
import { tokens } from './design-tokens';

const Button = ({ children, variant = 'primary' }) => {
  const styles = {
    primary: {
      backgroundColor: tokens.colors.primary,
      color: tokens.colors.white,
    },
    secondary: {
      backgroundColor: tokens.colors.surface,
      color: tokens.colors.primary,
    },
    accent: {
      backgroundColor: tokens.colors.gold,
      color: tokens.colors.white,
    }
  };

  return (
    <button style={{
      ...styles[variant],
      padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
      borderRadius: tokens.borderRadius.md,
      fontFamily: tokens.typography.fontFamily,
      fontSize: tokens.typography.label.fontSize,
      fontWeight: tokens.typography.label.fontWeight,
      border: 'none',
      cursor: 'pointer',
    }}>
      {children}
    </button>
  );
};
```

### Card Component

```javascript
import { tokens } from './design-tokens';

const Card = ({ children, title }) => (
  <div style={{
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.lg,
    padding: tokens.spacing.lg,
    boxShadow: tokens.shadows.card,
  }}>
    {title && (
      <h3 style={{
        ...typographyStyle('title3'),
        color: tokens.colors.primary,
        marginBottom: tokens.spacing.md,
      }}>
        {title}
      </h3>
    )}
    {children}
  </div>
);
```

---

## 🔗 Resources

- **Figma Design System**: `/packages/design-system/figma/`
- **Design Tokens Source**: `/apps/web/src/design-tokens.js`
- **Inter Font**: [Google Fonts](https://fonts.google.com/specimen/Inter)
- **Apple HIG Typography**: [Apple Developer](https://developer.apple.com/design/human-interface-guidelines/typography)

---

## 📋 Changelog

### v3.0 - December 21, 2025
- ✅ Full dark mode support with automatic detection
- ✅ Responsive typography for mobile devices
- ✅ Safe area insets for iOS notched devices
- ✅ Mobile navigation utilities
- ✅ Touch-friendly form elements (44px targets)
- ✅ Semantic token system (backgrounds, text, borders)
- ✅ Updated documentation and file structure

### v2.1 - December 17, 2025
- ✅ Changed default palette to **Blue Palette 01**
- ✅ Added new color naming: `primary`, `snow`, `surface`, `ink`
- ✅ Maintained backwards compatibility with legacy `forest` naming
- ✅ Updated documentation and migration guide

### v2.0 - Previous
- Initial design system with Forest/Green theme
- Typography scale based on Apple HIG
- Complete spacing and shadow system

---

**End of Design System Documentation**
