import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { BadgeNotificationProvider } from './contexts/BadgeNotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { tokens } from './design-tokens';

// Shared components (NOT lazy - needed immediately)
import AppShell from './components/layout/AppShell';
import CoachAppShell from './components/layout/CoachAppShell';
import AdminAppShell from './components/layout/AdminAppShell';
import ProtectedRoute from './components/guards/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingState from './components/ui/LoadingState';
import Toast from './components/Toast';

// Lazy-loaded feature components
const Login = lazy(() => import('./features/auth/Login'));
const DashboardContainer = lazy(() => import('./features/dashboard/DashboardContainer'));
const BrukerprofilContainer = lazy(() => import('./features/profile/BrukerprofilContainer'));
const TrenerteamContainer = lazy(() => import('./features/coaches/TrenerteamContainer'));
const MaalsetningerContainer = lazy(() => import('./features/goals/MaalsetningerContainer'));
const AarsplanContainer = lazy(() => import('./features/annual-plan/AarsplanContainer'));
const TestprotokollContainer = lazy(() => import('./features/tests/TestprotokollContainer'));
const TestresultaterContainer = lazy(() => import('./features/tests/TestresultaterContainer'));
const TreningsprotokollContainer = lazy(() => import('./features/training/TreningsprotokollContainer'));
const TreningsstatistikkContainer = lazy(() => import('./features/training/TreningsstatistikkContainer'));
const StatsPage = lazy(() => import('./features/stats/StatsPage'));
const OevelserContainer = lazy(() => import('./features/exercises/OevelserContainer'));
const NotaterContainer = lazy(() => import('./features/notes/NotaterContainer'));
const ArkivContainer = lazy(() => import('./features/archive/ArkivContainer'));
const KalenderContainer = lazy(() => import('./features/calendar/KalenderContainer'));
const PlanPreviewContainer = lazy(() => import('./features/annual-plan/PlanPreviewContainer'));
const ModificationRequestDashboardContainer = lazy(() => import('./features/coach/ModificationRequestDashboardContainer'));
const ProgressDashboardContainer = lazy(() => import('./features/progress/ProgressDashboardContainer'));
const AchievementsDashboardContainer = lazy(() => import('./features/achievements/AchievementsDashboardContainer'));
const BadgesContainer = lazy(() => import('./features/badges/Badges'));
const TurneringskalenderContainer = lazy(() => import('./features/tournaments/TurneringskalenderContainer'));
const MineTurneringerContainer = lazy(() => import('./features/tournaments/MineTurneringerContainer'));
const RessurserContainer = lazy(() => import('./features/knowledge/RessurserContainer'));
const SkoleplanContainer = lazy(() => import('./features/school/SkoleplanContainer'));
const PlaceholderPage = lazy(() => import('./features/planning/PlaceholderPage'));

// New feature components
const SamlingerContainer = lazy(() => import('./features/samlinger/SamlingerContainer'));
const PeriodeplanerContainer = lazy(() => import('./features/periodeplaner/PeriodeplanerContainer'));
const DagensTreningsplanContainer = lazy(() => import('./features/trening-plan/DagensTreningsplanContainer'));
const UkensTreningsplanContainer = lazy(() => import('./features/trening-plan/UkensTreningsplanContainer'));
const TekniskPlanContainer = lazy(() => import('./features/trening-plan/TekniskPlanContainer'));
const StatsOppdateringContainer = lazy(() => import('./features/stats-pages/StatsOppdateringContainer'));
const TurneringsstatistikkContainer = lazy(() => import('./features/stats-pages/TurneringsstatistikkContainer'));
const StatsVerktoyContainer = lazy(() => import('./features/stats-pages/StatsVerktoyContainer'));
const EvalueringContainer = lazy(() => import('./features/evaluering/EvalueringContainer'));

