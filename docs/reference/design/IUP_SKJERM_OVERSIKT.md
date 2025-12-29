# AK Golf Academy IUP - Komplett Skjermoversikt

## Prosjektinformasjon
- **Prosjekt:** Individuell Utviklingsplan (IUP) App
- **Klient:** AK Golf Academy × Team Norway Golf
- **Teknologi:** React + Tailwind CSS
- **Totalt antall skjermer:** 14

---

## Design System: Forest Theme v2.1

### Fargepalett
| Token | Hex | Bruk |
|-------|-----|------|
| forest | #10456A | Primær merkefarge |
| forestLight | #2C5F7F | Lysere primær |
| foam | #EDF0F2 | Lys bakgrunn |
| ivory | #EBE5DA | Hovedbakgrunn |
| gold | #C9A227 | Aksent/utmerkelser |
| success | #4A7C59 | Suksess-tilstander |
| warning | #D4A84B | Advarsler |
| error | #C45B4E | Feil |
| charcoal | #1C1C1E | Tekst |
| steel | #8E8E93 | Sekundær tekst |
| mist | #E5E5EA | Kantlinjer |
| cloud | #F2F2F7 | Badges/bakgrunner |

### Delte Komponenter
- **AKLogo:** SVG-basert logo som skalerer
- **Card:** Hvit boks med skygge og runde hjørner
- **Badge:** Status-indikatorer med varianter
- **Avatar:** Initialer eller bilde
- **Button:** Primary/Secondary/Ghost varianter
- **ProgressBar:** Fremdriftsindikator

---

## Skjermoversikt (14 skjermer)

---

### 1. AKGolfDashboard.jsx
**Fil:** `Screens/AKGolfDashboard.jsx`
**Linjer:** 536
**Formål:** Hovedhjemsiden for spilleren

#### Funksjoner:
- Velkomstmelding med spillernavn
- "Dagens fokus"-kort med L-fase, Clubspeed og Setting
- Kommende økter-liste med SessionCard
- Ukesoppgaver med avkryssing
- Statistikk-oversikt (timer, økter)
- Målsetninger med fremdrift
- Periodeoversikt (Utvikle/Vedlikehold/Oppretthold)

#### State:
```javascript
const [activeTab, setActiveTab] = useState('dashboard');
const [tasks, setTasks] = useState([...]);
```

#### Komponenter:
- SessionCard (L-fase, Speed, Setting tags)
- GoalProgressCard
- TaskItem med toggle
- LevelTag, SpeedTag, SettingTag

---

### 2. ak_golf_brukerprofil_onboarding.jsx
**Fil:** `Screens/ak_golf_brukerprofil_onboarding.jsx`
**Linjer:** 1672
**Formål:** 9-stegs spillerregistrering/onboarding

#### 9 Steg:
1. **Personlig informasjon** - Navn, fødselsdato, kjønn
2. **Kontaktinformasjon** - E-post, telefon, adresse
3. **Foresatte** - Obligatorisk under 16 år
4. **Golfprofil** - Klubb, HCP, snittscore, Team Norway status
5. **Skole** - Skoletype (WANG, NTG, etc.), aktiviteter
6. **Fysisk profil** - Høyde, vekt, skadehistorikk
7. **Utstyr** - Treningsfasiliteter, klubbhastighet
8. **Mål** - Kortsiktig/mellomlang/langsiktig
9. **Samtykke** - GDPR, digital signatur

#### Funksjoner:
- Trinn-for-trinn wizard med fremdriftsindikator
- Validering per steg
- Automatisk aldersberegning
- Foresatt-krav under 16 år
- JSON-output generator
- Skoletype med lokasjon-cascade

#### State:
```javascript
const [currentStep, setCurrentStep] = useState(1);
const [formData, setFormData] = useState({...});
const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);
const [isComplete, setIsComplete] = useState(false);
```

---

### 3. utviklingsplan_b_nivaa.jsx
**Fil:** `Screens/utviklingsplan_b_nivaa.jsx`
**Linjer:** 1159
**Formål:** Komplett utviklingsplan med 5 visninger

#### 5 Visninger:
1. **Årsplan** - Periodeoversikt, årshjul, prioriteringstabell
2. **Periodeplan** - 3-ukers syklus, treningskategorier
3. **Månedskalender** - Kalendervisning med økter
4. **Ukeplan** - 7-dagers grid med alle økter
5. **Treningsøkt** - Detaljert øktprotokoll

#### Funksjoner:
- B-nivå spesifikke prioriteringer
- Perioder: Evaluering, Grunnleggende, Spesialisering, Turnering
- L-fase og Clubspeed progresjon per periode
- Ukentlig treningsfordeling
- Øvelsesliste med repetisjon og pyramide

