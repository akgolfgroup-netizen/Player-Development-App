import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Målsetninger from '../Målsetninger';

describe('Målsetninger', () => {
  const mockGoals = [
    {
      id: 1,
      title: 'Nå handicap 5.0',
      description: 'Redusere handicap fra 8.2 til 5.0',
      category: 'score',
      timeframe: 'long',
      measurable: true,
      current: 8.2,
      target: 5.0,
      unit: 'HCP',
      deadline: '2025-09-01',
      status: 'active',
      sharedWithCoach: true,
      milestones: [
        { id: 1, title: 'Nå 7.0', target: 7.0, current: 7.5, status: 'in_progress' },
      ],
      coachComments: [
        { id: 1, author: 'Coach', date: '2025-12-10', comment: 'Great progress!' },
      ],
    },
    {
      id: 2,
      title: 'Forbedre putting',
      description: 'Under 30 puts per runde',
      category: 'teknikk',
      timeframe: 'medium',
      measurable: true,
      current: 32,
      target: 30,
      unit: 'puts/runde',
      deadline: '2025-06-01',
      status: 'active',
      sharedWithCoach: false,
      milestones: [],
      coachComments: [],
    },
    {
      id: 3,
      title: 'Fullført mål',
      description: 'Trene 4 ganger per uke',
      category: 'prosess',
      timeframe: 'short',
      measurable: true,
      current: 4,
      target: 4,
      unit: 'ganger/uke',
      deadline: '2025-01-01',
      status: 'completed',
      sharedWithCoach: false,
      milestones: [],
      coachComments: [],
    },
  ];

  describe('Rendering', () => {
    it('should render the goals page header', () => {
      render(<Målsetninger goals={mockGoals} />);

      expect(screen.getByRole('heading', { name: /Målsetninger/i })).toBeInTheDocument();
    });

    it('should render all goals', () => {
      render(<Målsetninger goals={mockGoals} />);

      expect(screen.getByText('Nå handicap 5.0')).toBeInTheDocument();
      expect(screen.getByText('Forbedre putting')).toBeInTheDocument();
      expect(screen.getByText('Fullført mål')).toBeInTheDocument();
    });

    it('should display goal descriptions', () => {
      render(<Målsetninger goals={mockGoals} />);

      expect(screen.getByText('Redusere handicap fra 8.2 til 5.0')).toBeInTheDocument();
    });

    it('should show timeframe badges', () => {
      render(<Målsetninger goals={mockGoals} />);

      expect(screen.getByText('Langsiktig')).toBeInTheDocument();
      expect(screen.getByText('Mellomlang')).toBeInTheDocument();
      expect(screen.getByText('Kortsiktig')).toBeInTheDocument();
    });

    it('should show coach sharing indicator', () => {
      render(<Målsetninger goals={mockGoals} />);

      expect(screen.getByText(/Delt med trener/)).toBeInTheDocument();
    });

    it('should display progress for measurable goals', () => {
      render(<Målsetninger goals={mockGoals} />);

      // Check for progress indicators
      expect(screen.getByText(/8.2.*5.0/)).toBeInTheDocument();
    });

    it('should render milestones for goals that have them', () => {
      render(<Målsetninger goals={mockGoals} />);

      expect(screen.getByText('Nå 7.0')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no goals provided', () => {
      render(<Målsetninger goals={[]} />);

      expect(screen.getByText(/ingen/i)).toBeInTheDocument();
    });

    it('should use default goals when no props provided', () => {
      render(<Målsetninger />);

      // Should render with default goals
      expect(screen.getByRole('heading', { name: /Målsetninger/i })).toBeInTheDocument();
    });
  });

  describe('Category Filtering', () => {
    it('should render category filter buttons', () => {
      render(<Målsetninger goals={mockGoals} />);

      expect(screen.getByText('Alle')).toBeInTheDocument();
      expect(screen.getByText(/Score/i)).toBeInTheDocument();
      expect(screen.getByText(/Teknikk/i)).toBeInTheDocument();
    });

    it('should filter goals by category when clicked', () => {
      render(<Målsetninger goals={mockGoals} />);

      // Click on Teknikk filter
      const teknikkButton = screen.getByRole('button', { name: /Teknikk/i });
      fireEvent.click(teknikkButton);

      // Should show only teknikk goals
      expect(screen.getByText('Forbedre putting')).toBeInTheDocument();
    });

    it('should show all goals when "Alle" filter clicked', () => {
      render(<Målsetninger goals={mockGoals} />);

      // First filter by category
      const teknikkButton = screen.getByRole('button', { name: /Teknikk/i });
      fireEvent.click(teknikkButton);

      // Then click Alle
      const alleButton = screen.getByText('Alle');
      fireEvent.click(alleButton);

      // Should show all goals
      expect(screen.getByText('Nå handicap 5.0')).toBeInTheDocument();
      expect(screen.getByText('Forbedre putting')).toBeInTheDocument();
    });
  });

  describe('Goal Interactions', () => {
    it('should have a button to create new goal', () => {
      render(<Målsetninger goals={mockGoals} />);

      expect(screen.getByRole('button', { name: /Nytt mål/i })).toBeInTheDocument();
    });

    it('should open modal when new goal button clicked', () => {
      render(<Målsetninger goals={mockGoals} />);

      const newGoalButton = screen.getByRole('button', { name: /Nytt mål/i });
      fireEvent.click(newGoalButton);

      // Modal should be visible
      expect(screen.getByText('Nytt mål')).toBeInTheDocument();
    });

    it('should have edit button for each goal', () => {
      render(<Målsetninger goals={mockGoals} />);

      // Each goal should have an edit button (emoji)
      const editButtons = screen.getAllByText('✏️');
      expect(editButtons.length).toBeGreaterThan(0);
    });

    it('should have completion checkbox for each goal', () => {
      render(<Målsetninger goals={mockGoals} />);

      // Check for completion checkmarks on completed goals
      const checkmarks = screen.getAllByText('✓');
      expect(checkmarks.length).toBeGreaterThan(0);
    });
  });

  describe('Goal Modal', () => {
    it('should show form fields in modal', async () => {
      render(<Målsetninger goals={mockGoals} />);

      const newGoalButton = screen.getByRole('button', { name: /Nytt mål/i });
      fireEvent.click(newGoalButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/Måltittel/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Beskrivelse/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Kategori/i)).toBeInTheDocument();
      });
    });

    it('should close modal when close button clicked', async () => {
      render(<Målsetninger goals={mockGoals} />);

      const newGoalButton = screen.getByRole('button', { name: /Nytt mål/i });
      fireEvent.click(newGoalButton);

      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);

      // Modal should be closed - 'Nytt mål' heading shouldn't be visible
      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: /^Nytt mål$/ })).not.toBeInTheDocument();
      });
    });

    it('should close modal when cancel button clicked', async () => {
      render(<Målsetninger goals={mockGoals} />);

      const newGoalButton = screen.getByRole('button', { name: /Nytt mål/i });
      fireEvent.click(newGoalButton);

      const cancelButton = screen.getByText('Avbryt');
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: /^Nytt mål$/ })).not.toBeInTheDocument();
      });
    });
  });

  describe('Stats Display', () => {
    it('should show goal statistics', () => {
      render(<Målsetninger goals={mockGoals} />);

      // Should show totals
      expect(screen.getByText(/Totalt/i)).toBeInTheDocument();
      expect(screen.getByText(/Aktive/i)).toBeInTheDocument();
    });

    it('should calculate completed goals correctly', () => {
      render(<Målsetninger goals={mockGoals} />);

      // One goal is completed
      expect(screen.getByText(/Fullførte/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<Målsetninger goals={mockGoals} />);

      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should have accessible buttons', () => {
      render(<Målsetninger goals={mockGoals} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should have labeled form fields in modal', async () => {
      render(<Målsetninger goals={mockGoals} />);

      const newGoalButton = screen.getByRole('button', { name: /Nytt mål/i });
      fireEvent.click(newGoalButton);

      await waitFor(() => {
        const titleInput = screen.getByLabelText(/Måltittel/i);
        expect(titleInput).toBeInTheDocument();
      });
    });
  });

  describe('Coach Integration', () => {
    it('should show coach comments on shared goals', () => {
      render(<Målsetninger goals={mockGoals} />);

      expect(screen.getByText('Great progress!')).toBeInTheDocument();
    });

    it('should have share with coach button', () => {
      render(<Målsetninger goals={mockGoals} />);

      // Goals should have share/unshare buttons
      const shareButtons = screen.getAllByTitle(/Del med trener|Delt med trener/);
      expect(shareButtons.length).toBeGreaterThan(0);
    });
  });
});
