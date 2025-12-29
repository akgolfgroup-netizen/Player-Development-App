# 📊 Stats Dashboard - Quick Start Guide

## 🚀 Hvordan Teste den Nye Stats Siden

### 1. Start Serverne

```bash
# Terminal 1: Start Backend
cd /Users/anderskristiansen/IUP_Master_V1/apps/api
npm run dev
# Kjører på http://localhost:3000

# Terminal 2: Start Frontend
cd /Users/anderskristiansen/IUP_Master_V1/apps/web
npm start
# Kjører på http://localhost:3001
```

### 2. Login

1. Gå til http://localhost:3001
2. Login med:
   - Email: `player@demo.com`
   - Password: `player123`

### 3. Åpne Stats Siden

**Metode 1: Via Sidebar**
- Se på sidebar til venstre
- Klikk på "Stats" (med TrendingUp ikon 📈)
- URL: `http://localhost:3001/stats`

**Metode 2: Direkte URL**
- Skriv inn i browser: `http://localhost:3001/stats`

---

## 🎯 Hva du Kan Teste

### Tab 1: Min Statistikk
✅ **Fungerer med demo data**

Sjekk:
- [ ] Stats cards vises (Tester Fullført, Bestått Rate, Overall Persentil)
- [ ] Styrker (Topp 25%) vises med grønne cards
- [ ] Fokusområder (Nederste 25%) vises med orange cards
- [ ] Kategori fremgang vises nederst

### Tab 2: SG Profil
✅ **Fungerer med demo data**

Sjekk:
- [ ] Tour selector (PGA/LPGA/DP World) fungerer
- [ ] SG Total card vises (blå gradient)
- [ ] SG Breakdown vises med 4 komponenter
- [ ] Comparison bars viser spiller vs tour average
- [ ] Oppsummering viser styrker og forbedringområder

### Tab 3: Peer Sammenligning
✅ **Fungerer med demo data**

Sjekk:
- [ ] Test selector (20 tester) fungerer
- [ ] Kategori filter (A-E) fungerer
- [ ] Kjønn filter (M/F) fungerer
- [ ] Box plot vises med player marker
- [ ] Detaljert statistikk vises (Verdi, Persentil, Z-Score, Rangering)
- [ ] Comparison text vises med emoji
- [ ] Peer gruppe statistikk tabell vises

### Tab 4: Tour Benchmark
⚠️ **Placeholder (Fase 2)**

Sjekk:
- [ ] "Coming Soon" banner vises
- [ ] Feature preview vises
- [ ] Implementeringsplan vises

### Tab 5: Live Trends
⚠️ **Placeholder (Fase 3)**

Sjekk:
- [ ] "Coming Soon" banner vises
- [ ] Feature preview vises
- [ ] Implementeringsplan vises

---

## 🧪 Testing Scenarios

### Scenario 1: Tab Switching
1. Åpne Stats siden
2. Klikk på hver tab
3. Verifiser at innholdet endres
4. Sjekk at tabs highlightes korrekt

### Scenario 2: Filter Changes (Peer tab)
1. Gå til Peer Sammenligning tab
2. Endre test (prøv Test 1, 5, 10, 15)
3. Endre kategori (A, B, C)
4. Endre kjønn (M, F, Alle)
5. Verifiser at data oppdateres

### Scenario 3: Tour Selector (SG Profil tab)
1. Gå til SG Profil tab
2. Bytt tour (PGA → LPGA → DP World)
3. Verifiser at comparison values endres

### Scenario 4: Loading States
1. Åpne DevTools Console
2. Refresh siden
3. Sjekk at loading spinner vises
4. Sjekk at data laster etter et par sekunder

### Scenario 5: Error Handling
1. Stopp backend serveren
2. Refresh Stats siden
3. Sjekk at demo data fortsatt vises
4. Sjekk at warning banner vises ("Demo data")

---

## 🐛 Kjente Problemer