#### State:
```javascript
const [activeView, setActiveView] = useState('årsplan');
const [selectedPeriod, setSelectedPeriod] = useState('grunn');
const [selectedWeek, setSelectedWeek] = useState(45);
const [selectedDay, setSelectedDay] = useState(null);
```

---

### 4. Kalender.jsx
**Fil:** `Screens/Kalender.jsx`
**Linjer:** 608
**Formål:** IUP Kalender med uke- og månedsvisning

#### Funksjoner:
- Periodekort med fremdrift
- Mini månedskalender med sesjons-indikatorer
- Uke-navigasjon
- Ukesrutenett med alle økter
- Detaljvisning for valgt dag
- Økttype-farger og L-fase tags
- Benchmark-markering

#### State:
```javascript
const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 14));
const [selectedDate, setSelectedDate] = useState(14);
const [viewMode, setViewMode] = useState('week');
```

#### Økttyper:
- teknikk, golfslag, spill, konkurranse, fysisk, mental

---

### 5. Aarsplan.jsx
**Fil:** `Screens/Aarsplan.jsx`
**Linjer:** 632
**Formål:** Helårsoversikt med prioriteringer

#### Funksjoner:
- Spillersammendrag med kategori og målscore
- Periodelegend og prioritetsskala
- **Tidslinjevisning:** Vertikal tidslinje med måneder
- **Rutenettvisning:** Kort per måned
- AK parametre (L-fase, Clubspeed, Setting)
- Turneringsmarkering
- Benchmark-uker
- Fem-prosess årsoversikt

#### 12 Måneder Data:
Hver måned har:
- Periode (E/G/S/T)
- Fokusprioriteter (konkurranse, spill, golfslag, teknikk, fysisk)
- Læringsfase, Clubspeed, Setting
- Aktiviteter og turneringer
- Benchmark-uker

#### State:
```javascript
const [selectedMonth, setSelectedMonth] = useState(null);
const [selectedView, setSelectedView] = useState('timeline');
```

---

### 6. Treningsstatistikk.jsx
**Fil:** `Screens/Treningsstatistikk.jsx`
**Linjer:** 670
**Formål:** Dashboard for treningsstatistikk

#### Funksjoner:
- Tidsperiode-velger (uke/måned/kvartal/år)
- **Ukesstatistikk:** Timer, økter, streak
- **Stolpediagram:** Timer per dag
- **Linjediagram:** Treningstimer over tid
- **L-fase progresjon:** L1-L5 med fremdriftsindikatorer
- **Sektordiagram:** Fordeling per område
- **Siste økter:** Liste med detaljer
- **Personlige rekorder:** Beste prestasjoner

#### Treningsområder:
- langspill, innspill, shortgame, putting, fysisk, mental

#### State:
```javascript
const [timeRange, setTimeRange] = useState('week');
const [selectedArea, setSelectedArea] = useState('all');
```

---

### 7. Testresultater.jsx
**Fil:** `Screens/Testresultater.jsx`
**Linjer:** 905
**Formål:** Oversikt over alle testresultater med historikk

#### Funksjoner:
- Benchmark-tidslinje (6 historiske tester)
- Statistikkoversikt (bestått/forbedret/snitt)
- **Radardiagram:** Spillerprofil vs krav
- Kategorifilter
- Utvidbare testkort med historikkgraf
- Kravlinje i grafer
- Eksportfunksjon

#### 10 Eksempeltester:
Driver, 7-jern, Wedge, Putting, Bunker, Benkpress, Markløft, Rotasjonskast, Pressure Putting, Strategi

#### State:
```javascript
const [selectedTest, setSelectedTest] = useState(null);
const [timeRange, setTimeRange] = useState('year');
const [categoryFilter, setCategoryFilter] = useState('all');
```

---

### 8. Trenerteam.jsx
**Fil:** `Screens/Trenerteam.jsx`
**Linjer:** 771
**Formål:** Trenerteam-administrasjon og kommunikasjon

#### 3 Faner:
1. **Team** - Hovedtrener og treneroversikt
2. **Økter** - Kommende treningsøkter med booking
3. **Meldinger** - Meldingsforhåndsvisning med ulest-indikator

#### Funksjoner:
- Hovedtrener-highlight
- Trenerkort med spesialiseringer og sertifiseringer
- Team-statistikk
- TrainerDetail modal med kontaktinfo
- Øktliste med booking-knapp
- Meldingssystem

