/**
 * ============================================================
 * PLAYER ROUTES V3 - AK Golf Academy
 * ============================================================
 *
 * Rutedefinisjoner for spillerportalen med 5-område struktur.
 *
 * Områder:
 * 1. /dashboard - Dashboard (hjem)
 * 2. /trening/* - Trening (grønn)
 * 3. /utvikling/* - Min utvikling (blå)
 * 4. /plan/* - Plan (amber)
 * 5. /mer/* - Mer (lilla)
 *
 * ============================================================
 */

import React, { lazy, Suspense } from 'react';
import { Route, Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

// ============================================================
// Lazy-loaded Hub Pages
// ============================================================

const DashboardHub = lazy(() => import('../features/hub-pages/DashboardHub'));
const TreningHub = lazy(() => import('../features/hub-pages/TreningHub'));
const UtviklingHub = lazy(() => import('../features/hub-pages/UtviklingHub'));
const PlanHub = lazy(() => import('../features/hub-pages/PlanHub'));
const MerHub = lazy(() => import('../features/hub-pages/MerHub'));

// ============================================================
// Existing Page Components (lazy loaded)
// ============================================================

// Trening area
const TreningLogg = lazy(() => import('../features/sessions/SessionCreateForm'));
const TreningDagbok = lazy(() => import('../features/sessions/SessionsListView'));
const TreningOkter = lazy(() => import('../features/sessions/SessionsListView'));
const TreningPlan = lazy(() => import('../features/training/TrainingPlanView').catch(() => ({ default: () => <PlaceholderPage title="Treningsplan" /> })));
const TreningOvelser = lazy(() => import('../features/exercises/ExercisesPage').catch(() => ({ default: () => <PlaceholderPage title="Øvelsesbank" /> })));
const TreningVideoer = lazy(() => import('../features/video-library/VideoLibrary').catch(() => ({ default: () => <PlaceholderPage title="Videoer" /> })));
const TreningTesting = lazy(() => import('../features/tests/TestingOverview').catch(() => ({ default: () => <PlaceholderPage title="Testing" /> })));
const TreningTestRegistrer = lazy(() => import('../features/tests/TestRegistration').catch(() => ({ default: () => <PlaceholderPage title="Registrer test" /> })));

// Utvikling area
const UtviklingOversikt = lazy(() => import('../features/utvikling/UtviklingPage').catch(() => ({ default: () => <PlaceholderPage title="Min utvikling" /> })));
const UtviklingStatistikk = lazy(() => import('../features/stats/StatsPage').catch(() => ({ default: () => <PlaceholderPage title="Statistikk" /> })));
const UtviklingHistorikk = lazy(() => import('../features/progress/ProgressPage').catch(() => ({ default: () => <PlaceholderPage title="Historikk" /> })));
const UtviklingTestresultater = lazy(() => import('../features/tests/TestResultsPage').catch(() => ({ default: () => <PlaceholderPage title="Testresultater" /> })));
const UtviklingKrav = lazy(() => import('../features/tests/CategoryRequirementsPage').catch(() => ({ default: () => <PlaceholderPage title="Kategori-krav" /> })));
const UtviklingBadges = lazy(() => import('../features/badges/BadgesPage').catch(() => ({ default: () => <PlaceholderPage title="Badges" /> })));
const UtviklingAchievements = lazy(() => import('../features/achievements/AchievementsPage').catch(() => ({ default: () => <PlaceholderPage title="Oppnåelser" /> })));

// Plan area
const PlanKalender = lazy(() => import('../features/calendar/CalendarPage').catch(() => ({ default: () => <PlaceholderPage title="Kalender" /> })));
const PlanUkeplan = lazy(() => import('../features/trening-plan/TreningPlanUkeplan').catch(() => ({ default: () => <PlaceholderPage title="Ukeplan" /> })));
const PlanBooking = lazy(() => import('../features/calendar-oversikt/CalendarOversikt').catch(() => ({ default: () => <PlaceholderPage title="Booking" /> })));
const PlanMaal = lazy(() => import('../features/goals/GoalsPage').catch(() => ({ default: () => <PlaceholderPage title="Målsetninger" /> })));
const PlanAarsplan = lazy(() => import('../features/annual-plan/AnnualPlanPage').catch(() => ({ default: () => <PlaceholderPage title="Årsplan" /> })));
const PlanTurneringer = lazy(() => import('../features/tournament-calendar/TournamentCalendar').catch(() => ({ default: () => <PlaceholderPage title="Turneringskalender" /> })));
const PlanMineTurneringer = lazy(() => import('../features/tournaments/MyTournamentsPage').catch(() => ({ default: () => <PlaceholderPage title="Mine turneringer" /> })));

// Mer area
const MerProfil = lazy(() => import('../features/profile/ProfilePage').catch(() => ({ default: () => <PlaceholderPage title="Min profil" /> })));
const MerProfilRediger = lazy(() => import('../features/profile/ProfileEditPage').catch(() => ({ default: () => <PlaceholderPage title="Rediger profil" /> })));
const MerTrenerteam = lazy(() => import('../features/coaches/CoachesPage').catch(() => ({ default: () => <PlaceholderPage title="Trenerteam" /> })));
const MerMeldinger = lazy(() => import('../features/kommunikasjon/KommunikasjonPage').catch(() => ({ default: () => <PlaceholderPage title="Meldinger" /> })));
const MerFeedback = lazy(() => import('../features/coach-notes/CoachNotesPage').catch(() => ({ default: () => <PlaceholderPage title="Trenerfeedback" /> })));
const MerKunnskap = lazy(() => import('../features/knowledge/KnowledgePage').catch(() => ({ default: () => <PlaceholderPage title="Kunnskapsbase" /> })));
const MerNotater = lazy(() => import('../features/notes/NotesPage').catch(() => ({ default: () => <PlaceholderPage title="Notater" /> })));
const MerInnstillinger = lazy(() => import('../features/innstillinger/InnstillingerPage').catch(() => ({ default: () => <PlaceholderPage title="Innstillinger" /> })));
const MerVarsler = lazy(() => import('../features/innstillinger/VarslerPage').catch(() => ({ default: () => <PlaceholderPage title="Varselinnstillinger" /> })));
const MerKalibrering = lazy(() => import('../features/tests/CalibrationPage').catch(() => ({ default: () => <PlaceholderPage title="Kalibrering" /> })));

// ============================================================
// Placeholder Component
// ============================================================

interface PlaceholderPageProps {
  title: string;
}

function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>{title}</h1>
      <p style={{ color: '#6B7280' }}>Denne siden er under utvikling.</p>
    </div>
  );
}

