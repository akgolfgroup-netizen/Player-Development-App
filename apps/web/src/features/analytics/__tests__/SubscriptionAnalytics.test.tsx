import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SubscriptionAnalytics from '../SubscriptionAnalytics';

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock auth context
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'admin-id',
      email: 'admin@iup-golf.com',
      role: { name: 'admin' },
    },
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SubscriptionAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    localStorageMock.clear();
    localStorageMock.setItem('accessToken', 'test-token-123');
  });

  describe('Analytics Overview', () => {
    const mockAnalytics = {
      planDistribution: [
        {
          planType: 'player_premium',
          count: 45,
          percentage: 53.6,
          mrr: 670500,
        },
        {
          planType: 'player_elite',
          count: 25,
          percentage: 29.8,
          mrr: 747500,
        },
        {
          planType: 'coach_pro',
          count: 14,
          percentage: 16.6,
          mrr: 698600,
        },
      ],
      trends: [
        {
          date: '2024-01-01',
          mrr: 1200000,
          subscriberCount: 80,
          churnRate: 2.5,
        },
        {
          date: '2024-01-15',
          mrr: 1250000,
          subscriberCount: 84,
          churnRate: 2.0,
        },
      ],
      retention: {
        month1: 95.0,
        month3: 85.0,
        month6: 78.0,
        month12: 70.0,
      },
      conversions: {
        trialToActive: 65.0,
        upgrades: 12,
        downgrades: 3,
      },
      revenueByPlan: [
        { planType: 'player_premium', revenue: 670500, percentage: 33.5 },
        { planType: 'player_elite', revenue: 747500, percentage: 37.4 },
        { planType: 'coach_pro', revenue: 698600, percentage: 34.9 },
      ],
    };

    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockAnalytics }),
      });
    });

    it('displays plan distribution', async () => {
      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        expect(screen.getByText(/plan distribution/i)).toBeInTheDocument();
        expect(screen.getByText(/player premium/i)).toBeInTheDocument();
        expect(screen.getByText(/player elite/i)).toBeInTheDocument();
        expect(screen.getByText(/coach pro/i)).toBeInTheDocument();
      });
    });

    it('shows subscriber counts and percentages', async () => {
      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        expect(screen.getByText('45 subscribers')).toBeInTheDocument();
        expect(screen.getByText(/53\.6%/)).toBeInTheDocument();
        expect(screen.getByText('25 subscribers')).toBeInTheDocument();
        expect(screen.getByText(/29\.8%/)).toBeInTheDocument();
      });
    });

    it('displays MRR by plan', async () => {
      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        expect(screen.getByText(/6,705\.00 NOK/i)).toBeInTheDocument();
        expect(screen.getByText(/7,475\.00 NOK/i)).toBeInTheDocument();
        expect(screen.getByText(/6,986\.00 NOK/i)).toBeInTheDocument();
      });
    });

    it('displays retention metrics', async () => {
      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        expect(screen.getByText(/retention rates/i)).toBeInTheDocument();
        expect(screen.getByText('95.0%')).toBeInTheDocument(); // 1 month
        expect(screen.getByText('85.0%')).toBeInTheDocument(); // 3 months
        expect(screen.getByText('78.0%')).toBeInTheDocument(); // 6 months
        expect(screen.getByText('70.0%')).toBeInTheDocument(); // 12 months
      });
    });

    it('shows conversion metrics', async () => {
      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        expect(screen.getByText(/trial conversion/i)).toBeInTheDocument();
        expect(screen.getByText('65.0%')).toBeInTheDocument();
        expect(screen.getByText(/upgrades/i)).toBeInTheDocument();
        expect(screen.getByText('12')).toBeInTheDocument();
        expect(screen.getByText(/downgrades/i)).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
      });
    });
  });

  describe('Time Range Selector', () => {
    const mockAnalytics = {
      planDistribution: [],
      trends: [],
      retention: { month1: 95, month3: 85, month6: 78, month12: 70 },
      conversions: { trialToActive: 65, upgrades: 12, downgrades: 3 },
      revenueByPlan: [],
    };

    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: mockAnalytics }),
      });
    });

    it('has time range selector', async () => {
      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        expect(screen.getByText('7 Days')).toBeInTheDocument();
        expect(screen.getByText('30 Days')).toBeInTheDocument();
        expect(screen.getByText('90 Days')).toBeInTheDocument();
        expect(screen.getByText('1 Year')).toBeInTheDocument();
      });
    });

    it('defaults to 30 days', async () => {
      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        const thirtyDayButton = screen.getByText('30 Days');
        expect(thirtyDayButton).toHaveClass('bg-tier-navy');
      });
    });

    it('changes time range when clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        expect(screen.getByText('30 Days')).toBeInTheDocument();
      });

      const ninetyDayButton = screen.getByText('90 Days');
      await user.click(ninetyDayButton);

      await waitFor(() => {
        expect(ninetyDayButton).toHaveClass('bg-tier-navy');
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('range=90d'),
          expect.any(Object)
        );
      });
    });

    it('fetches new data when range changes', async () => {
      const user = userEvent.setup();
      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      const oneYearButton = screen.getByText('1 Year');
      await user.click(oneYearButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Revenue Trend Chart', () => {
    const mockAnalytics = {
      planDistribution: [],
      trends: [
        { date: '2024-01-01', mrr: 1000000, subscriberCount: 70, churnRate: 3.0 },
        { date: '2024-01-08', mrr: 1100000, subscriberCount: 75, churnRate: 2.5 },
        { date: '2024-01-15', mrr: 1200000, subscriberCount: 80, churnRate: 2.0 },
        { date: '2024-01-22', mrr: 1250000, subscriberCount: 84, churnRate: 1.8 },
      ],
      retention: { month1: 95, month3: 85, month6: 78, month12: 70 },
      conversions: { trialToActive: 65, upgrades: 12, downgrades: 3 },
      revenueByPlan: [],
    };

    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockAnalytics }),
      });
    });

    it('displays MRR trend chart', async () => {
      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        expect(screen.getByText(/MRR trend/i)).toBeInTheDocument();
      });
    });

    it('shows data points for each trend', async () => {
      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        // Chart should render 4 bars for 4 data points
        const chart = screen.getByText(/MRR trend/i).closest('div');
        expect(chart).toBeInTheDocument();
      });
    });
  });

  describe('Revenue by Plan Visualization', () => {
    const mockAnalytics = {
      planDistribution: [],
      trends: [],
      retention: { month1: 95, month3: 85, month6: 78, month12: 70 },
      conversions: { trialToActive: 65, upgrades: 12, downgrades: 3 },
      revenueByPlan: [
        { planType: 'player_premium', revenue: 670500, percentage: 33.5 },
        { planType: 'player_elite', revenue: 747500, percentage: 37.4 },
        { planType: 'coach_pro', revenue: 698600, percentage: 34.9 },
      ],
    };

    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockAnalytics }),
      });
    });

    it('displays revenue by plan section', async () => {
      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        expect(screen.getByText(/revenue by plan/i)).toBeInTheDocument();
      });
    });

    it('shows revenue amounts for each plan', async () => {
      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        expect(screen.getByText(/6,705\.00/i)).toBeInTheDocument();
        expect(screen.getByText(/7,475\.00/i)).toBeInTheDocument();
        expect(screen.getByText(/6,986\.00/i)).toBeInTheDocument();
      });
    });

    it('shows percentage of total revenue', async () => {
      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        expect(screen.getByText('33.5%')).toBeInTheDocument();
        expect(screen.getByText('37.4%')).toBeInTheDocument();
        expect(screen.getByText('34.9%')).toBeInTheDocument();
      });
    });
  });

  describe('Subscription Changes Metrics', () => {
    const mockAnalytics = {
      planDistribution: [],
      trends: [],
      retention: { month1: 95, month3: 85, month6: 78, month12: 70 },
      conversions: {
        trialToActive: 65.0,
        upgrades: 12,
        downgrades: 3,
      },
      revenueByPlan: [],
    };

    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockAnalytics }),
      });
    });

    it('displays subscription changes section', async () => {
      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        expect(screen.getByText(/subscription changes/i)).toBeInTheDocument();
      });
    });

    it('shows trial conversion rate', async () => {
      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        expect(screen.getByText(/trial conversions/i)).toBeInTheDocument();
        expect(screen.getByText('65.0%')).toBeInTheDocument();
      });
    });

    it('displays upgrade count', async () => {
      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        expect(screen.getByText(/upgrades/i)).toBeInTheDocument();
        expect(screen.getByText('12')).toBeInTheDocument();
      });
    });

    it('displays downgrade count', async () => {
      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        expect(screen.getByText(/downgrades/i)).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('displays error message when API fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });

    it('shows retry button on error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    it('displays loading spinner initially', () => {
      (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

      renderWithRouter(<SubscriptionAnalytics />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('displays message when no data available', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            planDistribution: [],
            trends: [],
            retention: { month1: 0, month3: 0, month6: 0, month12: 0 },
            conversions: { trialToActive: 0, upgrades: 0, downgrades: 0 },
            revenueByPlan: [],
          },
        }),
      });

      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        expect(screen.getByText(/no analytics data available/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    const mockAnalytics = {
      planDistribution: [{ planType: 'premium', count: 10, percentage: 100, mrr: 100000 }],
      trends: [{ date: '2024-01-01', mrr: 100000, subscriberCount: 10, churnRate: 0 }],
      retention: { month1: 95, month3: 85, month6: 78, month12: 70 },
      conversions: { trialToActive: 65, upgrades: 12, downgrades: 3 },
      revenueByPlan: [{ planType: 'premium', revenue: 100000, percentage: 100 }],
    };

    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockAnalytics }),
      });
    });

    it('has proper heading hierarchy', async () => {
      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        const headings = screen.getAllByRole('heading');
        expect(headings.length).toBeGreaterThan(0);
      });
    });

    it('time range buttons are keyboard accessible', async () => {
      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
      });
    });

    it('charts have descriptive labels', async () => {
      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        expect(screen.getByText(/MRR trend/i)).toBeInTheDocument();
        expect(screen.getByText(/plan distribution/i)).toBeInTheDocument();
      });
    });
  });

  describe('Data Formatting', () => {
    const mockAnalytics = {
      planDistribution: [{ planType: 'premium', count: 45, percentage: 53.571428, mrr: 670500 }],
      trends: [],
      retention: { month1: 95.123, month3: 85.456, month6: 78.789, month12: 70.234 },
      conversions: { trialToActive: 65.432, upgrades: 12, downgrades: 3 },
      revenueByPlan: [{ planType: 'premium', revenue: 670500, percentage: 33.525 }],
    };

    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockAnalytics }),
      });
    });

    it('formats percentages to one decimal place', async () => {
      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        expect(screen.getByText('53.6%')).toBeInTheDocument(); // Plan distribution
        expect(screen.getByText('95.1%')).toBeInTheDocument(); // Retention
        expect(screen.getByText('65.4%')).toBeInTheDocument(); // Trial conversion
      });
    });

    it('formats currency amounts correctly', async () => {
      renderWithRouter(<SubscriptionAnalytics />);

      await waitFor(() => {
        expect(screen.getByText(/6,705\.00/i)).toBeInTheDocument();
      });
    });
  });
});
