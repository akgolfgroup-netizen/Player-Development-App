# Natt-Sprint Plan: 30-31 desember 2025
> **Start:** 23:34 | **Slutt:** 05:00 | **Varighet:** ~5.5 timer

---

## Estimert tidsbruk

| Sprint | Estimat | Prioritet |
|--------|---------|-----------|
| Sprint 1: Kritiske fixes | 1.5 timer | KRITISK |
| Sprint 2: Dashboard kobling | 1.5 timer | HØY |
| Sprint 3: Treningssystem | 1.5 timer | MEDIUM |
| Sprint 4: Cleanup & test | 1 time | LAV |

---

## SPRINT 1: Kritiske Fixes (1.5 timer)

### 1.1 LoggTreningContainer - Koble til API
**Fil:** `apps/web/src/features/training/LoggTreningContainer.jsx`
**Problem:** `// TODO: Save to backend API`
**Løsning:** Implementer POST til `/api/v1/sessions`

### 1.2 RegistrerTurneringsResultatContainer - Koble til API
**Fil:** `apps/web/src/features/tournaments/RegistrerTurneringsResultatContainer.jsx`
**Problem:** `// TODO: Save tournament result to backend API`
**Løsning:** Implementer POST til `/api/v1/tournaments/results`

### 1.3 BevisContainer - Video åpning
**Fil:** `apps/web/src/features/bevis/BevisContainer.jsx`
**Problem:** `onClick={() => { /* TODO: Open video detail/player */ }}`
**Løsning:** Implementer navigasjon til video player

### 1.4 VerifyResetToken - Ekte API-kall
**Fil:** `apps/web/src/features/auth/VerifyResetToken.jsx`
**Problem:** Mock data istedenfor API
**Løsning:** Koble til `/api/v1/auth/verify-reset-token`

### 1.5 TwoFactorDisable - Ekte API-kall
**Fil:** `apps/web/src/features/auth/TwoFactorDisable.jsx`
**Problem:** Mock data istedenfor API
**Løsning:** Koble til `/api/v1/auth/2fa/disable`

---

## SPRINT 2: Dashboard Kobling (1.5 timer)

### 2.1 ProfileCard - Live data
**Fil:** `apps/web/src/features/dashboard/components/ProfileCard.jsx`
**Oppgave:** Hent spillerdata fra `/api/v1/players/:id`

### 2.2 StrokesGainedWidget - Live data
**Fil:** `apps/web/src/features/dashboard/components/StrokesGainedWidget.jsx`
**Oppgave:** Hent SG-data fra `/api/v1/stats/strokes-gained`

### 2.3 DagensPlan - Kalenderintegrasjon
**Fil:** `apps/web/src/features/dashboard/components/DagensPlan.jsx`
**Oppgave:** Hent dagens plan fra `/api/v1/calendar/today`

### 2.4 UkensOversikt - Live statistikk
**Fil:** `apps/web/src/features/dashboard/components/UkensOversikt.jsx`
**Oppgave:** Hent ukesstatistikk fra `/api/v1/players/:id/weekly-summary`

---

## SPRINT 3: Treningssystem (1.5 timer)

### 3.1 Treningsdagbok - Fullføre hooks
**Fil:** `apps/web/src/features/trening-plan/hooks/useDagbokState.ts`
**Oppgave:** Koble til sessions API

### 3.2 Session Evaluering - Lagring
**Fil:** `apps/web/src/features/sessions/SessionEvaluationForm.jsx`
**Oppgave:** POST evaluering til API

### 3.3 Øvelsesbibliotek - Søk og filter
**Fil:** `apps/web/src/features/exercises/`
**Oppgave:** Implementer søk med query params

### 3.4 Quick Actions - Verifiser navigasjon
**Oppgave:** Test alle navigasjonslenker i dashboard

---

## SPRINT 4: Cleanup & Test (1 time)

### 4.1 ESLint Warnings - Kritiske
- Fjern ubrukte imports
- Fiks manglende dependencies i useEffect/useCallback
- Fjern ubrukte variabler

### 4.2 Console.log cleanup
- Fjern debug console.log i produksjonskode
- Behold kun logger-kall

### 4.3 Smoke Test
- Test login flow
- Test dashboard lasting
- Test treningslogging
- Test statistikk-visning

---

## Kjøreinstruksjoner

```bash
# Før start - verifiser at servere kjører
curl http://localhost:4000/health
curl http://localhost:3000

# Start med auto-YES modus
# Claude vil jobbe gjennom sprint 1-4 automatisk
```

---

## Suksesskriterier

- [ ] Sprint 1: Alle 5 TODO-fixes implementert
- [ ] Sprint 2: Dashboard viser live data
- [ ] Sprint 3: Treningslogging fungerer end-to-end
- [ ] Sprint 4: ESLint warnings redusert med 50%+

---

## Notater

- Prioriter stabilitet over nye features
- Hopp over oppgaver som krever store arkitekturendringer
- Commit etter hver sprint
- Test etter hver større endring
