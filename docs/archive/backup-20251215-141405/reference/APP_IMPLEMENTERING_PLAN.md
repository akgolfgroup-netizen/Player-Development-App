# APP IMPLEMENTERING - PLAN
**Fra JSX-filer til fungerende app**
**Dato**: 14. desember 2025

---

## 🎯 MÅL

**Nåværende status**: 9 JSX-filer i Screens/
**Ønsket status**: Fungerende app du kan teste på telefon/nettleser

---

## 📊 NÅVÆRENDE SITUASJON

### Hva du har:
```
Screens/
├── Aarsplan.jsx ✅
├── Kalender.jsx ✅
├── Testprotokoll.jsx ✅
├── Treningsprotokoll.jsx ✅
├── AKGolfDashboard.jsx ✅
├── ak_golf_brukerprofil_onboarding.jsx ✅
├── utviklingsplan_b_nivaa.jsx ✅
└── kategori_system_oversikt.jsx ✅
```

### Hva som mangler:
```
❌ React/React Native prosjektstruktur
❌ Navigation mellom skjermer
❌ package.json med dependencies
❌ Build-oppsett
❌ App-container/wrapper
```

---

## 🎨 3 ALTERNATIVER

### Sammenligning:

| Alternativ | Platform | Oppsett-tid | Se på telefon | Se i nettleser | Kompleksitet | Anbefalt |
|------------|----------|-------------|---------------|----------------|--------------|----------|
| **1. Expo (React Native)** | iOS/Android | 15 min | ✅ Ja (umiddelbart) | ⚠️ Limited | ⭐⭐ Middels | ✅ **JA** |
| **2. Next.js (Web)** | Web/PWA | 10 min | ⚠️ Via browser | ✅ Ja | ⭐ Enkel | ⚠️ Hvis web-fokus |
| **3. React Native CLI** | iOS/Android | 2 timer | ✅ Ja | ❌ Nei | ⭐⭐⭐⭐ Kompleks | ❌ Ikke anbefalt |

**Min anbefaling**: **Expo (React Native)** - Best balanse mellom hastighet og native app-opplevelse.

---

## ✅ ANBEFALT: EXPO (REACT NATIVE)

### Hvorfor Expo?

```
✅ Se appen på iPhone/Android på 15 minutter
✅ Hot reload (endringer vises umiddelbart)
✅ Ingen Xcode/Android Studio nødvendig (til å begynne med)
✅ Gratis
✅ Enkel å dele med andre (QR-kode)
✅ Enkelt å deploye senere (TestFlight/Play Store)
```

---

## 📋 STEG-FOR-STEG PLAN

### **FASE 1: QUICK WIN (15 minutter)** - Se appen i dag!

#### Steg 1.1: Installer nødvendig programvare (5 min)

```bash
# 1. Installer Node.js (hvis ikke allerede)
# Last ned fra: https://nodejs.org (LTS version)

# 2. Verifiser installasjon
node --version  # Skal vise v18.x eller nyere
npm --version   # Skal vise 9.x eller nyere

# 3. Installer Expo CLI
npm install -g expo-cli

# 4. Last ned Expo Go app på telefon
# iOS: App Store → søk "Expo Go"
# Android: Play Store → søk "Expo Go"
```

#### Steg 1.2: Opprett Expo-prosjekt (3 min)

```bash
# Naviger til parent-mappen
cd "/Users/anderskristiansen/Library/Mobile Documents/com~apple~CloudDocs/00. Inbox"

# Opprett nytt Expo-prosjekt
npx create-expo-app AK-Golf-Academy-App

# Gå inn i prosjektet
cd AK-Golf-Academy-App

# Test at det fungerer
npx expo start
```

**Resultat**: Du skal se en QR-kode i terminalen.

#### Steg 1.3: Se appen på telefon (2 min)

```
1. Åpne Expo Go app på telefonen
2. Skann QR-koden fra terminalen
3. Appen lastes og kjører på telefonen!
4. Se default Expo-skjermen
```

**🎉 Suksess**: Du har nå en fungerende app på telefonen!

#### Steg 1.4: Importer din første skjerm (5 min)

```bash
# Kopier en skjerm til app-prosjektet
cp "../IUP_Master_Folder/Screens/AKGolfDashboard.jsx" "./components/Dashboard.jsx"
```

**Rediger `App.js`**:
```jsx
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Dashboard from './components/Dashboard';

export default function App() {
  return (
    <View style={styles.container}>
      <Dashboard />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFCF8',
  },
});
```

