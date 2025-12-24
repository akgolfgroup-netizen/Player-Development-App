import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ForgotPassword from '../ForgotPassword';
import { authAPI } from '../../../services/api';

// Mock the API
jest.mock('../../../services/api', () => ({
  authAPI: {
    requestPasswordReset: jest.fn(),
  },
}));

// Mock router navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Test wrapper
const TestWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('ForgotPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render forgot password form', () => {
    render(<ForgotPassword />, { wrapper: TestWrapper });

    expect(screen.getByText(/Glemt passord/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/E-post/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send/i })).toBeInTheDocument();
  });

  it('should show error for invalid email', () => {
    render(<ForgotPassword />, { wrapper: TestWrapper });

    const emailInput = screen.getByPlaceholderText(/E-post/i);
    const submitButton = screen.getByRole('button', { name: /Send/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    // Email validation should prevent submission
    expect(authAPI.requestPasswordReset).not.toHaveBeenCalled();
  });

  it('should submit email and show success message', async () => {
    authAPI.requestPasswordReset.mockResolvedValue({ success: true });

    render(<ForgotPassword />, { wrapper: TestWrapper });

    const emailInput = screen.getByPlaceholderText(/E-post/i);
    const submitButton = screen.getByRole('button', { name: /Send/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authAPI.requestPasswordReset).toHaveBeenCalledWith('test@example.com');
    });

    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/Sjekk e-posten din/i)).toBeInTheDocument();
    });
  });

  it('should display error on API failure', async () => {
    authAPI.requestPasswordReset.mockRejectedValue({
      message: 'Network error',
    });

    render(<ForgotPassword />, { wrapper: TestWrapper });

    const emailInput = screen.getByPlaceholderText(/E-post/i);
    const submitButton = screen.getByRole('button', { name: /Send/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authAPI.requestPasswordReset).toHaveBeenCalled();
    });

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/kunne ikke sende/i)).toBeInTheDocument();
    });
  });

  it('should disable submit button while loading', async () => {
    authAPI.requestPasswordReset.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );

    render(<ForgotPassword />, { wrapper: TestWrapper });

    const emailInput = screen.getByPlaceholderText(/E-post/i);
    const submitButton = screen.getByRole('button', { name: /Send/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    // Button should be disabled during API call
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('should have a back to login link', () => {
    render(<ForgotPassword />, { wrapper: TestWrapper });

    const backLink = screen.getByText(/Tilbake til innlogging/i);
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/login');
  });
});
