# Plan: NGF-presentasjon Countdown

**Dato:** 3. januar 2026
**Mål:** NGF-presentasjon 13. januar 2026
**Tid igjen:** 10 dager

---

## PRIORITERT OPPGAVELISTE

### FASE 1: Teknisk stabilisering (3-4. jan)

#### 1.1 Fiks test-database (30 min)
**Problem:** Test-databasen mangler nyeste migreringer
**Løsning:**
```bash
DATABASE_URL="postgresql://iup_golf:dev_password@localhost:5432/iup_golf_test" npx prisma migrate deploy
```

**Manglende kolonner:**
- `breaking_points.test_domain_code`
- `daily_training_assignments.samling_session_id`

#### 1.2 Fiks feilende integrasjonstester (2-4 timer)

| Testfil | Antall feil | Årsak | Prioritet |
|---------|-------------|-------|-----------|
| `auth.test.ts` | 4 | Password reset | Høy |
| `breaking-points.test.ts` | 15+ | DB schema + TypeError | Høy |
| `dashboard.test.ts` | 2 | Coach dashboard | Medium |
| `players.test.ts` | 2 | Weekly summary | Medium |
| `training-plan.test.ts` | ~10 | DB schema | Høy |
| `notes.test.ts` | ~5 | Ukjent | Medium |

**Strategi:**
1. Kjør `prisma migrate deploy` på test-DB
2. Kjør tester på nytt - mange bør passere automatisk
3. Fiks gjenværende TypeError-issues (null checks)

#### 1.3 Verifiser produksjon (1 time)
- [ ] Test alle demo-brukerkontoer på Railway
- [ ] Verifiser kritiske flyter: login, dashboard, øvelser
- [ ] Sjekk at health endpoints svarer

---

### FASE 2: Juridisk forberedelse (4-8. jan)

#### 2.1 Schedule B (DPA) gjennomgang
**Kritisk for NGF**

- [ ] Send til advokat med personvernkompetanse
- [ ] Fokusområder:
  - Samtykke for mindreårige (under 16 år)
  - Databehandleravtale med NGF
  - Rettigheter for sletting
  - Overføring til tredjeparter

#### 2.2 Samtykkeformular
- [ ] Lag digital samtykkeformular
- [ ] Foreldre-verifisering for under-16
- [ ] Integrer i onboarding-flow

#### 2.3 DPIA vurdering
- [ ] Dokumenter om DPIA er nødvendig
- [ ] Hvis ja: Start prosess med Datatilsynet

---

### FASE 3: Presentasjonsmateriell (8-12. jan)

#### 3.1 Keynote/PowerPoint (4-6 timer)
- [ ] Konverter `PRESENTASJON_NGF_13_JANUAR.md` til slides
- [ ] Design med AK Golf branding
- [ ] Inkluder screenshots fra live app

**Struktur:**
1. Introduksjon (2 min)
2. Problem/Løsning (3 min)
3. Live demo (10 min)
4. Teknisk arkitektur (3 min)
5. Personvern & sikkerhet (5 min)
6. Kommersiell modell (3 min)
7. Q&A (10+ min)

#### 3.2 Demo-script (2 timer)
- [ ] Steg-for-steg demo-gjennomgang
- [ ] Backup-plan ved tekniske problemer
- [ ] Screenshots som fallback

#### 3.3 Q&A forberedelser (2 timer)
- [ ] FAQ dokument
- [ ] Potensielle innvendinger og svar
- [ ] Konkurrentanalyse-svar

---

### FASE 4: Kvalitetssikring (10-12. jan)

#### 4.1 Intern gjennomkjøring
- [ ] Full demo med timer
- [ ] Test alle demo-scenarioer
- [ ] Stress-test produksjon

#### 4.2 Backup-systemer
- [ ] Lokalt demo-miljø som backup
- [ ] Offline screenshots/video
- [ ] Printed handouts

---

## DAGLIG PLAN

| Dato | Fokus | Leveranser |
|------|-------|------------|
| **3. jan** | Teknisk | Fiks test-DB, verifiser produksjon |
| **4. jan** | Teknisk | Fiks gjenværende tester |
| **5. jan** | Juridisk | Send DPA til advokat |
| **6. jan** | Juridisk | Samtykkeformular draft |
| **7. jan** | Presentasjon | Start slides |
| **8. jan** | Presentasjon | Ferdigstill slides |
| **9. jan** | Demo | Demo-script |
| **10. jan** | Q&A | FAQ og innvendinger |
| **11. jan** | Gjennomkjøring | Intern test |
| **12. jan** | Buffer | Finpuss |
| **13. jan** | **NGF** | Presentasjon! |

---

## UMIDDELBARE HANDLINGER (i dag)

### Handling 1: Fiks test-database
```bash
cd /Users/anderskristiansen/Developer/IUP_Master_V1/apps/api
DATABASE_URL="postgresql://iup_golf:dev_password@localhost:5432/iup_golf_test" npx prisma migrate deploy
```

### Handling 2: Kjør tester på nytt
```bash
pnpm --filter iup-golf-backend test
```

### Handling 3: Verifiser produksjon
```bash
curl https://iup-golf-backend-production.up.railway.app/health
```

---

## RISIKOFAKTORER

| Risiko | Sannsynlighet | Konsekvens | Mitigering |
|--------|---------------|------------|------------|
| Advokat ikke tilgjengelig | Medium | Høy | Start kontakt umiddelbart |
| Produksjon nede under demo | Lav | Kritisk | Lokalt backup |
| Tekniske problemer i demo | Medium | Høy | Screenshots, video backup |
| Spørsmål om konkurrenter | Høy | Medium | Forbered svar |

---

## SUKSESSKRITERIER

- [ ] 100% tester passerer (eller dokumentert unntak)
- [ ] Juridiske dokumenter godkjent
- [ ] Presentasjon ferdig og øvd
- [ ] Demo testet 3+ ganger
- [ ] Backup-plan klar

---

**Neste steg:** Kjør Handling 1-3 umiddelbart for å stabilisere teknisk fundament.