// UI Lab
const UILabContainer = lazy(() => import('./features/ui-lab/UILabContainer'));
const StatsLab = lazy(() => import('./ui/lab/StatsLab'));
const TreningsevalueringContainer = lazy(() => import('./features/evaluering/TreningsevalueringContainer'));
const TurneringsevalueringContainer = lazy(() => import('./features/evaluering/TurneringsevalueringContainer'));

// Min utvikling
const UtviklingsOversiktContainer = lazy(() => import('./features/utvikling/UtviklingsOversiktContainer'));
const BreakingPointsContainer = lazy(() => import('./features/utvikling/BreakingPointsContainer'));
const KategoriFremgangContainer = lazy(() => import('./features/utvikling/KategoriFremgangContainer'));
const BenchmarkHistorikkContainer = lazy(() => import('./features/utvikling/BenchmarkHistorikkContainer'));

// Trening
const TreningsdagbokContainer = lazy(() => import('./features/trening-plan/TreningsdagbokContainer'));
const LoggTreningContainer = lazy(() => import('./features/trening-plan/LoggTreningContainer'));

// Kalender
const BookTrenerContainer = lazy(() => import('./features/calendar/BookTrenerContainer'));

// Testing
const KategoriKravContainer = lazy(() => import('./features/tests/KategoriKravContainer'));
const RegistrerTestContainer = lazy(() => import('./features/tests/RegistrerTestContainer'));

// Turneringer
const TurneringsResultaterContainer = lazy(() => import('./features/tournaments/TurneringsResultaterContainer'));
const RegistrerTurneringsResultatContainer = lazy(() => import('./features/tournaments/RegistrerTurneringsResultatContainer'));

// Kommunikasjon (Messaging & Notifications)
const MessageCenter = lazy(() => import('./features/messaging/MessageCenter'));
const ConversationView = lazy(() => import('./features/messaging/ConversationView'));
const NewConversation = lazy(() => import('./features/messaging/NewConversation'));
const NotificationCenter = lazy(() => import('./features/notifications/NotificationCenter'));

// Kunnskap
const BevisContainer = lazy(() => import('./features/bevis/BevisContainer'));

// Skole
const SkoleoppgaverContainer = lazy(() => import('./features/school/SkoleoppgaverContainer'));

// Innstillinger
const KalibreringsContainer = lazy(() => import('./features/innstillinger/KalibreringsContainer'));
const VarselinnstillingerContainer = lazy(() => import('./features/innstillinger/VarselinnstillingerContainer'));

// Session components (lazy-loaded)
const SessionDetailViewContainer = lazy(() => import('./features/sessions/SessionDetailViewContainer'));
const ActiveSessionViewContainer = lazy(() => import('./features/sessions/ActiveSessionViewContainer'));
const SessionReflectionFormContainer = lazy(() => import('./features/sessions/SessionReflectionFormContainer'));
const SessionEvaluationFormContainer = lazy(() => import('./features/sessions/SessionEvaluationFormContainer'));
const SessionCreateFormContainer = lazy(() => import('./features/sessions/SessionCreateFormContainer'));
const EvaluationStatsDashboardContainer = lazy(() => import('./features/sessions/EvaluationStatsDashboardContainer'));
const SessionsListContainer = lazy(() => import('./features/sessions/SessionsListContainer'));
const ExerciseLibraryContainer = lazy(() => import('./features/sessions/ExerciseLibraryContainer'));

// Mobile components (lazy-loaded)
const MobileShell = lazy(() => import('./components/layout/MobileShell'));
const MobileHome = lazy(() => import('./mobile/MobileHome'));
const MobilePlan = lazy(() => import('./mobile/MobilePlan'));
const MobileQuickLog = lazy(() => import('./mobile/MobileQuickLog'));
const MobileCalendar = lazy(() => import('./mobile/MobileCalendar'));
const MobileCalibration = lazy(() => import('./mobile/MobileCalibration'));

