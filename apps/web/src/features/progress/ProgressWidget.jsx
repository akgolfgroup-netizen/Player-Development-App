import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { SubSectionTitle } from '../../components/typography';

// UiCanon: Using CSS variables for consistent color theming
const styles = {
  container: {
    backgroundColor: 'var(--bg-primary)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-card)',
    padding: 'var(--spacing-6)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--spacing-4)',
  },
  viewDetailsButton: {
    fontSize: '14px',
    color: 'var(--accent)',
    fontWeight: 500,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'var(--spacing-4)',
    marginBottom: 'var(--spacing-4)',
  },
  completionCard: {
    textAlign: 'center',
    padding: 'var(--spacing-3)',
    backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
    borderRadius: 'var(--radius-lg)',
  },
  completionValue: {
    fontSize: '32px',
    fontWeight: 700,
    color: 'var(--accent)',
  },
  streakCard: {
    textAlign: 'center',
    padding: 'var(--spacing-3)',
    backgroundColor: 'rgba(var(--warning-rgb), 0.1)',
    borderRadius: 'var(--radius-lg)',
  },
  streakValue: {
    fontSize: '32px',
    fontWeight: 700,
    color: 'var(--warning)',
  },
  label: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    marginTop: 'var(--spacing-1)',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: 'var(--text-secondary)',
  },
};

export default function ProgressWidget({ planId }) {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (planId) loadAnalytics();
  }, [planId]);

  const loadAnalytics = async () => {
    try {
      const { data: response } = await apiClient.get(
        `/training-plan/${planId}/analytics`
      );
      setData(response.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  };

  if (!data) return null;

  const { overview } = data;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <SubSectionTitle>Your Progress</SubSectionTitle>
        <button
          onClick={() => navigate('/progress')}
          style={styles.viewDetailsButton}
        >
          View Details
        </button>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.completionCard}>
          <div style={styles.completionValue}>
            {overview.completionRate}%
          </div>
          <div style={styles.label}>Completion</div>
        </div>
        <div style={styles.streakCard}>
          <div style={styles.streakValue}>
            {overview.currentStreak}
          </div>
          <div style={styles.label}>Day Streak</div>
        </div>
      </div>

      <div style={styles.footer}>
        <span>{overview.totalSessionsCompleted} sessions completed</span>
        <span>{overview.totalHoursCompleted}h trained</span>
      </div>
    </div>
  );
}
