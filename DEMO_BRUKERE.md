# Demo Brukere for Presentasjon

## 🎯 Quick Reference

### Coach Bruker
- **Email:** `coach@demo.com`
- **Passord:** `coach123`
- **Navn:** Jørn Johnsen
- **Rolle:** Coach
- **Tilgang:** Alle coach funksjoner, DataGolf statistikk, spilleroversikt

### Spiller Brukere

#### 1. Anders Kristiansen (Kategori A - Lavest handicap)
- **Email:** `anders.kristiansen@demo.com`
- **Passord:** `player123`
- **Handicap:** 2.1
- **Kategori:** A
- **Alder:** 21 år
- **Klubb:** Oslo GK
- **Skole:** WANG Toppidrett Oslo
- **Mål:** Team Norway Junior, Bli profesjonell

#### 2. Caroline Diethelm (Kategori A - Kvinnelig spiller)
- **Email:** `caroline.diethelm@demo.com`
- **Passord:** `player123`
- **Handicap:** 3.2
- **Kategori:** A
- **Alder:** 21 år
- **Klubb:** Oslo GK
- **Skole:** WANG Toppidrett Oslo
- **Mål:** Team Norway Junior, Kvalifisere til landslaget

#### 3. Øyvind Rohjan (Kategori B)
- **Email:** `oyvind.rohjan@demo.com`
- **Passord:** `player123`
- **Handicap:** 4.8
- **Kategori:** B
- **Alder:** 20 år
- **Klubb:** Oslo GK
- **Skole:** WANG Toppidrett Oslo
- **Mål:** Nå kategori A, Forbedre driver presisjon

#### 4. Nils Jonas Lilja (Kategori B)
- **Email:** `nils.lilja@demo.com`
- **Passord:** `player123`
- **Handicap:** 5.2
- **Kategori:** B
- **Alder:** 19 år
- **Klubb:** Oslo GK
- **Skole:** WANG Toppidrett Oslo
- **Mål:** Konsistent ballslag, Forbedre putting

#### 5. Carl Johan Gustavsson (Kategori C)
- **Email:** `carl.gustavsson@demo.com`
- **Passord:** `player123`
- **Handicap:** 8.5
- **Kategori:** C
- **Alder:** 20 år
- **Klubb:** Oslo GK
- **Skole:** WANG Toppidrett Oslo
- **Mål:** Konstant under 80, Forbedre fysikk

#### 6. Demo Player (Standard test-spiller)
- **Email:** `player@demo.com`
- **Passord:** `player123`
- **Handicap:** 5.4
- **Kategori:** B
- **Denne brukeren har mest testdata og DataGolf kobling**

## 📋 Presentasjon Tips

### For å vise Coach Funksjoner:
1. Logg inn som **coach@demo.com**
2. Du har tilgang til:
   - Coach Dashboard (`/coach`)
   - DataGolf Statistikk (`/coach/stats/datagolf`)
   - Spilleroversikt med alle 6 spillere
   - Treningsplaner og notater

### For å vise Spiller Funksjoner:
1. Logg inn som **anders.kristiansen@demo.com** (best for å vise høyt nivå)
2. Eller **player@demo.com** (mest komplett testdata)
3. Du har tilgang til:
   - Dashboard med badges og fremgang
   - Test protokoller
   - Kategorikrav
   - Treningsøkter

## 🔄 Bytte Mellom Brukere Under Demo

1. Klikk på profil-ikonet øverst til høyre
2. Velg "Logg ut"
3. Logg inn med ny bruker

## ✅ Verifiser at Alle Brukere Fungerer

Kjør denne kommandoen for å sjekke at alle demo-brukere er i databasen:

```bash
cd /Users/anderskristiansen/Developer/IUP_Master_V1/apps/api
npx tsx -r dotenv/config -e "
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkDemoUsers() {
  const users = await prisma.user.findMany({
    where: {
      email: { endsWith: '@demo.com' }
    },
    include: {
      player: true,
      coach: true
    }
  });

  console.log('Demo Users:');
  users.forEach(u => {
    console.log(\`- \${u.email} (\${u.role}) - \${u.firstName} \${u.lastName}\`);
  });
}

checkDemoUsers().then(() => process.exit(0));
"
```

## 🎬 Demo Scenario Forslag

### Scenario 1: Coach Workflow
1. Logg inn som **coach@demo.com**
2. Gå til `/coach/stats/datagolf`
3. Vis DataGolf statistikk for alle spillere
4. Sammenlign med PGA tour averages
5. Gå til spiller-detaljer og vis utvikling

### Scenario 2: Spiller Workflow
1. Logg inn som **anders.kristiansen@demo.com**
2. Vis dashboard med badges
3. Gå til kategorikrav og vis SG integrasjon
4. Registrer ny testresultat
5. Vis fremgang i badges

### Scenario 3: Vise Forskjellige Nivåer
1. Logg inn som **Anders** (kategori A, handicap 2.1)
2. Vis høyt prestasjonsnivå
3. Logg ut og inn som **Carl** (kategori C, handicap 8.5)
4. Vis forskjeller i krav og badges