// Coach feature components (lazy-loaded)
const CoachDashboard = lazy(() => import('./features/coach-dashboard').then(m => ({ default: m.CoachDashboard })));
const CoachAthleteList = lazy(() => import('./features/coach-athlete-list').then(m => ({ default: m.CoachAthleteList })));
const CoachAthleteDetail = lazy(() => import('./features/coach-athlete-detail').then(m => ({ default: m.CoachAthleteDetail })));
const CoachTrainingPlan = lazy(() => import('./features/coach-training-plan').then(m => ({ default: m.CoachTrainingPlan })));
const CoachTrainingPlanEditor = lazy(() => import('./features/coach-training-plan-editor').then(m => ({ default: m.CoachTrainingPlanEditor })));
const CoachNotes = lazy(() => import('./features/coach-notes').then(m => ({ default: m.CoachNotes })));
const CoachAlertsPage = lazy(() => import('./features/coach-intelligence').then(m => ({ default: m.CoachAlertsPage })));
const CoachProofViewer = lazy(() => import('./features/coach-proof-viewer').then(m => ({ default: m.CoachProofViewer })));
const CoachTrajectoryViewer = lazy(() => import('./features/coach-trajectory-viewer').then(m => ({ default: m.CoachTrajectoryViewer })));

// Coach groups (lazy-loaded)
const CoachGroupList = lazy(() => import('./features/coach-groups').then(m => ({ default: m.CoachGroupList })));
const CoachGroupDetail = lazy(() => import('./features/coach-groups').then(m => ({ default: m.CoachGroupDetail })));
const CoachGroupCreate = lazy(() => import('./features/coach-groups').then(m => ({ default: m.CoachGroupCreate })));

// Coach booking (lazy-loaded)
const CoachBookingCalendar = lazy(() => import('./features/coach-booking').then(m => ({ default: m.CoachBookingCalendar })));
const CoachBookingRequests = lazy(() => import('./features/coach-booking').then(m => ({ default: m.CoachBookingRequests })));
const CoachBookingSettings = lazy(() => import('./features/coach-booking').then(m => ({ default: m.CoachBookingSettings })));

// Coach tournaments (lazy-loaded)
const CoachTournamentCalendar = lazy(() => import('./features/coach-tournaments').then(m => ({ default: m.CoachTournamentCalendar })));
const CoachTournamentPlayers = lazy(() => import('./features/coach-tournaments').then(m => ({ default: m.CoachTournamentPlayers })));
const CoachTournamentResults = lazy(() => import('./features/coach-tournaments').then(m => ({ default: m.CoachTournamentResults })));

// Coach stats (lazy-loaded)
const CoachStatsOverview = lazy(() => import('./features/coach-stats').then(m => ({ default: m.CoachStatsOverview })));
const CoachStatsProgress = lazy(() => import('./features/coach-stats').then(m => ({ default: m.CoachStatsProgress })));
const CoachStatsRegression = lazy(() => import('./features/coach-stats').then(m => ({ default: m.CoachStatsRegression })));
const CoachDataGolf = lazy(() => import('./features/coach-stats').then(m => ({ default: m.CoachDataGolf })));

// Coach messages (lazy-loaded)
const CoachMessageList = lazy(() => import('./features/coach-messages').then(m => ({ default: m.CoachMessageList })));
const CoachMessageCompose = lazy(() => import('./features/coach-messages').then(m => ({ default: m.CoachMessageCompose })));
const CoachScheduledMessages = lazy(() => import('./features/coach-messages').then(m => ({ default: m.CoachScheduledMessages })));

// Coach exercises (lazy-loaded)
const CoachExerciseLibrary = lazy(() => import('./features/coach-exercises').then(m => ({ default: m.CoachExerciseLibrary })));
const CoachMyExercises = lazy(() => import('./features/coach-exercises').then(m => ({ default: m.CoachMyExercises })));
const CoachExerciseTemplates = lazy(() => import('./features/coach-exercises').then(m => ({ default: m.CoachExerciseTemplates })));
const CoachSessionTemplateEditor = lazy(() => import('./features/coach-exercises').then(m => ({ default: m.CoachSessionTemplateEditor })));

