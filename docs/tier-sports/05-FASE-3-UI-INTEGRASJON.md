# Fase 3: UI-integrasjon

> Teknisk implementeringsguide

**Mål:** Komponenter bruker sport-konfigurasjon dynamisk
**Estimat:** 23 timer
**Avhengigheter:** Fase 2

---

## Oversikt

Denne fasen handler om å oppdatere alle UI-komponenter til å bruke sport-context i stedet for hardkodede golf-verdier.

---

## 3.1 Treningsregistrering

### LoggTreningContainer.jsx

**Nåværende problem:**
```jsx
// Hardkodede treningsområder
const TRAINING_AREAS = [
  'Driving', 'Iron Play', 'Short Game', 'Putting'
];
```

**Løsning:**

```jsx
// src/features/trening-plan/LoggTreningContainer.jsx

import { useSportSafe } from '@/contexts/SportContext';

export function LoggTreningContainer() {
  const sport = useSportSafe();

  // Dynamiske treningsområder fra config
  const trainingAreaOptions = sport.trainingAreas.map(area => ({
    value: area.id,
    label: area.name.no,
    group: area.group
  }));

  // Dynamiske miljøer
  const environmentOptions = sport.environments.map(env => ({
    value: env.id,
    label: env.name.no,
    icon: env.icon
  }));

  // Dynamiske intensitetsnivåer
  const intensityOptions = sport.intensityLevels.map(level => ({
    value: level.id,
    label: level.name.no,
    color: level.color
  }));

  return (
    <Form>
      {/* Treningsområde */}
      <FormField name="trainingArea">
        <Select options={trainingAreaOptions} />
      </FormField>

      {/* Miljø */}
      <FormField name="environment">
        <Select options={environmentOptions} />
      </FormField>

      {/* Intensitet */}
      <FormField name="intensity">
        <Select options={intensityOptions} />
      </FormField>

      {/* ... resten av skjemaet */}
    </Form>
  );
}
```

### Grupperte treningsområder

```jsx
// Bruk gruppering fra config

function TrainingAreaSelect({ value, onChange }) {
  const sport = useSportSafe();

  // Grupper områdene
  const groupedAreas = sport.trainingAreas.reduce((acc, area) => {
    const group = area.group || 'Other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(area);
    return acc;
  }, {});

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Velg treningsområde" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(groupedAreas).map(([group, areas]) => (
          <SelectGroup key={group}>
            <SelectLabel>{group}</SelectLabel>
            {areas.map(area => (
              <SelectItem key={area.id} value={area.id}>
                {area.name.no}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
```

---

## 3.2 Testregistrering

### TestDetailPage.tsx

**Fil:** `src/features/tests/TestDetailPage.tsx`

```tsx
import { useSportSafe } from '@/contexts/SportContext';

export function TestDetailPage({ testId }: { testId: string }) {
  const sport = useSportSafe();

  // Finn test-protokoll fra config
  const protocol = sport.testProtocols.find(p => p.id === testId);

  if (!protocol) {
    return <NotFound message="Test ikke funnet for denne idretten" />;
  }

  return (
    <div>
      <h1>{protocol.name.no}</h1>
      <p>{protocol.description.no}</p>

      {/* Dynamisk skjema basert på protocol.formConfig */}
      <TestForm protocol={protocol} />

      {/* Benchmark-visning */}
      <TestBenchmarks
        protocol={protocol}
        benchmarks={sport.benchmarks}
      />
    </div>
  );
}
```

### TestForm - dynamisk basert på protokoll

```tsx
interface TestFormProps {
  protocol: TestProtocol;
}

function TestForm({ protocol }: TestFormProps) {
  const [values, setValues] = useState<Record<string, any>>({});

  // Bygg skjema fra formConfig
  return (
    <form>
      {protocol.formConfig.fields.map(field => (
        <FormField key={field.name}>
          <Label>{field.label.no}</Label>

          {field.type === 'number' && (
            <Input
              type="number"
              min={field.min}
              max={field.max}
              step={field.step}
              value={values[field.name] || ''}
              onChange={e => setValues(prev => ({
                ...prev,
                [field.name]: e.target.value
              }))}
            />
          )}

          {field.type === 'select' && (
            <Select
              value={values[field.name]}
              onValueChange={v => setValues(prev => ({
                ...prev,
                [field.name]: v
              }))}
            >
              {field.options?.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </Select>
          )}

          {field.unit && (
            <span className="text-muted-foreground">{field.unit}</span>
          )}
        </FormField>
      ))}

      <Button type="submit">Registrer test</Button>
    </form>
  );
}
```