**Lagre** → Appen oppdateres automatisk på telefonen! 🎉

---

### **FASE 2: LEGG TIL NAVIGATION (1 time)**

#### Steg 2.1: Installer React Navigation (5 min)

```bash
npm install @react-navigation/native
npm install @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
```

#### Steg 2.2: Opprett navigasjonsstruktur (10 min)

**Opprett `navigation/AppNavigator.js`**:
```jsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Importer dine skjermer
import Dashboard from '../components/Dashboard';
import Aarsplan from '../components/Aarsplan';
import Testprotokoll from '../components/Testprotokoll';
import Treningsprotokoll from '../components/Treningsprotokoll';
import Kalender from '../components/Kalender';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Dashboard') iconName = 'home';
            else if (route.name === 'Årsplan') iconName = 'calendar';
            else if (route.name === 'Test') iconName = 'checkmark-circle';
            else if (route.name === 'Trening') iconName = 'barbell';
            else if (route.name === 'Kalender') iconName = 'today';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#1A3D2E',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen name="Årsplan" component={Aarsplan} />
        <Tab.Screen name="Test" component={Testprotokoll} />
        <Tab.Screen name="Trening" component={Treningsprotokoll} />
        <Tab.Screen name="Kalender" component={Kalender} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

#### Steg 2.3: Oppdater App.js (2 min)

```jsx
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return <AppNavigator />;
}
```

#### Steg 2.4: Kopier alle skjermer (5 min)

```bash
# Kopier alle P1-skjermer
cp ../IUP_Master_Folder/Screens/Aarsplan.jsx ./components/
cp ../IUP_Master_Folder/Screens/Kalender.jsx ./components/
cp ../IUP_Master_Folder/Screens/Testprotokoll.jsx ./components/
cp ../IUP_Master_Folder/Screens/Treningsprotokoll.jsx ./components/
cp ../IUP_Master_Folder/Screens/AKGolfDashboard.jsx ./components/Dashboard.jsx
```

#### Steg 2.5: Juster imports i hver fil (10 min per fil)

JSX-filene dine bruker sannsynligvis standard React-komponenter. Endre til React Native:

```jsx
// ❌ Fjern (web):
import { View, Text } from 'react';

// ✅ Bytt til (native):
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
```

**🎉 Resultat**: Nå har du en fungerende app med 5 skjermer og navigation!

---

### **FASE 3: DESIGN & STYLING (2 timer)**

#### Steg 3.1: Implementer design system (30 min)

**Opprett `constants/theme.js`**:
```jsx
export const Colors = {
  forest: '#1A3D2E',
  foam: '#F5F7F6',
  ivory: '#FDFCF8',
  accent: '#2D5F4C',
};

export const Typography = {
  fontFamily: 'Inter',
  sizes: {
    h1: 32,
    h2: 24,
    h3: 20,
    body: 16,
    small: 14,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
```

#### Steg 3.2: Legg til custom fonts (20 min)

```bash
# Last ned Inter font
# https://fonts.google.com/specimen/Inter

# Legg i assets/fonts/

# Installer expo-font
npx expo install expo-font
```

**Oppdater `App.js`**:
```jsx
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
  });

  if (!fontsLoaded) return null;
  SplashScreen.hideAsync();

  return <AppNavigator />;
}
```

#### Steg 3.3: Bruk theme i komponenter (1 time)

**Eksempel - Dashboard.jsx**:
```jsx
import { Colors, Typography, Spacing } from '../constants/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ivory,
    padding: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.h1,
    fontFamily: 'Inter-Bold',
    color: Colors.forest,
    marginBottom: Spacing.lg,
  },
});
```

---

### **FASE 4: BACKEND & DATA (3 timer)**

#### Steg 4.1: Sett opp data-struktur (30 min)

**Opprett `data/players.json`**:
```json
{
  "players": [
    {
      "id": "1",
      "name": "Test Spiller",
      "category": "D",
      "age": 16,
      "averageScore": 75.2,
      "clubspeed": 93
    }
  ]
}
```

#### Steg 4.2: Implementer Context API for state (1 time)

**Opprett `context/AppContext.js`**:
```jsx
import React, { createContext, useState } from 'react';
import playersData from '../data/players.json';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [players, setPlayers] = useState(playersData.players);
  const [selectedPlayer, setSelectedPlayer] = useState(players[0]);

  return (
    <AppContext.Provider value={{
      players,
      selectedPlayer,
      setSelectedPlayer
    }}>
      {children}
    </AppContext.Provider>
  );
}
```

**Oppdater `App.js`**:
```jsx
import { AppProvider } from './context/AppContext';

