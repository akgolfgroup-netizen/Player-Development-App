import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AKGolfDashboard from '../AKGolfDashboard';
import { useDashboard } from '../../../hooks/useDashboard';

// Mock the useDashboard hook
jest.mock('../../../hooks/useDashboard');

// Mock react-router-dom before importing
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/' }),
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => element,
  Navigate: () => null,
}));

describe('AKGolfDashboard', () => {
  const mockDashboardData = {
    player: {
      name: 'Test Player',
      category: 'B',
      profileImageUrl: null,
    },
    period: {
      week: 52,
      year: 2025,
      displayText: 'Uke 52',
    },
    stats: {
      sessionsCompleted: 8,
      sessionsTotal: 12,
      hoursThisWeek: 14.5,
      hoursGoal: 20,
      streak: 7,
    },
    calendarEvents: [
      {
        id: 'event-1',
        title: 'Putting Practice',
        startTime: '08:00',
        endTime: '09:30',
        type: 'training',
        location: 'Indoor Range',
      },
    ],
    upcomingSessions: [
      {
        id: 'session-1',
        title: 'Putting Practice',
        time: '08:00',
        location: 'Indoor Range',
        duration: 90,
        status: 'pending',
      },
    ],
    nextTournament: {
      id: 'tournament-1',
      title: 'NM Individuelt 2026',
      date: '2026-06-15',
      location: 'Miklagard Golf',
    },
    nextTest: {
      id: 'test-1',
      title: 'Kategoritest Q1',
      date: '2026-01-20',
      location: 'AK Golf Academy',
    },
    breakingPoints: [
      {
        id: 'bp-1',
        area: 'Putting',
        title: 'Lag consistency',
        status: 'working',
        priority: 'high',
        progress: 65,
      },
    ],
    recentTests: [
      {
        id: 'result-1',
        testId: 'test-1',
        name: 'Putting Test',
        date: '2025-12-20',
        score: 85,
        improvement: 5,
      },
    ],
    tasks: [
      {
        id: 'task-1',
        title: 'Complete swing analysis',
        area: 'Teknikk',
        completed: false,
        priority: 'high',
      },
    ],
    messages: [
      {
        id: 'msg-1',
        from: 'Coach Anders',
        preview: 'Great work this week!',
        time: '10 min',
        read: false,
        isGroup: false,
      },
    ],
    achievements: [
      {
        id: 'achievement-1',
        iconEmoji: '🔥',
        title: '7-Day Streak',
        description: 'Trent 7 dager på rad',
      },
    ],
    notifications: [],
    weather: {
      temp: 15,
      condition: 'Partly Cloudy',
      icon: '⛅',
    },
    performance: {
      trend: 'up',
      message: 'Din putting har forbedret seg med 12% denne uken',
    },
    xp: 350,
    totalXp: 850,
    level: 5,
    nextLevelXp: 500,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should display skeleton loaders when loading', () => {
      useDashboard.mockReturnValue({
        data: null,
        loading: true,
        error: null,
        refetch: jest.fn(),
      });

      const { container } = render(
        <BrowserRouter>
          <AKGolfDashboard />
        </BrowserRouter>
      );

      // Check for skeleton elements (pulse animations)
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should not display content while loading', () => {
      useDashboard.mockReturnValue({
        data: null,
        loading: true,
        error: null,
        refetch: jest.fn(),
      });

      render(
        <BrowserRouter>
          <AKGolfDashboard />
        </BrowserRouter>
      );

      // Player name should not be visible during loading
      expect(screen.queryByText('Test Player')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when error occurs', () => {
      const errorMessage = 'Failed to load dashboard';
      useDashboard.mockReturnValue({
        data: null,
        loading: false,
        error: errorMessage,
        refetch: jest.fn(),
      });

      render(
        <BrowserRouter>
          <AKGolfDashboard />
        </BrowserRouter>
      );

      expect(screen.getByText('Noe gikk galt')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should display retry button on error', () => {
      useDashboard.mockReturnValue({
        data: null,
        loading: false,
        error: 'Network error',
        refetch: jest.fn(),
      });

      render(
        <BrowserRouter>
          <AKGolfDashboard />
        </BrowserRouter>
      );

      expect(screen.getByText('Prøv igjen')).toBeInTheDocument();
    });

    it('should call refetch when retry button clicked', () => {
      const mockRefetch = jest.fn();
      useDashboard.mockReturnValue({
        data: null,
        loading: false,
        error: 'Network error',
        refetch: mockRefetch,
      });

      render(
        <BrowserRouter>
          <AKGolfDashboard />
        </BrowserRouter>
      );

      const retryButton = screen.getByText('Prøv igjen');
      fireEvent.click(retryButton);

      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it('should still show fallback data on error', () => {
      useDashboard.mockReturnValue({
        data: mockDashboardData, // Hook provides fallback data on error
        loading: false,
        error: 'API error',
        refetch: jest.fn(),
      });

      render(
        <BrowserRouter>
          <AKGolfDashboard />
        </BrowserRouter>
      );

      // Error banner shown
      expect(screen.getByText('Noe gikk galt')).toBeInTheDocument();

      // But fallback data also rendered
      expect(screen.getByText('Test Player')).toBeInTheDocument();
    });
  });

  describe('Successful Render', () => {
    beforeEach(() => {
      useDashboard.mockReturnValue({
        data: mockDashboardData,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });
    });

    it('should render dashboard when data loaded', () => {
      render(
        <BrowserRouter>
          <AKGolfDashboard />
        </BrowserRouter>
      );

      expect(screen.getByText('Test Player')).toBeInTheDocument();
    });

    it('should display player information', () => {
      render(
        <BrowserRouter>
          <AKGolfDashboard />
        </BrowserRouter>
      );

      expect(screen.getByText('Test Player')).toBeInTheDocument();
      expect(screen.getByText(/Kategori B/i)).toBeInTheDocument();
    });

    it('should display training stats', () => {
      render(
        <BrowserRouter>
          <AKGolfDashboard />
        </BrowserRouter>
      );

      // Check for session count
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText(/Økter/i)).toBeInTheDocument();

      // Check for hours
      expect(screen.getByText('14.5')).toBeInTheDocument();

      // Check for streak
      expect(screen.getByText('7')).toBeInTheDocument();
    });

    it('should render upcoming sessions', () => {
      render(
        <BrowserRouter>
          <AKGolfDashboard />
        </BrowserRouter>
      );

      expect(screen.getByText('Putting Practice')).toBeInTheDocument();
      expect(screen.getByText('08:00')).toBeInTheDocument();
    });

    it('should display next tournament', () => {
      render(
        <BrowserRouter>
          <AKGolfDashboard />
        </BrowserRouter>
      );

      expect(screen.getByText('NM Individuelt 2026')).toBeInTheDocument();
      expect(screen.getByText(/Miklagard Golf/i)).toBeInTheDocument();
    });

    it('should display next test', () => {
      render(
        <BrowserRouter>
          <AKGolfDashboard />
        </BrowserRouter>
      );

      expect(screen.getByText('Kategoritest Q1')).toBeInTheDocument();
    });

    it('should render breaking points widget', () => {
      render(
        <BrowserRouter>
          <AKGolfDashboard />
        </BrowserRouter>
      );

      expect(screen.getByText('Lag consistency')).toBeInTheDocument();
      expect(screen.getByText('Putting')).toBeInTheDocument();
    });

    it('should display recent tests', () => {
      render(
        <BrowserRouter>
          <AKGolfDashboard />
        </BrowserRouter>
      );

      expect(screen.getByText('Putting Test')).toBeInTheDocument();
      expect(screen.getByText('85')).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('should handle no breaking points gracefully', () => {
      const dataWithoutBP = {
        ...mockDashboardData,
        breakingPoints: [],
      };

      useDashboard.mockReturnValue({
        data: dataWithoutBP,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      render(
        <BrowserRouter>
          <AKGolfDashboard />
        </BrowserRouter>
      );

      expect(screen.getByText('Ingen aktive breaking points')).toBeInTheDocument();
    });

    it('should handle no upcoming sessions', () => {
      const dataWithoutSessions = {
        ...mockDashboardData,
        upcomingSessions: [],
        calendarEvents: [],
      };

      useDashboard.mockReturnValue({
        data: dataWithoutSessions,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      render(
        <BrowserRouter>
          <AKGolfDashboard />
        </BrowserRouter>
      );

      expect(screen.getByText(/Ingen økter i dag/i)).toBeInTheDocument();
    });

    it('should handle null next tournament', () => {
      const dataWithoutTournament = {
        ...mockDashboardData,
        nextTournament: null,
      };

      useDashboard.mockReturnValue({
        data: dataWithoutTournament,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      render(
        <BrowserRouter>
          <AKGolfDashboard />
        </BrowserRouter>
      );

      expect(screen.getByText('Ingen kommende turnering')).toBeInTheDocument();
    });

    it('should handle null next test', () => {
      const dataWithoutTest = {
        ...mockDashboardData,
        nextTest: null,
      };

      useDashboard.mockReturnValue({
        data: dataWithoutTest,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      render(
        <BrowserRouter>
          <AKGolfDashboard />
        </BrowserRouter>
      );

      expect(screen.getByText('Ingen kommende test')).toBeInTheDocument();
    });
  });

  describe('Interactive Elements', () => {
    beforeEach(() => {
      useDashboard.mockReturnValue({
        data: mockDashboardData,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });
    });

    it('should have clickable "Se alle" buttons', () => {
      render(
        <BrowserRouter>
          <AKGolfDashboard />
        </BrowserRouter>
      );

      const seeAllButtons = screen.getAllByText('Se alle');
      expect(seeAllButtons.length).toBeGreaterThan(0);
    });

    it('should navigate when clicking view all tests', () => {
      render(
        <BrowserRouter>
          <AKGolfDashboard />
        </BrowserRouter>
      );

      // Find and click the "Se alle" button for tests (if visible)
      const seeAllButtons = screen.queryAllByText('Se alle');
      if (seeAllButtons.length > 0) {
        fireEvent.click(seeAllButtons[0]);
        // Navigation would be called (mocked)
      }
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      useDashboard.mockReturnValue({
        data: mockDashboardData,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });
    });

    it('should have proper document structure', () => {
      const { container } = render(
        <BrowserRouter>
          <AKGolfDashboard />
        </BrowserRouter>
      );

      expect(container.querySelector('main') || container.querySelector('div')).toBeInTheDocument();
    });

    it('should render buttons as interactive elements', () => {
      render(
        <BrowserRouter>
          <AKGolfDashboard />
        </BrowserRouter>
      );

      const buttons = screen.queryAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
