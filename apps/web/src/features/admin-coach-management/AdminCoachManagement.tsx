/**
 * AK Golf Academy - Admin Coach Management
 *
 * Archetype: A - List/Index Page
 * Purpose: Manage coach accounts as system users
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Mail, CheckCircle, XCircle } from 'lucide-react';
import { Page } from '../../ui/components/Page';
import { Text, Badge, Button } from '../../ui/primitives';
import apiClient from '../../services/apiClient';

// ============================================================================
// TYPES
// ============================================================================

type CoachAccount = {
  id: string;
  name: string;
  email: string;
  active: boolean;
};

// ============================================================================
// AVATAR COMPONENT
// ============================================================================

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full bg-ak-brand-primary text-white
        flex items-center justify-center font-semibold flex-shrink-0
      `}
    >
      {initials}
    </div>
  );
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function AdminCoachManagement() {
  const [coaches, setCoaches] = useState<CoachAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCoaches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiClient.get('/coaches');
      const coachList = data.data.coaches || data.data || [];
      setCoaches(
        coachList.map(
          (c: {
            id: string;
            firstName: string;
            lastName: string;
            user?: { email: string; isActive: boolean };
          }) => ({
            id: c.id,
            name: `${c.firstName} ${c.lastName}`,
            email: c.user?.email || '',
            active: c.user?.isActive ?? true,
          })
        )
      );
    } catch (err) {
      console.error('Failed to load coaches:', err);
      setError('Kunne ikke laste trenere');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoaches();
  }, [loadCoaches]);

  const toggleActive = async (id: string) => {
    const coach = coaches.find((c) => c.id === id);
    if (!coach) return;

    try {
      await apiClient.patch(`/coaches/${id}`, { isActive: !coach.active });
      setCoaches((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
    } catch (err) {
      console.error('Failed to toggle coach status:', err);
    }
  };

  const activeCount = coaches.filter((c) => c.active).length;

  // Determine page state
  const pageState = loading ? 'loading' : error ? 'error' : coaches.length === 0 ? 'empty' : 'idle';

  return (
    <Page state={pageState} maxWidth="xl">
      <Page.Header
        title="Trenerkontoer"
        subtitle={coaches.length > 0 ? `${activeCount} aktive av ${coaches.length} kontoer` : undefined}
      />

      <Page.Content>
        <Page.Section title="Trenere" description="Administrer trenerkontoer">
          <div className="divide-y divide-ak-border-default">
            {coaches.map((coach) => (
              <div
                key={coach.id}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <Avatar name={coach.name} />

                <div className="flex-1 min-w-0">
                  <Text variant="body" color="primary" className="font-medium">
                    {coach.name}
                  </Text>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Mail size={14} className="text-ak-text-secondary" />
                    <Text variant="caption1" color="secondary">
                      {coach.email}
                    </Text>
                  </div>
                </div>

                <Badge variant={coach.active ? 'success' : 'default'} size="sm">
                  <span className="flex items-center gap-1.5">
                    {coach.active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {coach.active ? 'Aktiv' : 'Inaktiv'}
                  </span>
                </Badge>

                <Button
                  variant={coach.active ? 'ghost' : 'secondary'}
                  size="sm"
                  onClick={() => toggleActive(coach.id)}
                >
                  {coach.active ? 'Deaktiver' : 'Aktiver'}
                </Button>
              </div>
            ))}
          </div>
        </Page.Section>
      </Page.Content>
    </Page>
  );
}
