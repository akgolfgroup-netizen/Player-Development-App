# UX Implementeringsplan - TIER Golf
**Opprettet:** 2026-01-08
**Status:** Klar for implementering

---

## Oversikt

Denne planen implementerer 5 UX-forbedringer for å gjøre appen enklere for spillere og coacher:

| # | Forbedring | Fase | Estimert kompleksitet |
|---|------------|------|----------------------|
| 1 | Flat navigasjon med kontekst-tabs | Fase 1 | Høy |
| 2 | Quick Actions på dashboards | Fase 1 | Medium |
| 3 | Konsistent fargekoding | Fase 2 | Medium |
| 4 | Stegvise skjemaer | Fase 3 | Høy |
| 5 | Personlig Hjem-side | Fase 3 | Høy |

---

## Fase 1: Navigasjon og Quick Actions

### 1.1 Flat navigasjon med horisontale tabs

**Mål:** Redusere klikk fra 2 til 1 for å nå undersider.

#### Oppgaver

| # | Oppgave | Fil | Beskrivelse |
|---|---------|-----|-------------|
| 1.1.1 | Fjern nested sections fra sidebar | `apps/web/src/config/player-navigation-v3.ts` | Fjern `sections` array fra hvert NavArea-objekt |
| 1.1.2 | Oppdater sidebar til kun 5 items | `apps/web/src/components/layout/PlayerSidebarV2.tsx` | Fjern submenu-rendering, kun top-level links |
| 1.1.3 | Lag AreaTabs komponent | `apps/web/src/components/navigation/AreaTabs.tsx` | Ny komponent for horisontale tabs |
| 1.1.4 | Oppdater TreningHub med tabs | `apps/web/src/features/hub-pages/TreningHub.tsx` | Legg til AreaTabs øverst |
| 1.1.5 | Oppdater UtviklingHub med tabs | `apps/web/src/features/hub-pages/UtviklingHub.tsx` | Legg til AreaTabs øverst |
| 1.1.6 | Oppdater PlanHub med tabs | `apps/web/src/features/hub-pages/PlanHub.tsx` | Legg til AreaTabs øverst |
| 1.1.7 | Oppdater MerHub med tabs | `apps/web/src/features/hub-pages/MerHub.tsx` | Legg til AreaTabs øverst |

#### Ny komponent: AreaTabs.tsx

```tsx
// apps/web/src/components/navigation/AreaTabs.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from 'lib/utils';

interface TabItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

interface AreaTabsProps {
  tabs: TabItem[];
  color?: 'green' | 'blue' | 'amber' | 'purple' | 'default';
}

const colorClasses = {
  green: 'border-status-success text-status-success',
  blue: 'border-status-info text-status-info',
  amber: 'border-status-warning text-status-warning',
  purple: 'border-category-j text-category-j',
  default: 'border-tier-navy text-tier-navy',
};

export function AreaTabs({ tabs, color = 'default' }: AreaTabsProps) {
  const location = useLocation();

  return (
    <nav className="flex gap-1 border-b border-tier-border-subtle mb-6 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.href ||
                         location.pathname.startsWith(tab.href + '/');
        return (
          <Link
            key={tab.href}
            to={tab.href}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap',
              'border-b-2 -mb-[1px] transition-colors',
              isActive
                ? colorClasses[color]
                : 'border-transparent text-tier-text-secondary hover:text-tier-text-primary'
            )}
          >
            {tab.icon}
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
```

#### Endring i player-navigation-v3.ts

