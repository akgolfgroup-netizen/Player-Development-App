# Plan: NGF-presentasjon Countdown

**Dato:** 3. januar 2026
**Sist oppdatert:** 3. januar 2026 kl. 09:20
**Mål:** NGF-presentasjon 13. januar 2026
**Tid igjen:** 10 dager

---

## ✅ FASE 1: TEKNISK STABILISERING - FULLFØRT

**Fullført:** 3. januar 2026

### Resultater

| Metrikk | Før | Etter |
|---------|-----|-------|
| Tester pass | 730 | **779** |
| Tester fail | 49 | **0** |
| Pass rate | 94% | **100%** |

### Utførte fikser

| Problem | Løsning |
|---------|---------|
| Test-DB mangler kolonner | `prisma db push` synkroniserte schema |
| Dashboard 404 → 500 | La til player-eksistens-sjekk i `dashboard/index.ts:296` |
| Auth 401 → 400 forventninger | Oppdaterte test-forventninger (400 er korrekt for ugyldig token) |
| Logout body schema mangler | La til body-schema i Fastify route |
| Reset token test feil | Fikset test til å generere egen token (ikke bruke hashet versjon) |
| Field name mismatch | `passwordResetExpiresAt` → `passwordResetExpires` |
| Message assertion | `"sent"` → `"email"` |

### Verifisert

- [x] Test-database synkronisert
- [x] Alle 779 tester passerer
- [x] Produksjon health check OK
  ```json
  {"status":"healthy","uptime":2408s}
  ```

---

## PRIORITERT OPPGAVELISTE

### ~~FASE 1: Teknisk stabilisering (3-4. jan)~~ ✅ FULLFØRT

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
- [ ] Design med TIER Golf branding
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

| Dato | Fokus | Leveranser | Status |
|------|-------|------------|--------|
| **3. jan** | Teknisk | Fiks test-DB, verifiser produksjon | ✅ |
| **4. jan** | ~~Teknisk~~ Juridisk | ~~Fiks gjenværende tester~~ Start DPA-gjennomgang | ⏳ |
| **5. jan** | Juridisk | Send DPA til advokat | ⏳ |
| **6. jan** | Juridisk | Samtykkeformular draft | ⏳ |
| **7. jan** | Presentasjon | Start slides | ⏳ |
| **8. jan** | Presentasjon | Ferdigstill slides | ⏳ |
| **9. jan** | Demo | Demo-script | ⏳ |
| **10. jan** | Q&A | FAQ og innvendinger | ⏳ |
| **11. jan** | Gjennomkjøring | Intern test | ⏳ |
| **12. jan** | Buffer | Finpuss | ⏳ |
| **13. jan** | **NGF** | Presentasjon! | ⏳ |

---

## RISIKOFAKTORER

| Risiko | Sannsynlighet | Konsekvens | Mitigering |
|--------|---------------|------------|------------|
| ~~Tester feiler~~ | ~~Høy~~ | ~~Høy~~ | ✅ Løst |
| Advokat ikke tilgjengelig | Medium | Høy | Start kontakt umiddelbart |
| Produksjon nede under demo | Lav | Kritisk | Lokalt backup |
| Tekniske problemer i demo | Medium | Høy | Screenshots, video backup |
| Spørsmål om konkurrenter | Høy | Medium | Forbered svar |

---

## SUKSESSKRITERIER

- [x] **100% tester passerer** ✅
- [ ] Juridiske dokumenter godkjent
- [ ] Presentasjon ferdig og øvd
- [ ] Demo testet 3+ ganger
- [ ] Backup-plan klar

---

## NESTE STEG

Fase 1 er fullført før plan. Neste prioritet:

1. **Start juridisk fase** - Kontakt advokat for DPA-gjennomgang
2. **Forbered presentasjon** - Kan starte tidligere enn planlagt
3. **Test demo-flow** - Verifiser alle brukerroller i produksjon

---

**Sist oppdatert:** 3. januar 2026 kl. 09:20
