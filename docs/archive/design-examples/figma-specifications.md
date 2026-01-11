# Figma Design Specifications - ProSwing Golf App

## Project Setup

### Canvas Settings
```
Grid: 8px base grid
Layout Grid (Mobile): 4 columns, 16px margin, 16px gutter
Layout Grid (Tablet): 8 columns, 24px margin, 24px gutter
Layout Grid (Desktop): 12 columns, 64px margin, 24px gutter
```

### Frame Sizes
```
Mobile:          375 x 812px (iPhone 14)
Mobile Large:    428 x 926px (iPhone 14 Pro Max)
Tablet:          834 x 1194px (iPad Pro 11")
Desktop:         1440 x 900px
Desktop Large:   1920 x 1080px
```

---

## Color Styles

### Primary Colors
| Style Name | Hex | RGB | Usage |
|------------|-----|-----|-------|
| `primary/700` | #1B4332 | 27, 67, 50 | Primary buttons, active states |
| `primary/600` | #2D6A4F | 45, 106, 79 | Hover states, links |
| `primary/500` | #40916C | 64, 145, 108 | Secondary accents |
| `primary/400` | #4ADE80 | 74, 222, 128 | Success, positive trends |
| `primary/100` | #DCFCE7 | 220, 252, 231 | Light backgrounds (light mode) |

### Gold/Premium Colors
| Style Name | Hex | RGB | Usage |
|------------|-----|-----|-------|
| `gold/400` | #D4AF37 | 212, 175, 55 | Premium badges, stars |
| `gold/300` | #E8D5A3 | 232, 213, 163 | Gold gradient end |
| `gold/500` | #C9A227 | 201, 162, 39 | Gold hover |

### Surface Colors (Dark Mode)
| Style Name | Hex | RGB | Usage |
|------------|-----|-----|-------|
| `surface/black` | #0A0A0A | 10, 10, 10 | App background |
| `surface/dark` | #141414 | 20, 20, 20 | Secondary background |
| `surface/card` | #1E1E1E | 30, 30, 30 | Card backgrounds |
| `surface/elevated` | #2A2A2A | 42, 42, 42 | Elevated surfaces |
| `surface/border` | #3A3A3A | 58, 58, 58 | Borders, dividers |

### Text Colors
| Style Name | Hex | Opacity | Usage |
|------------|-----|---------|-------|
| `text/primary` | #FFFFFF | 100% | Headlines, important text |
| `text/secondary` | #B3B3B3 | 70% | Body text, descriptions |
| `text/muted` | #737373 | 45% | Placeholders, captions |

### Semantic Colors
| Style Name | Hex | Usage |
|------------|-----|-------|
| `semantic/success` | #4ADE80 | Success states, positive |
| `semantic/warning` | #FBBF24 | Warnings |
| `semantic/error` | #EF4444 | Errors, negative trends |
| `semantic/info` | #3B82F6 | Information |

---

## Text Styles

### Display
| Style Name | Font | Size | Weight | Line Height | Letter Spacing |
|------------|------|------|--------|-------------|----------------|
| `display/large` | SF Pro Display | 48px | Bold (700) | 56px (117%) | -0.5px |
| `display/medium` | SF Pro Display | 36px | Bold (700) | 44px (122%) | -0.25px |

### Headlines
| Style Name | Font | Size | Weight | Line Height | Letter Spacing |
|------------|------|------|--------|-------------|----------------|
| `headline/h1` | SF Pro Display | 28px | Semibold (600) | 36px (129%) | 0px |
| `headline/h2` | SF Pro Display | 22px | Semibold (600) | 28px (127%) | 0px |
| `headline/h3` | SF Pro Display | 18px | Semibold (600) | 24px (133%) | 0.1px |

### Body
| Style Name | Font | Size | Weight | Line Height | Letter Spacing |
|------------|------|------|--------|-------------|----------------|
| `body/large` | SF Pro Text | 16px | Regular (400) | 24px (150%) | 0.5px |
| `body/medium` | SF Pro Text | 14px | Regular (400) | 20px (143%) | 0.25px |
| `body/small` | SF Pro Text | 12px | Regular (400) | 16px (133%) | 0.4px |

