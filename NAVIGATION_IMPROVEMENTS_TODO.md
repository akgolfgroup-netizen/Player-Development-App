# TIER Golf Academy - Navigasjons- og UX-forbedringer

**Opprettet**: 2026-01-08
**Status**: Planlegging
**Estimat totalt**: 2-3 uker

---

## 🎯 PRIORITERING

Marker med `[X]` for å godkjenne, `[-]` for å vurdere, `[ ]` for å utsette

---

## TIER 1: KRITISKE FORBEDRINGER (Uke 1)

### 1. Video-funksjoner - Konsolider til én hub
**Status**: [ ] Ikke startet
**Prioritet**: Høy
**Estimat**: 1-2 dager

**Problem**:
- Video-funksjonalitet spredt over 3 separate URLs
- `/trening/videoer` - Video bibliotek
- `/trening/video-sammenligning` - Sammenligning
- `/trening/video-annotering` - Annotasjon

**Løsning**:
Konsolider til `/trening/videoer` hub med 3 tabs:
- Tab 1: Oversikt (bibliotek)
- Tab 2: Sammenligning (compare)
- Tab 3: Annotasjon (markup)

**Dine kommentarer**:
```
[SKRIV DINE TANKER HER]
- Hvilken tab skal være default?
- Skal vi beholde eksisterende URLs som redirects?
```

---

### 2. Teknisk Plan - Fjern duplikat
**Status**: [ ] Ikke startet
**Prioritet**: Høy
**Estimat**: 0.5 dag

**Problem**:
- `/bevis` - Mine teknisk plan
- `/trening/teknikkplan` - Teknikkplan
- SAMME funksjonalitet, 2 steder!

**Løsning A**: Bruk "Bevis" som primær, fjern "Teknikkplan"
**Løsning B**: Bruk "Teknikkplan" som primær, fjern "Bevis"

**Beslutning trengs**:
```
[ ] Løsning A - Behold "Bevis"
[ ] Løsning B - Behold "Teknikkplan"

Begrunnelse:
[SKRIV BEGRUNNELSE HER]
```

---

### 3. Turneringer - Konsolider til tabs
**Status**: [ ] Ikke startet
**Prioritet**: Medium
**Estimat**: 1 dag

**Problem**:
- `/plan/turneringer` - Alle turneringer
- `/plan/turneringer/mine` - Mine turneringer
- `/plan/turneringsforberedelse` - Forberedelse

**Løsning**:
Gjør `/plan/turneringer` til hub med tabs:
- Tab 1: Alle turneringer
- Tab 2: Mine turneringer
- Tab 3: Forberedelse

**Dine kommentarer**:
```
[SKRIV DINE TANKER HER]
- Er dette riktig gruppering?
- Skal "Forberedelse" være en tab eller egen side per turnering?
```

---

### 4. Profil - Edit som modal, ikke separat side
**Status**: [ ] Ikke startet
**Prioritet**: Lav
**Estimat**: 0.5 dag

**Problem**:
- `/mer/profil` - View profil
- `/mer/profil/rediger` - Edit profil (separat URL)

**Løsning**:
Gjør "Rediger" til en modal dialog istedenfor separat side

**Godkjenning**:
```
[ ] Ja, gjør edit til modal
[ ] Nei, behold separat side

Begrunnelse:
[SKRIV BEGRUNNELSE HER]
```

---

## TIER 2: VIKTIGE FORBEDRINGER (Uke 2)

### 5. Reorganiser "MER"-området
**Status**: [ ] Ikke startet
**Prioritet**: Høy
**Estimat**: 2-3 dager

**Problem**:
"Mer"-området har 30+ items uten klar struktur:
- Profil (3 items)
- Kommunikasjon (3 items)
- **Ressurser (8 items)** ← For bredt!
- Innstillinger (4 items)
- Administrasjon (3 items)

**Ressurser subseksjon inneholder**:
- Kunnskapsbase
- Notater
- Baner & Vær
- AI Treningshistorikk
- Samlinger
- Eksporter data
- Arkiv
- Betaling & Fakturering

**Løsning A - MINIMAL** (Split Ressurser):
```
Ressurser → Data (3):
  - Eksporter data
  - Arkiv
  - AI Treningshistorikk

Ressurser → Kunnskap (3):
  - Kunnskapsbase
  - Notater
  - Baner & Vær

Ressurser → System (2):
  - Samlinger
  - Betaling & Fakturering
```

**Løsning B - AGGRESSIV** (Flytt til andre områder):
```
Notater → Tilgjengelig overalt (quick-access)
Kunnskapsbase → Eget "Utdanning" område/hub
Samlinger → /trening (treningssamlinger)
Baner & Vær → /plan (planlegging-relatert)
AI Historikk → Integrert i AI Coach panel
Eksporter/Arkiv → Beholdes i Mer
Betaling → Beholdes i Mer
```

