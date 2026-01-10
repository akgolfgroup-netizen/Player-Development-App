# Kodeeksempler

> Mønstre og snippets å følge ved implementering

---

## 1. Bruke SportContext

### Grunnleggende bruk

```tsx
import { useSportSafe } from '@/contexts/SportContext';

function MyComponent() {
  // Hent sport context (trygt - returnerer Golf som fallback)
  const sport = useSportSafe();

  return (
    <div>
      <h1>{sport.name.no}</h1>
      <p>Ikon: {sport.icon}</p>
    </div>
  );
}
```

### Hente spesifikke data

```tsx
function TrainingForm() {
  const sport = useSportSafe();

  // Treningsområder
  const areas = sport.trainingAreas;

  // Miljøer
  const environments = sport.environments;

  // Intensitetsnivåer
  const intensities = sport.intensityLevels;

  // Faser
  const phases = sport.phases;

  // Tester
  const tests = sport.testProtocols;

  // Mål-kategorier
  const goalCategories = sport.goals;

  // Terminologi
  const athleteTerm = sport.getTerm('athlete');
  const sessionTerm = sport.getTerm('session');

  // Feature flags
  const showHandicap = sport.features?.usesHandicap;
}
```

---

## 2. Dynamisk Select-komponent

### Treningsområde-velger

