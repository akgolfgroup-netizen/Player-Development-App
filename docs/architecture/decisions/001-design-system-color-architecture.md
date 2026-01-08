# ADR 001: Design System Color Architecture

## Status

Accepted

## Date

2024-12-29

## Context

The IUP Golf application requires a consistent, premium visual identity across web and mobile platforms. The previous approach used ad-hoc hex color values scattered throughout components, leading to:

1. **Inconsistent branding** - Different shades of green used across components
2. **Maintenance burden** - Updating a brand color required changes in many files
3. **Accessibility issues** - No systematic approach to contrast ratios
4. **Gold overuse** - The premium gold accent lost meaning through excessive use

The design system needed to enforce brand consistency while allowing flexibility for future themes (e.g., dark mode).

## Options Considered

### Option 1: Raw CSS Variables Only

**Description:** Define all colors as CSS custom properties and use them directly.

**Pros:**
- Simple implementation
- No build step required
- Native browser support

**Cons:**
- No semantic meaning (developers must remember what `--color-1` is)
- Easy to use wrong colors for wrong purposes
- No compile-time checking

### Option 2: Tailwind Utility Classes Only

**Description:** Use Tailwind's built-in color palette with customizations.

**Pros:**
- Familiar to developers
- Good DX with autocomplete
- Small bundle size

**Cons:**
- Tailwind colors don't map to brand identity
- Custom colors pollute the default palette
- No semantic layer (bg-green-700 vs bg-emerald-600 confusion)

### Option 3: Three-Layer Token System (Chosen)

**Description:** Implement a three-tier architecture: Primitives → Semantic Tokens → Tailwind Classes

```
Layer 1: Primitives     → Raw hex values (--ak-primary: #1B4D3E)
Layer 2: Semantic       → Intent-based (--ak-brand-primary: var(--ak-primary))
Layer 3: Tailwind       → Utility classes (bg-ak-brand-primary)
```

**Pros:**
- Semantic naming prevents misuse
- Theming support (swap primitives, keep semantics)
- Lint-able (can detect raw hex usage)
- Self-documenting code

**Cons:**
- Higher initial setup complexity
- Three files to maintain (tokens.css, tailwind.config.js, COLOR_USAGE_RULES.md)
- Learning curve for new developers

## Decision

We will use **Option 3: Three-Layer Token System**.

The implementation consists of:

1. **`tokens/tokens.css`** - Defines CSS custom properties (primitives + semantics)
2. **`tokens/tailwind.config.js`** - Maps CSS variables to Tailwind classes
3. **`COLOR_USAGE_RULES.md`** - Documents proper usage and anti-patterns

### Token Categories

| Category | Purpose | Example Token |
|----------|---------|---------------|
| `brand.*` | Primary brand identity | `--ak-brand-primary` |
| `surface.*` | Backgrounds and containers | `--ak-surface-card` |
| `text.*` | Typography colors | `--ak-text-primary` |
| `status.*` | Feedback states | `--ak-status-success` |
| `accent.*` | Reserved achievements (gold) | `--ak-accent-gold` |

### Gold Discipline

Gold (`#B8860B`) is explicitly reserved for:
- Earned badges and achievements
- Championship/tournament wins
- Exceptional performance indicators

This prevents "gold inflation" and maintains its premium meaning.

## Rationale

1. **Semantic tokens catch misuse** - A developer using `bg-ak-accent-gold` for a random button will trigger code review discussions
2. **Theming is additive** - Dark mode can be added by creating `tokens-dark.css` that redefines primitives
3. **Linting enforces consistency** - The `.colorlintignore` pattern allows automated checks for raw hex values
4. **Documentation as code** - Rules are version-controlled alongside the tokens

## Consequences

### Positive

- Consistent visual identity across all components
- Clear guidelines reduce design decision overhead
- Future dark mode support without component changes
- Gold retains premium meaning through disciplined usage
- Accessibility compliance easier to verify (semantic tokens → known contrast ratios)

### Negative

- Initial migration effort to update existing components
- Developers must learn the token naming convention
- Additional build complexity (Tailwind plugin for CSS variable references)
- Three-file coordination when adding new colors

### Neutral

- Bundle size slightly larger due to CSS custom properties
- Requires documentation maintenance when tokens change

## Implementation Notes

### Adding a New Semantic Color

1. Add primitive to `tokens/tokens.css`:
   ```css
   :root {
     --ak-new-color: #HEXVAL;
   }
   ```

2. Add semantic token:
   ```css
   :root {
     --ak-purpose-name: var(--ak-new-color);
   }
   ```

3. Add to Tailwind config:
   ```js
   // tokens/tailwind.config.js
   colors: {
     'ak-purpose-name': 'var(--ak-purpose-name)',
   }
   ```

4. Document in `COLOR_USAGE_RULES.md`

### Migrating Existing Components

```tsx
// Before (anti-pattern)
<div className="bg-[#1B4D3E] text-white">

// After (correct)
<div className="bg-ak-brand-primary text-ak-text-inverse">
```

## Related Decisions

- [ADR-000: Template](./000-template.md)

## References

- [Design Tokens W3C Community Group](https://www.w3.org/community/design-tokens/)
- [Tailwind CSS: Using CSS Variables](https://tailwindcss.com/docs/customizing-colors#using-css-variables)
- [Nathan Curtis: Tokens in Design Systems](https://medium.com/eightshapes-llc/tokens-in-design-systems-25dd82d58421)
- Internal: `packages/design-system/COLOR_USAGE_RULES.md`
- Internal: `packages/design-system/AK_GOLF_PREMIUM_LIGHT_SPEC.html`
