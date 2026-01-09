# Button Color Guidelines
## TIER Golf Design System v3.1

Dette dokumentet beskriver button-fargehierarkiet for TIER Golf Academy appen.

---

## Fargehierarki Oversikt

| Prioritet | Variant | Farge | Bruksområde |
|-----------|---------|-------|-------------|
| 1 | `default` | Gull | Primære handlinger (CTA) |
| 2 | `destructive` | Rød | Destruktive handlinger |
| 3 | `outline` | Navy outline | Sekundære handlinger |
| 4 | `secondary` | Grå | Tertiære handlinger |
| 5 | `success` | Grønn | Bekreftelser |
| 6 | `info` | Blå | Informasjon |
| 7 | `warning` | Oransje | Advarsler |
| 8 | `ghost` | Transparent | Subtile handlinger |
| 9 | `link` | Navy tekst | Lenker |

---

## 1. Primære Handlinger (Gull)

**Variant:** `default`

**Farge:** `bg-tier-gold` (#C9A227)

**Bruk for:**
- Call-to-action (CTA) knapper
- Lagre/Send data
- Logg trening
- Opprett ny
- Registrer

```tsx
// Standard bruk
<Button>Lagre</Button>
<Button variant="default">Send inn</Button>

// Med ActionButton
<ActionButton.Save onClick={handleSave} />
<ActionButton.Send onClick={handleSend} />
<ActionButton.Create onClick={handleCreate} />
```

**Regel:** Maks 1-2 gull-knapper per visning. Gull skal tiltrekke oppmerksomhet.

---

## 2. Destruktive Handlinger (Rød)

**Variant:** `destructive`

**Farge:** `bg-status-error` (#DC2626)

**Bruk for:**
- Slette data permanent
- Fjerne elementer
- Avbryte farlige operasjoner

```tsx
<Button variant="destructive">Slett</Button>

// Med ActionButton
<ActionButton.Delete onClick={handleDelete} />
<ActionButton.Remove onClick={handleRemove} />
```

**Regel:** Alltid med bekreftelsesdialog før destruktiv handling utføres.

---

## 3. Sekundære Handlinger (Navy Outline)

**Variant:** `outline`

**Farge:** `border-tier-navy` med hover `bg-tier-navy`

**Bruk for:**
- Avbryt/Lukk
- Tilbake-navigering
- Sekundær handling ved siden av primær

```tsx
<Button variant="outline">Avbryt</Button>
<Button variant="outline">Tilbake</Button>

// Med ActionButton
<ActionButton.Cancel onClick={handleCancel} />
<ActionButton.Back onClick={handleBack} />
<ActionButton.Next onClick={handleNext} />
<ActionButton.Edit onClick={handleEdit} />
```

**Regel:** Plasser alltid til venstre for primær handling i knappgrupper.

---

## 4. Tertiære Handlinger (Grå)

**Variant:** `secondary`

**Farge:** `bg-tier-surface-secondary` med subtil border

**Bruk for:**
- Mindre viktige handlinger
- Last ned/Last opp
- Del/Kopier
- Innstillinger

```tsx
<Button variant="secondary">Last ned</Button>

// Med ActionButton
<ActionButton.Download onClick={handleDownload} />
<ActionButton.Upload onClick={handleUpload} />
<ActionButton.Copy onClick={handleCopy} />
<ActionButton.Share onClick={handleShare} />
<ActionButton.Settings onClick={handleSettings} />
```

---

## 5. Bekreftelse (Grønn)

**Variant:** `success`

**Farge:** `bg-status-success` (#16A34A)

**Bruk for:**
- Bekreft handling
- Godkjenn
- Marker som fullført

```tsx
<Button variant="success">Bekreft</Button>

// Med ActionButton
<ActionButton.Confirm onClick={handleConfirm} />
<ActionButton.Approve onClick={handleApprove} />
```

**Regel:** Bruk kun når handling har positiv konsekvens.

---

## 6. Informasjon (Blå)

**Variant:** `info`

**Farge:** `bg-status-info` (#2563EB)

**Bruk for:**
- Les mer
- Se detaljer
- Informasjonshandlinger

```tsx
<Button variant="info">Les mer</Button>
```

---

## 7. Ghost & Link

**Variant:** `ghost` eller `link`

**Bruk for:**
- Ikon-knapper
- Subtile handlinger i toolbars
- Tekst-lenker

```tsx
// Ghost for ikoner
<Button variant="ghost" size="icon">
  <Settings size={18} />
</Button>

// Link for tekst-lenker
<Button variant="link">Se alle</Button>

// Icon-only med ActionButton
<ActionButton.CloseIcon aria-label="Lukk" onClick={handleClose} />
<ActionButton.EditIcon aria-label="Rediger" onClick={handleEdit} />
<ActionButton.DeleteIcon aria-label="Slett" onClick={handleDelete} />
```

---

## Størrelser

| Size | Høyde | Bruk |
|------|-------|------|
| `sm` | 32px | Kompakte UI, tabeller |
| `default` | 40px | Standard bruk |
| `lg` | 48px | Fremhevede handlinger |
| `xl` | 56px | Landing pages, CTAs |
| `icon` | 40x40px | Kun ikon |
| `icon-sm` | 32x32px | Liten ikon |
| `icon-lg` | 48x48px | Stor ikon |

---

## Knappgruppe Layout

### Primær + Sekundær (vanligst)
```tsx
<div className="flex gap-3">
  <ActionButton.Cancel onClick={handleCancel} />
  <ActionButton.Save onClick={handleSave} />
</div>
```

### Med destruktiv handling
```tsx
<div className="flex gap-3 justify-between">
  <ActionButton.Delete onClick={handleDelete} />
  <div className="flex gap-3">
    <ActionButton.Cancel onClick={handleCancel} />
    <ActionButton.Save onClick={handleSave} />
  </div>
</div>
```

---

## Import

```tsx
// Individuelle komponenter
import {
  SaveButton,
  CancelButton,
  DeleteButton
} from '@/components/ui/ActionButton';

// Namespace import (anbefalt)
import { ActionButton } from '@/components/ui/ActionButton';

// Bruk
<ActionButton.Save />
<ActionButton.Cancel />
<ActionButton.Delete />

// Base Button med variant
import { Button } from '@/components/shadcn/button';

<Button variant="default">Primær</Button>
<Button variant="outline">Sekundær</Button>
<Button variant="destructive">Slett</Button>
```

---

## Loading State

```tsx
<ActionButton.Save
  loading={isLoading}
  loadingText="Lagrer..."
  onClick={handleSave}
/>
```

---

## Tilgjengelighet

- Alle ikon-knapper MÅ ha `aria-label`
- Bruk semantiske ActionButton komponenter for konsistent opplevelse
- Loading state deaktiverer knappen automatisk

```tsx
// Riktig
<ActionButton.DeleteIcon aria-label="Slett element" onClick={handleDelete} />

// Feil
<ActionButton.DeleteIcon onClick={handleDelete} /> // Mangler aria-label
```

---

## Fargetoken Referanse

| Token | Hex | RGB |
|-------|-----|-----|
| `--tier-gold` | #C9A227 | 201, 162, 39 |
| `--tier-gold-dark` | #A8871F | 168, 135, 31 |
| `--tier-navy` | #0A2540 | 10, 37, 64 |
| `--status-error` | #DC2626 | 220, 38, 38 |
| `--status-success` | #16A34A | 22, 163, 74 |
| `--status-info` | #2563EB | 37, 99, 235 |
| `--status-warning` | #D97706 | 217, 119, 6 |
