# BACKEND SETUP GUIDE
**AK Golf Academy - Booking & Kalendersystem**
**Dato**: 14. desember 2025

---

## 🎯 MÅL

Sett opp en fullstendig PostgreSQL-database med Supabase for booking- og kalendersystemet.

**Hva du får**:
- ✅ 13 database-tabeller
- ✅ Realtime subscriptions
- ✅ Row Level Security (RLS)
- ✅ REST API auto-generert
- ✅ Gratis hosting (starter-plan)

---

## 📋 TRINN 1: OPPRETT SUPABASE-PROSJEKT (5 min)

### 1.1 Registrer konto
```
1. Gå til https://supabase.com
2. Klikk "Start your project"
3. Sign up med GitHub (anbefalt) eller email
4. Bekreft email
```

### 1.2 Opprett nytt prosjekt
```
Organization: Opprett ny "AK Golf Academy"
Project name: "ak-golf-production"
Database Password: [Generer sterkt passord - LAGRE DETTE!]
Region: Europe West (Stockholm) - nærmest Norge
Pricing Plan: Free tier (gratis)

→ Klikk "Create new project"
→ Vent 2-3 minutter mens databasen settes opp
```

### 1.3 Hent tilkoblingsinformasjon
```
Når prosjektet er klart:
1. Gå til Settings → API
2. Kopier:
   - Project URL (SUPABASE_URL)
   - anon/public key (SUPABASE_ANON_KEY)

Lagre disse i .env-fil:
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📋 TRINN 2: KJØR DATABASE-MIGRERING (10 min)

### 2.1 Åpne SQL Editor
```
1. I Supabase Dashboard → klikk "SQL Editor" i venstre meny
2. Klikk "+ New query"
3. Gi navn: "Initial Migration - AK Golf Booking System"
```

### 2.2 Kjør database_setup.sql

**OBS**: database_setup.sql er opprettet som egen fil (se neste oppgave).

```sql
-- Kopier HELE innholdet fra database_setup.sql
-- Lim inn i SQL Editor
-- Klikk "Run" (nederst til høyre)

→ Du skal se: "Success. No rows returned"
→ Alle 13 tabeller opprettes
```

### 2.3 Verifiser at tabellene er opprettet

```
1. Gå til "Table Editor" i venstre meny
2. Du skal se 13 tabeller:
   ✓ coaches
   ✓ players
   ✓ parents
   ✓ events
   ✓ event_participants
   ✓ tournaments
   ✓ tournament_results
   ✓ tests
   ✓ test_results
   ✓ training_sessions
   ✓ periodization
   ✓ notifications
   ✓ availability
```

---

## 📋 TRINN 3: AKTIVER ROW LEVEL SECURITY (15 min)

### 3.1 Hvorfor RLS?
Row Level Security sikrer at:
- Spillere kun ser sine egne data
- Trenere kun ser sine spillere
- Foreldre kun ser barnas data

### 3.2 Kjør RLS-policies

**Opprett ny SQL-query**:

```sql
-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- ─────────────────────────────────────────────────────────────────────────
-- COACHES
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can view all coaches" ON coaches
    FOR SELECT
    USING (true);

CREATE POLICY "Coaches can update own profile" ON coaches
    FOR UPDATE
    USING (auth.uid() = id);

-- ─────────────────────────────────────────────────────────────────────────
-- PLAYERS
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches see own players" ON players
    FOR SELECT
    USING (
        coach_id = auth.uid()
        OR auth.uid() IN (SELECT id FROM coaches WHERE role = 'head_coach')
    );

