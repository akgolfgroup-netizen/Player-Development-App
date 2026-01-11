/**
 * Planlegger Hub Page
 * Landing page for the Planlegger area - AMBER
 */

import React from 'react';
import { getAreaById } from '../../config/player-navigation-v4';
import HubPage from '../../components/layout/HubPage';

interface PlanleggerHubProps {
  stats?: {
    planlagteOkter: number;
    kommendeTurneringer: number;
    skoleoppgaver: number;
    periodeTimer: number;
  };
}

export default function PlanleggerHub({
  stats = {
    planlagteOkter: 8,
    kommendeTurneringer: 3,
    skoleoppgaver: 5,
    periodeTimer: 25,
  },
}: PlanleggerHubProps) {
  const area = getAreaById('planlegger');

  if (!area) return null;

  return (
    <HubPage
      area={area}
      title="Planlegger"
      subtitle="Årsplan, treningsplan, skoleplan og turneringer"
      helpText="Oversikt over all planlegging. Organiser trening, skole og turneringer på ett sted."
      quickStats={[
        { label: 'Planlagte økter', value: stats.planlagteOkter, icon: 'Calendar' },
        { label: 'Kommende turneringer', value: stats.kommendeTurneringer, icon: 'Trophy' },
        { label: 'Skoleoppgaver', value: stats.skoleoppgaver, icon: 'BookOpen' },
        { label: 'Timer denne perioden', value: stats.periodeTimer, icon: 'Clock' },
      ]}
      featuredActions={[
        {
          label: 'Se årsplan',
          href: '/planlegger/aarsplan',
          icon: 'Calendar',
          variant: 'primary',
        },
        {
          label: 'Treningsplan',
          href: '/planlegger/treningsplan',
          icon: 'Calendar',
          variant: 'secondary',
        },
      ]}
    />
  );
}
