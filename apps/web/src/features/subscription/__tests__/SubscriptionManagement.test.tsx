import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SubscriptionManagement from '../SubscriptionManagement';

// Mock fetch
global.fetch = jest.fn();

// Mock auth context
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
    },
  }),
}));

// Mock notification context
jest.mock('../../../contexts/NotificationContext', () => ({
  useNotification: () => ({
    showSuccess: jest.fn(),
    showError: jest.fn(),
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SubscriptionManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('Current Subscription Display', () => {
    const mockSubscription = {
      subscription: {
        id: 'sub_123',
        status: 'active',
        planType: 'player_premium',
        interval: 'month',
        currentPeriodStart: '2024-01-01T00:00:00Z',
        currentPeriodEnd: '2024-02-01T00:00:00Z',
        cancelAtPeriodEnd: false,
        amount: 14900,
        currency: 'nok',
      },
    };

    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockSubscription }),
      });
    });

    it('displays current subscription plan', async () => {
      renderWithRouter(<SubscriptionManagement />);

      await waitFor(() => {
        expect(screen.getByText(/player premium/i)).toBeInTheDocument();
      });
    });

    it('displays subscription status', async () => {
      renderWithRouter(<SubscriptionManagement />);

      await waitFor(() => {
        expect(screen.getByText(/active/i)).toBeInTheDocument();
      });
    });

    it('displays billing amount', async () => {
      renderWithRouter(<SubscriptionManagement />);

      await waitFor(() => {
        expect(screen.getByText(/149\.00/i)).toBeInTheDocument();
        expect(screen.getByText(/nok/i)).toBeInTheDocument();
      });
    });

    it('displays next billing date', async () => {
      renderWithRouter(<SubscriptionManagement />);

      await waitFor(() => {
        expect(screen.getByText(/next billing/i)).toBeInTheDocument();
        expect(screen.getByText(/feb 1, 2024/i)).toBeInTheDocument();
      });
    });

    it('shows billing interval', async () => {
      renderWithRouter(<SubscriptionManagement />);

      await waitFor(() => {
        expect(screen.getByText(/monthly/i)).toBeInTheDocument();
      });
    });
  });

  describe('Plan Upgrade/Downgrade', () => {
    const mockSubscription = {
      subscription: {
        id: 'sub_123',
        status: 'active',
        planType: 'player_premium',
        interval: 'month',
      },
    };

    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockSubscription }),
      });
    });

    it('displays available plan options', async () => {
      renderWithRouter(<SubscriptionManagement />);

      await waitFor(() => {
        expect(screen.getByText(/player premium/i)).toBeInTheDocument();
      });

      // Should show upgrade options
      expect(screen.getByText(/player elite/i)).toBeInTheDocument();
    });

    it('handles plan upgrade', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: mockSubscription }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: { subscription: { planType: 'player_elite' } },
          }),
        });

      renderWithRouter(<SubscriptionManagement />);

      await waitFor(() => {
        expect(screen.getByText(/player premium/i)).toBeInTheDocument();
      });

      const upgradeButton = screen.getByRole('button', { name: /upgrade to elite/i });
      await user.click(upgradeButton);

      // Should show confirmation dialog
      await waitFor(() => {
        expect(screen.getByText(/confirm upgrade/i)).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/subscriptions/plan'),
          expect.objectContaining({
            method: 'PUT',
            body: expect.stringContaining('player_elite'),
          })
        );
      });
    });

    it('shows prorated amount for upgrade', async () => {
      const user = userEvent.setup();
      renderWithRouter(<SubscriptionManagement />);

      await waitFor(() => {
        expect(screen.getByText(/player premium/i)).toBeInTheDocument();
      });

      const upgradeButton = screen.getByRole('button', { name: /upgrade/i });
      await user.click(upgradeButton);

      await waitFor(() => {
        expect(screen.getByText(/prorated/i)).toBeInTheDocument();
      });
    });

    it('handles plan downgrade', async () => {
      const user = userEvent.setup();
      const eliteSubscription = {
        subscription: {
          id: 'sub_123',
          status: 'active',
          planType: 'player_elite',
          interval: 'month',
        },
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: eliteSubscription }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: { subscription: { planType: 'player_premium' } },
          }),
        });

      renderWithRouter(<SubscriptionManagement />);

      await waitFor(() => {
        expect(screen.getByText(/player elite/i)).toBeInTheDocument();
      });

      const downgradeButton = screen.getByRole('button', { name: /change to premium/i });
      await user.click(downgradeButton);

      // Confirm downgrade
      const confirmButton = await screen.findByRole('button', { name: /confirm/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/subscriptions/plan'),
          expect.objectContaining({
            method: 'PUT',
          })
        );
      });
    });
  });

  describe('Subscription Cancellation', () => {
    const mockActiveSubscription = {
      subscription: {
        id: 'sub_123',
        status: 'active',
        planType: 'player_premium',
        cancelAtPeriodEnd: false,
        currentPeriodEnd: '2024-02-01T00:00:00Z',
      },
    };

    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockActiveSubscription }),
      });
    });

    it('shows cancel subscription button', async () => {
      renderWithRouter(<SubscriptionManagement />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /cancel subscription/i })).toBeInTheDocument();
      });
    });

    it('shows confirmation dialog before canceling', async () => {
      const user = userEvent.setup();
      renderWithRouter(<SubscriptionManagement />);

      const cancelButton = await screen.findByRole('button', { name: /cancel subscription/i });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
        expect(screen.getByText(/access until/i)).toBeInTheDocument();
      });
    });

    it('handles subscription cancellation', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: mockActiveSubscription }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: { subscription: { cancelAtPeriodEnd: true } },
          }),
        });

      renderWithRouter(<SubscriptionManagement />);

      const cancelButton = await screen.findByRole('button', { name: /cancel subscription/i });
      await user.click(cancelButton);

      const confirmButton = await screen.findByRole('button', { name: /confirm cancel/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/subscriptions/cancel'),
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('cancelAtPeriodEnd'),
          })
        );
      });
    });

    it('displays scheduled cancellation status', async () => {
      const canceledSubscription = {
        subscription: {
          ...mockActiveSubscription.subscription,
          cancelAtPeriodEnd: true,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: canceledSubscription }),
      });

      renderWithRouter(<SubscriptionManagement />);

      await waitFor(() => {
        expect(screen.getByText(/cancels on/i)).toBeInTheDocument();
        expect(screen.getByText(/feb 1, 2024/i)).toBeInTheDocument();
      });
    });

    it('shows reactivate button for scheduled cancellations', async () => {
      const canceledSubscription = {
        subscription: {
          ...mockActiveSubscription.subscription,
          cancelAtPeriodEnd: true,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: canceledSubscription }),
      });

      renderWithRouter(<SubscriptionManagement />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /reactivate/i })).toBeInTheDocument();
      });
    });

    it('handles subscription reactivation', async () => {
      const user = userEvent.setup();
      const canceledSubscription = {
        subscription: {
          ...mockActiveSubscription.subscription,
          cancelAtPeriodEnd: true,
        },
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: canceledSubscription }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: { subscription: { cancelAtPeriodEnd: false } },
          }),
        });

      renderWithRouter(<SubscriptionManagement />);

      const reactivateButton = await screen.findByRole('button', { name: /reactivate/i });
      await user.click(reactivateButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/subscriptions/reactivate'),
          expect.objectContaining({
            method: 'POST',
          })
        );
      });
    });
  });

  describe('Payment Method Management', () => {
    const mockSubscription = {
      subscription: {
        id: 'sub_123',
        status: 'active',
        planType: 'player_premium',
      },
      paymentMethod: {
        brand: 'visa',
        last4: '4242',
        expMonth: 12,
        expYear: 2025,
      },
    };

    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockSubscription }),
      });
    });

    it('displays current payment method', async () => {
      renderWithRouter(<SubscriptionManagement />);

      await waitFor(() => {
        expect(screen.getByText(/visa/i)).toBeInTheDocument();
        expect(screen.getByText(/4242/)).toBeInTheDocument();
        expect(screen.getByText(/12\/2025/)).toBeInTheDocument();
      });
    });

    it('shows update payment method button', async () => {
      renderWithRouter(<SubscriptionManagement />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /update payment method/i })).toBeInTheDocument();
      });
    });

    it('links to billing portal for payment method update', async () => {
      const user = userEvent.setup();
      renderWithRouter(<SubscriptionManagement />);

      const updateButton = await screen.findByRole('button', { name: /update payment method/i });

      await waitFor(() => {
        expect(updateButton).toHaveAttribute('href', expect.stringContaining('/billing'));
      });
    });
  });

  describe('Error Handling', () => {
    it('displays error when API fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      renderWithRouter(<SubscriptionManagement />);

      await waitFor(() => {
        expect(screen.getByText(/error loading subscription/i)).toBeInTheDocument();
      });
    });

    it('displays error when no subscription found', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ success: false, error: 'No subscription found' }),
      });

      renderWithRouter(<SubscriptionManagement />);

      await waitFor(() => {
        expect(screen.getByText(/no active subscription/i)).toBeInTheDocument();
      });
    });

    it('shows retry button on error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Error'));

      renderWithRouter(<SubscriptionManagement />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });
    });

    it('handles plan update errors gracefully', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: { subscription: { planType: 'player_premium' } },
          }),
        })
        .mockRejectedValueOnce(new Error('Update failed'));

      renderWithRouter(<SubscriptionManagement />);

      const upgradeButton = await screen.findByRole('button', { name: /upgrade/i });
      await user.click(upgradeButton);

      const confirmButton = await screen.findByRole('button', { name: /confirm/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText(/failed to update/i)).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading spinner initially', () => {
      (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

      renderWithRouter(<SubscriptionManagement />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('shows loading state during plan update', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: { subscription: { planType: 'player_premium' } },
          }),
        })
        .mockImplementation(() => new Promise(() => {}));

      renderWithRouter(<SubscriptionManagement />);

      const upgradeButton = await screen.findByRole('button', { name: /upgrade/i });
      await user.click(upgradeButton);

      const confirmButton = await screen.findByRole('button', { name: /confirm/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText(/updating/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { subscription: { status: 'active', planType: 'player_premium' } },
        }),
      });
    });

    it('has proper heading hierarchy', async () => {
      renderWithRouter(<SubscriptionManagement />);

      await waitFor(() => {
        const headings = screen.getAllByRole('heading');
        expect(headings.length).toBeGreaterThan(0);
      });
    });

    it('has descriptive button labels', async () => {
      renderWithRouter(<SubscriptionManagement />);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        buttons.forEach((button) => {
          expect(button).toHaveAccessibleName();
        });
      });
    });

    it('confirmation dialogs have proper ARIA roles', async () => {
      const user = userEvent.setup();
      renderWithRouter(<SubscriptionManagement />);

      const cancelButton = await screen.findByRole('button', { name: /cancel subscription/i });
      await user.click(cancelButton);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
      });
    });
  });
});
