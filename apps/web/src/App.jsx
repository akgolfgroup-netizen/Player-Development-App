/**
 * App Component
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Minimal inline styles (dynamic colors)
 */

import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { BadgeNotificationProvider } from './contexts/BadgeNotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { initMobileApp } from './utils/mobile';

// PWA & AI components
import OfflineIndicator from './components/ui/OfflineIndicator';
import { AICoachProvider, AICoachButton, AICoachPanel } from './features/ai-coach';
import CommandPalette from './features/command-palette';
import BuildInfo from './components/BuildInfo';

// Shared components (NOT lazy - needed immediately)
import PlayerAppShellV3 from './components/layout/PlayerAppShellV3';
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
const DashboardV5 = lazy(() => import('./features/dashboard/DashboardV5'));
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
const StatistikkHub = lazy(() => import('./features/player-stats').then(m => ({ default: m.StatistikkHub })));
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
const PEIBaneTestPage = lazy(() => import('./features/tests/PEIBaneTestPage'));
const TestDetailPage = lazy(() => import('./features/tests/pages/TestDetailPage'));

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
const TrainingCategorySystemPage = lazy(() => import('./features/knowledge/TrainingCategorySystemPage'));

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
const CoachAthleteHub = lazy(() => import('./features/coach-athletes').then(m => ({ default: m.CoachAthleteHub })));
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

// Coach athlete progression (lazy-loaded)
const CategoryProgressionPage = lazy(() => import('./features/coach-athlete-progression').then(m => ({ default: m.CategoryProgressionPage })));

// Coach groups (lazy-loaded)
const CoachGroupList = lazy(() => import('./features/coach-groups').then(m => ({ default: m.CoachGroupList })));
const CoachGroupDetail = lazy(() => import('./features/coach-groups').then(m => ({ default: m.CoachGroupDetail })));
const CoachGroupCreate = lazy(() => import('./features/coach-groups').then(m => ({ default: m.CoachGroupCreate })));
const CoachGroupPlan = lazy(() => import('./features/coach-groups').then(m => ({ default: m.CoachGroupPlan })));

// Samling (training camp) (lazy-loaded)
const SamlingList = lazy(() => import('./features/samling').then(m => ({ default: m.SamlingList })));
const SamlingDetail = lazy(() => import('./features/samling').then(m => ({ default: m.SamlingDetail })));
const SamlingCreate = lazy(() => import('./features/samling').then(m => ({ default: m.SamlingCreate })));

// Coach booking (lazy-loaded)
const CoachBookingCalendar = lazy(() => import('./features/coach-booking').then(m => ({ default: m.CoachBookingCalendar })));
const CoachBookingRequests = lazy(() => import('./features/coach-booking').then(m => ({ default: m.CoachBookingRequests })));
const CoachBookingSettings = lazy(() => import('./features/coach-booking').then(m => ({ default: m.CoachBookingSettings })));
const CoachCalendarPage = lazy(() => import('./features/calendar/CoachCalendarPage'));

// Coach tournaments (lazy-loaded)
const CoachTournamentCalendar = lazy(() => import('./features/coach-tournaments').then(m => ({ default: m.CoachTournamentCalendar })));
const CoachTournamentPlayers = lazy(() => import('./features/coach-tournaments').then(m => ({ default: m.CoachTournamentPlayers })));
const CoachTournamentResults = lazy(() => import('./features/coach-tournaments').then(m => ({ default: m.CoachTournamentResults })));

