# Hard Refresh Instruksjoner - Se Nye Button Farger

Serveren kjører på http://localhost:3000 og har kompilert suksessfullt med nye button stilene.

## 🔄 Slik får du frem de nye fargene:

### Metode 1: Hard Refresh (Anbefalt)
1. Åpne http://localhost:3000 i Chrome
2. Trykk **Cmd + Shift + R** (Mac) eller **Ctrl + Shift + R** (Windows)
3. Dette tvinger nettleseren til å laste ned CSS på nytt

### Metode 2: Clear Cache og Refresh
1. Åpne Developer Tools: **Cmd + Option + I** (Mac) eller **F12** (Windows)
2. Høyreklikk på reload-knappen i nettleseren
3. Velg "Empty Cache and Hard Reload"

### Metode 3: Disable Cache i DevTools
1. Åpne Developer Tools: **Cmd + Option + I**
2. Gå til **Network** tab
3. Huk av "Disable cache"
4. Refresh siden (Cmd + R)

---

## 🎨 Hva du skal se:

### Nye Button Farger (TIER Design System v3.1):

#### Primary Button (default):
- **Bakgrunn**: Gull (#E8A54B - tier-gold)
- **Tekst**: Navy (#0D3B2F)
- **Hover**: Mørkere gull med shadow
- **Eksempel**: "Lagre", "Send", "Logg trening"

#### Outline Button (secondary):
- **Border**: 2px navy border
- **Bakgrunn**: Transparent
- **Hover**: Navy bakgrunn, hvit tekst
- **Eksempel**: "Avbryt", "Tilbake"

#### Destructive Button:
- **Bakgrunn**: Rød (error color)
- **Tekst**: Hvit
- **Eksempel**: "Slett", "Fjern"

#### Success Button:
- **Bakgrunn**: Grønn
- **Tekst**: Hvit
- **Eksempel**: "Fullført", "Godkjent"

#### Ghost Button:
- **Bakgrunn**: Transparent
- **Hover**: Lys grå bakgrunn
- **Eksempel**: Ikon-knapper

---

## 🧪 Test at det virker:

### 1. Login Side
- Gå til http://localhost:3000
- "Logg inn" knappen skal være **gull med navy tekst**

### 2. Dashboard
- Etter innlogging (player@demo.com / player123)
- Alle primære handlings-knapper skal være **gull**
- "Avbryt" knapper skal ha **navy border**

### 3. Årsplan Wizard
- Gå til http://localhost:3000/plan/aarsplan/ny
- "Neste" knapp skal være **gull**
- "Avbryt" / "Tilbake" knapper skal ha **navy border**

---

## ❌ Hvis du fortsatt ikke ser endringer:

### 1. Sjekk Console for errors:
```
Cmd + Option + I → Console tab
Se etter røde feilmeldinger
```

### 2. Sjekk at riktig CSS lastes:
```
Cmd + Option + I → Network tab
Refresh siden
Se at CSS filer lastes (ikke fra cache - skal være "200" eller "304")
```

### 3. Restart Chrome helt:
```
Quit Chrome (Cmd + Q)
Start Chrome på nytt
Gå til localhost:3000
```

### 4. Test i Inkognito Mode:
```
Cmd + Shift + N (ny inkognito-vindu)
Gå til localhost:3000
Dette hopper over all cache
```

---

## 🔍 Debugging:

Hvis du fortsatt har problemer, sjekk dette i Console:
```javascript
// Åpne Console (Cmd + Option + I)
// Skriv inn:
getComputedStyle(document.querySelector('button')).backgroundColor
// Skal returnere: "rgb(232, 165, 75)" for gull knapper
```

---

## ✅ Success Indicators:

Du VET at det virker når du ser:
1. ✅ Gull knapper med navy tekst for primære handlinger
2. ✅ Navy border på outline knapper
3. ✅ Smooth hover effects med scale animation
4. ✅ Consistent farger på tvers av alle sider

---

**Trenger du hjelp?** Si fra om du fortsatt ikke ser endringene!