### Labels & Captions
| Style Name | Font | Size | Weight | Line Height | Letter Spacing |
|------------|------|------|--------|-------------|----------------|
| `label/large` | SF Pro Text | 14px | Medium (500) | 20px | 0.1px |
| `label/medium` | SF Pro Text | 12px | Medium (500) | 16px | 0.5px |
| `caption` | SF Pro Text | 11px | Regular (400) | 14px | 0.4px |

### Numbers/Stats
| Style Name | Font | Size | Weight | Line Height |
|------------|------|------|--------|-------------|
| `stat/large` | JetBrains Mono | 36px | Bold (700) | 44px |
| `stat/medium` | JetBrains Mono | 24px | Semibold (600) | 32px |
| `stat/small` | JetBrains Mono | 16px | Medium (500) | 24px |

---

## Effect Styles

### Shadows
| Style Name | Type | X | Y | Blur | Spread | Color |
|------------|------|---|---|------|--------|-------|
| `shadow/card` | Drop Shadow | 0 | 4px | 24px | 0 | #000000 40% |
| `shadow/elevated` | Drop Shadow | 0 | 8px | 32px | 0 | #000000 50% |
| `shadow/button` | Drop Shadow | 0 | 2px | 8px | 0 | #000000 30% |
| `shadow/gold-glow` | Drop Shadow | 0 | 0 | 20px | 0 | #D4AF37 30% |
| `shadow/green-glow` | Drop Shadow | 0 | 0 | 20px | 0 | #2D6A4F 30% |

### Blur Effects
| Style Name | Type | Blur Amount |
|------------|------|-------------|
| `blur/glass` | Background Blur | 10px |
| `blur/overlay` | Background Blur | 20px |

---

## Component Specifications

### Buttons

#### Primary Button
```
Auto Layout:
  - Padding: 12px vertical, 24px horizontal
  - Gap: 8px (for icon + text)

Properties:
  - Fill: primary/700
  - Corner Radius: 8px
  - Text Style: label/large
  - Text Color: #FFFFFF

States:
  - Default: primary/700
  - Hover: primary/600
  - Pressed: primary/800 (scale 0.98)
  - Disabled: primary/700 at 50% opacity

Variants:
  - Size: Small (py:8, px:16), Medium (py:12, px:24), Large (py:16, px:32)
  - Icon: None, Left, Right
```

#### Secondary Button
```
Properties:
  - Fill: Transparent
  - Stroke: 1px, primary/700
  - Corner Radius: 8px
  - Text Color: primary/600

States:
  - Hover: Fill primary/700 at 10% opacity
```

#### Gold/Premium Button
```
Properties:
  - Fill: Linear Gradient 135°
    - Stop 1: #D4AF37 (0%)
    - Stop 2: #E8D5A3 (100%)
  - Corner Radius: 8px
  - Text Color: #1A1A1A
  - Effect: shadow/gold-glow

States:
  - Hover: shadow/gold-glow at 50% opacity, translateY -1px
```

#### Icon Button
```
Properties:
  - Size: 40 x 40px (touch target)
  - Fill: Transparent
  - Corner Radius: 8px
  - Icon Size: 24px
  - Icon Color: text/secondary

States:
  - Hover: Fill surface/elevated
  - Active: Fill surface/border
```

---

### Cards

#### Base Card
```
Auto Layout:
  - Padding: 20px all sides
  - Direction: Vertical
  - Gap: 12px

Properties:
  - Fill: surface/card
  - Stroke: 1px, surface/border
  - Corner Radius: 12px
  - Effect: shadow/card

States:
  - Hover (if interactive): Stroke primary/600
```

#### Stat Card
```
Layout:
  - Width: 160px (fixed) or Hug
  - Padding: 20px
  - Alignment: Center

Content:
  - Icon (optional): 24px, text/muted
  - Value: stat/large, text/primary
  - Label: label/medium, text/secondary
  - Trend: body/small, semantic/success or semantic/error
```