```ts
// Ny forenklet struktur - kun 5 hovedområder uten nested sections
export const playerNavigationV3Flat: NavArea[] = [
  {
    id: 'dashboard',
    label: 'Hjem',
    icon: 'Home',
    color: 'default',
    href: '/dashboard',
  },
  {
    id: 'trening',
    label: 'Trening',
    icon: 'Dumbbell',
    color: 'green',
    href: '/trening',
  },
  {
    id: 'utvikling',
    label: 'Utvikling',
    icon: 'TrendingUp',
    color: 'blue',
    href: '/utvikling',
  },
  {
    id: 'plan',
    label: 'Plan',
    icon: 'Calendar',
    color: 'amber',
    href: '/plan',
  },
  {
    id: 'mer',
    label: 'Mer',
    icon: 'MoreHorizontal',
    color: 'purple',
    href: '/mer',
    badge: 'unreadMessages',
  },
];

// Tabs for hvert område
export const areaTabs = {
  trening: [
    { href: '/trening', label: 'Oversikt' },
    { href: '/trening/logg', label: 'Logg økt' },
    { href: '/trening/dagbok', label: 'Historikk' },
    { href: '/trening/ovelser', label: 'Øvelser' },
    { href: '/trening/testing', label: 'Testing' },
  ],
  utvikling: [
    { href: '/utvikling', label: 'Oversikt' },
    { href: '/utvikling/statistikk', label: 'Statistikk' },
    { href: '/utvikling/testresultater', label: 'Testresultater' },
    { href: '/utvikling/badges', label: 'Merker' },
  ],
  plan: [
    { href: '/plan', label: 'Oversikt' },
    { href: '/plan/kalender', label: 'Kalender' },
    { href: '/plan/maal', label: 'Mål' },
    { href: '/plan/turneringer', label: 'Turneringer' },
  ],
  mer: [
    { href: '/mer', label: 'Oversikt' },
    { href: '/mer/profil', label: 'Profil' },
    { href: '/mer/meldinger', label: 'Meldinger' },
    { href: '/mer/innstillinger', label: 'Innstillinger' },
  ],
};
```

---

### 1.2 Quick Actions på dashboards

**Mål:** Vanlige handlinger tilgjengelig umiddelbart fra dashboard.

#### Oppgaver

| # | Oppgave | Fil | Beskrivelse |
|---|---------|-----|-------------|
| 1.2.1 | Lag QuickActions komponent | `apps/web/src/components/dashboard/QuickActions.tsx` | Gjenbrukbar komponent |
| 1.2.2 | Definer player quick actions | `apps/web/src/config/quick-actions.ts` | Konfigurasjon for spiller |
| 1.2.3 | Definer coach quick actions | `apps/web/src/config/quick-actions.ts` | Konfigurasjon for coach |
| 1.2.4 | Oppdater DashboardHub | `apps/web/src/features/hub-pages/DashboardHub.tsx` | Bruk QuickActions |
| 1.2.5 | Oppdater CoachDashboard | `apps/web/src/features/coach/CoachDashboard.tsx` | Bruk QuickActions |

#### Ny komponent: QuickActions.tsx

```tsx
// apps/web/src/components/dashboard/QuickActions.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from 'lib/utils';
import { LucideIcon } from 'lucide-react';

interface QuickAction {
  label: string;
  href: string;
  icon: LucideIcon;
  variant?: 'primary' | 'secondary';
}

interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
}

export function QuickActions({ actions, title = 'Hurtighandlinger' }: QuickActionsProps) {
  return (
    <section className="mb-6">
      <h2 className="text-sm font-medium text-tier-text-secondary mb-3">
        {title}
      </h2>
      <div className="flex flex-wrap gap-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            to={action.href}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
              action.variant === 'primary'
                ? 'bg-tier-gold text-tier-white hover:bg-tier-gold-dark shadow-sm'
                : 'bg-tier-surface-secondary text-tier-text-primary hover:bg-tier-surface-tertiary border border-tier-border-subtle'
            )}
          >
            <action.icon size={18} />
            {action.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
```

#### Konfigurasjon: quick-actions.ts

```ts
// apps/web/src/config/quick-actions.ts
import { Plus, Target, Calendar, MessageSquare, Users, BarChart3, ClipboardList } from 'lucide-react';

export const playerQuickActions = [
  { label: 'Logg trening', href: '/trening/logg', icon: Plus, variant: 'primary' as const },
  { label: 'Registrer test', href: '/trening/testing/registrer', icon: Target, variant: 'secondary' as const },
  { label: 'Se plan', href: '/plan/ukeplan', icon: Calendar, variant: 'secondary' as const },
];

export const coachQuickActions = [
  { label: 'Ny økt', href: '/coach/sessions/create', icon: Plus, variant: 'primary' as const },
  { label: 'Se spillere', href: '/coach/athletes', icon: Users, variant: 'secondary' as const },
  { label: 'Ukesrapport', href: '/coach/reports/weekly', icon: BarChart3, variant: 'secondary' as const },
  { label: 'Meldinger', href: '/coach/messages', icon: MessageSquare, variant: 'secondary' as const },
];
```