export default function App() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}
```

#### Steg 4.3: Bruk data i komponenter (1 time)

**Eksempel - Dashboard.jsx**:
```jsx
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Dashboard() {
  const { selectedPlayer } = useContext(AppContext);

  return (
    <View>
      <Text>{selectedPlayer.name}</Text>
      <Text>Kategori: {selectedPlayer.category}</Text>
      <Text>Snittscore: {selectedPlayer.averageScore}</Text>
    </View>
  );
}
```

#### Steg 4.4: Integrer med Notion API (valgfritt, 30 min)

```bash
npm install @notionhq/client
```

**Opprett `services/notionService.js`**:
```jsx
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function getPlayers() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });
  return response.results;
}
```

---

### **FASE 5: TESTING & DEPLOYMENT (2 timer)**

#### Steg 5.1: Test på flere enheter (30 min)

```
✅ Test på iPhone (via Expo Go)
✅ Test på Android (via Expo Go)
✅ Test på iPad (større skjerm)
✅ Test på simulator (Xcode/Android Studio)
```

#### Steg 5.2: Bygg standalone app (30 min)

```bash
# Konfigurer app.json
{
  "expo": {
    "name": "AK Golf Academy",
    "slug": "ak-golf-academy",
    "version": "1.0.0",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "backgroundColor": "#1A3D2E"
    }
  }
}

# Bygg iOS app
eas build --platform ios

# Bygg Android app
eas build --platform android
```

#### Steg 5.3: Deploy til TestFlight (30 min)

```bash
# Registrer for Apple Developer Program ($99/år)
# https://developer.apple.com

# Konfigurer EAS
npm install -g eas-cli
eas login
eas build:configure

# Submit til TestFlight
eas submit --platform ios
```

#### Steg 5.4: Inviter testere (30 min)

```
1. Gå til App Store Connect
2. TestFlight → Internal Testing
3. Legg til epost til testere
4. De får invitasjon via epost
5. Installer TestFlight app → Last ned appen
```

---

## 📊 TIDSESTIMAT TOTALT

| Fase | Beskrivelse | Tid | Prioritet |
|------|-------------|-----|-----------|
| **Fase 1** | Quick win - se app i dag | 15 min | 🔴 Kritisk |
| **Fase 2** | Navigation mellom skjermer | 1 time | 🔴 Kritisk |
| **Fase 3** | Design & styling | 2 timer | 🟡 Viktig |
| **Fase 4** | Backend & data | 3 timer | 🟡 Viktig |
| **Fase 5** | Testing & deployment | 2 timer | 🟢 Valgfritt |

**TOTALT**: 8.25 timer (spread over 2-3 dager)

---

## ✅ ANBEFALT ARBEIDSPLAN

### **DAG 1 (Lørdag - 2 timer)**

```
09:00 - 09:15  Fase 1.1-1.3: Installer Expo, se default app
09:15 - 09:30  Fase 1.4: Importer Dashboard
09:30 - 10:30  Fase 2: Legg til navigation og alle 5 skjermer
10:30 - 11:00  Pause ☕
11:00 - 12:00  Fase 3.1-3.2: Implementer design system

RESULTAT: Fungerende app med 5 skjermer og navigation
```

### **DAG 2 (Søndag - 4 timer)**

```
10:00 - 11:00  Fase 3.3: Style alle komponenter
11:00 - 12:00  Fase 4.1-4.2: Data-struktur og Context API
12:00 - 13:00  Lunsj 🍽️
13:00 - 15:00  Fase 4.3-4.4: Integrer data i komponenter

RESULTAT: Fullt stylet app med ekte data
```

### **DAG 3 (Mandag - valgfritt, 2 timer)**

```
18:00 - 18:30  Fase 5.1: Test på flere enheter
18:30 - 19:00  Fase 5.2: Bygg standalone app
19:00 - 20:00  Fase 5.3-5.4: Deploy til TestFlight