// Coach stats (lazy-loaded)
const CoachStatsOverview = lazy(() => import('./features/coach-stats').then(m => ({ default: m.CoachStatsOverview })));
const CoachStatsProgress = lazy(() => import('./features/coach-stats').then(m => ({ default: m.CoachStatsProgress })));
const CoachStatsRegression = lazy(() => import('./features/coach-stats').then(m => ({ default: m.CoachStatsRegression })));
const CoachDataGolf = lazy(() => import('./features/coach-stats').then(m => ({ default: m.CoachDataGolf })));
const PlayerComparisonTool = lazy(() => import('./features/coach-stats').then(m => ({ default: m.PlayerComparisonTool })));
const TeamAnalyticsDashboard = lazy(() => import('./features/coach-stats').then(m => ({ default: m.TeamAnalyticsDashboard })));

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
const CoachDetailView = lazy(() => import('./features/admin-coach-management').then(m => ({ default: m.CoachDetailView })));
const AdminTierManagement = lazy(() => import('./features/admin-tier-management').then(m => ({ default: m.AdminTierManagement })));
const AdminFeatureFlagsEditor = lazy(() => import('./features/admin-feature-flags').then(m => ({ default: m.AdminFeatureFlagsEditor })));
const AdminEscalationSupport = lazy(() => import('./features/admin-escalation').then(m => ({ default: m.AdminEscalationSupport })));