### TestBenchmarks

```tsx
interface TestBenchmarksProps {
  protocol: TestProtocol;
  benchmarks: BenchmarkConfig;
}

function TestBenchmarks({ protocol, benchmarks }: TestBenchmarksProps) {
  const levels = benchmarks.skillLevels;

  return (
    <div className="mt-6">
      <h3>Referanseverdier</h3>
      <p className="text-sm text-muted-foreground">
        Kilde: {benchmarks.source}
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nivå</TableHead>
            {protocol.scoringThresholds && (
              <>
                <TableHead>Min</TableHead>
                <TableHead>Max</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {levels.map(level => {
            const threshold = protocol.scoringThresholds?.[level.id];
            return (
              <TableRow key={level.id}>
                <TableCell>
                  <Badge style={{ backgroundColor: level.color }}>
                    {level.name.no}
                  </Badge>
                </TableCell>
                {threshold && (
                  <>
                    <TableCell>{threshold.min}</TableCell>
                    <TableCell>{threshold.max}</TableCell>
                  </>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
```

---

## 3.3 Målsetting

### Maalsetninger.tsx

```tsx
import { useGoalCategories } from '@/hooks/useTrainingConfig';

export function Maalsetninger() {
  const categories = useGoalCategories();

  return (
    <div>
      <h1>Målsettinger</h1>

      {/* Kategori-velger */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <Button
            key={cat.id}
            variant="outline"
            className="flex items-center gap-2"
            style={{ borderColor: cat.color }}
          >
            <span>{cat.icon}</span>
            <span>{cat.name.no}</span>
          </Button>
        ))}
      </div>

      {/* Mål-liste filtrert per kategori */}
      <GoalList categories={categories} />
    </div>
  );
}
```

### GoalForm med sport-kategorier

```tsx
function GoalForm() {
  const sport = useSportSafe();
  const categories = sport.goals;

  return (
    <Form>
      <FormField name="category">
        <Label>Kategori</Label>
        <Select>
          {categories.map(cat => (
            <SelectItem key={cat.id} value={cat.id}>
              <span className="flex items-center gap-2">
                <span style={{ color: cat.color }}>{cat.icon}</span>
                <span>{cat.name.no}</span>
              </span>
            </SelectItem>
          ))}
        </Select>
      </FormField>

      {/* Andre felt... */}
    </Form>
  );
}
```

---

## 3.4 Dashboard

### Sport-indikator på kort

```tsx
// Legg til sport-badge på alle data-kort

function DataCard({ item, children }) {
  const sport = useSportSafe();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        {children}

        {/* Sport-indikator */}
        <Badge variant="outline" className="text-xs">
          <span className="mr-1">{sport.icon}</span>
          {sport.name.no}
        </Badge>
      </CardHeader>
    </Card>
  );
}
```

### FocusCard med dynamisk terminologi

**Fil:** `src/components/dashboard/FocusCard.tsx`

```tsx
import { useSportSafe } from '@/contexts/SportContext';

export function FocusCard() {
  const sport = useSportSafe();

  // Bruk dynamisk terminologi
  const sessionTerm = sport.getTerm('session'); // "økt" / "trening"
  const athleteTerm = sport.getTerm('athlete'); // "spiller" / "utøver"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dagens fokus</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Neste {sessionTerm}: {/* ... */}
        </p>
        <p>
          {athleteTerm}ens mål: {/* ... */}
        </p>
      </CardContent>
    </Card>
  );
}
```

### Sport-spesifikke statistikker