#### 4 Mock-trenere:
- Hovedtrener, Teknisk trener, Fysisk trener, Mental trener

#### State:
```javascript
const [selectedTrainer, setSelectedTrainer] = useState(null);
const [showDetail, setShowDetail] = useState(false);
const [activeTab, setActiveTab] = useState('team');
```

---

### 9. Målsetninger.jsx
**Fil:** `Screens/Målsetninger.jsx`
**Linjer:** 819
**Formål:** Målsetting og -sporing med SMART-metodikk

#### Funksjoner:
- **6 Kategorier:** Score, Teknikk, Fysisk, Mental, Turnering, Prosess
- **3 Tidsrammer:** Kortsiktig (1-3 mnd), Mellomlang (3-12 mnd), Langsiktig (1-3 år)
- Målkort med fremdriftslinje
- Milepæler med avkryssing
- Visningsmodi (aktive/fullførte/alle)
- CRUD-operasjoner
- Tips-seksjon for SMART-mål

#### State:
```javascript
const [goals, setGoals] = useState([...]);
const [selectedCategory, setSelectedCategory] = useState('all');
const [showModal, setShowModal] = useState(false);
const [editingGoal, setEditingGoal] = useState(null);
const [viewMode, setViewMode] = useState('active');
```

---

### 10. Testprotokoll.jsx
**Fil:** `Screens/Testprotokoll.jsx`
**Linjer:** 743
**Formål:** 20 offisielle Team Norway tester

#### 20 Tester fordelt på 5 kategorier:
- **Golf Shots (7):** Driver avstand, Jern 7, Wedge PEI, Putting, Bunker
- **Teknikk (4):** Klubbfart, Smash Factor, Launch Angle, Spin Rate
- **Fysisk (3):** Benkpress, Markløft, Rotasjonskast
- **Mental (4):** Pressure Putting, Pre-shot rutine, Fokus, MTQ48
- **Strategisk (2):** Klubbvalg, Banestrategi

#### Funksjoner:
- Spillerkort med neste benchmark
- Statistikkort (bestått/forbedret/fokusområder)
- Kategorifilter
- Testkort med resultat vs krav
- Trend-indikator (forbedret/tilbakegang/uendret)
- Utvidet detalj med progresjonslinje

#### State:
```javascript
const [selectedCategory, setSelectedCategory] = useState('all');
const [selectedTest, setSelectedTest] = useState(null);
```

---

### 11. Treningsprotokoll.jsx
**Fil:** `Screens/Treningsprotokoll.jsx`
**Linjer:** 695
**Formål:** Øktbibliotek med interaktiv gjennomføring

#### 6 Treningsøkter:
1. Driver Teknikk - Grunnleggende (L2)
2. Putting Lab - Avstandskontroll (L4)
3. Fysisk - Golf Styrke (L3)
4. Shortgame - Pitch & Chip (L3)
5. Mental - Fokus & Rutiner (L2)
6. Jern Teknikk - L3 Variasjon (L3)

#### Funksjoner:
- Øktbibliotek med kategorifilter
- Økt-header med parametre og fokusområder
- Avspillingskontroller (play/pause/neste)
- Øvelsesliste med avkryssing
- Progresjonsindikator
- L-fase, Speed og Setting tags

#### State:
```javascript
const [selectedSession, setSelectedSession] = useState(null);
const [activeExercise, setActiveExercise] = useState(0);
const [isPlaying, setIsPlaying] = useState(false);
const [completedExercises, setCompletedExercises] = useState([]);
const [selectedCategory, setSelectedCategory] = useState('all');
```

---

### 12. Øvelser.jsx
**Fil:** `Screens/Øvelser.jsx`
**Linjer:** 762
**Formål:** Søkbart øvelsesbibliotek

#### 10 Øvelser:
- Driver Carry Drill, Stock Shot 7-jern, Wedge Distance Control
- Bunker Escape, Lag Putting Gate, Pressure Putting
- Rotary Power Drill, Pre-shot Rutine, Fade/Draw Control
- Chip & Run Variasjon

#### Kategorier:
- langspill, innspill, shortgame, putting, fysisk, mental

#### Funksjoner:
- Søkefelt med filtrering
- L-fase filter dropdown
- Grid/List visningsvalg
- Favoritter med hjerte-toggle
- Øvelseskort med thumbnail, varighet, vanskelighetsgrad
- Detaljmodal med instruksjoner og utstyrsliste
- Start øvelse-knapp

