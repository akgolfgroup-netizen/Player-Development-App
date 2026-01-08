# TIER Golf App Icon

## App Icon Specifications

The app icon uses the AK monogram on a brand primary background.

### Sizes Required

| Platform | Size | Format | Filename |
|----------|------|--------|----------|
| Favicon | 32x32 | ICO | `favicon.ico` |
| Favicon | 32x32 | SVG | `favicon.svg` |
| PWA Small | 192x192 | WebP | `logo192.webp` |
| PWA Large | 512x512 | WebP | `logo512.webp` |
| iOS Home | 180x180 | PNG | `apple-touch-icon.png` |
| Android | 192x192 | WebP | `logo192.webp` |

### Icon Construction

```
┌─────────────────────────────────┐
│  ████████████████████████████   │
│  ██                        ██   │
│  ██    ┌────────────┐     ██   │
│  ██    │            │     ██   │
│  ██    │    AK      │     ██   │
│  ██    │   Logo     │     ██   │
│  ██    │            │     ██   │
│  ██    └────────────┘     ██   │
│  ██                        ██   │
│  ████████████████████████████   │
└─────────────────────────────────┘
     ↑                    ↑
   12.5% padding on all sides
```

### Icon Colors

| Element | Color | Hex |
|---------|-------|-----|
| Background | Brand Primary | `#1A3D2E` |
| Logo | White/Surface | `#FAFAF9` |

### Corner Radius

| Platform | Radius |
|----------|--------|
| iOS | System (automatic) |
| Android | 20% of icon size |
| Web Favicon | 0 (square) |
| PWA | 0 (square, masked by OS) |

## Favicon SVG

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#1A3D2E" rx="4"/>
  <g fill="#FAFAF9" transform="translate(4, 4) scale(0.12)">
    <!-- AK Logo path -->
  </g>
</svg>
```

## Manifest Configuration

```json
{
  "icons": [
    {
      "src": "/logo192.webp",
      "sizes": "192x192",
      "type": "image/webp",
      "purpose": "any maskable"
    },
    {
      "src": "/logo512.webp",
      "sizes": "512x512",
      "type": "image/webp",
      "purpose": "any maskable"
    }
  ]
}
```

## Adaptive Icons (Android)

For Android adaptive icons:
- **Foreground:** AK logo (centered, 66% of safe zone)
- **Background:** Solid `#1A3D2E`
- Safe zone: 66% of total icon area (centered)