---

## Fase 2: Fargekoding og Button-standardisering

### 2.1 Konsistent fargekoding for handlingstyper

**Mål:** Alle knapper følger samme fargehierarki.

#### Oppgaver

| # | Oppgave | Fil | Beskrivelse |
|---|---------|-----|-------------|
| 2.1.1 | Oppdater button variants | `apps/web/src/components/shadcn/button.tsx` | Legg til gold variant |
| 2.1.2 | Lag ActionButton wrapper | `apps/web/src/components/ui/ActionButton.tsx` | Semantisk wrapper |
| 2.1.3 | Søk og erstatt primærknapper | Diverse filer | Bytt til gold variant |
| 2.1.4 | Dokumenter fargehierarki | `docs/design/BUTTON_GUIDELINES.md` | Retningslinjer |

#### Oppdatert button.tsx

```tsx
// apps/web/src/components/shadcn/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primær handling - Gull (CTA, lagre, send)
        default: "bg-tier-gold text-tier-white shadow hover:bg-tier-gold-dark focus-visible:ring-tier-gold",

        // Destruktiv - Rød (slett, fjern)
        destructive: "bg-status-error text-tier-white shadow-sm hover:bg-status-error/90 focus-visible:ring-status-error",

        // Sekundær - Navy outline (avbryt, tilbake)
        outline: "border-2 border-tier-navy bg-transparent text-tier-navy hover:bg-tier-navy hover:text-tier-white",

        // Tertiær - Grå bakgrunn
        secondary: "bg-tier-surface-secondary text-tier-text-primary shadow-sm hover:bg-tier-surface-tertiary",

        // Ghost - Transparent
        ghost: "hover:bg-tier-surface-secondary hover:text-tier-text-primary",

        // Link
        link: "text-tier-navy underline-offset-4 hover:underline",

        // Suksess - Grønn (bekreftelse)
        success: "bg-status-success text-tier-white shadow-sm hover:bg-status-success/90",

        // Info - Blå (lenker, les mer)
        info: "bg-status-info text-tier-white shadow-sm hover:bg-status-info/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-6 text-base",
        xl: "h-14 rounded-xl px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

---

## Fase 3: Skjemaer og Personlig Dashboard

### 3.1 Stegvise skjemaer (Progressive Disclosure)

**Mål:** Redusere kognitiv belastning ved å vise ett steg om gangen.

#### Oppgaver

| # | Oppgave | Fil | Beskrivelse |
|---|---------|-----|-------------|
| 3.1.1 | Lag MultiStepForm komponent | `apps/web/src/components/forms/MultiStepForm.tsx` | Container for steg |
| 3.1.2 | Lag FormStep komponent | `apps/web/src/components/forms/FormStep.tsx` | Enkelt steg |
| 3.1.3 | Lag StepIndicator komponent | `apps/web/src/components/forms/StepIndicator.tsx` | Visuell progresjon |
| 3.1.4 | Refaktorer LoggTreningokt | `apps/web/src/features/training-log/LoggTreningokt.tsx` | Bruk MultiStepForm |
| 3.1.5 | Refaktorer RegistrerTest | `apps/web/src/features/testing/RegistrerTest.tsx` | Bruk MultiStepForm |
| 3.1.6 | Refaktorer TournamentPrep | `apps/web/src/features/tournament-prep/TournamentPrepForm.tsx` | Bruk MultiStepForm |

#### Ny komponent: MultiStepForm.tsx

```tsx
// apps/web/src/components/forms/MultiStepForm.tsx
import React, { useState, createContext, useContext } from 'react';
import { Button } from '../shadcn/button';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description?: string;
}

