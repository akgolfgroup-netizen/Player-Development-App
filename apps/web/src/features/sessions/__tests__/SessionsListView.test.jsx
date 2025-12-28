import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  useNavigate: () => mockNavigate,
}));

import { BrowserRouter } from 'react-router-dom';
import SessionsListView from '../SessionsListView';

describe('SessionsListView', () => {
  const mockSessions = [
    {
      id: 'session-1',
      sessionType: 'driving_range',
      completionStatus: 'completed',
      startedAt: '2025-12-20T10:00:00Z',
      duration: 90,
      focusArea: 'Driver Accuracy',
      evaluationFocus: 8,
      evaluationTechnical: 7,
    },
    {
      id: 'session-2',
      sessionType: 'putting',
      completionStatus: 'in_progress',
      startedAt: '2025-12-28T14:00:00Z',
      duration: 60,
      focusArea: 'Lag Putting',
    },
    {
      id: 'session-3',
      sessionType: 'chipping',
      completionStatus: 'abandoned',
      startedAt: '2025-12-15T09:00:00Z',
      duration: 45,
      focusArea: null,
    },
  ];

  const defaultProps = {
    sessions: mockSessions,
    pagination: { page: 1, totalPages: 2, total: 25 },
    filters: {},
    isLoading: false,
    onFilterChange: jest.fn(),
    onSearch: jest.fn(),
    onPageChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the sessions list header', () => {
      render(
        <BrowserRouter>
          <SessionsListView {...defaultProps} />
        </BrowserRouter>
      );

      expect(screen.getByText('Treningsokter')).toBeInTheDocument();
    });

    it('should render all sessions', () => {
      render(
        <BrowserRouter>
          <SessionsListView {...defaultProps} />
        </BrowserRouter>
      );

      expect(screen.getByText('Driver Accuracy')).toBeInTheDocument();
      expect(screen.getByText('Lag Putting')).toBeInTheDocument();
    });

    it('should display session types correctly', () => {
      render(
        <BrowserRouter>
          <SessionsListView {...defaultProps} />
        </BrowserRouter>
      );

      expect(screen.getByText('Driving Range')).toBeInTheDocument();
      expect(screen.getByText('Putting')).toBeInTheDocument();
      expect(screen.getByText('Chipping')).toBeInTheDocument();
    });

    it('should show status labels', () => {
      render(
        <BrowserRouter>
          <SessionsListView {...defaultProps} />
        </BrowserRouter>
      );

      expect(screen.getByText('Fullfort')).toBeInTheDocument();
      expect(screen.getByText('Pagar')).toBeInTheDocument();
      expect(screen.getByText('Avbrutt')).toBeInTheDocument();
    });

    it('should display session durations', () => {
      render(
        <BrowserRouter>
          <SessionsListView {...defaultProps} />
        </BrowserRouter>
      );

      expect(screen.getByText('90 min')).toBeInTheDocument();
      expect(screen.getByText('60 min')).toBeInTheDocument();
      expect(screen.getByText('45 min')).toBeInTheDocument();
    });

    it('should show evaluation ratings for completed sessions', () => {
      render(
        <BrowserRouter>
          <SessionsListView {...defaultProps} />
        </BrowserRouter>
      );

      expect(screen.getByText('Fokus: 8/10')).toBeInTheDocument();
      expect(screen.getByText('Teknikk: 7/10')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no sessions', () => {
      render(
        <BrowserRouter>
          <SessionsListView {...defaultProps} sessions={[]} />
        </BrowserRouter>
      );

      expect(screen.getByText('Ingen okter funnet')).toBeInTheDocument();
    });

    it('should have a create new session button in empty state', () => {
      render(
        <BrowserRouter>
          <SessionsListView {...defaultProps} sessions={[]} />
        </BrowserRouter>
      );

      expect(screen.getByText(/Ny okt/i)).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to session detail when clicking completed session', () => {
      render(
        <BrowserRouter>
          <SessionsListView {...defaultProps} />
        </BrowserRouter>
      );

      const completedSession = screen.getByText('Driver Accuracy').closest('div[role="button"]') ||
                               screen.getByText('Driver Accuracy').closest('div');
      fireEvent.click(completedSession);

      expect(mockNavigate).toHaveBeenCalledWith('/session/session-1');
    });

    it('should navigate to evaluation when clicking in-progress session', () => {
      render(
        <BrowserRouter>
          <SessionsListView {...defaultProps} />
        </BrowserRouter>
      );

      const inProgressSession = screen.getByText('Lag Putting').closest('div[role="button"]') ||
                                screen.getByText('Lag Putting').closest('div');
      fireEvent.click(inProgressSession);

      expect(mockNavigate).toHaveBeenCalledWith('/session/session-2/evaluate');
    });

    it('should navigate to new session when clicking create button', () => {
      render(
        <BrowserRouter>
          <SessionsListView {...defaultProps} />
        </BrowserRouter>
      );

      const createButton = screen.getByRole('button', { name: /Ny okt/i });
      fireEvent.click(createButton);

      expect(mockNavigate).toHaveBeenCalledWith('/session/new');
    });
  });

  describe('Filtering', () => {
    it('should render filter bar', () => {
      render(
        <BrowserRouter>
          <SessionsListView {...defaultProps} />
        </BrowserRouter>
      );

      expect(screen.getByPlaceholderText(/Sok i okter/i)).toBeInTheDocument();
    });

    it('should call onSearch when typing in search', () => {
      const mockOnSearch = jest.fn();
      render(
        <BrowserRouter>
          <SessionsListView {...defaultProps} onSearch={mockOnSearch} />
        </BrowserRouter>
      );

      const searchInput = screen.getByPlaceholderText(/Sok i okter/i);
      fireEvent.change(searchInput, { target: { value: 'putting' } });

      expect(mockOnSearch).toHaveBeenCalledWith('putting');
    });
  });

  describe('Pagination', () => {
    it('should render pagination when multiple pages', () => {
      render(
        <BrowserRouter>
          <SessionsListView {...defaultProps} />
        </BrowserRouter>
      );

      expect(screen.getByText('Side 1 av 2')).toBeInTheDocument();
    });

    it('should not render pagination when only one page', () => {
      render(
        <BrowserRouter>
          <SessionsListView
            {...defaultProps}
            pagination={{ page: 1, totalPages: 1, total: 3 }}
          />
        </BrowserRouter>
      );

      expect(screen.queryByText(/Side.*av/)).not.toBeInTheDocument();
    });

    it('should call onPageChange when clicking next', () => {
      const mockOnPageChange = jest.fn();
      render(
        <BrowserRouter>
          <SessionsListView {...defaultProps} onPageChange={mockOnPageChange} />
        </BrowserRouter>
      );

      const nextButton = screen.getByText('Neste');
      fireEvent.click(nextButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it('should disable previous button on first page', () => {
      render(
        <BrowserRouter>
          <SessionsListView {...defaultProps} />
        </BrowserRouter>
      );

      const prevButton = screen.getByText('Forrige');
      expect(prevButton).toBeDisabled();
    });

    it('should disable next button on last page', () => {
      render(
        <BrowserRouter>
          <SessionsListView
            {...defaultProps}
            pagination={{ page: 2, totalPages: 2, total: 25 }}
          />
        </BrowserRouter>
      );

      const nextButton = screen.getByText('Neste');
      expect(nextButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(
        <BrowserRouter>
          <SessionsListView {...defaultProps} />
        </BrowserRouter>
      );

      const heading = screen.getByRole('heading', { name: /Treningsokter/i });
      expect(heading).toBeInTheDocument();
    });

    it('should have accessible buttons', () => {
      render(
        <BrowserRouter>
          <SessionsListView {...defaultProps} />
        </BrowserRouter>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
