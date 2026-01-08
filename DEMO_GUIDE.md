# Demo Guide for Presentasjon

## 🎯 Demo Brukere

### Coach (Jørn Johnsen)
```
Email: coach@demo.com
Passord: coach123
```
**Hva du kan vise:**
- ✅ Coach Dashboard med alle spillere
- ✅ DataGolf statistikk (`/coach/stats/datagolf`)
- ✅ Spilleroversikt og fremgang
- ✅ Treningsplaner og notater

### Spiller (Anders Kristiansen)
```
Email: anders.kristiansen@demo.com
Passord: player123
```
**Profil:**
- Handicap: 2.1
- Kategori: A (høyeste nivå)
- Klubb: Oslo GK
- Skole: WANG Toppidrett Oslo

**Hva du kan vise:**
- ✅ Spiller Dashboard med badges
- ✅ Kategorikrav med SG-integrasjon
- ✅ Test protokoller
- ✅ Fremgang og statistikk

## 📱 Demo Flow Forslag

### 1. Start med Coach (5 min)
1. Logg inn som **coach@demo.com**
2. Gå til `/coach/stats/datagolf`
3. Vis DataGolf statistikk for spillere
4. Sammenlign med PGA tour averages
5. Vis spiller-detaljer

### 2. Bytt til Spiller (5 min)
1. Logg ut (klikk profil → Logg ut)
2. Logg inn som **anders.kristiansen@demo.com**
3. Vis Dashboard med badges
4. Gå til Kategorikrav og vis SG-integrasjon
5. Vis test protokoller og fremgang

### 3. Viktige Features å Vise
- ✅ DataGolf integrasjon (coach view)
- ✅ Strokes Gained konvertering fra PEI
- ✅ Badge systemet
- ✅ Kategorikrav (Test 8-11: Approach, Test 15-16: Putting)
- ✅ Automatisk fremgangsberegning

## 🔧 Før Presentasjonen

### Sjekk at backend og frontend kjører:
```bash
# Terminal 1 - Backend
cd /Users/anderskristiansen/Developer/IUP_Master_V1/apps/api
PORT=4000 npm run dev

# Terminal 2 - Frontend
cd /Users/anderskristiansen/Developer/IUP_Master_V1/apps/web
PORT=3000 npm start
```

### Verifiser at brukerne fungerer:
```bash
bash /tmp/test-demo-users.sh
```

Du skal se:
```
✅ Coach login SUCCESS
✅ Spiller login SUCCESS
```

## ⚠️ Viktig å Huske

1. **Coach må logge inn for DataGolf stats**
   - Spillere har IKKE tilgang til `/coach/stats/datagolf`
   - Du må bruke `coach@demo.com` for denne siden

2. **Test data**
   - Anders Kristiansen har kategori A data
   - player@demo.com har mest komplett testdata og DataGolf kobling

3. **Bytte bruker under demo**
   - Klikk profil-ikon → Logg ut
   - Logg inn med ny bruker

## 🎬 Backup Plan

Hvis du trenger mer testdata, kan du også bruke:
- **player@demo.com** (handicap 5.4, kategori B)
  - Har mest komplett testdata
  - Har DataGolf synkronisering
  - God for å vise badge-systemet

## 📞 Kontakt Info i Demo

Alle spillere:
- Klubb: Oslo GK
- Skole: WANG Toppidrett Oslo
- Coach: Jørn Johnsen

Dette gir en konsistent historie for presentasjonen.

## ✅ Quick Checklist

Før presentasjon:
- [ ] Backend kjører på port 4000
- [ ] Frontend kjører på port 3000
- [ ] Test coach login
- [ ] Test spiller login
- [ ] Åpne browser tabs for begge views
- [ ] Ha denne guiden klar

Lykke til med presentasjonen! 🎉