#### Video Thumbnail Card
```
Layout:
  - Width: Fill or 280px min
  - Aspect Ratio: 16:9 for thumbnail

Structure:
  ├── Thumbnail Container (16:9)
  │   ├── Image (fill)
  │   ├── Gradient Overlay (linear, transparent to #000 60%)
  │   ├── Play Button (centered)
  │   │   └── 56 x 56px, #FFFFFF 20%, blur 10px
  │   ├── Duration Badge (bottom-right)
  │   │   └── #000000 70%, padding 4px 8px, radius 4px
  │   └── Progress Bar (bottom, optional)
  │       └── Height 4px, primary/600
  └── Content (padding 16px)
      ├── Title: headline/h3
      ├── Subtitle: body/medium, text/secondary
      └── Meta: Stars + Views, body/small, text/muted
```

---

### Navigation

#### Bottom Navigation (Mobile)
```
Frame:
  - Width: 100% (375px reference)
  - Height: 80px (includes safe area)
  - Position: Fixed bottom

Properties:
  - Fill: surface/dark
  - Stroke: 1px top, surface/border

Items (5 max):
  - Layout: Horizontal, Space Between
  - Item Width: Equal distribution
  - Item Structure:
    ├── Icon: 24px
    ├── Label: caption
    └── Active Dot: 4px circle (optional)

States:
  - Default: text/muted
  - Active: primary/500, show dot indicator
```

#### Sidebar Navigation (Web)
```
Frame:
  - Width: 240px (fixed)
  - Height: 100vh

Structure:
  ├── Logo Area (padding 24px)
  │   └── Logo + Brand Name
  ├── Navigation (padding 16px)
  │   └── Nav Items (vertical, gap 8px)
  └── Footer (padding 16px)
      └── Settings, Sign Out

Nav Item:
  - Padding: 12px 16px
  - Corner Radius: 8px
  - Icon: 20px
  - Gap: 12px

States:
  - Default: text/secondary
  - Hover: Fill surface/elevated, text/primary
  - Active: Fill primary/700 at 20%, text primary/400
```

#### Tab Bar
```
Layout:
  - Horizontal scroll if needed
  - Gap: 24px between items
  - Padding: 0 16px

Tab Item:
  - Padding: 12px 0
  - Text: label/large

States:
  - Default: text/secondary
  - Active: text/primary + underline
    - Underline: 2px, primary/600, width matches text
```

---

### Form Elements

#### Text Input
```
Frame:
  - Height: 48px
  - Width: Fill

Properties:
  - Fill: surface/dark
  - Stroke: 1px, surface/border
  - Corner Radius: 8px
  - Padding: 12px 16px

Content:
  - Placeholder: body/large, text/muted
  - Value: body/large, text/primary
  - Icon (optional): 20px, left side, text/muted

States:
  - Default: Stroke surface/border
  - Focus: Stroke primary/600, outer glow 3px primary/600 at 20%
  - Error: Stroke semantic/error
  - Disabled: 50% opacity
```

#### Dropdown/Select
```
Trigger:
  - Same as Text Input
  - Right icon: Chevron Down, 20px

Dropdown Menu:
  - Fill: surface/elevated
  - Stroke: 1px, surface/border
  - Corner Radius: 8px
  - Shadow: shadow/elevated
  - Max Height: 300px (scrollable)

Menu Item:
  - Padding: 12px 16px
  - Text: body/large

States:
  - Default: transparent
  - Hover: Fill surface/card
  - Selected: Checkmark icon right, primary/400
```

#### Toggle Switch
```
Track:
  - Width: 48px
  - Height: 24px
  - Corner Radius: 12px (full)

Thumb:
  - Size: 20px
  - Corner Radius: 10px (full)
  - Color: #FFFFFF
  - Shadow: 0 2px 4px #000 30%

States:
  - Off: Track surface/border, Thumb left
  - On: Track primary/600, Thumb right

Animation: 200ms ease
```