RESULTAT: App klar for testing med spillere/trenere
```

---

## 🎯 MILEPÆLER

### Milepæl 1: PROTOTYPE (Dag 1)
```
✅ Se appen på telefon
✅ Navigation mellom 5 skjermer
✅ Design system implementert
```

### Milepæl 2: BETA (Dag 2)
```
✅ Alle komponenter stylet riktig
✅ Ekte data fra JSON/Notion
✅ Fungerer smooth på iOS/Android
```

### Milepæl 3: PILOT (Dag 3)
```
✅ Standalone app bygget
✅ Testet på 3+ enheter
✅ Delt med 5-10 testere via TestFlight
```

---

### **FASE 6: BOOKING & KALENDERSYSTEM (6 timer)** 🆕

Du har allerede et komplett booking- og kalendersystem! La oss integrere det.

#### Steg 6.1: Backend-oppsett (2 timer)

**Følg BACKEND_SETUP_GUIDE.md** (ny fil):

```bash
# 1. Opprett Supabase-prosjekt (gratis)
→ Gå til https://supabase.com
→ Opprett nytt prosjekt: "AK Golf Academy"

# 2. Kjør database-migrering
→ Bruk SQL Editor i Supabase
→ Kjør database_setup.sql (ny fil)
→ Verifiser at 13 tabeller er opprettet

# 3. Konfigurer miljøvariabler
→ Legg til SUPABASE_URL og SUPABASE_ANON_KEY
```

#### Steg 6.2: Installer Supabase-klient (15 min)

```bash
npm install @supabase/supabase-js

# Opprett services/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### Steg 6.3: Importer kalendersystem (1 time)

```bash
# Kopier React Native-versjon til prosjektet
cp ../IUP_Master_Folder/Screens/Kalender_Native.jsx ./components/

# Eller bruk eksisterende Kalender.jsx og tilpass
```

**Tilpass for React Native**:
- Erstatt `lucide-react` med `@expo/vector-icons`
- Bruk `ScrollView` i stedet for `overflow-auto`
- Bruk React Native `Pressable` i stedet for HTML `<button>`

#### Steg 6.4: Koble til backend (2 timer)

**Opprett `services/calendarService.js`**:
```jsx
import { supabase } from './supabase';

export async function fetchEvents(startDate, endDate) {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      participants:event_participants(
        player:players(*)
      )
    `)
    .gte('start_time', startDate)
    .lte('start_time', endDate);

  return data;
}

export async function createEvent(event) {
  const { data, error } = await supabase
    .from('events')
    .insert(event)
    .select();

  return data;
}
```

**Oppdater Kalender-komponenten**:
```jsx
import { fetchEvents } from '../services/calendarService';