CREATE POLICY "Players can view own data" ON players
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Coaches can update own players" ON players
    FOR UPDATE
    USING (coach_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────
-- EVENTS
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches see own events" ON events
    FOR SELECT
    USING (
        coach_id = auth.uid()
        OR created_by = auth.uid()
    );

CREATE POLICY "Players see events they participate in" ON events
    FOR SELECT
    USING (
        id IN (
            SELECT event_id
            FROM event_participants
            WHERE player_id = auth.uid()
        )
    );

CREATE POLICY "Coaches can create events" ON events
    FOR INSERT
    WITH CHECK (auth.uid() IN (SELECT id FROM coaches));

CREATE POLICY "Coaches can update own events" ON events
    FOR UPDATE
    USING (coach_id = auth.uid() OR created_by = auth.uid());

CREATE POLICY "Coaches can delete own events" ON events
    FOR DELETE
    USING (created_by = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────
-- EVENT_PARTICIPANTS
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches see participants in own events" ON event_participants
    FOR SELECT
    USING (
        event_id IN (SELECT id FROM events WHERE coach_id = auth.uid())
    );

CREATE POLICY "Players see own participations" ON event_participants
    FOR SELECT
    USING (player_id = auth.uid());

CREATE POLICY "Coaches can add participants" ON event_participants
    FOR INSERT
    WITH CHECK (
        event_id IN (SELECT id FROM events WHERE coach_id = auth.uid())
    );

-- ─────────────────────────────────────────────────────────────────────────
-- PARENTS
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents see own data" ON parents
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Parents see children events" ON event_participants
    FOR SELECT
    USING (
        player_id IN (
            SELECT id FROM players WHERE parent_id = auth.uid()
        )
    );

-- ─────────────────────────────────────────────────────────────────────────
-- PUBLIC TABLES (alle kan lese)
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view tournaments" ON tournaments FOR SELECT USING (true);

ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view tests" ON tests FOR SELECT USING (true);

-- ─────────────────────────────────────────────────────────────────────────
-- NOTIFICATIONS
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own notifications" ON notifications
    FOR SELECT
    USING (recipient_id = auth.uid());

CREATE POLICY "Users can mark notifications as read" ON notifications
    FOR UPDATE
    USING (recipient_id = auth.uid());
```

**Kjør query** → "Success"

---

## 📋 TRINN 4: SEED DATA (10 min)

### 4.1 Legg til testdata

**Opprett ny SQL-query: "Seed Data"**:

```sql
-- ============================================================================
-- SEED DATA FOR TESTING
-- ============================================================================

-- ─────────────────────────────────────────────────────────────────────────
-- COACHES (2 trenere)
-- ─────────────────────────────────────────────────────────────────────────
INSERT INTO coaches (id, first_name, last_name, email, specializations, role, color) VALUES
('00000000-0000-0000-0000-000000000001', 'Anders', 'Kristiansen', 'anders@akgolf.no', '["teknikk", "mental", "strategi"]', 'head_coach', '#1E4B33'),
('00000000-0000-0000-0000-000000000002', 'Erik', 'Andersen', 'erik@akgolf.no', '["fysisk", "shortgame"]', 'assistant_coach', '#0891B2');

-- ─────────────────────────────────────────────────────────────────────────
-- PLAYERS (6 testspillere)
-- ─────────────────────────────────────────────────────────────────────────
INSERT INTO players (id, first_name, last_name, email, date_of_birth, category, average_score, coach_id, current_period, status) VALUES
('10000000-0000-0000-0000-000000000001', 'Magnus', 'Eriksen', 'magnus@test.no', '2007-05-15', 'B', 70.5, '00000000-0000-0000-0000-000000000001', 'T', 'active'),
('10000000-0000-0000-0000-000000000002', 'Sofie', 'Hansen', 'sofie@test.no', '2008-08-20', 'C', 73.2, '00000000-0000-0000-0000-000000000001', 'S', 'active'),
('10000000-0000-0000-0000-000000000003', 'Oliver', 'Berg', 'oliver@test.no', '2009-03-10', 'D', 75.8, '00000000-0000-0000-0000-000000000002', 'G', 'active'),
('10000000-0000-0000-0000-000000000004', 'Emma', 'Larsen', 'emma@test.no', '2008-11-25', 'C', 72.9, '00000000-0000-0000-0000-000000000001', 'S', 'active'),
('10000000-0000-0000-0000-000000000005', 'Noah', 'Andersen', 'noah@test.no', '2010-06-05', 'E', 77.1, '00000000-0000-0000-0000-000000000002', 'G', 'active'),
('10000000-0000-0000-0000-000000000006', 'Mia', 'Olsen', 'mia@test.no', '2009-09-15', 'D', 76.3, '00000000-0000-0000-0000-000000000002', 'G', 'active');

-- ─────────────────────────────────────────────────────────────────────────
-- EVENTS (5 eksempel-hendelser)
-- ─────────────────────────────────────────────────────────────────────────
INSERT INTO events (id, title, event_type, start_time, end_time, location, coach_id, max_participants, status) VALUES
('20000000-0000-0000-0000-000000000001', 'Magnus - Teknikk: Innspill', 'individual_training', NOW() + INTERVAL '2 days' + INTERVAL '14 hours', NOW() + INTERVAL '2 days' + INTERVAL '15.5 hours', 'GFGK Range', '00000000-0000-0000-0000-000000000001', 1, 'scheduled'),
('20000000-0000-0000-0000-000000000002', 'Gruppetrening - Shortgame', 'group_training', NOW() + INTERVAL '3 days' + INTERVAL '16 hours', NOW() + INTERVAL '3 days' + INTERVAL '18 hours', 'GFGK Shortgame', '00000000-0000-0000-0000-000000000001', 6, 'scheduled'),
('20000000-0000-0000-0000-000000000003', 'Benchmark Test - Uke 46', 'test_session', NOW() + INTERVAL '7 days' + INTERVAL '10 hours', NOW() + INTERVAL '7 days' + INTERVAL '16 hours', 'GFGK Indoor', '00000000-0000-0000-0000-000000000001', 12, 'scheduled'),
('20000000-0000-0000-0000-000000000004', 'NM Junior 2026', 'tournament_result', NOW() + INTERVAL '30 days' + INTERVAL '8 hours', NOW() + INTERVAL '32 days' + INTERVAL '18 hours', 'Miklagard Golf', NULL, 50, 'scheduled'),
('20000000-0000-0000-0000-000000000005', 'Check-in: Sofie', 'player_checkin', NOW() + INTERVAL '5 days' + INTERVAL '15 hours', NOW() + INTERVAL '5 days' + INTERVAL '15.5 hours', 'Kontor', '00000000-0000-0000-0000-000000000001', 1, 'scheduled');

-- ─────────────────────────────────────────────────────────────────────────
-- EVENT_PARTICIPANTS
-- ─────────────────────────────────────────────────────────────────────────
INSERT INTO event_participants (event_id, player_id, status) VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'confirmed'),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'confirmed'),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'confirmed'),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', 'invited'),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'confirmed'),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'confirmed'),
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'confirmed'),
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'confirmed'),
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'confirmed'),
('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', 'confirmed');
```

**Kjør query** → "Success. 19 rows inserted"

### 4.2 Verifiser testdata

```
1. Gå til "Table Editor"
2. Klikk på "players" tabellen
3. Du skal se 6 spillere
4. Klikk på "events" tabellen
5. Du skal se 5 hendelser
```

---

## 📋 TRINN 5: AKTIVER REALTIME (5 min)

### 5.1 Konfigurer Realtime-subscriptions

```
1. Gå til "Database" → "Replication" i venstre meny
2. Aktiver replication for tabellene:
   ✓ events
   ✓ event_participants
   ✓ notifications