// ============================================================
// Suspense Wrapper
// ============================================================

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
}

// ============================================================
// Route Constants
// ============================================================

export const ROUTES_V3 = {
  // Dashboard
  DASHBOARD: '/dashboard',

  // Trening
  TRENING: {
    HUB: '/trening',
    LOGG: '/trening/logg',
    DAGBOK: '/trening/dagbok',
    OKTER: '/trening/okter',
    PLAN: '/trening/plan',
    OVELSER: '/trening/ovelser',
    VIDEOER: '/trening/videoer',
    TESTING: '/trening/testing',
    TESTING_REGISTRER: '/trening/testing/registrer',
  },

  // Utvikling
  UTVIKLING: {
    HUB: '/utvikling',
    OVERSIKT: '/utvikling/oversikt',
    STATISTIKK: '/utvikling/statistikk',
    HISTORIKK: '/utvikling/historikk',
    TESTRESULTATER: '/utvikling/testresultater',
    KRAV: '/utvikling/krav',
    BADGES: '/utvikling/badges',
    ACHIEVEMENTS: '/utvikling/achievements',
  },

  // Plan
  PLAN: {
    HUB: '/plan',
    KALENDER: '/plan/kalender',
    UKEPLAN: '/plan/ukeplan',
    BOOKING: '/plan/booking',
    MAAL: '/plan/maal',
    AARSPLAN: '/plan/aarsplan',
    TURNERINGER: '/plan/turneringer',
    TURNERINGER_MINE: '/plan/turneringer/mine',
  },

  // Mer
  MER: {
    HUB: '/mer',
    PROFIL: '/mer/profil',
    PROFIL_REDIGER: '/mer/profil/rediger',
    TRENERTEAM: '/mer/trenerteam',
    MELDINGER: '/mer/meldinger',
    FEEDBACK: '/mer/feedback',
    KUNNSKAP: '/mer/kunnskap',
    NOTATER: '/mer/notater',
    INNSTILLINGER: '/mer/innstillinger',
    VARSLER: '/mer/varsler',
    KALIBRERING: '/mer/kalibrering',
  },
} as const;

