import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { BadgeNotificationProvider } from './contexts/BadgeNotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { tokens } from './design-tokens';
import { initMobileApp } from './utils/mobile';

// Shared components (NOT lazy - needed immediately)
import ApplicationLayoutTopNav from './components/layout/ApplicationLayoutTopNav';
import CoachAppShell from './components/layout/CoachAppShell';
import AdminAppShell from './components/layout/AdminAppShell';
import ProtectedRoute from './components/guards/ProtectedRoute';
import PublicRoute from './components/guards/PublicRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingState from './components/ui/LoadingState';
import Toast from './components/Toast';
import VideoNotificationManager from './components/VideoNotificationManager';
import NotificationManager from './components/NotificationManager';
import { Toaster, TooltipProvider, Button } from './components/shadcn';
import { Plus } from 'lucide-react';

// Lazy-loaded feature components
const Login = lazy(() => import('./features/auth/Login'));
const DashboardContainer = lazy(() => import('./features/dashboard/DashboardContainer'));
const BrukerprofilContainer = lazy(() => import('./features/profile/BrukerprofilContainer'));
const TrenerteamContainer = lazy(() => import('./features/coaches/TrenerteamContainer'));
const MaalsetningerContainer = lazy(() => import('./features/goals/MaalsetningerContainer'));
const AarsplanContainer = lazy(() => import('./features/annual-plan/AarsplanContainer'));
const AarsplanGenerator = lazy(() => import('./features/annual-plan/AarsplanGenerator'));
const TestprotokollContainer = lazy(() => import('./features/tests/TestprotokollContainer'));
const TestresultaterContainer = lazy(() => import('./features/tests/TestresultaterContainer'));
const TreningsprotokollContainer = lazy(() => import('./features/training/TreningsprotokollContainer'));
const TreningsstatistikkContainer = lazy(() => import('./features/training/TreningsstatistikkContainer'));
const OevelserContainer = lazy(() => import('./features/exercises/OevelserContainer'));
const NotaterContainer = lazy(() => import('./features/notes/NotaterContainer'));
const ArkivContainer = lazy(() => import('./features/archive/ArkivContainer'));
const PlanPreviewContainer = lazy(() => import('./features/annual-plan/PlanPreviewContainer'));
const ModificationRequestDashboardContainer = lazy(() => import('./features/coach/ModificationRequestDashboardContainer'));
const ProgressDashboardContainer = lazy(() => import('./features/progress/ProgressDashboardContainer'));
const AchievementsDashboardContainer = lazy(() => import('./features/achievements/AchievementsDashboardContainer'));
const BadgesContainer = lazy(() => import('./features/badges/Badges'));
const TurneringskalenderContainer = lazy(() => import('./features/tournaments/TurneringskalenderContainer'));
const MineTurneringerContainer = lazy(() => import('./features/tournaments/MineTurneringerContainer'));

// Tournament Calendar (new list-first design)
const TournamentCalendarPage = lazy(() => import('./features/tournament-calendar').then(m => ({ default: m.TournamentCalendarPage })));
const TournamentPlannerPage = lazy(() => import('./features/tournament-calendar').then(m => ({ default: m.TournamentPlannerPage })));
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
const StatsGuidePage = lazy(() => import('./features/stats-pages/StatsGuidePage'));
const EvalueringContainer = lazy(() => import('./features/evaluering/EvalueringContainer'));

// UI Lab (DEV-only)
const IS_DEV = process.env.NODE_ENV === 'development';
const UILabContainer = lazy(() => import('./features/ui-lab/UILabContainer'));
const StatsLab = lazy(() => import('./ui/lab/StatsLab'));
const AppShellLab = lazy(() => import('./ui/lab/AppShellLab'));
const CalendarLab = lazy(() => import('./ui/lab/CalendarLab'));
const UiCanonPage = lazy(() => import('./ui/lab/UiCanonPage'));
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const GoalsPage = lazy(() => import('./features/goals/GoalsPage'));
const StatsPageV2 = lazy(() => import('./features/stats/StatsPageV2'));
const CalendarPage = lazy(() => import('./features/calendar/CalendarPage'));
const DayViewPage = lazy(() => import('./features/calendar/DayViewPage'));
const CalendarOversiktPage = lazy(() => import('./features/calendar-oversikt').then(m => ({ default: m.CalendarOversiktPage })));