### Problem 1: Backend API ikke svar
**Symptom:** Yellow warning banner: "Kunne ikke laste statistikk fra API. Viser demo data."

**Løsning:** Dette er forventet! Backend endpoints eksisterer, men returnerer demo data.
- Dette er IKKE en bug
- Demo data er bevisst design for testing
- Fase 2 vil koble til ekte DataGolf data

### Problem 2: Player ID ikke funnet
**Symptom:** "Ingen data tilgjengelig"

**Løsning:**
1. Sjekk at du er logget inn
2. Sjekk at localStorage har `playerId`
3. Eller bruk `/stats/:playerId` route med en UUID

---

## 📱 Responsive Testing

### Desktop (anbefalt)
- **Optimal opplevelse:** 1400px+ bredde
- Alle tabs vises horisontalt
- Full sidebar

### Tablet (1024px - 1399px)
- Tabs scrolles horisontalt
- Sidebar synlig

### Mobile (< 768px)
- Tabs stacker vertikalt
- Sidebar kollapser
- Mindre charts

---

## 🎨 Visual Design Check

### Color Coding
- **Blå** (90-100%): Eksepsjonell
- **Grønn** (75-90%): Veldig bra
- **Gul** (50-75%): Over gjennomsnitt
- **Orange** (25-50%): Under gjennomsnitt
- **Rød** (0-25%): Forbedringspotensial

### Icons
- 📊 Min Statistikk
- 🎯 SG Profil
- 👥 Peer
- 🏆 Tour (coming soon)
- ⚡ Trends (coming soon)

---

## 🔍 Debugging Tips

### Sjekk Console
```javascript
// Åpne DevTools Console (F12)
// Sjekk for errors
console.log(localStorage.getItem('accessToken'))
console.log(localStorage.getItem('playerId'))
```

### Sjekk Network Tab
```
DevTools → Network → Filter: "api/v1"
- coach-analytics (Min Statistikk)
- peer-comparison (Peer tab)
- datagolf (SG Profil tab)
```

### Sjekk React DevTools
```
Components → Stats → state
- activeTab (hvilken tab er aktiv)
- effectivePlayerId (hvilken player ID brukes)
```

---

## ✅ Acceptance Criteria

### For Beta Launch:
- [x] Alle 5 tabs vises
- [x] Tab switching fungerer
- [x] Demo data vises korrekt
- [x] Loading states fungerer
- [x] Error handling med fallback
- [x] Responsive design
- [x] Navigation link i sidebar
- [x] Build compiles uten warnings

### For Production (Fase 2+):
- [ ] DataGolf API live data
- [ ] Ekte peer comparison data
- [ ] Tour benchmark med live tour stats
- [ ] Historical trends tracking
- [ ] Predictive analytics

---

## 📞 Support

### Hvis noe ikke fungerer:

1. **Sjekk at begge servere kjører**
   ```bash
   lsof -i :3000  # Backend
   lsof -i :3001  # Frontend
   ```

2. **Sjekk browser console for errors**
   - F12 → Console tab

3. **Clear localStorage og refresh**
   ```javascript
   // I browser console:
   localStorage.clear()
   location.reload()
   ```

4. **Rebuild frontend**
   ```bash
   cd /Users/anderskristiansen/IUP_Master_V1/apps/web
   rm -rf node_modules/.cache
   npm run build
   npm start
   ```

---

## 🎉 Success Indicators

Du vet at Stats siden fungerer når:
✅ Alle 5 tabs loader uten errors
✅ Demo data vises i alle tabs
✅ Filters i Peer tab kan endres
✅ Tour selector i SG Profil fungerer
✅ Loading spinner vises ved første load
✅ Navigation link highlightes når på /stats

---

**Happy Testing! 🚀**

Hvis alt fungerer som forventet, er Stats Dashboard klar for beta testing med demo data.
Fase 2 vil koble til ekte DataGolf API for live data.