#### State:
```javascript
const [searchQuery, setSearchQuery] = useState('');
const [selectedCategory, setSelectedCategory] = useState('all');
const [selectedLevel, setSelectedLevel] = useState('all');
const [viewMode, setViewMode] = useState('grid');
const [selectedExercise, setSelectedExercise] = useState(null);
const [favorites, setFavorites] = useState([1, 5, 8]);
```

---

### 13. Notater.jsx
**Fil:** `Screens/Notater.jsx`
**Linjer:** 702
**Formål:** Treningsdagbok med refleksjoner

#### 7 Tags:
- trening, turnering, mental, teknikk, mål, refleksjon (+ alle)

#### Funksjoner:
- Søkefelt
- Tag-filter i sidebar
- Statistikk (totalt/denne uken/festet)
- Notat-grid med humør-emoji
- Pin/unpin notater
- Detaljmodal med fullstendig innhold
- Ny notat-modal med tittel, innhold, tags og humør
- Slette-funksjon

#### State:
```javascript
const [searchQuery, setSearchQuery] = useState('');
const [selectedTag, setSelectedTag] = useState('all');
const [selectedNote, setSelectedNote] = useState(null);
const [isEditing, setIsEditing] = useState(false);
const [showNewNote, setShowNewNote] = useState(false);
const [notes, setNotes] = useState([...]);
```

---

### 14. Arkiv.jsx
**Fil:** `Screens/Arkiv.jsx`
**Linjer:** 664
**Formål:** Historiske dokumenter og resultater

#### 4 Mapper per år:
1. **Årsplaner** - Utviklingsplaner
2. **Testresultater** - Benchmark-resultater
3. **Turneringsresultater** - Turneringer med plassering
4. **Målsetninger** - Oppnådde mål

#### 3 År med data:
- 2025 (aktivt år)
- 2024
- 2023

#### Funksjoner:
- Statistikkort (dokumenter/benchmarks/turneringer)
- År-velger
- Søk i arkiv
- Ekspanderbare mapper
- Dokumentliste med metadata
- Vis/Last ned-knapper
- Tidslinje-visning
- Progresjonssammendrag

#### State:
```javascript
const [searchQuery, setSearchQuery] = useState('');
const [selectedYear, setSelectedYear] = useState('2025');
const [expandedFolders, setExpandedFolders] = useState(['planer', 'tester']);
const [selectedDocument, setSelectedDocument] = useState(null);
```

---

## Tekniske Mønstre

### Felles for alle skjermer:
1. **React Functional Components** med useState hooks
2. **Tailwind CSS** for styling
3. **Forest Theme v2.1** design tokens
4. **AKLogo SVG** komponent
5. **Bottom Navigation** for mobil
6. **Card, Badge, Avatar** gjenbrukbare komponenter

### L-fase System (L1-L5):
| Fase | Navn | Farge |
|------|------|-------|
| L1 | Eksponering | #F2F2F7 |
| L2 | Fundamentals | #E5E5EA |
| L3 | Variasjon | #D4E5DB |
| L4 | Timing | #4A7C59 |
| L5 | Automatikk | #10456A |

### Clubspeed System:
- CS0, CS20, CS40, CS60, CS70, CS80, CS100

### Setting System (S1-S10):
- S1: Range perfekt → S10: Høy-innsats turnering

---

## Navigasjonsstruktur

### Hovednavigasjon (5 ikoner):
1. 🏠 Hjem (Dashboard)
2. 📅 Kalender
3. 🎯 Mål / 📝 Trening / 📚 Øvelser (kontekstavhengig)
4. 📊 Stats
5. 👤 Profil

---

## Oppsummering

| # | Skjerm | Linjer | Hovedfunksjon |
|---|--------|--------|---------------|
| 1 | Dashboard | 536 | Hovedhjem med oversikt |
| 2 | Onboarding | 1672 | 9-stegs registrering |
| 3 | Utviklingsplan | 1159 | 5 visninger for plan |
| 4 | Kalender | 608 | Uke/måned kalender |
| 5 | Årsplan | 632 | Årsoversikt |
| 6 | Treningsstatistikk | 670 | Statistikk-dashboard |
| 7 | Testresultater | 905 | Testhistorikk |
| 8 | Trenerteam | 771 | Trenere og kommunikasjon |
| 9 | Målsetninger | 819 | SMART mål |
| 10 | Testprotokoll | 743 | 20 offisielle tester |
| 11 | Treningsprotokoll | 695 | Interaktiv øktgjennomføring |
| 12 | Øvelser | 762 | Øvelsesbibliotek |
| 13 | Notater | 702 | Treningsdagbok |
| 14 | Arkiv | 664 | Historiske dokumenter |

**Totalt:** ~10,338 linjer kode
