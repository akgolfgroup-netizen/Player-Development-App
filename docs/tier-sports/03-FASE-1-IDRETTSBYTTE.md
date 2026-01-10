# Fase 1: Aktiver idrettsbytte

> Teknisk implementeringsguide

**Mål:** Gjøre det mulig å bytte idrett i appen
**Estimat:** 9 timer
**Avhengigheter:** Ingen

---

## Oversikt

Denne fasen handler om å "vekke" den eksisterende multi-sport arkitekturen ved å:
1. Koble frontend til API for sport config
2. Lage UI for å velge/bytte idrett
3. Legge til backend-endpoint for å bytte idrett

---

## Oppgave 1.1: Backend - Idrettsbytte API

### Nåværende tilstand

API-et har allerede CRUD for SportConfig, men mangler et dedikert endpoint for å bytte tenant's sport.

### Implementering

**Fil:** `apps/api/src/api/v1/sport-config/routes.ts`

Legg til ny route:

```typescript
// PATCH /api/v1/sport-config/switch
router.patch('/switch', requireAuth, async (req, res, next) => {
  try {
    const { sportId } = req.body;
    const tenantId = req.user.tenantId;

    // Valider sportId
    const validSports = ['GOLF', 'RUNNING', 'HANDBALL', 'FOOTBALL', 'TENNIS', 'SWIMMING', 'JAVELIN'];
    if (!validSports.includes(sportId)) {
      return res.status(400).json({ error: 'Invalid sport ID' });
    }

    const result = await sportConfigService.switchSport(tenantId, sportId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});
```

**Fil:** `apps/api/src/api/v1/sport-config/service.ts`

Legg til metode:

```typescript
async switchSport(tenantId: string, sportId: SportId): Promise<SportConfig> {
  // Oppdater tenant's sportId
  await prisma.tenant.update({
    where: { id: tenantId },
    data: { sportId }
  });

  // Oppdater eller opprett SportConfig
  const config = await prisma.sportConfig.upsert({
    where: { tenantId },
    update: { sportId },
    create: {
      tenantId,
      sportId,
      // Sett default feature flags basert på sport
      usesHandicap: sportId === 'GOLF',
      usesClubSpeed: sportId === 'GOLF',
      usesSG: sportId === 'GOLF',
      usesAKFormula: true,
      usesBenchmarks: true
    }
  });

  return config;
}
```

### Tester å skrive

```typescript
describe('PATCH /api/v1/sport-config/switch', () => {
  it('should switch tenant sport to RUNNING', async () => {
    const res = await request(app)
      .patch('/api/v1/sport-config/switch')
      .set('Authorization', `Bearer ${token}`)
      .send({ sportId: 'RUNNING' });

    expect(res.status).toBe(200);
    expect(res.body.sportId).toBe('RUNNING');
  });

  it('should reject invalid sport ID', async () => {
    const res = await request(app)
      .patch('/api/v1/sport-config/switch')
      .set('Authorization', `Bearer ${token}`)
      .send({ sportId: 'INVALID' });

    expect(res.status).toBe(400);
  });
});
```

---

## Oppgave 1.2: Frontend - Provider oppsett

### Nåværende tilstand

```jsx
// src/App.jsx (linje ~14)
<SportProvider sportId="golf">
```

### Implementering

**Steg 1:** Oppdater App.jsx

```jsx
// src/App.jsx

// Fjern denne importen:
// import { SportProvider } from './contexts/SportContext';

// Legg til denne:
import { ApiSportProvider } from './contexts/SportContext';

// Erstatt provider:
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <ApiSportProvider>  {/* <-- ENDRET */}
              <ThemeProvider>
                {/* ... resten av appen */}
              </ThemeProvider>
            </ApiSportProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
```

**Steg 2:** Håndter loading state i SportContext

```tsx
// src/contexts/SportContext.tsx

export function ApiSportProvider({ children }: { children: React.ReactNode }) {
  const { data: apiConfig, isLoading, error } = useSportConfig();

  // Vis loading indikator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // Ved feil, bruk Golf som fallback
  if (error) {
    console.warn('Failed to fetch sport config, using Golf fallback');
  }

  const sportId = apiConfig?.sportId || 'golf';
  const baseConfig = getSportConfig(sportId as SportId);

  // Merg API-overrides med base config
  const config = mergeConfigs(baseConfig, apiConfig);

  return (
    <SportContext.Provider value={config}>
      {children}
    </SportContext.Provider>
  );
}
```

**Steg 3:** Legg til invalidering ved sport-bytte