// Player Stats (DataGolf & Test Results)
const PlayerStatsPage = lazy(() => import('./features/player-stats').then(m => ({ default: m.PlayerStatsPage })));
const StrokesGainedPage = lazy(() => import('./features/player-stats').then(m => ({ default: m.StrokesGainedPage })));
const PlayerTestResultsPage = lazy(() => import('./features/player-stats').then(m => ({ default: m.TestResultsPage })));
const StatusProgressPage = lazy(() => import('./features/player-stats').then(m => ({ default: m.StatusProgressPage })));
const BenchmarkPage = lazy(() => import('./features/player-stats').then(m => ({ default: m.BenchmarkPage })));
const TreningsevalueringContainer = lazy(() => import('./features/evaluering/TreningsevalueringContainer'));
const TurneringsevalueringContainer = lazy(() => import('./features/evaluering/TurneringsevalueringContainer'));

// Min utvikling
const UtviklingsOversiktContainer = lazy(() => import('./features/utvikling/UtviklingsOversiktContainer'));
const BreakingPointsContainer = lazy(() => import('./features/utvikling/BreakingPointsContainer'));
const KategoriFremgangContainer = lazy(() => import('./features/utvikling/KategoriFremgangContainer'));
const BenchmarkHistorikkContainer = lazy(() => import('./features/utvikling/BenchmarkHistorikkContainer'));

// Trening
const TreningsdagbokContainer = lazy(() => import('./features/trening-plan/treningsdagbok').then(m => ({ default: m.TreningsdagbokPage })));
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

// Coach videos (lazy-loaded)
const CoachVideosDashboard = lazy(() => import('./features/coach-videos/CoachVideosDashboard').then(m => ({ default: m.CoachVideosDashboard })));
const ReferenceLibrary = lazy(() => import('./features/coach-videos/ReferenceLibrary').then(m => ({ default: m.ReferenceLibrary })));

// Video analysis (lazy-loaded)
const VideoAnalysisPage = lazy(() => import('./features/video-analysis/VideoAnalysisPage').then(m => ({ default: m.VideoAnalysisPage })));

// Video library for players (lazy-loaded)
const VideoLibraryPage = lazy(() => import('./features/video-library/VideoLibraryPage').then(m => ({ default: m.VideoLibraryPage })));

// Video comparison (lazy-loaded)
const VideoComparisonPage = lazy(() => import('./features/video-comparison/VideoComparisonPage').then(m => ({ default: m.VideoComparisonPage })));

// Video progress (lazy-loaded)
const VideoProgressView = lazy(() => import('./features/video-progress').then(m => ({ default: m.VideoProgressView })));

// Coach player profile (lazy-loaded)
const CoachPlayerPage = lazy(() => import('./features/coach-player/CoachPlayerPage').then(m => ({ default: m.CoachPlayerPage })));

// Coach groups (lazy-loaded)
const CoachGroupList = lazy(() => import('./features/coach-groups').then(m => ({ default: m.CoachGroupList })));
const CoachGroupDetail = lazy(() => import('./features/coach-groups').then(m => ({ default: m.CoachGroupDetail })));
const CoachGroupCreate = lazy(() => import('./features/coach-groups').then(m => ({ default: m.CoachGroupCreate })));
const CoachGroupPlan = lazy(() => import('./features/coach-groups').then(m => ({ default: m.CoachGroupPlan })));

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