#### Checkbox
```
Box:
  - Size: 20 x 20px
  - Corner Radius: 4px
  - Stroke: 1.5px

States:
  - Unchecked: Stroke surface/border, Fill transparent
  - Checked: Fill primary/600, Checkmark #FFFFFF
  - Indeterminate: Fill primary/600, Dash #FFFFFF
```

---

### Data Visualization

#### Progress Bar
```
Track:
  - Height: 8px (default), 4px (small), 12px (large)
  - Corner Radius: 4px (half of height)
  - Fill: surface/border

Fill:
  - Corner Radius: Match track
  - Fill: Linear Gradient 90°
    - Stop 1: primary/700
    - Stop 2: primary/500

Animation: Width transition 500ms ease-out
```

#### Strokes Gained Bar
```
Container:
  - Height: 24px
  - Layout: Horizontal

Structure:
  ├── Label: 96px width, body/medium, text/secondary
  ├── Bar Container: Flex 1
  │   ├── Track: Full width, surface/border
  │   ├── Center Line: 1px, 50% from left
  │   └── Value Bar: Absolute position
  └── Value: 48px width, body/medium, right aligned

Value Bar:
  - Positive: semantic/success, starts at 50%, grows right
  - Negative: semantic/error, ends at 50%, grows left
```

#### Handicap Chart
```
Frame:
  - Aspect Ratio: 16:9 or custom
  - Padding: 20px

Elements:
  - Y-Axis Labels: caption, text/muted
  - X-Axis Labels: caption, text/muted
  - Grid Lines: 1px, surface/border at 50%
  - Line: 2px, primary/600
  - Data Points: 8px circle, primary/600, fill surface/card
  - Current Value: Label with value, primary/400
```

---

### Badges & Tags

#### Premium Badge
```
Properties:
  - Padding: 4px 8px
  - Corner Radius: 4px
  - Fill: Linear Gradient (gold)
  - Text: label/medium, #1A1A1A
```

#### Status Badge
```
Properties:
  - Padding: 4px 12px
  - Corner Radius: 16px (pill)
  - Fill: primary/600 at 20%
  - Stroke: 1px, primary/600 at 40%
  - Text: label/medium, primary/400
```

#### Notification Badge
```
Properties:
  - Size: 18px (min-width)
  - Corner Radius: 9px (full)
  - Fill: semantic/error
  - Text: caption, #FFFFFF
  - Position: Top-right of parent, offset -6px
```

---

### Modals & Overlays

#### Modal Dialog
```
Overlay:
  - Fill: #000000 at 70%
  - Blur: 4px (optional)

Dialog:
  - Width: 400px (mobile: 90% max)
  - Corner Radius: 16px
  - Fill: surface/card
  - Shadow: shadow/elevated
  - Padding: 24px

Structure:
  ├── Header
  │   ├── Title: headline/h2
  │   └── Close Button: Icon button, top-right
  ├── Content
  │   └── body/large, text/secondary
  └── Actions
      └── Horizontal, gap 12px, right aligned
```

#### Bottom Sheet (Mobile)
```
Properties:
  - Width: 100%
  - Corner Radius: 16px 16px 0 0
  - Fill: surface/card
  - Shadow: 0 -4px 24px #000 40%

Handle:
  - Width: 40px
  - Height: 4px
  - Corner Radius: 2px
  - Fill: surface/border
  - Position: Center top, margin 12px

Animation: Slide up 300ms ease-out
```

#### Toast Notification
```
Properties:
  - Width: Auto (max 400px)
  - Padding: 16px
  - Corner Radius: 8px
  - Fill: surface/elevated
  - Stroke: 1px, surface/border
  - Border Left: 4px, semantic color
  - Shadow: shadow/elevated

Position: Top center or bottom center, 16px margin
Animation: Slide down + fade in, 300ms
Auto-dismiss: 4000ms
```

---

### Video Player

