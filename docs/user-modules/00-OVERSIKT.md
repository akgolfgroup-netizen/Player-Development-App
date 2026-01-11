# Spiller & Coach Moduler - Prosjektoversikt

> Offline arbeidsmappe for planlegging

## Dokumenter i denne mappen

| Fil | Innhold |
|-----|---------|
| `00-OVERSIKT.md` | Denne filen - innholdsfortegnelse og sammendrag |
| `01-NÅVÆRENDE-STATUS.md` | Analyse av eksisterende brukerroller og funksjoner |
| `02-SPILLER-MODUL.md` | Komplett spesifikasjon for spilleropplevelsen |
| `03-COACH-MODUL.md` | Komplett spesifikasjon for treneropplevelsen |
| `04-ONBOARDING.md` | Registrerings- og oppsettflyt for begge roller |
| `05-TILGANGER-OG-ROLLER.md` | Tilgangsstyring og rollebasert funksjonalitet |
| `06-FEATURE-MATRISE.md` | Detaljert oversikt over features per rolle |
| `07-UX-FLYT.md` | Brukerreiser og interaksjonsflyter |

---

## Rask oversikt

### Eksisterende roller
- **Admin** - Organisasjonsadministrator
- **Coach** - Trener med tilgang til flere spillere
- **Player** - Utøver med personlig dashboard

### Arkitektur
```
User (autentisering)
  │
  ├── Admin → AdminAppShell → Admin features
  │
  ├── Coach → CoachAppShell → Coach features
  │      └── Tilgang til: Spillere, Grupper, Samlinger, Statistikk
  │
  └── Player → PlayerAppShell → Player features
         └── Personlig: Dashboard, Trening, Tester, Mål, Kalender
```

### Nøkkelfunn fra analyse

| Aspekt | Status |
|--------|--------|
| Brukerregistrering | ✅ Fungerer med rollevalg |
| Separate dashboards | ✅ Eksisterer for alle 3 roller |
| Coach-player kobling | ⚠️ Via tenant, ikke eksplisitt tilordning |
| Onboarding | ⚠️ PlayerOnboardingPage eksisterer, men ufullstendig |
| Rollebasert navigasjon | ✅ Separate AppShells |
| Feature-tilgang | ⚠️ Ikke konsekvent implementert |

---

## Hovedmål for modulene

### Spiller-modul
1. **Personlig treningsopplevelse** - Alt sett fra utøverens perspektiv
2. **Enkel dataregistrering** - Logg treninger, tester, turneringer
3. **Fremgangsvisning** - Se egen utvikling over tid
4. **Coach-kommunikasjon** - Motta feedback og planer

### Coach-modul
1. **Spilleroversikt** - Se og administrere alle utøvere
2. **Planlegging** - Lage treningsplaner og årsplaner
3. **Analyse** - Statistikk og fremgang på tvers av spillere
4. **Kommunikasjon** - Sende meldinger og feedback

---

## Anbefalte leserekkefølge

### For å forstå nåværende tilstand (1 time)
1. `01-NÅVÆRENDE-STATUS.md` - Hva som eksisterer
2. `05-TILGANGER-OG-ROLLER.md` - Hvordan roller fungerer

### For å planlegge spillermodul (1 time)
3. `02-SPILLER-MODUL.md` - Feature-spesifikasjon
4. `04-ONBOARDING.md` - Onboarding for spillere

### For å planlegge coach-modul (1 time)
5. `03-COACH-MODUL.md` - Feature-spesifikasjon
6. `06-FEATURE-MATRISE.md` - Sammenligning

### For UX-arbeid (30 min)
7. `07-UX-FLYT.md` - Brukerreiser

---

## Nøkkelbeslutninger som må tas

### 1. Coach-Player kobling
- **Spørsmål:** Hvordan kobles en coach til spillere?
- **Alternativ A:** Alle i samme tenant ser alle
- **Alternativ B:** Eksplisitt tilordning (coach → player)
- **Alternativ C:** Gruppebasert (coach → gruppe → spillere)

### 2. Onboarding-flyt
- **Spørsmål:** Hva må spillere/coaches fylle ut ved registrering?
- **Spiller:** Personlig info, nivå, mål?
- **Coach:** Spesialisering, erfaring, sertifiseringer?

### 3. Invitasjonsflyt
- **Spørsmål:** Hvordan får nye spillere/coaches tilgang?
- **Alternativ A:** Selvregistrering
- **Alternativ B:** Invitasjon fra admin
- **Alternativ C:** Invitasjon fra coach

### 4. Tilgangsnivåer
- **Spørsmål:** Hva kan en coach se av spillerdata?
- **Alt A:** Alt (treninger, tester, mål, personlig info)
- **Alt B:** Kun treningsrelatert (ikke personlig)
- **Alt C:** Konfigurerbart per spiller

---

## Tekniske komponenter

### Eksisterende AppShells
```
src/components/layout/
├── PlayerAppShell.tsx    # Spiller-navigasjon (5 items)
├── CoachAppShell.tsx     # Coach-navigasjon
└── AdminAppShell.tsx     # Admin-navigasjon
```

### Eksisterende features
```
src/features/
├── coach-dashboard/      # Coach startside
├── coach-athletes/       # Spilleroversikt
├── coach-groups/         # Gruppehåndtering
├── coach-stats/          # Statistikk
├── coach-messages/       # Meldinger
├── onboarding/           # Onboarding-sider
│   ├── OnboardingPage.tsx
│   └── PlayerOnboardingPage.tsx
└── ... (mange player-features)
```

### Database-modeller
```prisma
model User {
  role: 'admin' | 'coach' | 'player'
  // Koblet til Player eller Coach via email
}

model Player {
  userId: String?  // Optional kobling til User
  tenantId: String
  onboardingComplete: Boolean
}

model Coach {
  userId: String?  // Optional kobling til User
  tenantId: String
  specializations: String[]
}
```

---

## Implementeringsrekkefølge (anbefalt)

### Fase 1: Fundament (må gjøres først)
1. Definere coach-player kobling i database
2. Oppdatere onboarding-flyt for begge roller
3. Implementere invitasjonsflyt

### Fase 2: Spiller-modul
4. Forbedre PlayerAppShell navigasjon
5. Implementere komplett onboarding
6. Gjennomgå alle player-features for konsistens

### Fase 3: Coach-modul
7. Forbedre CoachAppShell navigasjon
8. Implementere spillertilordning
9. Gjennomgå alle coach-features for konsistens

### Fase 4: Integrasjon
10. Coach-spiller kommunikasjon
11. Delt kalender/planlegging
12. Varsler og notifikasjoner