**Beslutning trengs**:
```
[ ] Løsning A - Minimal (split i 3 subseksjoner)
[ ] Løsning B - Aggressiv (flytt til andre områder)
[ ] Løsning C - Hybrid (beskriv under)

Din løsning:
[SKRIV DIN TILNÆRMING HER]
```

---

### 6. Testing vs Statistikk - Klarere navnegiving
**Status**: [ ] Ikke startet
**Prioritet**: Medium
**Estimat**: 0.5 dag

**Problem**:
- `/trening/testing` - Log og se tester
- `/analyse/tester` - Test-analyse
- Forvirring: Er testing = stats?

**Løsning**:
Klarere navnegiving og beskrivelser:
- `/trening/testing` → "Registrer tester" (unchanged)
- `/analyse/tester` → "Testing-analyse" (klarere)
- Legg til beskrivelse i nav: "Logg nye testresultater" vs "Analyser test-progresjon"

**Godkjenning**:
```
[ ] Ja, gjør navnegiving klarere
[ ] Nei, beholdes som nå

Forslag til alternativ navnegiving:
[SKRIV FORSLAG HER]
```

---

### 7. Quick Actions - Legg til "Book trening"
**Status**: [ ] Ikke startet
**Prioritet**: Medium
**Estimat**: 0.5 dag

**Problem**:
Booking ligger under `/plan/booking` - 2 klikk unna

**Løsning**:
Legg til "Book trening" som quick-action på Dashboard for raskere tilgang

**Godkjenning**:
```
[ ] Ja, legg til quick-action
[ ] Nei, ikke nødvendig

Andre quick-actions som burde legges til:
[SKRIV FORSLAG HER]
```

---

## TIER 3: NIS (Nice to have) - (Uke 3+)

### 8. Personaliserte Quick Actions
**Status**: [ ] Ikke startet
**Prioritet**: Lav
**Estimat**: 2 dager

**Konsept**:
Vis kun 4 mest brukte quick-actions basert på brukeradferd istedenfor 8+ statiske

**Godkjenning**:
```
[ ] Ja, implementer personalisering
[ ] Nei, behold statiske actions
```

---

### 9. Slett gamle navigasjonsversjoner
**Status**: [ ] Ikke startet
**Prioritet**: Lav
**Estimat**: 0.5 dag

**Mål**:
Rydd opp i kodebasen:
- Slett `/config/player-navigation-v2.ts`
- Slett `/config/coach-navigation.ts` (v2)
- Behold kun v3 og v4

**Godkjenning**:
```
[ ] Ja, slett v2
[ ] Nei, behold inntil videre
```

---

### 10. Context-aware shortcuts
**Status**: [ ] Ikke startet
**Prioritet**: Lav
**Estimat**: 3 dager

**Konsept**:
Vis relevante shortcuts basert på hvor i appen brukeren er:
- I Trening-hub: Vis "Logg økt", "Se plan"
- I Analyse-hub: Vis "Sammenlign", "Se tester"
- I Plan-hub: Vis "Book tid", "Se kalender"

**Godkjenning**:
```
[ ] Ja, implementer context-aware shortcuts
[ ] Nei, ikke prioritert nå
```

---

## 📋 IMPLEMENTERINGSREKKEFØLGE

Anbefalt rekkefølge basert på impact vs effort:

1. ✅ **Video-konsolidering** (høy impact, medium effort)
2. ✅ **Teknisk plan duplikat** (høy impact, lav effort)
3. ✅ **Mer-område reorganisering** (høy impact, høy effort)
4. ⚠️ **Turneringer tabs** (medium impact, medium effort)
5. ⚠️ **Testing navnegiving** (medium impact, lav effort)
6. ⚠️ **Quick actions** (medium impact, lav effort)
7. 📦 **Profil modal** (lav impact, lav effort)
8. 📦 **Personalisering** (lav impact, høy effort)

---

## 📝 NOTATER OG KOMMENTARER

**Legg til dine generelle kommentarer her**:

```
[DINE KOMMENTARER]

Eksempel:
- Jeg vil prioritere X før Y fordi...
- Ikke sikker på om vi trenger Z funksjonalitet
- Kan vi vurdere å legge til ABC?
```

---

## 🚀 NESTE STEG

1. **Gjennomgå denne listen** - Marker prioriteringer
2. **Legg til kommentarer** - Skriv dine tanker
3. **Gi beskjed** - Si fra når du er klar for implementering
4. **Jeg implementerer** - Jeg tar de godkjente endringene én etter én

---

**Sist oppdatert**: 2026-01-08
**Neste review**: [SETT DATO]