// ============================================================
// Route Definitions
// ============================================================

export function getPlayerRoutesV3() {
  return (
    <>
      {/* Dashboard */}
      <Route path="/dashboard" element={<SuspenseWrapper><DashboardHub /></SuspenseWrapper>} />

      {/* Trening */}
      <Route path="/trening" element={<SuspenseWrapper><TreningHub /></SuspenseWrapper>} />
      <Route path="/trening/logg" element={<SuspenseWrapper><TreningLogg /></SuspenseWrapper>} />
      <Route path="/trening/dagbok" element={<SuspenseWrapper><TreningDagbok /></SuspenseWrapper>} />
      <Route path="/trening/okter" element={<SuspenseWrapper><TreningOkter /></SuspenseWrapper>} />
      <Route path="/trening/plan" element={<SuspenseWrapper><TreningPlan /></SuspenseWrapper>} />
      <Route path="/trening/ovelser" element={<SuspenseWrapper><TreningOvelser /></SuspenseWrapper>} />
      <Route path="/trening/videoer" element={<SuspenseWrapper><TreningVideoer /></SuspenseWrapper>} />
      <Route path="/trening/testing" element={<SuspenseWrapper><TreningTesting /></SuspenseWrapper>} />
      <Route path="/trening/testing/registrer" element={<SuspenseWrapper><TreningTestRegistrer /></SuspenseWrapper>} />

      {/* Utvikling */}
      <Route path="/utvikling" element={<SuspenseWrapper><UtviklingHub /></SuspenseWrapper>} />
      <Route path="/utvikling/oversikt" element={<SuspenseWrapper><UtviklingOversikt /></SuspenseWrapper>} />
      <Route path="/utvikling/statistikk" element={<SuspenseWrapper><UtviklingStatistikk /></SuspenseWrapper>} />
      <Route path="/utvikling/historikk" element={<SuspenseWrapper><UtviklingHistorikk /></SuspenseWrapper>} />
      <Route path="/utvikling/testresultater" element={<SuspenseWrapper><UtviklingTestresultater /></SuspenseWrapper>} />
      <Route path="/utvikling/krav" element={<SuspenseWrapper><UtviklingKrav /></SuspenseWrapper>} />
      <Route path="/utvikling/badges" element={<SuspenseWrapper><UtviklingBadges /></SuspenseWrapper>} />
      <Route path="/utvikling/achievements" element={<SuspenseWrapper><UtviklingAchievements /></SuspenseWrapper>} />

      {/* Plan */}
      <Route path="/plan" element={<SuspenseWrapper><PlanHub /></SuspenseWrapper>} />
      <Route path="/plan/kalender" element={<SuspenseWrapper><PlanKalender /></SuspenseWrapper>} />
      <Route path="/plan/ukeplan" element={<SuspenseWrapper><PlanUkeplan /></SuspenseWrapper>} />
      <Route path="/plan/booking" element={<SuspenseWrapper><PlanBooking /></SuspenseWrapper>} />
      <Route path="/plan/maal" element={<SuspenseWrapper><PlanMaal /></SuspenseWrapper>} />
      <Route path="/plan/aarsplan" element={<SuspenseWrapper><PlanAarsplan /></SuspenseWrapper>} />
      <Route path="/plan/turneringer" element={<SuspenseWrapper><PlanTurneringer /></SuspenseWrapper>} />
      <Route path="/plan/turneringer/mine" element={<SuspenseWrapper><PlanMineTurneringer /></SuspenseWrapper>} />

      {/* Mer */}
      <Route path="/mer" element={<SuspenseWrapper><MerHub /></SuspenseWrapper>} />
      <Route path="/mer/profil" element={<SuspenseWrapper><MerProfil /></SuspenseWrapper>} />
      <Route path="/mer/profil/rediger" element={<SuspenseWrapper><MerProfilRediger /></SuspenseWrapper>} />
      <Route path="/mer/trenerteam" element={<SuspenseWrapper><MerTrenerteam /></SuspenseWrapper>} />
      <Route path="/mer/meldinger" element={<SuspenseWrapper><MerMeldinger /></SuspenseWrapper>} />
      <Route path="/mer/feedback" element={<SuspenseWrapper><MerFeedback /></SuspenseWrapper>} />
      <Route path="/mer/kunnskap" element={<SuspenseWrapper><MerKunnskap /></SuspenseWrapper>} />
      <Route path="/mer/notater" element={<SuspenseWrapper><MerNotater /></SuspenseWrapper>} />
      <Route path="/mer/innstillinger" element={<SuspenseWrapper><MerInnstillinger /></SuspenseWrapper>} />
      <Route path="/mer/varsler" element={<SuspenseWrapper><MerVarsler /></SuspenseWrapper>} />
      <Route path="/mer/kalibrering" element={<SuspenseWrapper><MerKalibrering /></SuspenseWrapper>} />

      {/* Redirects from old routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/hjem" element={<Navigate to="/dashboard" replace />} />
    </>
  );
}

// ============================================================
// Redirect Routes (from V2 to V3)
// ============================================================

export const V3_REDIRECTS: Record<string, string> = {
  // V2 -> V3
  '/': '/dashboard',
  '/hjem': '/dashboard',
  '/tren': '/trening',
  '/tren/logg': '/trening/logg',
  '/tren/okter': '/trening/okter',
  '/tren/ovelser': '/trening/ovelser',
  '/tren/testing': '/trening/testing',
  '/tren/testing/registrer': '/trening/testing/registrer',
  '/tren/testing/resultater': '/utvikling/testresultater',
  '/tren/testing/krav': '/utvikling/krav',
  '/planlegg': '/plan',
  '/planlegg/ukeplan': '/plan/ukeplan',
  '/planlegg/kalender': '/plan/kalender',
  '/planlegg/turneringer/kalender': '/plan/turneringer',
  '/planlegg/turneringer/mine': '/plan/turneringer/mine',
  '/analyser': '/utvikling',
  '/analyser/utvikling': '/utvikling/oversikt',
  '/analyser/statistikk': '/utvikling/statistikk',
  '/analyser/mal': '/plan/maal',
  '/analyser/historikk': '/utvikling/historikk',
  '/samhandle': '/mer',
  '/samhandle/meldinger': '/mer/meldinger',
  '/samhandle/feedback': '/mer/feedback',
  '/samhandle/kunnskap': '/mer/kunnskap',
  '/profil': '/mer/profil',
  '/profil/oppdater': '/mer/profil/rediger',
  '/innstillinger': '/mer/innstillinger',
  '/innstillinger/varsler': '/mer/varsler',
  '/trenerteam': '/mer/trenerteam',
  '/kalibrering': '/mer/kalibrering',
};

export default getPlayerRoutesV3;