```tsx
import { useSportSafe } from '@/contexts/SportContext';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TrainingAreaSelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TrainingAreaSelect({
  value,
  onChange,
  placeholder = 'Velg treningsområde'
}: TrainingAreaSelectProps) {
  const sport = useSportSafe();

  // Grupper etter gruppe-felt
  const grouped = sport.trainingAreas.reduce((acc, area) => {
    const group = area.group || 'Annet';
    if (!acc[group]) acc[group] = [];
    acc[group].push(area);
    return acc;
  }, {} as Record<string, typeof sport.trainingAreas>);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(grouped).map(([group, areas]) => (
          <SelectGroup key={group}>
            <SelectLabel>{group}</SelectLabel>
            {areas.map(area => (
              <SelectItem key={area.id} value={area.id}>
                <span className="flex items-center gap-2">
                  {area.icon && <span>{area.icon}</span>}
                  <span>{area.name.no}</span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### Miljø-velger

```tsx
export function EnvironmentSelect({ value, onChange }) {
  const sport = useSportSafe();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Velg miljø" />
      </SelectTrigger>
      <SelectContent>
        {sport.environments.map(env => (
          <SelectItem key={env.id} value={env.id}>
            <span className="flex items-center gap-2">
              <span>{env.icon}</span>
              <span>{env.name.no}</span>
              {env.competitionLevel && (
                <span className="text-xs text-muted-foreground">
                  ({env.competitionLevel})
                </span>
              )}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### Intensitets-velger

```tsx
export function IntensitySelect({ value, onChange }) {
  const sport = useSportSafe();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Velg intensitet" />
      </SelectTrigger>
      <SelectContent>
        {sport.intensityLevels.map(level => (
          <SelectItem key={level.id} value={level.id}>
            <span className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: level.color }}
              />
              <span>{level.name.no}</span>
              <span className="text-xs text-muted-foreground">
                ({level.description.no})
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

---

## 3. Feature Flag sjekker

### Betinget rendering

```tsx
function AnalysisSection() {
  const sport = useSportSafe();

  return (
    <div>
      {/* Vis alltid */}
      <TrainingStats />

      {/* Kun for golf */}
      {sport.features?.usesHandicap && (
        <HandicapSection />
      )}

      {/* Kun for golf */}
      {sport.features?.usesClubSpeed && (
        <ClubSpeedSection />
      )}

      {/* Kun for golf */}
      {sport.features?.usesSG && (
        <StrokesGainedSection />
      )}

      {/* Konfigurerbar per sport */}
      {sport.features?.usesBenchmarks && (
        <BenchmarkComparison />
      )}

      {/* Konfigurerbar per sport */}
      {sport.features?.usesAKFormula && (
        <AKFormulaSection />
      )}
    </div>
  );
}
```

### Med fallback

```tsx
function StatsDisplay() {
  const sport = useSportSafe();

  // Fallback-logikk
  const showAdvancedStats = sport.features?.usesSG ?? false;

  if (showAdvancedStats) {
    return <AdvancedStats />;
  }

  return <BasicStats />;
}
```

---

## 4. Dynamisk terminologi

### getTerm() bruk

```tsx
function WelcomeMessage() {
  const sport = useSportSafe();

  // Hent termer
  const athlete = sport.getTerm('athlete');
  const coach = sport.getTerm('coach');
  const session = sport.getTerm('session');
  const match = sport.getTerm('match');

  return (
    <div>
      <h1>Velkommen, {athlete}!</h1>
      <p>Din {coach} har planlagt en ny {session}.</p>
      <p>Neste {match} er om 3 dager.</p>
    </div>
  );
}
```

### Alle tilgjengelige termer

```typescript
// Fra types.ts - SportTerminology
interface SportTerminology {
  athlete: LocalizedString;    // "spiller" | "utøver" | "svømmer"
  athletes: LocalizedString;   // "spillere" | "utøvere"
  coach: LocalizedString;      // "trener" | "coach"
  session: LocalizedString;    // "økt" | "trening"
  match: LocalizedString;      // "runde" | "kamp" | "løp"
  score: LocalizedString;      // "score" | "resultat" | "tid"
  venue: LocalizedString;      // "bane" | "hall" | "basseng"
  equipment: LocalizedString;  // "utstyr" | "køller" | "sko"
}
```

---

## 5. Test-protokoll rendering

### Dynamisk test-skjema

```tsx
function TestForm({ protocolId }: { protocolId: string }) {
  const sport = useSportSafe();
  const [values, setValues] = useState<Record<string, any>>({});

  // Finn protokoll
  const protocol = sport.testProtocols.find(p => p.id === protocolId);

  if (!protocol) {
    return <div>Test ikke funnet</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logikk...
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{protocol.name.no}</h2>
      <p className="text-muted-foreground">{protocol.description.no}</p>

      {protocol.formConfig.fields.map(field => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label.no}</Label>

          {field.type === 'number' && (
            <div className="flex items-center gap-2">
              <Input
                id={field.name}
                type="number"
                min={field.min}
                max={field.max}
                step={field.step}
                value={values[field.name] ?? ''}
                onChange={e => setValues(prev => ({
                  ...prev,
                  [field.name]: parseFloat(e.target.value)
                }))}
              />
              {field.unit && (
                <span className="text-sm text-muted-foreground">
                  {field.unit}
                </span>
              )}
            </div>
          )}

          {field.type === 'select' && (
            <Select
              value={values[field.name]}
              onValueChange={v => setValues(prev => ({
                ...prev,
                [field.name]: v
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Velg ${field.label.no.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {field.type === 'time' && (
            <Input
              id={field.name}
              type="text"
              placeholder="MM:SS"
              value={values[field.name] ?? ''}
              onChange={e => setValues(prev => ({
                ...prev,
                [field.name]: e.target.value
              }))}
            />
          )}
        </div>
      ))}

      <Button type="submit">Registrer resultat</Button>
    </form>
  );
}
```

---

## 6. API-kall med sport

### Hente data filtrert på sport

```tsx
import { useSportSafe } from '@/contexts/SportContext';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

function useSessions(playerId: string) {
  const { sportId } = useSportSafe();

  return useQuery({
    // Inkluder sportId i queryKey for korrekt caching
    queryKey: ['sessions', playerId, sportId],
    queryFn: async () => {
      const response = await api.get('/sessions', {
        params: { playerId, sportId }
      });
      return response.data;
    }
  });
}
```

### Opprette data med sport

```tsx
function useCreateSession() {
  const { sportId } = useSportSafe();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSessionDto) => {
      const response = await api.post('/sessions', {
        ...data,
        sportId  // Alltid inkluder sportId
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalider alle session-queries for denne sporten
      queryClient.invalidateQueries({
        queryKey: ['sessions']
      });
    }
  });
}
```

---

## 7. Sport-indikator komponenter

### Header-indikator

```tsx
function SportIndicator() {
  const sport = useSportSafe();

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
      <span className="text-lg">{sport.icon}</span>
      <span className="text-sm font-medium">{sport.name.no}</span>
    </div>
  );
}
```

### Badge på kort

```tsx
function SportBadge({ className }: { className?: string }) {
  const sport = useSportSafe();

  return (
    <Badge variant="outline" className={cn("text-xs", className)}>
      {sport.icon} {sport.name.no}
    </Badge>
  );
}
```

---

## 8. Komplett eksempel: Treningsregistrering

```tsx
import { useSportSafe } from '@/contexts/SportContext';
import { useCreateSession } from '@/hooks/useSessions';
import { TrainingAreaSelect } from '@/components/sport/TrainingAreaSelect';
import { EnvironmentSelect } from '@/components/sport/EnvironmentSelect';
import { IntensitySelect } from '@/components/sport/IntensitySelect';

export function LoggTrening() {
  const sport = useSportSafe();
  const createSession = useCreateSession();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    trainingArea: '',
    environment: '',
    intensity: '',
    duration: 60,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createSession.mutateAsync({
      ...formData,
      // sportId legges til automatisk i hook
    });

    // Reset eller naviger...
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1>Registrer {sport.getTerm('session')}</h1>
        <SportBadge />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField>
          <Label>Dato</Label>
          <Input
            type="date"
            value={formData.date}
            onChange={e => setFormData(prev => ({
              ...prev,
              date: e.target.value
            }))}
          />
        </FormField>

        <FormField>
          <Label>Treningsområde</Label>
          <TrainingAreaSelect
            value={formData.trainingArea}
            onChange={v => setFormData(prev => ({
              ...prev,
              trainingArea: v
            }))}
          />
        </FormField>

        <FormField>
          <Label>Miljø</Label>
          <EnvironmentSelect
            value={formData.environment}
            onChange={v => setFormData(prev => ({
              ...prev,
              environment: v
            }))}
          />
        </FormField>

        <FormField>
          <Label>Intensitet</Label>
          <IntensitySelect
            value={formData.intensity}
            onChange={v => setFormData(prev => ({
              ...prev,
              intensity: v
            }))}
          />
        </FormField>

        <FormField>
          <Label>Varighet (minutter)</Label>
          <Input
            type="number"
            min={1}
            max={480}
            value={formData.duration}
            onChange={e => setFormData(prev => ({
              ...prev,
              duration: parseInt(e.target.value)
            }))}
          />
        </FormField>

        <FormField>
          <Label>Notater</Label>
          <Textarea
            value={formData.notes}
            onChange={e => setFormData(prev => ({
              ...prev,
              notes: e.target.value
            }))}
            placeholder={`Beskriv ${sport.getTerm('session')}en...`}
          />
        </FormField>

        <Button
          type="submit"
          disabled={createSession.isPending}
          className="w-full"
        >
          {createSession.isPending ? 'Lagrer...' : 'Lagre'}
        </Button>
      </form>
    </div>
  );
}
```

---

## 9. Backend: Sport-filtrering

### Service-metode

```typescript
// apps/api/src/api/v1/sessions/service.ts

class SessionService {
  async findAll(playerId: string, sportId?: SportId) {
    return prisma.trainingSession.findMany({
      where: {
        playerId,
        // Filtrer på sport hvis spesifisert
        ...(sportId && { sportId })
      },
      orderBy: { date: 'desc' },
      include: {
        player: {
          select: { id: true, name: true }
        }
      }
    });
  }

  async create(data: CreateSessionDto) {
    // Valider at sportId er gyldig
    const validSports = Object.values(SportId);
    if (!validSports.includes(data.sportId)) {
      throw new Error(`Invalid sportId: ${data.sportId}`);
    }

    return prisma.trainingSession.create({
      data: {
        ...data,
        sportId: data.sportId
      }
    });
  }
}
```

### Route med sport-parameter

```typescript
// apps/api/src/api/v1/sessions/routes.ts

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { playerId, sportId } = req.query;

    const sessions = await sessionService.findAll(
      playerId as string,
      sportId as SportId | undefined
    );

    res.json(sessions);
  } catch (error) {
    next(error);
  }
});
```