interface MultiStepFormContextType {
  currentStep: number;
  totalSteps: number;
  goToNext: () => void;
  goToPrevious: () => void;
  goToStep: (step: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const MultiStepFormContext = createContext<MultiStepFormContextType | null>(null);

export function useMultiStepForm() {
  const context = useContext(MultiStepFormContext);
  if (!context) throw new Error('useMultiStepForm must be used within MultiStepForm');
  return context;
}

interface MultiStepFormProps {
  steps: Step[];
  children: React.ReactNode;
  onComplete: () => void;
  onStepChange?: (step: number) => void;
}

export function MultiStepForm({ steps, children, onComplete, onStepChange }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      onStepChange?.(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      onStepChange?.(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
      onStepChange?.(step);
    }
  };

  const value: MultiStepFormContextType = {
    currentStep,
    totalSteps: steps.length,
    goToNext,
    goToPrevious,
    goToStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
  };

  return (
    <MultiStepFormContext.Provider value={value}>
      <div className="max-w-2xl mx-auto">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                ${index < currentStep
                  ? 'bg-status-success text-tier-white'
                  : index === currentStep
                    ? 'bg-tier-gold text-tier-white'
                    : 'bg-tier-surface-secondary text-tier-text-secondary'}
              `}>
                {index < currentStep ? <Check size={18} /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  w-16 h-1 mx-2
                  ${index < currentStep ? 'bg-status-success' : 'bg-tier-surface-tertiary'}
                `} />
              )}
            </div>
          ))}
        </div>

        {/* Current Step Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-tier-navy">
            {steps[currentStep].title}
          </h2>
          {steps[currentStep].description && (
            <p className="text-tier-text-secondary mt-1">
              {steps[currentStep].description}
            </p>
          )}
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {React.Children.toArray(children)[currentStep]}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={goToPrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft size={18} />
            Tilbake
          </Button>

          <Button onClick={goToNext}>
            {currentStep === steps.length - 1 ? (
              <>
                <Check size={18} />
                Lagre
              </>
            ) : (
              <>
                Neste
                <ChevronRight size={18} />
              </>
            )}
          </Button>
        </div>
      </div>
    </MultiStepFormContext.Provider>
  );
}
```

---

### 3.2 Personlig Hjem-side

**Mål:** Dynamisk dashboard basert på brukerens kontekst og rolle.

#### Oppgaver

| # | Oppgave | Fil | Beskrivelse |
|---|---------|-----|-------------|
| 3.2.1 | Lag FocusCard komponent | `apps/web/src/components/dashboard/FocusCard.tsx` | "Ditt fokus i dag" |
| 3.2.2 | Lag AttentionItems komponent | `apps/web/src/components/dashboard/AttentionItems.tsx` | For coach |
| 3.2.3 | Lag WeekProgress komponent | `apps/web/src/components/dashboard/WeekProgress.tsx` | Ukentlig progresjon |
| 3.2.4 | Lag UpcomingEvents komponent | `apps/web/src/components/dashboard/UpcomingEvents.tsx` | Kommende hendelser |
| 3.2.5 | Refaktorer PlayerDashboard | `apps/web/src/features/hub-pages/DashboardHub.tsx` | Ny layout |
| 3.2.6 | Refaktorer CoachDashboard | `apps/web/src/features/coach/CoachDashboard.tsx` | Ny layout |
| 3.2.7 | Lag API endpoint for dashboard data | `apps/api/src/routes/dashboard.ts` | Aggregert data |

#### Ny komponent: FocusCard.tsx

```tsx
// apps/web/src/components/dashboard/FocusCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Calendar, Target } from 'lucide-react';
import { Button } from '../shadcn/button';

interface FocusCardProps {
  type: 'training' | 'tournament' | 'test';
  title: string;
  description: string;
  href: string;
  actionLabel?: string;
  meta?: string;
}

const icons = {
  training: Play,
  tournament: Calendar,
  test: Target,
};

const colors = {
  training: 'bg-status-success/10 border-status-success/20 text-status-success',
  tournament: 'bg-status-warning/10 border-status-warning/20 text-status-warning',
  test: 'bg-status-info/10 border-status-info/20 text-status-info',
};

export function FocusCard({ type, title, description, href, actionLabel = 'Start', meta }: FocusCardProps) {
  const Icon = icons[type];

  return (
    <div className={`rounded-2xl border-2 p-6 ${colors[type]}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-current/10 flex items-center justify-center">
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <div className="text-xs font-medium uppercase tracking-wider opacity-70 mb-1">
            Ditt fokus i dag
          </div>
          <h3 className="text-lg font-semibold text-tier-navy mb-1">
            {title}
          </h3>
          <p className="text-sm text-tier-text-secondary mb-4">
            {description}
          </p>
          {meta && (
            <p className="text-xs text-tier-text-tertiary mb-4">
              {meta}
            </p>
          )}
          <Button asChild>
            <Link to={href}>
              <Play size={16} />
              {actionLabel}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
```

#### Ny komponent: AttentionItems.tsx (for Coach)

```tsx
// apps/web/src/components/dashboard/AttentionItems.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, MessageSquare, FileText, ChevronRight } from 'lucide-react';

interface AttentionItem {
  id: string;
  type: 'inactive' | 'message' | 'review';
  playerName: string;
  message: string;
  href: string;
}

interface AttentionItemsProps {
  items: AttentionItem[];
}

const icons = {
  inactive: AlertTriangle,
  message: MessageSquare,
  review: FileText,
};

const colors = {
  inactive: 'text-status-warning',
  message: 'text-status-info',
  review: 'text-status-success',
};

export function AttentionItems({ items }: AttentionItemsProps) {
  if (items.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={18} className="text-status-warning" />
        <h2 className="text-sm font-semibold text-tier-navy">
          Krever oppmerksomhet ({items.length})
        </h2>
      </div>

      <div className="bg-tier-white rounded-xl border border-tier-border-default overflow-hidden">
        {items.map((item, index) => {
          const Icon = icons[item.type];
          return (
            <Link
              key={item.id}
              to={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 hover:bg-tier-surface-secondary transition-colors
                ${index < items.length - 1 ? 'border-b border-tier-border-subtle' : ''}
              `}
            >
              <Icon size={18} className={colors[item.type]} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-tier-navy truncate">
                  {item.playerName}
                </div>
                <div className="text-sm text-tier-text-secondary truncate">
                  {item.message}
                </div>
              </div>
              <ChevronRight size={16} className="text-tier-text-tertiary" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
```

---

## Filkart - Alle filer som skal endres/opprettes

### Nye filer (opprett)

```
apps/web/src/
├── components/
│   ├── navigation/
│   │   └── AreaTabs.tsx                    # Fase 1.1.3
│   ├── dashboard/
│   │   ├── QuickActions.tsx                # Fase 1.2.1
│   │   ├── FocusCard.tsx                   # Fase 3.2.1
│   │   ├── AttentionItems.tsx              # Fase 3.2.2
│   │   ├── WeekProgress.tsx                # Fase 3.2.3
│   │   └── UpcomingEvents.tsx              # Fase 3.2.4
│   ├── forms/
│   │   ├── MultiStepForm.tsx               # Fase 3.1.1
│   │   ├── FormStep.tsx                    # Fase 3.1.2
│   │   └── StepIndicator.tsx               # Fase 3.1.3
│   └── ui/
│       └── ActionButton.tsx                # Fase 2.1.2
├── config/
│   └── quick-actions.ts                    # Fase 1.2.2-1.2.3
└── docs/
    └── design/
        └── BUTTON_GUIDELINES.md            # Fase 2.1.4
```

### Eksisterende filer (modifiser)

```
apps/web/src/
├── config/
│   └── player-navigation-v3.ts             # Fase 1.1.1
├── components/
│   ├── layout/
│   │   └── PlayerSidebarV2.tsx             # Fase 1.1.2
│   └── shadcn/
│       └── button.tsx                      # Fase 2.1.1
├── features/
│   ├── hub-pages/
│   │   ├── DashboardHub.tsx                # Fase 1.2.4, 3.2.5
│   │   ├── TreningHub.tsx                  # Fase 1.1.4
│   │   ├── UtviklingHub.tsx                # Fase 1.1.5
│   │   ├── PlanHub.tsx                     # Fase 1.1.6
│   │   └── MerHub.tsx                      # Fase 1.1.7
│   ├── coach/
│   │   └── CoachDashboard.tsx              # Fase 1.2.5, 3.2.6
│   ├── training-log/
│   │   └── LoggTreningokt.tsx              # Fase 3.1.4
│   ├── testing/
│   │   └── RegistrerTest.tsx               # Fase 3.1.5
│   └── tournament-prep/
│       └── TournamentPrepForm.tsx          # Fase 3.1.6
apps/api/src/
└── routes/
    └── dashboard.ts                        # Fase 3.2.7
```

---

## Prioritert oppgaveliste

### Fase 1 - Navigasjon (Start her)

| Prioritet | Oppgave | Fil | Avhengighet |
|-----------|---------|-----|-------------|
| P1 | 1.1.3 Lag AreaTabs komponent | `AreaTabs.tsx` | Ingen |
| P1 | 1.2.1 Lag QuickActions komponent | `QuickActions.tsx` | Ingen |
| P1 | 1.2.2 Definer quick actions config | `quick-actions.ts` | Ingen |
| P2 | 1.1.1 Forenkle navigation config | `player-navigation-v3.ts` | 1.1.3 |
| P2 | 1.1.2 Oppdater sidebar | `PlayerSidebarV2.tsx` | 1.1.1 |
| P3 | 1.1.4-1.1.7 Oppdater hub-pages | Hub files | 1.1.3 |
| P3 | 1.2.4-1.2.5 Integrer QuickActions | Dashboard files | 1.2.1 |

### Fase 2 - Fargekoding

| Prioritet | Oppgave | Fil | Avhengighet |
|-----------|---------|-----|-------------|
| P1 | 2.1.1 Oppdater button variants | `button.tsx` | Ingen |
| P2 | 2.1.2 Lag ActionButton wrapper | `ActionButton.tsx` | 2.1.1 |
| P3 | 2.1.3 Søk og erstatt knapper | Diverse | 2.1.2 |
| P3 | 2.1.4 Dokumenter fargehierarki | `BUTTON_GUIDELINES.md` | 2.1.1 |

### Fase 3 - Skjemaer og Dashboard

| Prioritet | Oppgave | Fil | Avhengighet |
|-----------|---------|-----|-------------|
| P1 | 3.1.1 Lag MultiStepForm | `MultiStepForm.tsx` | Ingen |
| P1 | 3.2.1 Lag FocusCard | `FocusCard.tsx` | Ingen |
| P1 | 3.2.2 Lag AttentionItems | `AttentionItems.tsx` | Ingen |
| P2 | 3.1.2-3.1.3 Lag FormStep/StepIndicator | Form files | 3.1.1 |
| P2 | 3.2.3-3.2.4 Lag WeekProgress/UpcomingEvents | Dashboard files | Ingen |
| P3 | 3.1.4-3.1.6 Refaktorer skjemaer | Form features | 3.1.1 |
| P3 | 3.2.5-3.2.6 Refaktorer dashboards | Hub/Coach files | 3.2.1-3.2.4 |
| P4 | 3.2.7 Lag API endpoint | `dashboard.ts` | 3.2.5 |

---

## Testing-sjekkliste

### Funksjonell testing

- [ ] Navigasjon: Kan nå alle sider med maks 2 klikk
- [ ] Quick Actions: Alle handlinger fungerer
- [ ] Knapper: Konsistent utseende på alle sider
- [ ] Skjemaer: Steg-navigering fungerer
- [ ] Dashboard: Viser riktig data for brukerrolle

### Responsivitet

- [ ] Desktop (1920px): Full sidebar + tabs synlige
- [ ] Laptop (1366px): Kompakt sidebar
- [ ] Tablet (768px): Bottom nav + tabs
- [ ] Mobil (375px): Bottom nav + scrollbare tabs

### Tilgjengelighet

- [ ] Tastaturnavigasjon fungerer
- [ ] Skjermleser-kompatibel
- [ ] Fargekontrast godkjent (WCAG AA)
- [ ] Focus-states synlige

---

## Suksesskriterier

| Metrikk | Før | Mål |
|---------|-----|-----|
| Klikk til vanlig handling | 2-3 | 1 |
| Sidebar scroll-lengde | 15+ items | 5 items |
| Skjema-fullføringsrate | Ukjent | +20% |
| Brukerforvirring (support) | Baseline | -30% |