// Coach settings (lazy-loaded)
const CoachSettings = lazy(() => import('./features/coach-settings').then(m => ({ default: m.CoachSettings })));

// Coach athlete status (lazy-loaded)
const CoachAthleteStatus = lazy(() => import('./features/coach-athlete-status').then(m => ({ default: m.CoachAthleteStatus })));

// Coach athlete tournaments (lazy-loaded)
const CoachAthleteTournaments = lazy(() => import('./features/coach-athlete-tournaments').then(m => ({ default: m.CoachAthleteTournaments })));

// Coach planning (lazy-loaded)
const CoachPlanningHub = lazy(() => import('./features/coach-planning').then(m => ({ default: m.CoachPlanningHub })));

// Coach session evaluations (lazy-loaded)
const CoachSessionEvaluations = lazy(() => import('./features/coach-session-evaluations').then(m => ({ default: m.CoachSessionEvaluations })));

// Admin feature components (lazy-loaded)
const AdminSystemOverview = lazy(() => import('./features/admin-system-overview').then(m => ({ default: m.AdminSystemOverview })));
const AdminCoachManagement = lazy(() => import('./features/admin-coach-management').then(m => ({ default: m.AdminCoachManagement })));
const AdminTierManagement = lazy(() => import('./features/admin-tier-management').then(m => ({ default: m.AdminTierManagement })));
const AdminFeatureFlagsEditor = lazy(() => import('./features/admin-feature-flags').then(m => ({ default: m.AdminFeatureFlagsEditor })));
const AdminEscalationSupport = lazy(() => import('./features/admin-escalation').then(m => ({ default: m.AdminEscalationSupport })));

// Layout component for authenticated pages using AppShell (Player)
const AuthenticatedLayout = ({ children }) => (
  <AppShell>{children}</AppShell>
);

// Layout component for coach pages using CoachAppShell
const CoachLayout = ({ children }) => (
  <CoachAppShell>{children}</CoachAppShell>
);

// Layout component for admin pages using AdminAppShell
const AdminLayout = ({ children }) => (
  <AdminAppShell>{children}</AdminAppShell>
);

// Offline Banner Component
const OfflineBanner = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: tokens.colors.error,
    color: 'white',
    padding: '12px 16px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '500',
    zIndex: 9999,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  }}>
    ⚠️ Ingen internettforbindelse. Noen funksjoner kan være utilgjengelige.
  </div>
);