```tsx
function PlayerStatCard({ player }) {
  const sport = useSportSafe();

  // Velg riktige metriker basert på sport
  const primaryMetrics = sport.metrics
    .filter(m => m.isPrimary)
    .slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistikk</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {primaryMetrics.map(metric => (
            <div key={metric.id}>
              <Label>{metric.name.no}</Label>
              <Value>
                {player.stats?.[metric.id] || '-'}
                {metric.unit && ` ${metric.unit}`}
              </Value>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 3.5 Analyse

### AnalyseHub.tsx

```tsx
import { useSportSafe } from '@/contexts/SportContext';

export function AnalyseHub() {
  const sport = useSportSafe();

  // Dynamiske analyse-kategorier
  const analyseCategories = [
    {
      id: 'training',
      title: `${sport.getTerm('session')}sanalyse`,
      icon: '📊'
    },
    {
      id: 'tests',
      title: 'Tester og målinger',
      icon: '📈'
    },
    {
      id: 'progress',
      title: 'Fremgang',
      icon: '📉'
    }
  ];

  // Vis kun benchmarks hvis sport støtter det
  if (sport.features?.usesBenchmarks) {
    analyseCategories.push({
      id: 'benchmarks',
      title: 'Benchmarks',
      icon: '🎯'
    });
  }

  return (
    <div className="grid gap-4">
      {analyseCategories.map(cat => (
        <AnalyseCard key={cat.id} {...cat} />
      ))}
    </div>
  );
}
```

### AnalyseStatistikkHub med dynamiske metriker

```tsx
export function AnalyseStatistikkHub() {
  const sport = useSportSafe();

  // Grupper metriker etter kategori
  const metricsByCategory = sport.metrics.reduce((acc, metric) => {
    const cat = metric.category || 'general';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(metric);
    return acc;
  }, {});

  return (
    <div>
      <h1>Statistikk</h1>

      {Object.entries(metricsByCategory).map(([category, metrics]) => (
        <Section key={category}>
          <SectionTitle>{category}</SectionTitle>
          <MetricsGrid metrics={metrics} />
        </Section>
      ))}
    </div>
  );
}
```

---

## Sjekkliste

### Treningsregistrering
- [ ] LoggTreningContainer bruker dynamiske treningsområder
- [ ] LoggTreningContainer bruker dynamiske miljøer
- [ ] LoggTreningContainer bruker dynamiske intensitetsnivåer
- [ ] Gruppering av treningsområder fungerer

### Testregistrering
- [ ] TestDetailPage henter protokoll fra sport config
- [ ] TestForm bygges dynamisk fra formConfig
- [ ] Benchmark-visning bruker sport.benchmarks
- [ ] Ikke-eksisterende tester viser 404

### Målsetting
- [ ] Maalsetninger bruker dynamiske kategorier
- [ ] GoalForm viser sport-spesifikke kategorier
- [ ] Ikoner og farger fra config vises

### Dashboard
- [ ] Sport-indikator på alle kort
- [ ] FocusCard bruker dynamisk terminologi
- [ ] PlayerStatCard viser sport-spesifikke metriker

### Analyse
- [ ] AnalyseHub viser sport-relevante kategorier
- [ ] Benchmarks skjules hvis ikke støttet
- [ ] Metriker grupperes etter kategori

---

## Tips for implementering

### 1. Bruk useSportSafe() overalt
For å unngå crashes hvis context mangler:

```tsx
// Trygt - returnerer Golf som fallback
const sport = useSportSafe();

// Risikabelt - kaster feil hvis utenfor provider
const sport = useSport();
```

### 2. Lag gjenbrukbare select-komponenter

```tsx
// src/components/sport/TrainingAreaSelect.tsx
// src/components/sport/EnvironmentSelect.tsx
// src/components/sport/IntensitySelect.tsx
```

### 3. Bruk getTerm() for all terminologi

```tsx
// I stedet for:
<p>Spillerens mål</p>

// Bruk:
<p>{sport.getTerm('athlete')}s mål</p>
```

### 4. Sjekk feature flags

```tsx
const sport = useSportSafe();

// Vis kun hvis støttet
{sport.features?.usesHandicap && (
  <HandicapSection />
)}
```
