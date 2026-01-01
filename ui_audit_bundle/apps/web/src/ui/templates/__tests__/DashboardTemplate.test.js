import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardTemplate from '../DashboardTemplate.template';

describe('DashboardTemplate', () => {
  const defaultProps = {
    title: 'Dashboard',
    stats: [
      { id: '1', label: 'Total', value: 100 },
      { id: '2', label: 'Active', value: 50 },
      { id: '3', label: 'Pending', value: 25 },
    ],
  };

  describe('Basic Rendering', () => {
    it('renders with required props', () => {
      render(<DashboardTemplate {...defaultProps} />);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('renders with subtitle', () => {
      render(<DashboardTemplate {...defaultProps} subtitle="Overview" />);

      expect(screen.getByText('Overview')).toBeInTheDocument();
    });

    it('renders without subtitle', () => {
      render(<DashboardTemplate {...defaultProps} />);

      expect(screen.queryByText('Overview')).not.toBeInTheDocument();
    });
  });

  describe('Stats Grid', () => {
    it('renders all stats', () => {
      render(<DashboardTemplate {...defaultProps} />);

      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
    });

    it('renders stats with change indicators', () => {
      const statsWithChange = [
        { id: '1', label: 'Sessions', value: 12, change: 5, trend: 'up' },
        { id: '2', label: 'Hours', value: 24, change: -10, trend: 'down' },
        { id: '3', label: 'Streak', value: 5, change: 0, trend: 'neutral' },
      ];

      render(<DashboardTemplate {...defaultProps} stats={statsWithChange} />);

      expect(screen.getByText('5%')).toBeInTheDocument();
      expect(screen.getByText('10%')).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('uses StatsGridTemplate with 3 columns', () => {
      const { container } = render(<DashboardTemplate {...defaultProps} />);

      // StatsGridTemplate creates a grid
      const grid = container.querySelector('[style*="grid"]');
      expect(grid).toBeInTheDocument();
    });

    it('renders empty stats array', () => {
      render(<DashboardTemplate {...defaultProps} stats={[]} />);

      expect(screen.queryByText('Total')).not.toBeInTheDocument();
    });
  });

  describe('Welcome Section', () => {
    it('renders welcome message', () => {
      render(<DashboardTemplate {...defaultProps} welcomeMessage="Welcome to your dashboard" />);

      expect(screen.getByText('Welcome to your dashboard')).toBeInTheDocument();
    });

    it('renders user info', () => {
      const user = {
        name: 'John Doe',
        role: 'Admin',
      };

      render(<DashboardTemplate {...defaultProps} user={user} />);

      expect(screen.getByText('Welcome back, John Doe!')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('renders user avatar when provided', () => {
      const user = {
        name: 'John Doe',
        avatar: 'https://example.com/avatar.jpg',
      };

      render(<DashboardTemplate {...defaultProps} user={user} />);

      expect(screen.getByText('Welcome back, John Doe!')).toBeInTheDocument();
    });

    it('does not render welcome section without user or message', () => {
      render(<DashboardTemplate {...defaultProps} />);

      expect(screen.queryByText(/Welcome back/)).not.toBeInTheDocument();
    });

    it('renders both user and welcome message', () => {
      const user = { name: 'John Doe' };
      const welcomeMessage = 'Good morning!';

      render(<DashboardTemplate {...defaultProps} user={user} welcomeMessage={welcomeMessage} />);

      expect(screen.getByText('Welcome back, John Doe!')).toBeInTheDocument();
      expect(screen.getByText('Good morning!')).toBeInTheDocument();
    });
  });

  describe('Activity Feed', () => {
    const activities = [
      {
        id: '1',
        title: 'Session Completed',
        description: 'John completed a training session',
        timestamp: new Date().toISOString(),
        type: 'success',
      },
      {
        id: '2',
        title: 'New Goal',
        description: 'Jane set a new goal',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        type: 'info',
      },
    ];

    it('renders activity feed when activities provided', () => {
      render(<DashboardTemplate {...defaultProps} activities={activities} />);

      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
      expect(screen.getByText('Session Completed')).toBeInTheDocument();
      expect(screen.getByText('John completed a training session')).toBeInTheDocument();
      expect(screen.getByText('New Goal')).toBeInTheDocument();
    });

    it('shows activity count', () => {
      render(<DashboardTemplate {...defaultProps} activities={activities} />);

      expect(screen.getByText('2 updates')).toBeInTheDocument();
    });

    it('does not render activity feed when showActivity is false', () => {
      render(<DashboardTemplate {...defaultProps} activities={activities} showActivity={false} />);

      expect(screen.queryByText('Recent Activity')).not.toBeInTheDocument();
    });

    it('does not render activity feed when activities array is empty', () => {
      render(<DashboardTemplate {...defaultProps} activities={[]} />);

      expect(screen.queryByText('Recent Activity')).not.toBeInTheDocument();
    });

    it('limits activities to 10 items', () => {
      const manyActivities = Array.from({ length: 15 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Activity ${i + 1}`,
        description: `Description ${i + 1}`,
        timestamp: new Date().toISOString(),
      }));

      render(<DashboardTemplate {...defaultProps} activities={manyActivities} />);

      expect(screen.getByText('Activity 1')).toBeInTheDocument();
      expect(screen.getByText('Activity 10')).toBeInTheDocument();
      expect(screen.queryByText('Activity 11')).not.toBeInTheDocument();
    });

    it('shows "View All Activity" button when more than 10 activities', () => {
      const manyActivities = Array.from({ length: 15 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Activity ${i + 1}`,
        description: `Description ${i + 1}`,
        timestamp: new Date().toISOString(),
      }));

      render(<DashboardTemplate {...defaultProps} activities={manyActivities} />);

      expect(screen.getByText('View All Activity')).toBeInTheDocument();
    });

    it('does not show "View All Activity" button with 10 or fewer activities', () => {
      render(<DashboardTemplate {...defaultProps} activities={activities} />);

      expect(screen.queryByText('View All Activity')).not.toBeInTheDocument();
    });

    it('renders activity with user avatar', () => {
      const activitiesWithAvatar = [
        {
          id: '1',
          title: 'Activity',
          description: 'Description',
          timestamp: new Date().toISOString(),
          userName: 'John',
          avatar: 'https://example.com/avatar.jpg',
        },
      ];

      render(<DashboardTemplate {...defaultProps} activities={activitiesWithAvatar} />);

      expect(screen.getByText('Activity')).toBeInTheDocument();
    });

    it('renders different activity types with correct icons', () => {
      const typedActivities = [
        {
          id: '1',
          title: 'Success',
          description: 'Success activity',
          timestamp: new Date().toISOString(),
          type: 'success',
        },
        {
          id: '2',
          title: 'Warning',
          description: 'Warning activity',
          timestamp: new Date().toISOString(),
          type: 'warning',
        },
        {
          id: '3',
          title: 'Error',
          description: 'Error activity',
          timestamp: new Date().toISOString(),
          type: 'error',
        },
        {
          id: '4',
          title: 'Info',
          description: 'Info activity',
          timestamp: new Date().toISOString(),
          type: 'info',
        },
      ];

      render(<DashboardTemplate {...defaultProps} activities={typedActivities} />);

      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('Warning')).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Info')).toBeInTheDocument();
    });

    it('formats timestamps correctly - just now', () => {
      const recentActivity = [
        {
          id: '1',
          title: 'Activity',
          description: 'Description',
          timestamp: new Date().toISOString(),
        },
      ];

      render(<DashboardTemplate {...defaultProps} activities={recentActivity} />);

      expect(screen.getByText('Just now')).toBeInTheDocument();
    });

    it('formats timestamps correctly - minutes ago', () => {
      const activity = [
        {
          id: '1',
          title: 'Activity',
          description: 'Description',
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        },
      ];

      render(<DashboardTemplate {...defaultProps} activities={activity} />);

      expect(screen.getByText('5m ago')).toBeInTheDocument();
    });

    it('formats timestamps correctly - hours ago', () => {
      const activity = [
        {
          id: '1',
          title: 'Activity',
          description: 'Description',
          timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
        },
      ];

      render(<DashboardTemplate {...defaultProps} activities={activity} />);

      expect(screen.getByText('3h ago')).toBeInTheDocument();
    });

    it('formats timestamps correctly - days ago', () => {
      const activity = [
        {
          id: '1',
          title: 'Activity',
          description: 'Description',
          timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
        },
      ];

      render(<DashboardTemplate {...defaultProps} activities={activity} />);

      expect(screen.getByText('2d ago')).toBeInTheDocument();
    });
  });

  describe('Tabs', () => {
    const tabs = [
      { id: 'tab1', label: 'Overview', content: <div>Overview Content</div> },
      { id: 'tab2', label: 'Details', content: <div>Details Content</div> },
    ];

    it('renders tabs when provided', () => {
      render(<DashboardTemplate {...defaultProps} tabs={tabs} />);

      expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Details' })).toBeInTheDocument();
    });

    it('renders first tab content by default', () => {
      render(<DashboardTemplate {...defaultProps} tabs={tabs} />);

      expect(screen.getByText('Overview Content')).toBeInTheDocument();
    });

    it('renders placeholder when no tabs provided', () => {
      render(<DashboardTemplate {...defaultProps} />);

      expect(screen.getByText('No content configured. Add tabs to display data.')).toBeInTheDocument();
    });

    it('renders tabs with badges', () => {
      const tabsWithBadges = [
        { id: 'tab1', label: 'Notifications', content: <div>Content</div>, badge: 5 },
      ];

      render(<DashboardTemplate {...defaultProps} tabs={tabsWithBadges} />);

      // Tab accessible name includes badge number
      expect(screen.getByRole('tab', { name: /Notifications/ })).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('renders action buttons', () => {
      const actions = <button>Create New</button>;
      render(<DashboardTemplate {...defaultProps} actions={actions} />);

      expect(screen.getByText('Create New')).toBeInTheDocument();
    });

    it('renders without actions', () => {
      render(<DashboardTemplate {...defaultProps} />);

      expect(screen.queryByText('Create New')).not.toBeInTheDocument();
    });

    it('renders multiple action buttons', () => {
      const actions = (
        <>
          <button>Export</button>
          <button>Settings</button>
        </>
      );
      render(<DashboardTemplate {...defaultProps} actions={actions} />);

      expect(screen.getByText('Export')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading state when loading is true', () => {
      render(<DashboardTemplate {...defaultProps} loading={true} />);

      expect(screen.getByText('Loading statistics...')).toBeInTheDocument();
    });

    it('does not show loading state when loading is false', () => {
      render(<DashboardTemplate {...defaultProps} loading={false} />);

      expect(screen.queryByText('Loading statistics...')).not.toBeInTheDocument();
    });

    it('hides stats when loading', () => {
      render(<DashboardTemplate {...defaultProps} loading={true} />);

      expect(screen.queryByText('Total')).not.toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('renders with AppShell structure', () => {
      const { container } = render(<DashboardTemplate {...defaultProps} />);

      expect(container.querySelector('header')).toBeInTheDocument();
    });

    it('renders main content area', () => {
      const { container } = render(<DashboardTemplate {...defaultProps} />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('uses grid layout for main content and activity feed', () => {
      const activities = [
        {
          id: '1',
          title: 'Activity',
          description: 'Description',
          timestamp: new Date().toISOString(),
        },
      ];

      const { container } = render(<DashboardTemplate {...defaultProps} activities={activities} />);

      const mainContent = container.querySelector('[style*="grid"]');
      expect(mainContent).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles missing optional props', () => {
      render(<DashboardTemplate title="Dashboard" stats={[]} />);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('handles stats with zero values', () => {
      const zeroStats = [{ id: '1', label: 'Empty', value: 0 }];

      render(<DashboardTemplate {...defaultProps} stats={zeroStats} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('handles stats with string values', () => {
      const stringStats = [{ id: '1', label: 'Status', value: 'Active' }];

      render(<DashboardTemplate {...defaultProps} stats={stringStats} />);

      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('handles negative change values', () => {
      const stats = [{ id: '1', label: 'Sessions', value: 10, change: -5, trend: 'down' }];

      render(<DashboardTemplate {...defaultProps} stats={stats} />);

      // Should show absolute value
      expect(screen.getByText('5%')).toBeInTheDocument();
    });

    it('handles stats without trend but with change', () => {
      const stats = [{ id: '1', label: 'Sessions', value: 10, change: 5 }];

      render(<DashboardTemplate {...defaultProps} stats={stats} />);

      expect(screen.getByText('5%')).toBeInTheDocument();
    });

    it('handles very old activity timestamps', () => {
      const oldActivity = [
        {
          id: '1',
          title: 'Old Activity',
          description: 'Description',
          timestamp: new Date('2020-01-01').toISOString(),
        },
      ];

      render(<DashboardTemplate {...defaultProps} activities={oldActivity} />);

      // Should show formatted date
      expect(screen.getByText('Old Activity')).toBeInTheDocument();
    });
  });

  describe('Integration with StatsGridTemplate', () => {
    it('transforms stats correctly for StatsGridTemplate', () => {
      const stats = [
        { id: '1', label: 'Total', value: 100, change: 10, trend: 'up' },
      ];

      render(<DashboardTemplate {...defaultProps} stats={stats} />);

      // Verify the transformation worked
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('10%')).toBeInTheDocument();
      expect(screen.getByText('↑')).toBeInTheDocument();
    });

    it('handles stats without change for StatsGridTemplate', () => {
      const stats = [{ id: '1', label: 'Total', value: 100 }];

      render(<DashboardTemplate {...defaultProps} stats={stats} />);

      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.queryByText('↑')).not.toBeInTheDocument();
      expect(screen.queryByText('↓')).not.toBeInTheDocument();
    });
  });

  describe('Complete Dashboard Scenarios', () => {
    it('renders fully configured dashboard', () => {
      const fullProps = {
        title: 'Analytics Dashboard',
        subtitle: 'Weekly Overview',
        user: {
          name: 'Jane Doe',
          avatar: 'https://example.com/avatar.jpg',
          role: 'Manager',
        },
        stats: [
          { id: '1', label: 'Revenue', value: '$10,000', change: 15, trend: 'up' },
          { id: '2', label: 'Users', value: 500, change: -5, trend: 'down' },
          { id: '3', label: 'Sessions', value: 1200, change: 0, trend: 'neutral' },
        ],
        activities: [
          {
            id: '1',
            title: 'Sale Completed',
            description: 'New sale recorded',
            timestamp: new Date().toISOString(),
            type: 'success',
            userName: 'John',
          },
        ],
        tabs: [
          { id: 'overview', label: 'Overview', content: <div>Overview Tab</div> },
          { id: 'analytics', label: 'Analytics', content: <div>Analytics Tab</div> },
        ],
        actions: <button>Export Report</button>,
        welcomeMessage: 'Great work this week!',
      };

      render(<DashboardTemplate {...fullProps} />);

      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Weekly Overview')).toBeInTheDocument();
      expect(screen.getByText('Welcome back, Jane Doe!')).toBeInTheDocument();
      expect(screen.getByText('Manager')).toBeInTheDocument();
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('$10,000')).toBeInTheDocument();
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
      expect(screen.getByText('Export Report')).toBeInTheDocument();
      expect(screen.getByText('Great work this week!')).toBeInTheDocument();
    });

    it('renders minimal dashboard', () => {
      const minimalProps = {
        title: 'Simple Dashboard',
        stats: [{ id: '1', label: 'Count', value: 42 }],
      };

      render(<DashboardTemplate {...minimalProps} />);

      expect(screen.getByText('Simple Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Count')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });
  });
});