3. Klikk "Save"
```

### 5.2 Test Realtime (valgfritt)

**I din app senere**:
```jsx
const subscription = supabase
  .channel('calendar-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'events'
  }, (payload) => {
    console.log('Event changed:', payload);
  })
  .subscribe();
```

---

## 📋 TRINN 6: KONFIGURER MILJØVARIABLER (5 min)

### 6.1 Opprett .env.local i app-prosjektet

```bash
# I AK-Golf-Academy-App/
touch .env.local
```

**Legg til**:
```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 6.2 Opprett services/supabase.js

```jsx
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 6.3 Test tilkobling

**Opprett test-fil: `testSupabase.js`**:
```jsx
import { supabase } from './services/supabase';

async function testConnection() {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Connection failed:', error);
  } else {
    console.log('Connection successful!', data);
  }
}

testConnection();
```

**Kjør**:
```bash
node testSupabase.js
```

**Forventet output**:
```
Connection successful! [{ id: '...', first_name: 'Magnus', ... }]
```

---

## 📋 TRINN 7: OPPRETT API-SERVICES (20 min)

### 7.1 services/calendarService.js

```jsx
import { supabase } from './supabase';

// Hent hendelser for en periode
export async function fetchEvents(startDate, endDate) {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      coach:coaches(first_name, last_name, color),
      participants:event_participants(
        *,
        player:players(id, first_name, last_name, category)
      )
    `)
    .gte('start_time', startDate)
    .lte('start_time', endDate)
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data;
}

// Opprett ny hendelse
export async function createEvent(eventData) {
  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Oppdater hendelse
export async function updateEvent(eventId, updates) {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', eventId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Slett hendelse
export async function deleteEvent(eventId) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (error) throw error;
}

// Legg til deltaker
export async function addParticipant(eventId, playerId, status = 'invited') {
  const { data, error } = await supabase
    .from('event_participants')
    .insert({
      event_id: eventId,
      player_id: playerId,
      status: status
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Check-in spiller
export async function checkInPlayer(eventId, playerId) {
  const { data, error } = await supabase
    .from('event_participants')
    .update({
      status: 'attended',
      checkin_time: new Date().toISOString()
    })
    .eq('event_id', eventId)
    .eq('player_id', playerId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

### 7.2 services/playerService.js

```jsx
import { supabase } from './supabase';

export async function fetchPlayers(coachId) {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('coach_id', coachId)
    .eq('status', 'active')
    .order('first_name');

  if (error) throw error;
  return data;
}

export async function fetchPlayerById(playerId) {
  const { data, error } = await supabase
    .from('players')
    .select('*, coach:coaches(*)')
    .eq('id', playerId)
    .single();

  if (error) throw error;
  return data;
}
```

---

## ✅ VERIFISERING

### Sjekkliste før du går videre:

- [ ] Supabase-prosjekt opprettet
- [ ] Database-migrering kjørt (13 tabeller)
- [ ] RLS policies aktivert
- [ ] Testdata lagt inn
- [ ] Realtime aktivert
- [ ] Miljøvariabler konfigurert
- [ ] services/supabase.js opprettet
- [ ] Test-tilkobling OK
- [ ] API-services opprettet

### Test at alt fungerer:

```jsx
// I din app:
import { fetchEvents } from './services/calendarService';
import { fetchPlayers } from './services/playerService';

// Test 1: Hent spillere
const players = await fetchPlayers('00000000-0000-0000-0000-000000000001');
console.log('Players:', players); // Skal vise 4 spillere

// Test 2: Hent hendelser
const today = new Date();
const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
const events = await fetchEvents(today, nextWeek);
console.log('Events:', events); // Skal vise 5 hendelser
```

---

## 🎓 NYTTIGE SUPABASE-KOMMANDOER

### SQL-queries du kan bruke:

```sql
-- Se alle hendelser med deltakere
SELECT
  e.title,
  e.event_type,
  e.start_time,
  p.first_name || ' ' || p.last_name as player_name
FROM events e
LEFT JOIN event_participants ep ON e.id = ep.event_id
LEFT JOIN players p ON ep.player_id = p.id
ORDER BY e.start_time;

-- Tell hendelser per type
SELECT
  event_type,
  COUNT(*) as count
FROM events
GROUP BY event_type
ORDER BY count DESC;

-- Se spillere med mest hendelser
SELECT
  p.first_name || ' ' || p.last_name as player,
  COUNT(ep.id) as event_count
FROM players p
LEFT JOIN event_participants ep ON p.id = ep.player_id
GROUP BY p.id, p.first_name, p.last_name
ORDER BY event_count DESC;
```

---

## 🚨 FEILSØKING

### Problem: "relation does not exist"
**Løsning**: Du har ikke kjørt database-migrering. Gå til TRINN 2.

### Problem: "permission denied"
**Løsning**: RLS policies er aktive. Sjekk at du er logget inn som riktig bruker.

### Problem: "Invalid API key"
**Løsning**: Sjekk at EXPO_PUBLIC_SUPABASE_ANON_KEY er korrekt i .env.local

### Problem: Ingen data returneres
**Løsning**: Sjekk at testdata er lagt inn (TRINN 4). Kjør SELECT * FROM players;

---

## 📚 RESSURSER

- **Supabase Docs**: https://supabase.com/docs
- **SQL Tutorial**: https://www.postgresqltutorial.com
- **Supabase + React Native**: https://supabase.com/docs/guides/getting-started/quickstarts/reactnative

---

## 🎯 NESTE STEG

1. ✅ Backend er nå klar!
2. → Gå til APP_IMPLEMENTERING_PLAN.md, Fase 6.3
3. → Importer Kalender_Native.jsx til appen
4. → Koble til backend med services

---

**BACKEND SETUP FERDIG! 🎉**

*Guide opprettet: 14. desember 2025*
*Estimert tid: 50 minutter*