// 404 Not Found (lazy-loaded)
const NotFoundPage = lazy(() => import('./features/not-found/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Landing page (lazy-loaded)
const SplitScreenLanding = lazy(() => import('./features/landing/SplitScreenLanding'));

// Layout component for authenticated pages using Top Navigation (Player)
const AuthenticatedLayout = ({ children, title, subtitle, actions }) => (
  <ApplicationLayoutTopNav title={title} subtitle={subtitle} actions={actions}>
    {children}
  </ApplicationLayoutTopNav>
);

// Dashboard layout - uses Top Navigation
const DashboardLayout = ({ children }) => (
  <ApplicationLayoutTopNav>{children}</ApplicationLayoutTopNav>
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

  // Initialize mobile app features (Capacitor)
  useEffect(() => {
    initMobileApp();
  }, []);

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <BadgeNotificationProvider>
              <ErrorBoundary>
                <TooltipProvider>
                {!isOnline && <OfflineBanner />}
                <Toast />
                <Toaster />
                <VideoNotificationManager />
                <NotificationManager />
            <Suspense fallback={<LoadingState />}>
              <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<SplitScreenLanding />} />

          {/* Landing page - redirects to dashboard if logged in */}
          <Route path="/" element={
            <PublicRoute>
              <SplitScreenLanding />
            </PublicRoute>
          } />

          {/* Mobile routes */}
          <Route path="/m" element={<ProtectedRoute><MobileShell /></ProtectedRoute>}>
            <Route path="home" element={<MobileHome />} />
            <Route path="plan" element={<MobilePlan />} />
            <Route path="log" element={<MobileQuickLog />} />
            <Route path="calendar" element={<MobileCalendar />} />
            <Route path="calibration" element={<MobileCalibration />} />
          </Route>

          {/* Desktop protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardContainer />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/profil" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Min profil" subtitle="Administrer kontoen din">
                <BrukerprofilContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/profil/oppdater" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Oppdater profil" subtitle="Rediger din spillerprofil">
                <BrukerprofilContainer forceOnboarding />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/trenerteam" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Trenerteam" subtitle="Dine trenere og støtteapparat">
                <TrenerteamContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/maalsetninger" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Målsetninger" subtitle="Sett og følg opp dine mål">
                <MaalsetningerContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/aarsplan" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Årsplan" subtitle="Din treningsplan for sesongen">
                <AarsplanContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/aarsplan/perioder" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Periodisering" subtitle="Periodeoversikt med fokusområder">
                <AarsplanContainer view="periods" />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/aarsplan/fokus" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Fokusområder" subtitle="Målsetninger for perioder">
                <AarsplanContainer view="focus" />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/aarsplan/ny" element={
            <ProtectedRoute>
              <AarsplanGenerator />
            </ProtectedRoute>
          } />
          <Route path="/testprotokoll" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Testprotokoll" subtitle="Gjennomfør tester">
                <TestprotokollContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/testresultater" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Testresultater" subtitle="Se dine resultater og fremgang">
                <TestresultaterContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/treningsprotokoll" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Treningsprotokoll" subtitle="Logg din trening">
                <TreningsprotokollContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/treningsstatistikk" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Treningsstatistikk" subtitle="Analyse av din trening">
                <TreningsstatistikkContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/stats" element={
            <ProtectedRoute>
              <DashboardLayout>
                <StatsPageV2 />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          {/* UI Lab Routes - DEV ONLY */}
          {IS_DEV && (
            <>
              <Route path="/ui-lab" element={
                <ProtectedRoute>
                  <AuthenticatedLayout title="UI Lab" subtitle="Komponentbibliotek">
                    <UILabContainer />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } />
              <Route path="/stats-lab" element={
                <ProtectedRoute>
                  <AuthenticatedLayout title="Stats Lab" subtitle="StatsGridTemplate demo">
                    <StatsLab />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } />
              <Route path="/appshell-lab" element={
                <ProtectedRoute>
                  <AuthenticatedLayout title="AppShell Lab" subtitle="AppShellTemplate demo">
                    <AppShellLab />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } />
              <Route path="/calendar-lab" element={
                <ProtectedRoute>
                  <AuthenticatedLayout title="Calendar Lab" subtitle="CalendarTemplate demo">
                    <CalendarLab />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } />
              <Route path="/ui-canon" element={
                <ProtectedRoute>
                  <AuthenticatedLayout title="UI Canon" subtitle="Single source of truth for visual style">
                    <UiCanonPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } />
            </>
          )}
          <Route path="/dashboard-v2" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/goals" element={
            <ProtectedRoute>
              <DashboardLayout>
                <GoalsPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/oevelser" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Øvelser" subtitle="Øvelsesbibliotek">
                <OevelserContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/notater" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Notater" subtitle="Dine notater og refleksjoner">
                <NotaterContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/arkiv" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Arkiv" subtitle="Historiske data">
                <ArkivContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/kalender" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Kalender" subtitle="Planlegg og se dine aktiviteter">
                <CalendarPage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/kalender/dag" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Dagsoversikt" subtitle="Dagens aktiviteter">
                <DayViewPage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/kalender/oversikt" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Kalenderoversikt" subtitle="Se hele planen din">
                <CalendarOversiktPage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/plan-preview/:planId" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Planforhåndsvisning" subtitle="Se din plan">
                <PlanPreviewContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/modification-requests" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Endringsforespørsler" subtitle="Håndter spillerforespørsler">
                <ModificationRequestDashboardContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Fremgang" subtitle="Se din utvikling over tid">
                <ProgressDashboardContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/achievements" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Prestasjoner" subtitle="Dine oppnåelser">
                <AchievementsDashboardContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/badges" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Merker" subtitle="Saml merker og vis frem">
                <BadgesContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/turneringskalender" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Turneringskalender" subtitle="Finn og planlegg turneringer">
                <TournamentCalendarPage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/turneringer/planlegger" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Turneringsplanlegger" subtitle="Min turneringsplan">
                <TournamentPlannerPage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          {/* Legacy route - keep for backwards compatibility */}
          <Route path="/turneringskalender-old" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Turneringskalender" subtitle="Kommende turneringer">
                <TurneringskalenderContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/mine-turneringer" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Mine turneringer" subtitle="Dine påmeldte turneringer">
                <MineTurneringerContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/ressurser" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Ressurser" subtitle="Læringsmateriell og videoer">
                <RessurserContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/skoleplan" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Skoleplan" subtitle="Balanse mellom skole og golf">
                <SkoleplanContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Session routes (APP_FUNCTIONALITY.md Section 6-12) */}
          <Route path="/session/new" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Ny økt" subtitle="Opprett treningsøkt">
                <SessionCreateFormContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/session/:sessionId" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Øktdetaljer" subtitle="Se og rediger økten">
                <SessionDetailViewContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/session/:sessionId/active" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Aktiv økt" subtitle="Gjennomfør treningsøkt">
                <ActiveSessionViewContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/session/:sessionId/reflection" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Refleksjon" subtitle="Reflekter over økten">
                <SessionReflectionFormContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/session/:sessionId/evaluate" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Evaluering" subtitle="Evaluer økten">
                <SessionEvaluationFormContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/session/stats" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Øktstatistikk" subtitle="Analyse av dine økter">
                <EvaluationStatsDashboardContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/sessions" element={
            <ProtectedRoute>
              <AuthenticatedLayout
                title="Alle økter"
                subtitle="Oversikt over dine treningsøkter"
                actions={
                  <Link to="/session/new">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Ny økt
                    </Button>
                  </Link>
                }
              >
                <SessionsListContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/ovelsesbibliotek" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Øvelsesbibliotek" subtitle="Finn og velg øvelser">
                <ExerciseLibraryContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* New routes from Dashboard Struktur */}
          {/* Planlegger */}
          <Route path="/periodeplaner" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Periodeplaner" subtitle="Langsiktig treningsplanlegging">
                <PeriodeplanerContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/samlinger" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Samlinger" subtitle="Deltakelse og oppmøte">
                <SamlingerContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Trening */}
          <Route path="/trening/dagens" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Dagens treningsplan" subtitle="Din plan for i dag">
                <DagensTreningsplanContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/trening/ukens" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Ukens treningsplan" subtitle="Din plan for denne uken">
                <UkensTreningsplanContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/trening/teknisk" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Teknisk plan" subtitle="Fokusområder og teknikk">
                <TekniskPlanContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Stats */}
          <Route path="/stats/ny" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Ny statistikk" subtitle="Registrer nye data">
                <StatsOppdateringContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/stats/turnering" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Turneringsstatistikk" subtitle="Resultater fra turneringer">
                <TurneringsstatistikkContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/stats/verktoy" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Statistikkverktøy" subtitle="Analyseverktøy">
                <StatsVerktoyContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/stats/guide" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Statistikk & Testing" subtitle="Slik fungerer det">
                <StatsGuidePage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Statistikk - Player Stats with DataGolf & Test Results */}
          <Route path="/statistikk" element={
            <ProtectedRoute>
              <DashboardLayout>
                <PlayerStatsPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/statistikk/status" element={
            <ProtectedRoute>
              <DashboardLayout>
                <StatusProgressPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/statistikk/strokes-gained" element={
            <ProtectedRoute>
              <DashboardLayout>
                <StrokesGainedPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/statistikk/testresultater" element={
            <ProtectedRoute>
              <DashboardLayout>
                <PlayerTestResultsPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/statistikk/benchmark" element={
            <ProtectedRoute>
              <DashboardLayout>
                <BenchmarkPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Evaluering */}
          <Route path="/evaluering" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Evaluering" subtitle="Vurder din innsats">
                <EvalueringContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/evaluering/trening" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Treningsevaluering" subtitle="Evaluer dine treningsøkter">
                <TreningsevalueringContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/evaluering/turnering" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Turneringsevaluering" subtitle="Evaluer dine turneringer">
                <TurneringsevalueringContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Min utvikling */}
          <Route path="/utvikling" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Min utvikling" subtitle="Følg din fremgang">
                <UtviklingsOversiktContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/utvikling/breaking-points" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Breaking Points" subtitle="Viktige milepæler">
                <BreakingPointsContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/utvikling/kategori" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Kategoriframgang" subtitle="Fremgang per kategori A-K">
                <KategoriFremgangContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/utvikling/benchmark" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Benchmark-historikk" subtitle="Sammenlign med andre">
                <BenchmarkHistorikkContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Trening */}
          <Route path="/trening/dagbok" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Treningsdagbok" subtitle="Din personlige logg">
                <TreningsdagbokContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/trening/logg" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Logg trening" subtitle="Registrer ny økt">
                <LoggTreningContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Kalender */}
          <Route path="/kalender/booking" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Book trener" subtitle="Bestill trenertimer">
                <BookTrenerContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Testing */}
          <Route path="/testing/krav" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Kategorikrav" subtitle="Krav for hver kategori">
                <KategoriKravContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/testing/registrer" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Registrer test" subtitle="Logg testresultat">
                <RegistrerTestContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Turneringer */}
          <Route path="/turneringer/resultater" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Turneringsresultater" subtitle="Dine resultater">
                <TurneringsResultaterContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/turneringer/registrer" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Registrer resultat" subtitle="Logg turneringsresultat">
                <RegistrerTurneringsResultatContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Kommunikasjon (Messaging & Notifications) */}
          <Route path="/meldinger" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Meldinger" subtitle="Kommuniser med trenere">
                <MessageCenter />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/meldinger/ny" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Ny melding" subtitle="Start en samtale">
                <NewConversation />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/meldinger/trener" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Trenermeldinger" subtitle="Meldinger fra trenere">
                <MessageCenter filterType="coach" />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/meldinger/:conversationId" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Samtale" subtitle="Les og svar på meldinger">
                <ConversationView />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/varsler" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Varsler" subtitle="Dine varslinger">
                <NotificationCenter />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Kunnskap */}
          <Route path="/bevis" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Bevis" subtitle="Dokumenter fremgang">
                <BevisContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Video Library for Players */}
          <Route path="/videos" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Videoer" subtitle="Dine sving-videoer">
                <VideoLibraryPage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Video Analysis */}
          <Route path="/videos/:videoId/analyze" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Videoanalyse" subtitle="Analyser din video">
                <VideoAnalysisPage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Video Comparison */}
          <Route path="/videos/compare" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Videosammenligning" subtitle="Sammenlign videoer side om side">
                <VideoComparisonPage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Video Progress */}
          <Route path="/videos/progress" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Videofremgang" subtitle="Spor din utvikling over tid">
                <VideoProgressView />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Skole */}
          <Route path="/skole/oppgaver" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Skoleoppgaver" subtitle="Balanse mellom skole og golf">
                <SkoleoppgaverContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* Innstillinger */}
          <Route path="/kalibrering" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Kalibrering" subtitle="Kalibrer dine innstillinger">
                <KalibreringsContainer />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/innstillinger/varsler" element={
            <ProtectedRoute>
              <AuthenticatedLayout title="Varselinnstillinger" subtitle="Administrer varsler">
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
          <Route path="/coach/videos" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachVideosDashboard />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/videos/:videoId/analyze" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <VideoAnalysisPage />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/videos/compare" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <VideoComparisonPage />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/reference-videos" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <ReferenceLibrary />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/players/:playerId" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachPlayerPage />
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
                <CoachGroupPlan />
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

          {/* 404 Catch-all route - must be last */}
          <Route path="*" element={<NotFoundPage />} />
            </Routes>
            </Suspense>
                </TooltipProvider>
              </ErrorBoundary>
            </BadgeNotificationProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
