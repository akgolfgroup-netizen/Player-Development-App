/**
 * Mer Hub Page
 * Landing page for the Mer (More) area - PURPLE
 */

import React from 'react';
import { getAreaById } from '../../config/player-navigation-v3';
import HubPage from '../../components/layout/HubPage';

interface MerHubProps {
  stats?: {
    ulesteMeldinger: number;
    nyFeedback: number;
    ressurser: number;
  };
  userName?: string;
}

export default function MerHub({
  stats = {
    ulesteMeldinger: 3,
    nyFeedback: 2,
    ressurser: 45,
  },
  userName = 'Spiller',
}: MerHubProps) {
  const area = getAreaById('mer');

  if (!area) return null;

  return (
    <HubPage
      area={area}
      title="Mer"
      subtitle="Profil, meldinger, ressurser og innstillinger"
      quickStats={[
        {
          label: 'Uleste meldinger',
          value: stats.ulesteMeldinger,
          icon: 'Mail',
          color: stats.ulesteMeldinger > 0 ? '#DC2626' : undefined,
        },
        {
          label: 'Ny feedback',
          value: stats.nyFeedback,
          icon: 'MessageSquare',
          color: stats.nyFeedback > 0 ? '#D97706' : undefined,
        },
        { label: 'Ressurser tilgjengelig', value: stats.ressurser, icon: 'BookOpen' },
      ]}
      featuredAction={{
        label: 'Se meldinger',
        href: '/mer/meldinger',
        icon: 'Mail',
        variant: 'primary',
      }}
    />
  );
}
