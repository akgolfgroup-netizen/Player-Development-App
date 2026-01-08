/**
 * Plan Hub Page
 * Landing page for the Plan area - AMBER
 */

import React from 'react';
import { getAreaById } from '../../config/player-navigation-v3';
import HubPage from '../../components/layout/HubPage';

interface PlanHubProps {
  stats?: {
    planlagteOkter: number;
    kommendeTurneringer: number;
    aktiveMaal: number;
    fullforteMaal: number;
  };
}

export default function PlanHub({
  stats = {
    planlagteOkter: 8,
    kommendeTurneringer: 3,
    aktiveMaal: 5,
    fullforteMaal: 12,
  },
}: PlanHubProps) {
  const area = getAreaById('plan');

  if (!area) return null;

  return (
    <HubPage
      area={area}
      title="Plan"
      subtitle="Planlegg trening, sett mål og følg med på turneringer"
      quickStats={[
        { label: 'Planlagte økter', value: stats.planlagteOkter, icon: 'Calendar' },
        { label: 'Kommende turneringer', value: stats.kommendeTurneringer, icon: 'Trophy' },
        { label: 'Aktive mål', value: stats.aktiveMaal, icon: 'Target' },
        { label: 'Fullførte mål', value: stats.fullforteMaal, icon: 'CheckCircle' },
      ]}
      featuredAction={{
        label: 'Se kalender',
        href: '/plan/kalender',
        icon: 'Calendar',
        variant: 'primary',
      }}
    />
  );
}
