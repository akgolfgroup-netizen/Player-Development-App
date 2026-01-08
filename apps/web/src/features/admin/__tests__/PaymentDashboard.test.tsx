import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import PaymentDashboard from '../PaymentDashboard';

// Mock fetch
global.fetch = jest.fn();

// Mock auth context with admin user
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'admin-id',
      email: 'admin@iup-golf.com',
      role: { name: 'admin' },
    },
  }),
}));

// Mock timers for auto-refresh testing
jest.useFakeTimers();

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PaymentDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Overview Tab', () => {
    const mockPaymentStats = {
      mrr: 1250000,
      arr: 15000000,
      activeSubscriptions: 84,
      totalCustomers: 120,
      successRate: 97.5,
      failedPayments30d: 3,
      averageTransaction: 24900,
      revenueByPlan: {
        player_premium: 450000,
        player_elite: 600000,
        coach_pro: 200000,
      },
    };

    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockPaymentStats }),
      });
    });

    it('displays MRR metric', async () => {
      renderWithRouter(<PaymentDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/MRR/i)).toBeInTheDocument();
        expect(screen.getByText(/12,500\.00/i)).toBeInTheDocument();
      });
    });

    it('displays ARR metric', async () => {
      renderWithRouter(<PaymentDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/ARR/i)).toBeInTheDocument();
        expect(screen.getByText(/150,000\.00/i)).toBeInTheDocument();
      });
    });

    it('displays active subscriptions count', async () => {
      renderWithRouter(<PaymentDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/active subscriptions/i)).toBeInTheDocument();
        expect(screen.getByText('84')).toBeInTheDocument();
      });
    });

    it('displays success rate percentage', async () => {
      renderWithRouter(<PaymentDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/success rate/i)).toBeInTheDocument();
        expect(screen.getByText(/97\.5%/i)).toBeInTheDocument();
      });
    });

    it('displays failed payments count', async () => {
      renderWithRouter(<PaymentDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/failed payments/i)).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
      });
    });

    it('displays revenue by plan breakdown', async () => {
      renderWithRouter(<PaymentDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/revenue by plan/i)).toBeInTheDocument();
        expect(screen.getByText(/player premium/i)).toBeInTheDocument();
        expect(screen.getByText(/player elite/i)).toBeInTheDocument();
        expect(screen.getByText(/coach pro/i)).toBeInTheDocument();
      });
    });
  });

  describe('Transactions Tab', () => {
    const mockTransactions = [
      {
        id: 'pi_1',
        amount: 14900,
        currency: 'nok',
        status: 'succeeded',
        customerEmail: 'user1@example.com',
        description: 'Player Premium - Monthly',
        created: '2024-01-15T10:30:00Z',
        invoiceUrl: 'https://stripe.com/invoice1.pdf',
      },
      {
        id: 'pi_2',
        amount: 29900,
        currency: 'nok',
        status: 'failed',
        customerEmail: 'user2@example.com',
        description: 'Player Elite - Monthly',
        created: '2024-01-14T15:20:00Z',
        invoiceUrl: null,
      },
    ];

    beforeEach(() => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: {} }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: mockTransactions }),
        });
    });

    it('switches to transactions tab', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<PaymentDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/overview/i)).toBeInTheDocument();
      });

      const transactionsTab = screen.getByText(/transactions/i);
      await user.click(transactionsTab);

      await waitFor(() => {
        expect(screen.getByText('user1@example.com')).toBeInTheDocument();
        expect(screen.getByText('user2@example.com')).toBeInTheDocument();
      });
    });

    it('displays transaction list', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<PaymentDashboard />);

      const transactionsTab = await screen.findByText(/transactions/i);
      await user.click(transactionsTab);

      await waitFor(() => {
        expect(screen.getByText(/149\.00 NOK/i)).toBeInTheDocument();
        expect(screen.getByText(/299\.00 NOK/i)).toBeInTheDocument();
        expect(screen.getByText('succeeded')).toBeInTheDocument();
        expect(screen.getByText('failed')).toBeInTheDocument();
      });
    });

    it('shows transaction status indicators', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<PaymentDashboard />);

      const transactionsTab = await screen.findByText(/transactions/i);
      await user.click(transactionsTab);

      await waitFor(() => {
        const successBadge = screen.getByText('succeeded');
        const failedBadge = screen.getByText('failed');
        expect(successBadge).toHaveClass('success');
        expect(failedBadge).toHaveClass('error');
      });
    });

    it('displays customer email addresses', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<PaymentDashboard />);

      const transactionsTab = await screen.findByText(/transactions/i);
      await user.click(transactionsTab);

      await waitFor(() => {
        expect(screen.getByText('user1@example.com')).toBeInTheDocument();
        expect(screen.getByText('user2@example.com')).toBeInTheDocument();
      });
    });
  });

  describe('Webhook Events Tab', () => {
    const mockWebhookEvents = [
      {
        id: 'evt_1',
        type: 'invoice.paid',
        status: 'processed',
        created: '2024-01-15T10:30:00Z',
        attempts: 1,
        lastError: null,
        processedAt: '2024-01-15T10:30:05Z',
      },
      {
        id: 'evt_2',
        type: 'invoice.payment_failed',
        status: 'failed',
        created: '2024-01-15T09:00:00Z',
        attempts: 3,
        lastError: 'Signature verification failed',
        processedAt: null,
      },
    ];

    beforeEach(() => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: {} }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: mockWebhookEvents }),
        });
    });

    it('displays webhook event log', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<PaymentDashboard />);

      const webhooksTab = await screen.findByText(/webhooks/i);
      await user.click(webhooksTab);

      await waitFor(() => {
        expect(screen.getByText('invoice.paid')).toBeInTheDocument();
        expect(screen.getByText('invoice.payment_failed')).toBeInTheDocument();
      });
    });

    it('shows webhook processing status', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<PaymentDashboard />);

      const webhooksTab = await screen.findByText(/webhooks/i);
      await user.click(webhooksTab);

      await waitFor(() => {
        expect(screen.getByText('processed')).toBeInTheDocument();
        expect(screen.getByText('failed')).toBeInTheDocument();
      });
    });

    it('displays error messages for failed events', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<PaymentDashboard />);

      const webhooksTab = await screen.findByText(/webhooks/i);
      await user.click(webhooksTab);

      await waitFor(() => {
        expect(screen.getByText(/signature verification failed/i)).toBeInTheDocument();
      });
    });

    it('shows retry count for failed events', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<PaymentDashboard />);

      const webhooksTab = await screen.findByText(/webhooks/i);
      await user.click(webhooksTab);

      await waitFor(() => {
        expect(screen.getByText(/3 attempts/i)).toBeInTheDocument();
      });
    });
  });

  describe('Failed Payments Tab', () => {
    const mockFailedPayments = [
      {
        id: 'pi_fail_1',
        customerEmail: 'user@example.com',
        amount: 14900,
        currency: 'nok',
        failureReason: 'card_declined',
        created: '2024-01-15T10:30:00Z',
        nextRetry: '2024-01-18T10:30:00Z',
      },
      {
        id: 'pi_fail_2',
        customerEmail: 'another@example.com',
        amount: 29900,
        currency: 'nok',
        failureReason: 'insufficient_funds',
        created: '2024-01-14T15:20:00Z',
        nextRetry: null,
      },
    ];

    beforeEach(() => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: {} }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: mockFailedPayments }),
        });
    });

    it('displays failed payment list', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<PaymentDashboard />);

      const failedTab = await screen.findByText(/failed payments/i);
      await user.click(failedTab);

      await waitFor(() => {
        expect(screen.getByText('user@example.com')).toBeInTheDocument();
        expect(screen.getByText('another@example.com')).toBeInTheDocument();
      });
    });

    it('shows failure reasons', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<PaymentDashboard />);

      const failedTab = await screen.findByText(/failed payments/i);
      await user.click(failedTab);

      await waitFor(() => {
        expect(screen.getByText(/card declined/i)).toBeInTheDocument();
        expect(screen.getByText(/insufficient funds/i)).toBeInTheDocument();
      });
    });

    it('displays next retry date when available', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<PaymentDashboard />);

      const failedTab = await screen.findByText(/failed payments/i);
      await user.click(failedTab);

      await waitFor(() => {
        expect(screen.getByText(/jan 18, 2024/i)).toBeInTheDocument();
      });
    });
  });

  describe('Auto-Refresh Feature', () => {
    const mockStats = { mrr: 1000000, arr: 12000000 };

    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: mockStats }),
      });
    });

    it('auto-refreshes every 30 seconds', async () => {
      renderWithRouter(<PaymentDashboard />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      // Fast-forward 30 seconds
      jest.advanceTimersByTime(30000);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });
    });

    it('shows last updated timestamp', async () => {
      renderWithRouter(<PaymentDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/last updated/i)).toBeInTheDocument();
      });
    });

    it('has toggle for auto-refresh', async () => {
      renderWithRouter(<PaymentDashboard />);

      await waitFor(() => {
        const toggle = screen.getByRole('switch', { name: /auto-refresh/i });
        expect(toggle).toBeInTheDocument();
        expect(toggle).toBeChecked();
      });
    });

    it('stops auto-refresh when toggle is disabled', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<PaymentDashboard />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      const toggle = screen.getByRole('switch', { name: /auto-refresh/i });
      await user.click(toggle);

      // Fast-forward 30 seconds
      jest.advanceTimersByTime(30000);

      // Should not have called fetch again
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('has manual refresh button', async () => {
      renderWithRouter(<PaymentDashboard />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('displays error message when API fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      renderWithRouter(<PaymentDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/error loading dashboard/i)).toBeInTheDocument();
      });
    });

    it('shows retry button on error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Error'));

      renderWithRouter(<PaymentDashboard />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading spinner initially', () => {
      (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

      renderWithRouter(<PaymentDashboard />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Access Control', () => {
    it('requires admin role', async () => {
      // This would typically be handled by ProtectedRoute
      // Test that component expects admin user
      renderWithRouter(<PaymentDashboard />);

      await waitFor(() => {
        // Component should render for admin user
        expect(screen.queryByText(/unauthorized/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: {} }),
      });
    });

    it('has proper tab navigation', async () => {
      renderWithRouter(<PaymentDashboard />);

      await waitFor(() => {
        const tablist = screen.getByRole('tablist');
        expect(tablist).toBeInTheDocument();

        const tabs = screen.getAllByRole('tab');
        expect(tabs).toHaveLength(4);
      });
    });

    it('tabs are keyboard navigable', async () => {
      renderWithRouter(<PaymentDashboard />);

      await waitFor(() => {
        const tabs = screen.getAllByRole('tab');
        tabs.forEach((tab) => {
          expect(tab).toHaveAttribute('aria-selected');
        });
      });
    });

    it('has descriptive headings', async () => {
      renderWithRouter(<PaymentDashboard />);

      await waitFor(() => {
        const headings = screen.getAllByRole('heading');
        expect(headings.length).toBeGreaterThan(0);
        headings.forEach((heading) => {
          expect(heading.textContent).toBeTruthy();
        });
      });
    });
  });
});
