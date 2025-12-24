import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import ResetPassword from '../ResetPassword';
import { authAPI } from '../../../services/api';

// Mock the API
jest.mock('../../../services/api', () => ({
  authAPI: {
    resetPassword: jest.fn(),
  },
}));

// Mock router navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Test wrapper with query params
const TestWrapper = ({ children, token = 'test-token', email = 'test@example.com' }) => {
  const search = `?token=${token}&email=${encodeURIComponent(email)}`;
  return (
    <MemoryRouter initialEntries={[{ pathname: '/reset-password', search }]}>
      {children}
    </MemoryRouter>
  );
};

describe('ResetPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render reset password form', () => {
    render(<ResetPassword />, { wrapper: TestWrapper });

    expect(screen.getByText(/Nytt passord/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Nytt passord/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Bekreft passord/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tilbakestill passord/i })).toBeInTheDocument();
  });

  it('should show error when passwords do not match', () => {
    render(<ResetPassword />, { wrapper: TestWrapper });

    const passwordInput = screen.getByPlaceholderText(/Nytt passord/i);
    const confirmInput = screen.getByPlaceholderText(/Bekreft passord/i);
    const submitButton = screen.getByRole('button', { name: /Tilbakestill passord/i });

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password456' } });
    fireEvent.click(submitButton);

    // Should show error message
    expect(screen.getByText(/passordene må være like/i)).toBeInTheDocument();
  });

  it('should show error for weak password', () => {
    render(<ResetPassword />, { wrapper: TestWrapper });

    const passwordInput = screen.getByPlaceholderText(/Nytt passord/i);
    const confirmInput = screen.getByPlaceholderText(/Bekreft passord/i);
    const submitButton = screen.getByRole('button', { name: /Tilbakestill passord/i });

    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.change(confirmInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    // Should show password strength error
    expect(screen.getByText(/minst 8 tegn/i)).toBeInTheDocument();
  });

  it('should submit form and redirect on success', async () => {
    authAPI.resetPassword.mockResolvedValue({ success: true });

    render(<ResetPassword />, { wrapper: TestWrapper });

    const passwordInput = screen.getByPlaceholderText(/Nytt passord/i);
    const confirmInput = screen.getByPlaceholderText(/Bekreft passord/i);
    const submitButton = screen.getByRole('button', { name: /Tilbakestill passord/i });

    fireEvent.change(passwordInput, { target: { value: 'NewPassword123!' } });
    fireEvent.change(confirmInput, { target: { value: 'NewPassword123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authAPI.resetPassword).toHaveBeenCalledWith(
        'test-token',
        'test@example.com',
        'NewPassword123!'
      );
    });

    // Should show success message
    await waitFor(() => {
      expect(screen.getByText(/Passordet ditt er tilbakestilt/i)).toBeInTheDocument();
    });

    // Should navigate to login after timeout
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    }, { timeout: 4000 });
  });

  it('should display error on API failure', async () => {
    authAPI.resetPassword.mockRejectedValue({
      message: 'Invalid token',
    });

    render(<ResetPassword />, { wrapper: TestWrapper });

    const passwordInput = screen.getByPlaceholderText(/Nytt passord/i);
    const confirmInput = screen.getByPlaceholderText(/Bekreft passord/i);
    const submitButton = screen.getByRole('button', { name: /Tilbakestill passord/i });

    fireEvent.change(passwordInput, { target: { value: 'NewPassword123!' } });
    fireEvent.change(confirmInput, { target: { value: 'NewPassword123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authAPI.resetPassword).toHaveBeenCalled();
    });

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Kunne ikke tilbakestille passord/i)).toBeInTheDocument();
    });
  });

  it('should show error when token is missing', () => {
    const wrapper = ({ children }) => (
      <MemoryRouter initialEntries={['/reset-password']}>
        {children}
      </MemoryRouter>
    );

    render(<ResetPassword />, { wrapper });

    // Should show error for missing token
    expect(screen.getByText(/Ugyldig eller utløpt lenke/i)).toBeInTheDocument();
  });

  it('should toggle password visibility', () => {
    render(<ResetPassword />, { wrapper: TestWrapper });

    const passwordInput = screen.getByPlaceholderText(/Nytt passord/i);

    // Should start as password type
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Find and click the visibility toggle button
    const toggleButtons = screen.getAllByRole('button');
    const visibilityToggle = toggleButtons.find(btn =>
      btn.querySelector('svg') !== null && btn.getAttribute('aria-label') === 'Toggle password visibility'
    );

    if (visibilityToggle) {
      fireEvent.click(visibilityToggle);
      expect(passwordInput).toHaveAttribute('type', 'text');
    }
  });
});