function Kalender() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, [currentDate]);

  async function loadEvents() {
    const data = await fetchEvents(startOfMonth, endOfMonth);
    setEvents(data);
  }

  // ... resten av komponenten
}
```

#### Steg 6.5: Implementer booking-funksjonalitet (30 min)

```jsx
async function bookTrainingSession(playerId, coachId, startTime) {
  // 1. Opprett event
  const event = await createEvent({
    title: 'Individuell trening',
    event_type: 'individual_training',
    start_time: startTime,
    end_time: addHours(startTime, 1.5),
    coach_id: coachId
  });

  // 2. Legg til deltaker
  await supabase.from('event_participants').insert({
    event_id: event.id,
    player_id: playerId,
    status: 'confirmed'
  });

  // 3. Send varsling
  await sendNotification(playerId, 'Trening bekreftet!');
}
```

#### Steg 6.6: Realtime-oppdateringer (30 min)

```jsx
// Subscribe til kalender-endringer
useEffect(() => {
  const subscription = supabase
    .channel('calendar-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'events'
    }, (payload) => {
      console.log('Event updated:', payload);
      loadEvents(); // Refresh
    })
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

---

## 📊 OPPDATERT TIDSESTIMAT

| Fase | Beskrivelse | Tid | Status |
|------|-------------|-----|--------|
| **Fase 1** | Quick win - se app | 15 min | 🔴 Kritisk |
| **Fase 2** | Navigation | 1 time | 🔴 Kritisk |
| **Fase 3** | Design & styling | 2 timer | 🟡 Viktig |
| **Fase 4** | Backend & data | 3 timer | 🟡 Viktig |
| **Fase 5** | Testing & deployment | 2 timer | 🟢 Valgfritt |
| **Fase 6** | **Booking & kalender** 🆕 | **6 timer** | **🟡 Viktig** |

**TOTALT**: 14.25 timer (3-4 dager)

---

## ✅ OPPDATERT ARBEIDSPLAN

### **DAG 1 (Lørdag - 3 timer)**

```
09:00 - 09:15  Fase 1: Installer Expo, se default app
09:15 - 10:30  Fase 2: Navigation og alle P1-skjermer
10:30 - 11:00  Pause ☕
11:00 - 12:00  Fase 3.1-3.2: Design system
12:00 - 12:30  Fase 6.1: Backend-oppsett (Supabase)

RESULTAT: App med 9 skjermer + database klar
```

### **DAG 2 (Søndag - 5 timer)**

```
10:00 - 11:00  Fase 3.3: Style komponenter
11:00 - 12:00  Fase 4.1-4.2: Context API
12:00 - 13:00  Lunsj 🍽️
13:00 - 14:30  Fase 6.2-6.4: Kalender + backend-integrasjon
14:30 - 15:30  Fase 6.5-6.6: Booking + realtime

RESULTAT: Fullstendig fungerende app med booking
```

### **DAG 3 (Mandag - 2 timer, valgfritt)**

```
18:00 - 20:00  Fase 5: TestFlight deployment

RESULTAT: Beta-testing med spillere/trenere
```

---

## 🚨 POTENSIELLE PROBLEMER & LØSNINGER

### Problem 1: JSX-filene bruker web-komponenter
**Symptom**: `<div>`, `<span>`, `className` i stedet for React Native
**Løsning**:
```bash
# Søk og erstatt i alle filer:
<div> → <View>
<span> → <Text>
className= → style=
```

### Problem 2: Styling fungerer ikke
**Symptom**: CSS-klasser fungerer ikke i React Native
**Løsning**: Bruk StyleSheet.create()
```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  }
});
```

### Problem 3: Ikoner mangler
**Symptom**: Lucide-ikoner ikke tilgjengelig
**Løsning**: Bruk @expo/vector-icons
```jsx
import { Ionicons } from '@expo/vector-icons';
<Ionicons name="home" size={24} color="black" />
```

### Problem 4: Expo Go ikke finner appen
**Symptom**: QR-kode ikke fungerer
**Løsning**:
- Sjekk at telefon og Mac er på samme WiFi
- Bruk `npx expo start --tunnel` for ekstern tilgang

---

## 💡 TIPS & BESTE-PRAKSIS

### 1. Bruk Hot Reload
```
Lagre fil → Appen oppdateres automatisk (2-3 sekunder)
Ingen behov for å restarte!
```

### 2. Console.log for debugging
```jsx
console.log('Player data:', selectedPlayer);
// Se output i terminalen hvor expo kjører
```

### 3. React DevTools
```bash
npx react-devtools
# Koble til app for å inspisere komponenter
```

### 4. Expo Snack (online testing)
```
https://snack.expo.dev
→ Test komponenter direkte i browser
→ Del med andre via link
```

---

## 📚 RESSURSER

### Dokumentasjon:
- **Expo**: https://docs.expo.dev
- **React Navigation**: https://reactnavigation.org
- **React Native**: https://reactnative.dev

### Video-tutorials:
- "Expo in 100 seconds": https://youtu.be/vFW_TxKLyrE
- "React Native Tutorial for Beginners": https://youtu.be/0-S5a0eXPoc

### Communities:
- r/reactnative
- r/expo
- Discord: Expo Community

---

## ✅ QUICK START (TL;DR)

**Hvis du bare vil se appen NÅ (15 min)**:

```bash
# 1. Installer Expo
npm install -g expo-cli

# 2. Opprett prosjekt
cd "/Users/anderskristiansen/Library/Mobile Documents/com~apple~CloudDocs/00. Inbox"
npx create-expo-app AK-Golf-Academy-App
cd AK-Golf-Academy-App

# 3. Start app
npx expo start

# 4. Skann QR-kode med Expo Go på telefon
```

**🎉 Ferdig! Du ser nå appen på telefonen.**

---

## 🎯 NESTE STEG FOR DEG

1. **I DAG (15 min)**: Kjør Quick Start, se default Expo app
2. **I KVELD (2 timer)**: Følg Dag 1-planen, få alle skjermer inn
3. **I MORGEN (4 timer)**: Følg Dag 2-planen, style og data
4. **NESTE UKE**: Test med 5-10 spillere/trenere

---

**LYKKE TIL MED APP-UTVIKLINGEN! 🚀⛳**

*Plan opprettet: 14. desember 2025*
*Estimert tid til fungerende prototype: 2-3 timer*
*Estimert tid til TestFlight beta: 8-10 timer*