function App() {
  const isOnline = useOnlineStatus();

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <BadgeNotificationProvider>
              <ErrorBoundary>
                {!isOnline && <OfflineBanner />}
                <Toast />
            <Suspense fallback={<LoadingState />}>
              <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Mobile routes */}
          <Route path="/m" element={<ProtectedRoute><MobileShell /></ProtectedRoute>}>
            <Route path="home" element={<MobileHome />} />
            <Route path="plan" element={<MobilePlan />} />
            <Route path="log" element={<MobileQuickLog />} />
            <Route path="calendar" element={<MobileCalendar />} />
            <Route path="calibration" element={<MobileCalibration />} />
          </Route>

          {/* Desktop protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <DashboardContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <DashboardContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/profil" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <BrukerprofilContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/trenerteam" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <TrenerteamContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/maalsetninger" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <MaalsetningerContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/aarsplan" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <AarsplanContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/testprotokoll" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <TestprotokollContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/testresultater" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <TestresultaterContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/treningsprotokoll" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <TreningsprotokollContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/treningsstatistikk" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <TreningsstatistikkContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/stats" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <StatsPage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/ui-lab" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <UILabContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/stats-lab" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <StatsLab />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/oevelser" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <OevelserContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/notater" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <NotaterContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/arkiv" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <ArkivContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/kalender" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <KalenderContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/plan-preview/:planId" element={
            <ProtectedRoute>
              <PlanPreviewContainer />
            </ProtectedRoute>
          } />
          <Route path="/coach/modification-requests" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <ModificationRequestDashboardContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <ProgressDashboardContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/achievements" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <AchievementsDashboardContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/badges" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <BadgesContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/turneringskalender" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <TurneringskalenderContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/mine-turneringer" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <MineTurneringerContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/ressurser" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <RessurserContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/skoleplan" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <SkoleplanContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Session routes (APP_FUNCTIONALITY.md Section 6-12) */}
          <Route path="/session/new" element={
            <ProtectedRoute>
              <SessionCreateFormContainer />
            </ProtectedRoute>
          } />
          <Route path="/session/:sessionId" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <SessionDetailViewContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/session/:sessionId/active" element={
            <ProtectedRoute>
              <ActiveSessionViewContainer />
            </ProtectedRoute>
          } />
          <Route path="/session/:sessionId/reflection" element={
            <ProtectedRoute>
              <SessionReflectionFormContainer />
            </ProtectedRoute>
          } />
          <Route path="/session/:sessionId/evaluate" element={
            <ProtectedRoute>
              <SessionEvaluationFormContainer />
            </ProtectedRoute>
          } />
          <Route path="/session/stats" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <EvaluationStatsDashboardContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/sessions" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <SessionsListContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/ovelsesbibliotek" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <ExerciseLibraryContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* New routes from Dashboard Struktur */}
          {/* Planlegger */}
          <Route path="/periodeplaner" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <PeriodeplanerContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/samlinger" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <SamlingerContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Trening */}
          <Route path="/trening/dagens" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <DagensTreningsplanContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/trening/ukens" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <UkensTreningsplanContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/trening/teknisk" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <TekniskPlanContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Stats */}
          <Route path="/stats/ny" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <StatsOppdateringContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/stats/turnering" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <TurneringsstatistikkContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/stats/verktoy" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <StatsVerktoyContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Evaluering */}
          <Route path="/evaluering" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <EvalueringContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/evaluering/trening" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <TreningsevalueringContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/evaluering/turnering" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <TurneringsevalueringContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Min utvikling */}
          <Route path="/utvikling" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <UtviklingsOversiktContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/utvikling/breaking-points" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <BreakingPointsContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/utvikling/kategori" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <KategoriFremgangContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/utvikling/benchmark" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <BenchmarkHistorikkContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Trening */}
          <Route path="/trening/dagbok" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <TreningsdagbokContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/trening/logg" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <LoggTreningContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Kalender */}
          <Route path="/kalender/booking" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <BookTrenerContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Testing */}
          <Route path="/testing/krav" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <KategoriKravContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/testing/registrer" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <RegistrerTestContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Turneringer */}
          <Route path="/turneringer/resultater" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <TurneringsResultaterContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/turneringer/registrer" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <RegistrerTurneringsResultatContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Kommunikasjon (Messaging & Notifications) */}
          <Route path="/meldinger" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <MessageCenter />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/meldinger/ny" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <NewConversation />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/meldinger/trener" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <MessageCenter filterType="coach" />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/meldinger/:conversationId" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <ConversationView />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/varsler" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <NotificationCenter />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Kunnskap */}
          <Route path="/bevis" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <BevisContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Skole */}
          <Route path="/skole/oppgaver" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <SkoleoppgaverContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Innstillinger */}
          <Route path="/kalibrering" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <KalibreringsContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/innstillinger/varsler" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <VarselinnstillingerContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* ════════════════════════════════════════════════════════════════
              COACH ROUTES
              Role: coach
              Layout: CoachAppShell with CoachSidebar
              ════════════════════════════════════════════════════════════════ */}
          <Route path="/coach" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachDashboard />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/athletes" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachAthleteList />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/athletes/status" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachAthleteStatus />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/athletes/tournaments" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachAthleteTournaments />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/athletes/:athleteId" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachAthleteDetail />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/athletes/:athleteId/plan" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachTrainingPlan />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/athletes/:athleteId/plan/edit" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachTrainingPlanEditor />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/athletes/:athleteId/notes" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachNotes />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/athletes/:athleteId/trajectory" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachTrajectoryViewer />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/training-plans/create" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachTrainingPlanEditor />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/alerts" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachAlertsPage />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/proof" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachProofViewer />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/settings" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachSettings />
              </CoachLayout>
            </ProtectedRoute>
          } />

          {/* Coach Groups */}
          <Route path="/coach/groups" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachGroupList />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/groups/create" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachGroupCreate />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/groups/:groupId" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachGroupDetail />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/groups/:groupId/edit" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachGroupCreate />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/groups/:groupId/plan" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <PlaceholderPage title="Gruppeplan" />
              </CoachLayout>
            </ProtectedRoute>
          } />

          {/* Coach Booking */}
          <Route path="/coach/booking" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachBookingCalendar />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/booking/requests" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachBookingRequests />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/booking/settings" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachBookingSettings />
              </CoachLayout>
            </ProtectedRoute>
          } />

          {/* Coach Tournaments */}
          <Route path="/coach/tournaments" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachTournamentCalendar />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/tournaments/players" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachTournamentPlayers />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/tournaments/results" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachTournamentResults />
              </CoachLayout>
            </ProtectedRoute>
          } />

          {/* Coach Stats */}
          <Route path="/coach/stats" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachStatsOverview />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/stats/progress" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachStatsProgress />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/stats/regression" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachStatsRegression />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/stats/datagolf" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachDataGolf />
              </CoachLayout>
            </ProtectedRoute>
          } />

          {/* Coach Messages */}
          <Route path="/coach/messages" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachMessageList />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/messages/compose" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachMessageCompose />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/messages/scheduled" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachScheduledMessages />
              </CoachLayout>
            </ProtectedRoute>
          } />

          {/* Coach Exercises */}
          <Route path="/coach/exercises" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachExerciseLibrary />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/exercises/mine" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachMyExercises />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/exercises/templates" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachExerciseTemplates />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/exercises/templates/create" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachSessionTemplateEditor />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/exercises/templates/:templateId/edit" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachSessionTemplateEditor />
              </CoachLayout>
            </ProtectedRoute>
          } />

          {/* Coach Planning */}
          <Route path="/coach/planning" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachPlanningHub />
              </CoachLayout>
            </ProtectedRoute>
          } />

          {/* Coach Session Evaluations */}
          <Route path="/coach/sessions/evaluations" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachSessionEvaluations />
              </CoachLayout>
            </ProtectedRoute>
          } />

          {/* ════════════════════════════════════════════════════════════════
              ADMIN ROUTES
              Role: admin
              Layout: AdminAppShell with AdminSidebar
              NON-NEGOTIABLE: Admin has NO access to player/athlete data
              ════════════════════════════════════════════════════════════════ */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <AdminSystemOverview />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users/coaches" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <AdminCoachManagement />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users/pending" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <PlaceholderPage title="Ventende godkjenninger" />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users/invitations" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <PlaceholderPage title="Invitasjoner" />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/tiers" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <AdminTierManagement />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/tiers/features" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <PlaceholderPage title="Funksjoner per nivå" />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/feature-flags" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <AdminFeatureFlagsEditor />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/support" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <AdminEscalationSupport />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/logs/audit" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <PlaceholderPage title="Audit-logg" />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/logs/errors" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <PlaceholderPage title="Feillogg" />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/config/categories" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <PlaceholderPage title="Kategorier (A-K)" />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/config/tests" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <PlaceholderPage title="Testkonfigurasjon" />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/config/notifications" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <PlaceholderPage title="Varsler" />
              </AdminLayout>
            </ProtectedRoute>
          } />
            </Routes>
            </Suspense>
              </ErrorBoundary>
            </BadgeNotificationProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