```tsx
// Legg til i SportContext.tsx eller egen hook

export function useSwitchSport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sportId: SportId) => {
      const response = await api.patch('/api/v1/sport-config/switch', { sportId });
      return response.data;
    },
    onSuccess: () => {
      // Invalider alle sport-relaterte queries
      queryClient.invalidateQueries({ queryKey: ['sportConfig'] });
      // Tvinger refetch av hele appen
      window.location.reload();
    }
  });
}
```

---

## Oppgave 1.3: Frontend - Idrettsvelger UI

### SportSelector komponent

**Fil:** `src/components/sport/SportSelector.tsx`

```tsx
import { useSportConfig, useSwitchSport } from '@/hooks/useSportConfig';
import { getAvailableSports, getSportConfig } from '@/config/sports';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SportOption {
  id: string;
  name: string;
  icon: string;
}

export function SportSelector() {
  const { data: currentConfig } = useSportConfig();
  const { mutate: switchSport, isPending } = useSwitchSport();

  const sports: SportOption[] = getAvailableSports().map(id => {
    const config = getSportConfig(id);
    return {
      id,
      name: config.name.no,
      icon: config.icon
    };
  });

  const handleChange = (sportId: string) => {
    if (sportId !== currentConfig?.sportId) {
      switchSport(sportId as SportId);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Idrett:</span>
      <Select
        value={currentConfig?.sportId || 'golf'}
        onValueChange={handleChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Velg idrett" />
        </SelectTrigger>
        <SelectContent>
          {sports.map(sport => (
            <SelectItem key={sport.id} value={sport.id}>
              <span className="flex items-center gap-2">
                <span>{sport.icon}</span>
                <span>{sport.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
```

### Integrer i innstillinger

**Fil:** `src/features/settings/SettingsPage.tsx` (eller tilsvarende)

```tsx
import { SportSelector } from '@/components/sport/SportSelector';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Idrett</CardTitle>
          <CardDescription>
            Velg hvilken idrett denne organisasjonen jobber med
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SportSelector />
        </CardContent>
      </Card>

      {/* Andre innstillinger... */}
    </div>
  );
}
```

### Sport-indikator i header

**Fil:** `src/components/layout/Header.tsx`

```tsx
import { useSportSafe } from '@/contexts/SportContext';

export function Header() {
  const sport = useSportSafe();

  return (
    <header className="...">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">{sport.icon}</span>
        <span className="font-semibold">{sport.name.no}</span>
      </div>

      {/* ... resten av header */}
    </header>
  );
}
```

---

## Verifisering

### Manuell test

1. Start appen
2. Gå til Innstillinger
3. Endre idrett fra Golf til Løping
4. Verifiser at:
   - Siden reloader
   - Header viser løping-ikon
   - SportContext har løping-data

### Automatisert test (Playwright)

```typescript
// tests/sport-switching.spec.ts

test('should switch sport from Golf to Running', async ({ page }) => {
  await page.goto('/settings');

  // Finn sport-selector
  const selector = page.getByRole('combobox', { name: /idrett/i });
  await expect(selector).toHaveValue('golf');

  // Bytt til løping
  await selector.click();
  await page.getByRole('option', { name: /løping/i }).click();

  // Vent på reload
  await page.waitForLoadState('networkidle');

  // Verifiser header
  await expect(page.getByText('Løping')).toBeVisible();
});
```

---

## Sjekkliste

- [ ] Backend: PATCH /switch endpoint implementert
- [ ] Backend: switchSport service metode fungerer
- [ ] Backend: Validering av sportId
- [ ] Frontend: App.jsx bruker ApiSportProvider
- [ ] Frontend: Loading state vises under fetch
- [ ] Frontend: Fallback til Golf ved feil
- [ ] Frontend: SportSelector komponent laget
- [ ] Frontend: SportSelector integrert i settings
- [ ] Frontend: Sport-indikator i header
- [ ] Test: Manuell testing OK
- [ ] Test: E2E test skrevet og passerer

---

## Mulige problemer

### 1. Circular dependency
Hvis `ApiSportProvider` importerer noe som importerer sport context.

**Løsning:** Bruk lazy loading eller restructurer imports.

### 2. Flash of wrong content
Brukeren ser Golf-innhold før API-response.

**Løsning:** Vis loading spinner til config er lastet.

### 3. Cache invalidering
Gammel sport-data vises etter bytte.

**Løsning:** Bruk `window.location.reload()` eller invalidier alle queries.

### 4. Autentisering timing
API-kall feiler fordi auth ikke er klar.

**Løsning:** ApiSportProvider må være innenfor AuthProvider.
