# TIER Golf Typography

## Font Families

### Primary Font Stack
```css
font-family: 'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont,
             'Segoe UI', Roboto, sans-serif;
```

### Monospace Font Stack
```css
font-family: 'SF Mono', 'JetBrains Mono', 'Fira Code',
             'Consolas', monospace;
```

## Type Scale

| Name | Size | Line Height | Weight | Usage |
|------|------|-------------|--------|-------|
| Display XL | 48px | 1.1 | 700 | Hero headings |
| Display | 36px | 1.2 | 700 | Page titles |
| H1 | 30px | 1.25 | 600 | Section headers |
| H2 | 24px | 1.3 | 600 | Card titles |
| H3 | 20px | 1.35 | 600 | Subsections |
| H4 | 18px | 1.4 | 500 | Widget titles |
| Body Large | 18px | 1.6 | 400 | Lead paragraphs |
| Body | 16px | 1.5 | 400 | Default text |
| Body Small | 14px | 1.5 | 400 | Secondary text |
| Caption | 12px | 1.4 | 400 | Labels, hints |
| Overline | 11px | 1.3 | 600 | Category labels |

## Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text, descriptions |
| Medium | 500 | Emphasis, labels |
| Semibold | 600 | Headings, buttons |
| Bold | 700 | Display text, strong emphasis |

## CSS Variables

```css
:root {
  /* Font sizes */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  --font-size-5xl: 3rem;      /* 48px */

  /* Line heights */
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
}
```

## Text Styles

### Headings
```css
.heading-display {
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.heading-page {
  font-size: 1.875rem;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.01em;
}
```

### Body Text
```css
.body-default {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
}

.body-small {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--ak-text-secondary);
}
```

### Labels
```css
.label {
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
}

.overline {
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
```

## Norwegian Text Considerations

- Support for Norwegian characters: Æ, Ø, Å (æ, ø, å)
- Use `lang="no"` on HTML elements
- Hyphenation: `hyphens: auto;` for long Norwegian words

```html
<html lang="no">
  <body>
    <p>Treningsøkt med fokus på putting</p>
  </body>
</html>
```
