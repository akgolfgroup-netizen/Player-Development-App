# ProSwing Golf App - CRA + Capacitor Setup

Ferdig UI-komponenter for Create React App + Capacitor.

## Filstruktur

```
cra-setup/
└── src/
    ├── styles/
    │   ├── theme.ts        # Design tokens (farger, spacing, etc.)
    │   └── globals.css     # Global CSS + CSS variabler
    │
    └── components/ui/
        ├── index.ts        # Eksport av alle komponenter
        ├── Button.tsx      # Button med variants
        ├── Card.tsx        # Card + StatCard
        ├── Input.tsx       # Input + SearchInput
        ├── BottomNav.tsx   # Mobil navigasjon
        └── ProgressBar.tsx # ProgressBar + StrokesGainedBar
```

## Installasjon

1. **Kopier filene til ditt prosjekt:**

```bash
# Fra prosjektmappen din
cp -r ~/Library/Mobile\ Documents/com~apple~CloudDocs/00.\ Inbox/golf-app-design-examples/cra-setup/src/* ./src/
```

2. **Installer styled-components:**

```bash
npm install styled-components
npm install -D @types/styled-components
```

3. **Importer globals.css i index.tsx:**

```tsx
// src/index.tsx
import './styles/globals.css';
```

## Bruk

```tsx
import { Button, Card, StatCard, Input, BottomNav, ProgressBar } from './components/ui';

function App() {
  return (
    <div>
      <Button variant="primary">Start Practice</Button>
      <Button variant="gold">Upgrade to Premium</Button>

      <StatCard
        value="12.4"
        label="Handicap"
        trend={{ value: "0.3", positive: true }}
      />

      <Input
        label="Email"
        placeholder="you@example.com"
      />

      <ProgressBar
        value={75}
        label="Weekly Progress"
      />
    </div>
  );
}
```

## Capacitor-spesifikke ting

`globals.css` inkluderer allerede:

- Safe area padding for iOS notch
- Touch-optimaliserte størrelser (44px minimum)
- Dark mode som standard

## Neste steg

Komponenter du kan legge til:
- `VideoPlayer.tsx` - For swing-analyse
- `Avatar.tsx` - Profilbilder
- `Modal.tsx` - Dialoger
- `Toast.tsx` - Varsler
- `Sidebar.tsx` - For web dashboard
