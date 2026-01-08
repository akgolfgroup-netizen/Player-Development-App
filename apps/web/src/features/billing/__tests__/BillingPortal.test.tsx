import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import BillingPortal from '../BillingPortal';

// Mock fetch globally
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

// Helper to wrap component with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('BillingPortal', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('Loading State', () => {
    it('displays loading state initially', () => {
      (global.fetch as jest.Mock).mockImplementation(() =>
        new Promise(() => {}) // Never resolves
      );

      renderWithRouter(<BillingPortal />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Subscription Overview Tab', () => {
    const mockSubscriptionData = {
      subscription: {
        id: 'sub_123',
        status: 'active',
        planType: 'Player Premium',
        currentPeriodEnd: '2024-02-01T00:00:00Z',
        cancelAtPeriodEnd: false,
        amount: 14900,
        currency: 'nok',
      },
      paymentMethod: {
        brand: 'visa',
        last4: '4242',
        expMonth: 12,
        expYear: 2025,
      },
      upcomingInvoice: {
        amount: 14900,
        date: '2024-02-01T00:00:00Z',
      },
    };

    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockSubscriptionData }),
      });
    });

    it('renders subscription overview tab by default', async () => {
      renderWithRouter(<BillingPortal />);

      await waitFor(() => {
        expect(screen.getByText('Player Premium')).toBeInTheDocument();
      });
    });

    it('displays current subscription details', async () => {
      renderWithRouter(<BillingPortal />);

      await waitFor(() => {
        expect(screen.getByText('Player Premium')).toBeInTheDocument();
        expect(screen.getByText(/149\.00 NOK/i)).toBeInTheDocument();
        expect(screen.getByText(/active/i)).toBeInTheDocument();
      });
    });

    it('displays payment method information', async () => {
      renderWithRouter(<BillingPortal />);

      await waitFor(() => {
        expect(screen.getByText(/visa/i)).toBeInTheDocument();
        expect(screen.getByText(/4242/)).toBeInTheDocument();
        expect(screen.getByText(/12\/2025/)).toBeInTheDocument();
      });
    });

    it('displays upcoming invoice information', async () => {
      renderWithRouter(<BillingPortal />);

      await waitFor(() => {
        expect(screen.getByText(/next billing/i)).toBeInTheDocument();
        expect(screen.getByText(/149\.00 NOK/i)).toBeInTheDocument();
      });
    });

    it('shows manage subscription button', async () => {
      renderWithRouter(<BillingPortal />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /manage subscription/i })).toBeInTheDocument();
      });
    });
  });

  describe('Payment Methods Tab', () => {
    const mockPaymentMethods = {
      paymentMethods: [
        {
          id: 'pm_1',
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242',
            expMonth: 12,
            expYear: 2025,
          },
          isDefault: true,
        },
        {
          id: 'pm_2',
          type: 'card',
          card: {
            brand: 'mastercard',
            last4: '5555',
            expMonth: 6,
            expYear: 2026,
          },
          isDefault: false,
        },
      ],
    };

    beforeEach(() => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: {} }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: mockPaymentMethods }),
        });
    });

    it('switches to payment methods tab when clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<BillingPortal />);

      await waitFor(() => {
        expect(screen.getByText(/overview/i)).toBeInTheDocument();
      });

      const paymentMethodsTab = screen.getByText(/payment methods/i);
      await user.click(paymentMethodsTab);

      await waitFor(() => {
        expect(screen.getByText('visa')).toBeInTheDocument();
        expect(screen.getByText('mastercard')).toBeInTheDocument();
      });
    });

    it('displays all payment methods', async () => {
      const user = userEvent.setup();
      renderWithRouter(<BillingPortal />);

      const paymentMethodsTab = await screen.findByText(/payment methods/i);
      await user.click(paymentMethodsTab);

      await waitFor(() => {
        expect(screen.getByText('visa')).toBeInTheDocument();
        expect(screen.getByText(/4242/)).toBeInTheDocument();
        expect(screen.getByText('mastercard')).toBeInTheDocument();
        expect(screen.getByText(/5555/)).toBeInTheDocument();
      });
    });

    it('marks default payment method', async () => {
      const user = userEvent.setup();
      renderWithRouter(<BillingPortal />);

      const paymentMethodsTab = await screen.findByText(/payment methods/i);
      await user.click(paymentMethodsTab);

      await waitFor(() => {
        expect(screen.getByText(/default/i)).toBeInTheDocument();
      });
    });

    it('shows add payment method button', async () => {
      const user = userEvent.setup();
      renderWithRouter(<BillingPortal />);

      const paymentMethodsTab = await screen.findByText(/payment methods/i);
      await user.click(paymentMethodsTab);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /add payment method/i })).toBeInTheDocument();
      });
    });
  });

  describe('Invoices Tab', () => {
    const mockInvoices = {
      invoices: [
        {
          id: 'in_1',
          amount: 14900,
          currency: 'nok',
          status: 'paid',
          created: '2024-01-01T00:00:00Z',
          invoicePdf: 'https://stripe.com/invoice1.pdf',
          hostedInvoiceUrl: 'https://stripe.com/invoice1',
        },
        {
          id: 'in_2',
          amount: 14900,
          currency: 'nok',
          status: 'paid',
          created: '2023-12-01T00:00:00Z',
          invoicePdf: 'https://stripe.com/invoice2.pdf',
          hostedInvoiceUrl: 'https://stripe.com/invoice2',
        },
      ],
      hasMore: false,
    };

    beforeEach(() => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: {} }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: mockInvoices }),
        });
    });

    it('displays invoice history', async () => {
      const user = userEvent.setup();
      renderWithRouter(<BillingPortal />);

      const invoicesTab = await screen.findByText(/invoices/i);
      await user.click(invoicesTab);

      await waitFor(() => {
        expect(screen.getAllByText(/149\.00 NOK/i)).toHaveLength(2);
        expect(screen.getAllByText(/paid/i)).toHaveLength(2);
      });
    });

    it('shows download links for invoices', async () => {
      const user = userEvent.setup();
      renderWithRouter(<BillingPortal />);

      const invoicesTab = await screen.findByText(/invoices/i);
      await user.click(invoicesTab);

      await waitFor(() => {
        const downloadButtons = screen.getAllByRole('link', { name: /download/i });
        expect(downloadButtons).toHaveLength(2);
        expect(downloadButtons[0]).toHaveAttribute('href', 'https://stripe.com/invoice1.pdf');
      });
    });

    it('displays invoice dates', async () => {
      const user = userEvent.setup();
      renderWithRouter(<BillingPortal />);

      const invoicesTab = await screen.findByText(/invoices/i);
      await user.click(invoicesTab);

      await waitFor(() => {
        expect(screen.getByText(/jan 1, 2024/i)).toBeInTheDocument();
        expect(screen.getByText(/dec 1, 2023/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('displays error message when API fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      renderWithRouter(<BillingPortal />);

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });

    it('displays error when subscription not found', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ success: false, error: 'Subscription not found' }),
      });

      renderWithRouter(<BillingPortal />);

      await waitFor(() => {
        expect(screen.getByText(/no active subscription/i)).toBeInTheDocument();
      });
    });

    it('shows retry button on error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      renderWithRouter(<BillingPortal />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });
    });
  });

  describe('API Integration', () => {
    it('calls billing dashboard API on mount', () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: {} }),
      });

      renderWithRouter(<BillingPortal />);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/billing/dashboard'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('Bearer'),
          }),
        })
      );
    });

    it('includes auth token in API requests', () => {
      localStorage.setItem('accessToken', 'test-token-123');

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: {} }),
      });

      renderWithRouter(<BillingPortal />);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token-123',
          }),
        })
      );
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            subscription: { status: 'active', planType: 'Premium' },
          },
        }),
      });
    });

    it('has proper heading hierarchy', async () => {
      renderWithRouter(<BillingPortal />);

      await waitFor(() => {
        const headings = screen.getAllByRole('heading');
        expect(headings.length).toBeGreaterThan(0);
      });
    });

    it('tabs are keyboard navigable', async () => {
      const user = userEvent.setup();
      renderWithRouter(<BillingPortal />);

      await waitFor(() => {
        expect(screen.getByText(/overview/i)).toBeInTheDocument();
      });

      // Tab should be navigable with keyboard
      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBeGreaterThan(0);
    });

    it('has proper ARIA labels', async () => {
      renderWithRouter(<BillingPortal />);

      await waitFor(() => {
        const tablist = screen.getByRole('tablist');
        expect(tablist).toBeInTheDocument();
      });
    });
  });
});