#### Custom Controls Bar
```
Frame:
  - Height: 48px
  - Fill: surface/black at 90%
  - Backdrop Blur: 10px

Layout:
  - Padding: 0 16px
  - Gap: 16px

Elements:
  ├── Play/Pause: 24px icon
  ├── Progress Bar
  │   ├── Track: surface/border
  │   ├── Buffered: surface/elevated
  │   ├── Progress: primary/600
  │   └── Thumb: 12px circle, #FFFFFF (on hover/drag)
  ├── Time: stat/small, text/secondary
  └── Controls: Volume, Speed, Fullscreen
```

#### Analysis Toolbar
```
Frame:
  - Height: 56px
  - Fill: surface/dark
  - Stroke: 1px top, surface/border

Tools:
  - Icon Buttons: 40px
  - Active: primary/600 background at 20%, icon primary/400
  - Dividers: 1px vertical, surface/border
```

---

### Empty States

```
Layout:
  - Padding: 48px vertical
  - Alignment: Center
  - Max Width: 320px

Structure:
  ├── Icon: 48px, text/muted
  ├── Title: headline/h3, text/primary (margin-top 16px)
  ├── Description: body/medium, text/secondary (margin-top 8px)
  └── Action: Primary Button (margin-top 24px)
```

---

### Loading States

#### Skeleton
```
Properties:
  - Fill: surface/elevated
  - Corner Radius: Match content shape

Animation:
  - Shimmer gradient moving left to right
  - Duration: 1500ms
  - Timing: Linear, infinite

Gradient:
  - 0%: surface/elevated
  - 50%: surface/card
  - 100%: surface/elevated
```

#### Spinner
```
Properties:
  - Sizes: 24px (small), 40px (medium), 64px (large)
  - Stroke: 3px
  - Color: primary/600

Animation:
  - Rotate 360°
  - Duration: 1000ms
  - Timing: Linear, infinite
```

---

## Component Variants Matrix

### Button Variants
```
Size:        Small | Medium | Large
Style:       Primary | Secondary | Gold | Ghost
State:       Default | Hover | Pressed | Disabled | Loading
Icon:        None | Left | Right | Only
```

### Input Variants
```
Size:        Small | Medium | Large
State:       Default | Focus | Error | Disabled
Icon:        None | Left | Right
Helper:      None | Helper Text | Error Text
```

### Card Variants
```
Type:        Base | Stat | Video | Coach | Lesson
Elevation:   Default | Elevated
Interactive: Yes | No
```

---

## Figma Organization

### Page Structure
```
📁 ProSwing Golf App
├── 📄 Cover
├── 📄 Design System
│   ├── Colors
│   ├── Typography
│   ├── Effects
│   └── Icons
├── 📄 Components
│   ├── Buttons
│   ├── Cards
│   ├── Navigation
│   ├── Forms
│   ├── Data Display
│   ├── Feedback
│   └── Overlays
├── 📄 Mobile Screens
│   ├── Onboarding
│   ├── Home
│   ├── Swing Analysis
│   ├── Statistics
│   ├── Lessons
│   ├── Chat
│   └── Profile
├── 📄 Web Screens
│   ├── Coach Dashboard
│   ├── Video Analysis
│   ├── Player Portal
│   └── Booking
├── 📄 Prototypes
│   ├── Mobile Flow
│   └── Web Flow
└── 📄 Handoff
    ├── Specs
    └── Assets
```

### Naming Convention
```
Components: [Category]/[Name]/[Variant]
Examples:
  - Button/Primary/Default
  - Card/Stat/With Trend
  - Input/Text/Focus

Screens: [Platform]/[Section]/[Screen Name]
Examples:
  - Mobile/Home/Dashboard
  - Web/Coach/Video Analysis
```

### Auto Layout Best Practices
```
1. Use 8px increments for all spacing
2. Set min-width on flexible items
3. Use "Hug contents" for buttons
4. Use "Fill container" for inputs
5. Constrain icons to fixed size
6. Add padding to parent, not children
```
