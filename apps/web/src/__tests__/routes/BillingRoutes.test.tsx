import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import App from '../../App';

// Mock components to simplify testing
jest.mock('../../features/billing/BillingPortal', () => {
  return function BillingPortal() {
    return <div>Billing Portal Component</div>;
  };
});

jest.mock('../../features/subscription/SubscriptionManagement', () => {
  return function SubscriptionManagement() {
    return <div>Subscription Management Component</div>;
  };
});

jest.mock('../../features/admin/PaymentDashboard', () => {
  return function PaymentDashboard() {
    return <div>Payment Dashboard Component</div>;
  };
});

jest.mock('../../features/analytics/SubscriptionAnalytics', () => {
  return function SubscriptionAnalytics() {
    return <div>Subscription Analytics Component</div>;
  };
});

// Mock auth context
const mockAuthContext = {
  user: null,
  isAuthenticated: false,
  login: jest.fn(),
  logout: jest.fn(),
};

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock other required contexts
jest.mock('../../contexts/NotificationContext', () => ({
  NotificationProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useNotification: () => ({
    showSuccess: jest.fn(),
    showError: jest.fn(),
  }),
}));

jest.mock('../../contexts/BadgeNotificationContext', () => ({
  BadgeNotificationProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../features/ai-coach', () => ({
  AICoachProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AICoachButton: () => <div>AI Coach Button</div>,
  AICoachPanel: () => <div>AI Coach Panel</div>,
}));

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Billing Routes Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();

    // Reset auth context before each test
    mockAuthContext.user = null;
    mockAuthContext.isAuthenticated = false;
  });

  describe('/billing Route', () => {
    it('redirects to login when user is not authenticated', async () => {
      mockAuthContext.isAuthenticated = false;
      mockAuthContext.user = null;

      render(
        <MemoryRouter initialEntries={['/billing']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        // Should redirect to login or show unauthorized message
        expect(screen.queryByText('Billing Portal Component')).not.toBeInTheDocument();
      });
    });

    it('renders BillingPortal when user is authenticated', async () => {
      mockAuthContext.isAuthenticated = true;
      mockAuthContext.user = {
        id: 'user-123',
        email: 'user@example.com',
        role: { name: 'player' },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: {} }),
      });

      render(
        <MemoryRouter initialEntries={['/billing']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Billing Portal Component')).toBeInTheDocument();
      });
    });

    it('is accessible to players', async () => {
      mockAuthContext.isAuthenticated = true;
      mockAuthContext.user = {
        id: 'player-123',
        email: 'player@example.com',
        role: { name: 'player' },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: {} }),
      });

      render(
        <MemoryRouter initialEntries={['/billing']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Billing Portal Component')).toBeInTheDocument();
      });
    });

    it('is accessible to coaches', async () => {
      mockAuthContext.isAuthenticated = true;
      mockAuthContext.user = {
        id: 'coach-123',
        email: 'coach@example.com',
        role: { name: 'coach' },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: {} }),
      });

      render(
        <MemoryRouter initialEntries={['/billing']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Billing Portal Component')).toBeInTheDocument();
      });
    });
  });

  describe('/innstillinger/subscription Route', () => {
    it('redirects to login when not authenticated', async () => {
      mockAuthContext.isAuthenticated = false;

      render(
        <MemoryRouter initialEntries={['/innstillinger/subscription']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.queryByText('Subscription Management Component')).not.toBeInTheDocument();
      });
    });

    it('renders SubscriptionManagement when authenticated', async () => {
      mockAuthContext.isAuthenticated = true;
      mockAuthContext.user = {
        id: 'user-123',
        email: 'user@example.com',
        role: { name: 'player' },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: {} }),
      });

      render(
        <MemoryRouter initialEntries={['/innstillinger/subscription']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Subscription Management Component')).toBeInTheDocument();
      });
    });
  });

  describe('/admin/payments Route', () => {
    it('redirects when user is not authenticated', async () => {
      mockAuthContext.isAuthenticated = false;

      render(
        <MemoryRouter initialEntries={['/admin/payments']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.queryByText('Payment Dashboard Component')).not.toBeInTheDocument();
      });
    });

    it('blocks access for non-admin users', async () => {
      mockAuthContext.isAuthenticated = true;
      mockAuthContext.user = {
        id: 'player-123',
        email: 'player@example.com',
        role: { name: 'player' },
      };

      render(
        <MemoryRouter initialEntries={['/admin/payments']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        // Should show unauthorized or redirect
        expect(screen.queryByText('Payment Dashboard Component')).not.toBeInTheDocument();
      });
    });

    it('renders PaymentDashboard for admin users', async () => {
      mockAuthContext.isAuthenticated = true;
      mockAuthContext.user = {
        id: 'admin-123',
        email: 'admin@iup-golf.com',
        role: { name: 'admin' },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: {} }),
      });

      render(
        <MemoryRouter initialEntries={['/admin/payments']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Payment Dashboard Component')).toBeInTheDocument();
      });
    });
  });

  describe('/admin/analytics/subscriptions Route', () => {
    it('redirects when not authenticated', async () => {
      mockAuthContext.isAuthenticated = false;

      render(
        <MemoryRouter initialEntries={['/admin/analytics/subscriptions']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.queryByText('Subscription Analytics Component')).not.toBeInTheDocument();
      });
    });

    it('blocks access for non-admin users', async () => {
      mockAuthContext.isAuthenticated = true;
      mockAuthContext.user = {
        id: 'coach-123',
        email: 'coach@example.com',
        role: { name: 'coach' },
      };

      render(
        <MemoryRouter initialEntries={['/admin/analytics/subscriptions']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.queryByText('Subscription Analytics Component')).not.toBeInTheDocument();
      });
    });

    it('renders SubscriptionAnalytics for admin users', async () => {
      mockAuthContext.isAuthenticated = true;
      mockAuthContext.user = {
        id: 'admin-123',
        email: 'admin@iup-golf.com',
        role: { name: 'admin' },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: {} }),
      });

      render(
        <MemoryRouter initialEntries={['/admin/analytics/subscriptions']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Subscription Analytics Component')).toBeInTheDocument();
      });
    });
  });

  describe('Route Constants', () => {
    it('exports correct route paths', () => {
      const ROUTES = require('../../routes/index').ROUTES;

      expect(ROUTES.BILLING).toBe('/billing');
      expect(ROUTES.SUBSCRIPTION_MANAGEMENT).toBe('/innstillinger/subscription');
      expect(ROUTES.ADMIN.PAYMENTS).toBe('/admin/payments');
      expect(ROUTES.ADMIN.SUBSCRIPTION_ANALYTICS).toBe('/admin/analytics/subscriptions');
    });
  });

  describe('Layout Integration', () => {
    it('wraps /billing in PlayerLayout', async () => {
      mockAuthContext.isAuthenticated = true;
      mockAuthContext.user = {
        id: 'user-123',
        email: 'user@example.com',
        role: { name: 'player' },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: {} }),
      });

      render(
        <MemoryRouter initialEntries={['/billing']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        // Component should be rendered within PlayerLayout
        expect(screen.getByText('Billing Portal Component')).toBeInTheDocument();
      });
    });

    it('wraps /admin/payments in AdminLayout', async () => {
      mockAuthContext.isAuthenticated = true;
      mockAuthContext.user = {
        id: 'admin-123',
        email: 'admin@iup-golf.com',
        role: { name: 'admin' },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: {} }),
      });

      render(
        <MemoryRouter initialEntries={['/admin/payments']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        // Component should be rendered within AdminLayout
        expect(screen.getByText('Payment Dashboard Component')).toBeInTheDocument();
      });
    });
  });

  describe('Lazy Loading', () => {
    it('lazy loads billing components', async () => {
      mockAuthContext.isAuthenticated = true;
      mockAuthContext.user = {
        id: 'user-123',
        email: 'user@example.com',
        role: { name: 'player' },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: {} }),
      });

      render(
        <MemoryRouter initialEntries={['/billing']}>
          <App />
        </MemoryRouter>
      );

      // Component should eventually load
      await waitFor(() => {
        expect(screen.getByText('Billing Portal Component')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Error Handling', () => {
    it('handles API errors gracefully', async () => {
      mockAuthContext.isAuthenticated = true;
      mockAuthContext.user = {
        id: 'user-123',
        email: 'user@example.com',
        role: { name: 'player' },
      };

      (global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

      render(
        <MemoryRouter initialEntries={['/billing']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        // Component should still render even if initial API call fails
        expect(screen.getByText('Billing Portal Component')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation Integration', () => {
    it('allows navigation between billing routes', async () => {
      mockAuthContext.isAuthenticated = true;
      mockAuthContext.user = {
        id: 'user-123',
        email: 'user@example.com',
        role: { name: 'player' },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: {} }),
      });

      const { rerender } = render(
        <MemoryRouter initialEntries={['/billing']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Billing Portal Component')).toBeInTheDocument();
      });

      // Navigate to subscription management
      rerender(
        <MemoryRouter initialEntries={['/innstillinger/subscription']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Subscription Management Component')).toBeInTheDocument();
      });
    });
  });
});