// 404 Not Found (lazy-loaded)
const NotFoundPage = lazy(() => import('./features/not-found/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Landing page (lazy-loaded)
const SplitScreenLanding = lazy(() => import('./features/landing/SplitScreenLanding'));

// Onboarding (lazy-loaded)
const OnboardingPage = lazy(() => import('./features/onboarding/OnboardingPage'));

// V3 Hub Pages (lazy-loaded)
const DashboardHub = lazy(() => import('./features/hub-pages/DashboardHub'));
const TreningHub = lazy(() => import('./features/hub-pages/TreningHub'));
const UtviklingHub = lazy(() => import('./features/hub-pages/UtviklingHub'));
const PlanHub = lazy(() => import('./features/hub-pages/PlanHub'));
const MerHub = lazy(() => import('./features/hub-pages/MerHub'));

// Player Layout - uses PlayerAppShellV3 with color-coded navigation
const PlayerLayout = ({ children }) => (
  <PlayerAppShellV3>{children}</PlayerAppShellV3>
);

// Layout component for coach pages using CoachAppShell
const CoachLayout = ({ children }) => (
  <CoachAppShell>{children}</CoachAppShell>
);

// Layout component for admin pages using AdminAppShell
const AdminLayout = ({ children }) => (
  <AdminAppShell>{children}</AdminAppShell>
);

// AI Coach wrapper - only shows for authenticated players (not on onboarding)
const AuthenticatedAICoach = () => {
  const { user, isAuthenticated } = useAuth();
  const location = window.location.pathname;

  // Hide on onboarding page
  if (location === '/onboarding') {
    return null;
  }

  // Only show AI Coach for authenticated players (not coaches/admins)
  if (!isAuthenticated || !user || user.role !== 'player') {
    return null;
  }

  return (
    <>
      <AICoachButton />
      <AICoachPanel />
    </>
  );
};

function App() {
  // Initialize mobile app features (Capacitor)
  useEffect(() => {
    initMobileApp();
  }, []);

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AICoachProvider>
          <NotificationProvider>
            <BadgeNotificationProvider>
              <ErrorBoundary>
                <TooltipProvider>
                <BuildInfo showBadge={process.env.NODE_ENV === 'development'} />
                <OfflineIndicator position="top" />
                <AuthenticatedAICoach />
                <Toast />
                <Toaster />
                <CommandPalette />
                <VideoNotificationManager />
                <NotificationManager />
            <Suspense fallback={<LoadingState />}>
              <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<SplitScreenLanding />} />

          {/* Onboarding - protected route for new players */}
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          } />

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

          {/* ════════════════════════════════════════════════════════════════
              PLAYER ROUTES - 5-område navigasjon med fargekodet design
              Dashboard, Trening (grønn), Utvikling (blå), Plan (amber), Mer (lilla)
              ════════════════════════════════════════════════════════════════ */}

          {/* Dashboard Hub */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <PlayerLayout>
                <DashboardHub />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/aktivitet" element={
            <ProtectedRoute>
              <PlayerLayout>
                <ProgressDashboardContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/varsler" element={
            <ProtectedRoute>
              <PlayerLayout>
                <NotificationCenter />
              </PlayerLayout>
            </ProtectedRoute>
          } />

          {/* Trening Hub (Green) */}
          <Route path="/trening" element={
            <ProtectedRoute>
              <PlayerLayout>
                <TreningHub />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/trening/logg" element={
            <ProtectedRoute>
              <PlayerLayout>
                <LoggTreningContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/trening/dagbok" element={
            <ProtectedRoute>
              <PlayerLayout>
                <TreningsdagbokContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/trening/okter" element={
            <ProtectedRoute>
              <PlayerLayout>
                <SessionsListContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/trening/plan" element={
            <ProtectedRoute>
              <PlayerLayout>
                <UkensTreningsplanContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/trening/ovelser" element={
            <ProtectedRoute>
              <PlayerLayout>
                <ExerciseLibraryContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/trening/videoer" element={
            <ProtectedRoute>
              <PlayerLayout>
                <VideoLibraryPage />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/trening/testing" element={
            <ProtectedRoute>
              <PlayerLayout>
                <TestprotokollContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/trening/testing/registrer" element={
            <ProtectedRoute>
              <PlayerLayout>
                <RegistrerTestContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/trening/kategorisystem" element={
            <ProtectedRoute>
              <PlayerLayout>
                <TrainingCategorySystemPage />
              </PlayerLayout>
            </ProtectedRoute>
          } />

          {/* Utvikling Hub (Blue) */}
          <Route path="/utvikling" element={
            <ProtectedRoute>
              <PlayerLayout>
                <UtviklingHub />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/utvikling/oversikt" element={
            <ProtectedRoute>
              <PlayerLayout>
                <UtviklingsOversiktContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/utvikling/statistikk" element={
            <ProtectedRoute>
              <PlayerLayout>
                <StatistikkHub />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/utvikling/historikk" element={
            <ProtectedRoute>
              <PlayerLayout>
                <ProgressDashboardContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/utvikling/testresultater" element={
            <ProtectedRoute>
              <PlayerLayout>
                <TestresultaterContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/utvikling/krav" element={
            <ProtectedRoute>
              <PlayerLayout>
                <KategoriKravContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/utvikling/badges" element={
            <ProtectedRoute>
              <PlayerLayout>
                <BadgesContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/utvikling/achievements" element={
            <ProtectedRoute>
              <PlayerLayout>
                <AchievementsDashboardContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />

          {/* Plan Hub (Amber) */}
          <Route path="/plan" element={
            <ProtectedRoute>
              <PlayerLayout>
                <PlanHub />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/plan/kalender" element={
            <ProtectedRoute>
              <PlayerLayout>
                <CalendarPage />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/plan/ukeplan" element={
            <ProtectedRoute>
              <PlayerLayout>
                <UkensTreningsplanContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/plan/booking" element={
            <ProtectedRoute>
              <PlayerLayout>
                <BookTrenerContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/plan/maal" element={
            <ProtectedRoute>
              <PlayerLayout>
                <MaalsetningerContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/plan/aarsplan" element={
            <ProtectedRoute>
              <PlayerLayout>
                <AarsplanContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/plan/turneringer" element={
            <ProtectedRoute>
              <PlayerLayout>
                <TournamentCalendarPage />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/plan/turneringer/mine" element={
            <ProtectedRoute>
              <PlayerLayout>
                <MineTurneringerContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />

          {/* Mer Hub (Purple) */}
          <Route path="/mer" element={
            <ProtectedRoute>
              <PlayerLayout>
                <MerHub />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/mer/profil" element={
            <ProtectedRoute>
              <PlayerLayout>
                <BrukerprofilContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/mer/profil/rediger" element={
            <ProtectedRoute>
              <PlayerLayout>
                <BrukerprofilContainer forceOnboarding />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/mer/trenerteam" element={
            <ProtectedRoute>
              <PlayerLayout>
                <TrenerteamContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/mer/meldinger" element={
            <ProtectedRoute>
              <PlayerLayout>
                <MessageCenter />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/mer/feedback" element={
            <ProtectedRoute>
              <PlayerLayout>
                <MessageCenter filterType="coach" />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/mer/kunnskap" element={
            <ProtectedRoute>
              <PlayerLayout>
                <RessurserContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          {/* Training Category System page moved to /trening */}
          <Route path="/mer/notater" element={
            <ProtectedRoute>
              <PlayerLayout>
                <NotaterContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/mer/innstillinger" element={
            <ProtectedRoute>
              <PlayerLayout>
                <VarselinnstillingerContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/mer/varsler" element={
            <ProtectedRoute>
              <PlayerLayout>
                <VarselinnstillingerContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/mer/kalibrering" element={
            <ProtectedRoute>
              <PlayerLayout>
                <KalibreringsContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />

          {/* ════════════════════════════════════════════════════════════════
              REDIRECTS - Gammel → Ny URL-struktur
              ════════════════════════════════════════════════════════════════ */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/hjem" element={<Navigate to="/dashboard" replace />} />
          <Route path="/tren" element={<Navigate to="/trening" replace />} />
          <Route path="/tren/*" element={<Navigate to="/trening" replace />} />
          <Route path="/planlegg" element={<Navigate to="/plan" replace />} />
          <Route path="/planlegg/*" element={<Navigate to="/plan" replace />} />
          <Route path="/analyser" element={<Navigate to="/utvikling" replace />} />
          <Route path="/analyser/*" element={<Navigate to="/utvikling" replace />} />
          <Route path="/samhandle" element={<Navigate to="/mer/meldinger" replace />} />
          <Route path="/samhandle/*" element={<Navigate to="/mer/meldinger" replace />} />

          {/* Desktop protected routes - Legacy (backward compatibility) */}
          <Route path="/profil" element={
            <ProtectedRoute>
              <PlayerLayout title="Min profil" subtitle="Administrer kontoen din">
                <BrukerprofilContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/profil/oppdater" element={
            <ProtectedRoute>
              <PlayerLayout title="Oppdater profil" subtitle="Rediger din spillerprofil">
                <BrukerprofilContainer forceOnboarding />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/trenerteam" element={
            <ProtectedRoute>
              <PlayerLayout title="Trenerteam" subtitle="Dine trenere og støtteapparat">
                <TrenerteamContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/maalsetninger" element={
            <ProtectedRoute>
              <PlayerLayout title="Målsetninger" subtitle="Sett og følg opp dine mål">
                <MaalsetningerContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/aarsplan" element={
            <ProtectedRoute>
              <PlayerLayout title="Årsplan" subtitle="Din treningsplan for sesongen">
                <AarsplanContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/aarsplan/perioder" element={
            <ProtectedRoute>
              <PlayerLayout title="Periodisering" subtitle="Periodeoversikt med fokusområder">
                <AarsplanContainer view="periods" />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/aarsplan/fokus" element={
            <ProtectedRoute>
              <PlayerLayout title="Fokusområder" subtitle="Målsetninger for perioder">
                <AarsplanContainer view="focus" />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/aarsplan/ny" element={
            <ProtectedRoute>
              <AarsplanGenerator />
            </ProtectedRoute>
          } />
          <Route path="/testprotokoll" element={
            <ProtectedRoute>
              <PlayerLayout title="Testprotokoll" subtitle="Gjennomfør tester">
                <TestprotokollContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/testresultater" element={
            <ProtectedRoute>
              <PlayerLayout title="Testresultater" subtitle="Se dine resultater og fremgang">
                <TestresultaterContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/treningsprotokoll" element={
            <ProtectedRoute>
              <PlayerLayout title="Treningsprotokoll" subtitle="Logg din trening">
                <TreningsprotokollContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/treningsstatistikk" element={
            <ProtectedRoute>
              <PlayerLayout title="Treningsstatistikk" subtitle="Analyse av din trening">
                <TreningsstatistikkContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/stats" element={
            <ProtectedRoute>
              <PlayerLayout>
                <StatsPageV2 />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          {/* UI Lab Routes - DEV ONLY */}
          {IS_DEV && (
            <>
              <Route path="/ui-lab" element={
                <ProtectedRoute>
                  <PlayerLayout title="UI Lab" subtitle="Komponentbibliotek">
                    <UILabContainer />
                  </PlayerLayout>
                </ProtectedRoute>
              } />
              <Route path="/stats-lab" element={
                <ProtectedRoute>
                  <PlayerLayout title="Stats Lab" subtitle="StatsGridTemplate demo">
                    <StatsLab />
                  </PlayerLayout>
                </ProtectedRoute>
              } />
              <Route path="/appshell-lab" element={
                <ProtectedRoute>
                  <PlayerLayout title="AppShell Lab" subtitle="AppShellTemplate demo">
                    <AppShellLab />
                  </PlayerLayout>
                </ProtectedRoute>
              } />
              <Route path="/calendar-lab" element={
                <ProtectedRoute>
                  <PlayerLayout title="Calendar Lab" subtitle="CalendarTemplate demo">
                    <CalendarLab />
                  </PlayerLayout>
                </ProtectedRoute>
              } />
              <Route path="/ui-canon" element={
                <ProtectedRoute>
                  <PlayerLayout title="UI Canon" subtitle="Single source of truth for visual style">
                    <UiCanonPage />
                  </PlayerLayout>
                </ProtectedRoute>
              } />
            </>
          )}
          <Route path="/dashboard-v2" element={
            <ProtectedRoute>
              <PlayerLayout>
                <DashboardPage />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/goals" element={
            <ProtectedRoute>
              <PlayerLayout>
                <GoalsPage />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/oevelser" element={
            <ProtectedRoute>
              <PlayerLayout title="Øvelser" subtitle="Øvelsesbibliotek">
                <OevelserContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/notater" element={
            <ProtectedRoute>
              <PlayerLayout title="Notater" subtitle="Dine notater og refleksjoner">
                <NotaterContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/arkiv" element={
            <ProtectedRoute>
              <PlayerLayout title="Arkiv" subtitle="Historiske data">
                <ArkivContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/kalender" element={
            <ProtectedRoute>
              <PlayerLayout title="Kalender" subtitle="Planlegg og se dine aktiviteter">
                <CalendarPage />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/kalender/dag" element={
            <ProtectedRoute>
              <PlayerLayout title="Dagsoversikt" subtitle="Dagens aktiviteter">
                <DayViewPage />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/kalender/oversikt" element={
            <ProtectedRoute>
              <PlayerLayout title="Kalenderoversikt" subtitle="Se hele planen din">
                <CalendarOversiktPage />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/plan-preview/:planId" element={
            <ProtectedRoute>
              <PlayerLayout title="Planforhåndsvisning" subtitle="Se din plan">
                <PlanPreviewContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/modification-requests" element={
            <ProtectedRoute>
              <PlayerLayout title="Endringsforespørsler" subtitle="Håndter spillerforespørsler">
                <ModificationRequestDashboardContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute>
              <PlayerLayout title="Fremgang" subtitle="Se din utvikling over tid">
                <ProgressDashboardContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/achievements" element={
            <ProtectedRoute>
              <PlayerLayout title="Prestasjoner" subtitle="Dine prestasjoner">
                <AchievementsDashboardContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/badges" element={
            <ProtectedRoute>
              <PlayerLayout title="Merker" subtitle="Saml merker og vis frem">
                <BadgesContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/turneringskalender" element={
            <ProtectedRoute>
              <PlayerLayout title="Turneringskalender" subtitle="Finn og planlegg turneringer">
                <TournamentCalendarPage />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/turneringer/planlegger" element={
            <ProtectedRoute>
              <PlayerLayout title="Turneringsplanlegger" subtitle="Min turneringsplan">
                <TournamentPlannerPage />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          {/* Legacy route - keep for backwards compatibility */}
          <Route path="/turneringskalender-old" element={
            <ProtectedRoute>
              <PlayerLayout title="Turneringskalender" subtitle="Kommende turneringer">
                <TurneringskalenderContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/mine-turneringer" element={
            <ProtectedRoute>
              <PlayerLayout title="Mine turneringer" subtitle="Dine påmeldte turneringer">
                <MineTurneringerContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/ressurser" element={
            <ProtectedRoute>
              <PlayerLayout title="Ressurser" subtitle="Læringsmateriell og videoer">
                <RessurserContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/skoleplan" element={
            <ProtectedRoute>
              <PlayerLayout title="Skoleplan" subtitle="Balanse mellom skole og golf">
                <SkoleplanContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />

          {/* Session routes (APP_FUNCTIONALITY.md Section 6-12) */}
          <Route path="/session/new" element={
            <ProtectedRoute>
              <PlayerLayout title="Ny økt" subtitle="Opprett treningsøkt">
                <SessionCreateFormContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/session/:sessionId" element={
            <ProtectedRoute>
              <PlayerLayout title="Øktdetaljer" subtitle="Se og rediger økten">
                <SessionDetailViewContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/session/:sessionId/active" element={
            <ProtectedRoute>
              <PlayerLayout title="Aktiv økt" subtitle="Gjennomfør treningsøkt">
                <ActiveSessionViewContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/session/:sessionId/reflection" element={
            <ProtectedRoute>
              <PlayerLayout title="Refleksjon" subtitle="Reflekter over økten">
                <SessionReflectionFormContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/session/:sessionId/evaluate" element={
            <ProtectedRoute>
              <PlayerLayout title="Evaluering" subtitle="Evaluer økten">
                <SessionEvaluationFormContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/session/stats" element={
            <ProtectedRoute>
              <PlayerLayout title="Øktstatistikk" subtitle="Analyse av dine økter">
                <EvaluationStatsDashboardContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/sessions" element={
            <ProtectedRoute>
              <PlayerLayout
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
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/ovelsesbibliotek" element={
            <ProtectedRoute>
              <PlayerLayout title="Øvelsesbibliotek" subtitle="Finn og velg øvelser">
                <ExerciseLibraryContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />

          {/* New routes from Dashboard Struktur */}
          {/* Planlegger */}
          <Route path="/periodeplaner" element={
            <ProtectedRoute>
              <PlayerLayout title="Periodeplaner" subtitle="Langsiktig treningsplanlegging">
                <PeriodeplanerContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/samlinger" element={
            <ProtectedRoute>
              <PlayerLayout title="Samlinger" subtitle="Deltakelse og oppmøte">
                <SamlingerContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />

          {/* Trening */}
          <Route path="/trening/dagens" element={
            <ProtectedRoute>
              <PlayerLayout title="Dagens treningsplan" subtitle="Din plan for i dag">
                <DagensTreningsplanContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/trening/ukens" element={
            <ProtectedRoute>
              <PlayerLayout title="Ukens treningsplan" subtitle="Din plan for denne uken">
                <UkensTreningsplanContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/trening/teknisk" element={
            <ProtectedRoute>
              <PlayerLayout title="Teknisk plan" subtitle="Fokusområder og teknikk">
                <TekniskPlanContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />

          {/* Stats */}
          <Route path="/stats/ny" element={
            <ProtectedRoute>
              <PlayerLayout title="Ny statistikk" subtitle="Registrer nye data">
                <StatsOppdateringContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/stats/turnering" element={
            <ProtectedRoute>
              <PlayerLayout title="Turneringsstatistikk" subtitle="Resultater fra turneringer">
                <TurneringsstatistikkContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/stats/verktoy" element={
            <ProtectedRoute>
              <PlayerLayout title="Statistikkverktøy" subtitle="Analyseverktøy">
                <StatsVerktoyContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/stats/guide" element={
            <ProtectedRoute>
              <PlayerLayout title="Statistikk & Testing" subtitle="Slik fungerer det">
                <StatsGuidePage />
              </PlayerLayout>
            </ProtectedRoute>
          } />

          {/* Statistikk Hub - Unified tab navigation for all statistics */}
          <Route path="/statistikk" element={
            <ProtectedRoute>
              <PlayerLayout>
                <StatistikkHub />
              </PlayerLayout>
            </ProtectedRoute>
          } />

          {/* Evaluering */}
          <Route path="/evaluering" element={
            <ProtectedRoute>
              <PlayerLayout title="Evaluering" subtitle="Vurder din innsats">
                <EvalueringContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/evaluering/trening" element={
            <ProtectedRoute>
              <PlayerLayout title="Treningsevaluering" subtitle="Evaluer dine treningsøkter">
                <TreningsevalueringContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/evaluering/turnering" element={
            <ProtectedRoute>
              <PlayerLayout title="Turneringsevaluering" subtitle="Evaluer dine turneringer">
                <TurneringsevalueringContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />

          {/* Min utvikling */}
          <Route path="/utvikling" element={
            <ProtectedRoute>
              <PlayerLayout title="Min utvikling" subtitle="Følg din fremgang">
                <UtviklingsOversiktContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/utvikling/breaking-points" element={
            <ProtectedRoute>
              <PlayerLayout title="Breaking Points" subtitle="Viktige milepæler">
                <BreakingPointsContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/utvikling/kategori" element={
            <ProtectedRoute>
              <PlayerLayout title="Kategoriframgang" subtitle="Fremgang per kategori A-K">
                <KategoriFremgangContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/utvikling/benchmark" element={
            <ProtectedRoute>
              <PlayerLayout title="Benchmark-historikk" subtitle="Sammenlign med andre">
                <BenchmarkHistorikkContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />

          {/* Trening */}
          <Route path="/trening/dagbok" element={
            <ProtectedRoute>
              <PlayerLayout title="Treningsdagbok" subtitle="Din personlige logg">
                <TreningsdagbokContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/trening/logg" element={
            <ProtectedRoute>
              <PlayerLayout title="Logg trening" subtitle="Registrer ny økt">
                <LoggTreningContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />

          {/* Kalender */}
          <Route path="/kalender/booking" element={
            <ProtectedRoute>
              <PlayerLayout title="Book trener" subtitle="Bestill trenertimer">
                <BookTrenerContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />

          {/* Testing */}
          <Route path="/testing/krav" element={
            <ProtectedRoute>
              <PlayerLayout title="Kategorikrav" subtitle="Krav for hver kategori">
                <KategoriKravContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/testing/registrer" element={
            <ProtectedRoute>
              <PlayerLayout title="Registrer test" subtitle="Logg testresultat">
                <RegistrerTestContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/testing/pei-bane" element={
            <ProtectedRoute>
              <PlayerLayout title="PEI Test - Bane" subtitle="Test din presisjon på banen">
                <PEIBaneTestPage />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/testing/:testId" element={
            <ProtectedRoute>
              <TestDetailPage />
            </ProtectedRoute>
          } />

          {/* Turneringer */}
          <Route path="/turneringer/resultater" element={
            <ProtectedRoute>
              <PlayerLayout title="Turneringsresultater" subtitle="Dine resultater">
                <TurneringsResultaterContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/turneringer/registrer" element={
            <ProtectedRoute>
              <PlayerLayout title="Registrer resultat" subtitle="Logg turneringsresultat">
                <RegistrerTurneringsResultatContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />

          {/* Kommunikasjon (Messaging & Notifications) */}
          <Route path="/meldinger" element={
            <ProtectedRoute>
              <PlayerLayout title="Meldinger" subtitle="Kommuniser med trenere">
                <MessageCenter />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/meldinger/ny" element={
            <ProtectedRoute>
              <PlayerLayout title="Ny melding" subtitle="Start en samtale">
                <NewConversation />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/meldinger/trener" element={
            <ProtectedRoute>
              <PlayerLayout title="Trenermeldinger" subtitle="Meldinger fra trenere">
                <MessageCenter filterType="coach" />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/meldinger/:conversationId" element={
            <ProtectedRoute>
              <PlayerLayout title="Samtale" subtitle="Les og svar på meldinger">
                <ConversationView />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/varsler" element={
            <ProtectedRoute>
              <PlayerLayout title="Varsler" subtitle="Dine varslinger">
                <NotificationCenter />
              </PlayerLayout>
            </ProtectedRoute>
          } />

          {/* Kunnskap */}
          <Route path="/bevis" element={
            <ProtectedRoute>
              <PlayerLayout title="Bevis" subtitle="Dokumenter fremgang">
                <BevisContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />

          {/* Video Library for Players */}
          <Route path="/videos" element={
            <ProtectedRoute>
              <PlayerLayout title="Videoer" subtitle="Dine sving-videoer">
                <VideoLibraryPage />
              </PlayerLayout>
            </ProtectedRoute>
          } />

          {/* Video Analysis */}
          <Route path="/videos/:videoId/analyze" element={
            <ProtectedRoute>
              <PlayerLayout title="Videoanalyse" subtitle="Analyser din video">
                <VideoAnalysisPage />
              </PlayerLayout>
            </ProtectedRoute>
          } />

          {/* Video Comparison */}
          <Route path="/videos/compare" element={
            <ProtectedRoute>
              <PlayerLayout title="Videosammenligning" subtitle="Sammenlign videoer side om side">
                <VideoComparisonPage />
              </PlayerLayout>
            </ProtectedRoute>
          } />

          {/* Video Progress */}
          <Route path="/videos/progress" element={
            <ProtectedRoute>
              <PlayerLayout title="Videofremgang" subtitle="Spor din utvikling over tid">
                <VideoProgressView />
              </PlayerLayout>
            </ProtectedRoute>
          } />

          {/* Skole */}
          <Route path="/skole/oppgaver" element={
            <ProtectedRoute>
              <PlayerLayout title="Skoleoppgaver" subtitle="Balanse mellom skole og golf">
                <SkoleoppgaverContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />

          {/* Innstillinger */}
          <Route path="/kalibrering" element={
            <ProtectedRoute>
              <PlayerLayout title="Kalibrering" subtitle="Kalibrer dine innstillinger">
                <KalibreringsContainer />
              </PlayerLayout>
            </ProtectedRoute>
          } />
          <Route path="/innstillinger/varsler" element={
            <ProtectedRoute>
              <PlayerLayout title="Varselinnstillinger" subtitle="Administrer varsler">
                <VarselinnstillingerContainer />
              </PlayerLayout>
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
          {/* CoachAthleteHub - Consolidated athlete management with tabs */}
          <Route path="/coach/athletes" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachAthleteHub />
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
          <Route path="/coach/athletes/:athleteId/proof" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachProofViewer />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/athletes/:athleteId/progression" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CategoryProgressionPage />
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

          {/* Samlinger (Training Camps) */}
          <Route path="/coach/samlinger" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <SamlingList />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/samlinger/ny" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <SamlingCreate />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/samlinger/:id" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <SamlingDetail />
              </CoachLayout>
            </ProtectedRoute>
          } />

          {/* Coach Calendar (new enhanced) */}
          <Route path="/coach/calendar" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachCalendarPage />
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
          <Route path="/coach/stats/compare" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <PlayerComparisonTool />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/stats/team" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <TeamAnalyticsDashboard />
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

          {/* Coach Training System & Areas */}
          <Route path="/coach/training-system" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <TrainingCategorySystemPage />
              </CoachLayout>
            </ProtectedRoute>
          } />
          <Route path="/coach/training-areas" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <TrainingCategorySystemPage />
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
          <Route path="/coach/session-evaluations" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachSessionEvaluations />
              </CoachLayout>
            </ProtectedRoute>
          } />

          {/* Coach Athlete Status */}
          <Route path="/coach/athlete-status" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <CoachAthleteStatus />
              </CoachLayout>
            </ProtectedRoute>
          } />

          {/* Coach Modification Requests */}
          <Route path="/coach/modification-requests" element={
            <ProtectedRoute requiredRole="coach">
              <CoachLayout>
                <ModificationRequestDashboardContainer />
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
          <Route path="/admin/users/coaches/:coachId" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <CoachDetailView />
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
          </AICoachProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
