/**
 * Målsetninger Hub Page
 * Landing page for the Målsetninger area - AMBER
 */

import React from 'react';
import { getAreaById } from '../../config/player-navigation-v4';
import HubPage from '../../components/layout/HubPage';

interface MaalsetningerHubProps {
  stats?: {
    aktiveMaal: number;
    fullforteMaal: number;
    prosessmaal: number;
    resultatmaal: number;
  };
}

export default function MaalsetningerHub({
  stats = {
    aktiveMaal: 5,
    fullforteMaal: 12,
    prosessmaal: 3,
    resultatmaal: 2,
  },
}: MaalsetningerHubProps) {
  const area = getAreaById('maalsetninger');

  if (!area) return null;

  return (
    <HubPage
      area={area}
      title="Målsetninger"
      subtitle="Mine mål og progresjon"
      helpText="Oversikt over alle målsetninger. Følg med på målprogresjon og se fremgang mot dine mål."
      quickStats={[
        { label: 'Aktive mål', value: stats.aktiveMaal, icon: 'Target' },
        { label: 'Fullførte mål', value: stats.fullforteMaal, icon: 'CheckCircle' },
        { label: 'Prosessmål', value: stats.prosessmaal, icon: 'TrendingUp' },
        { label: 'Resultatmål', value: stats.resultatmaal, icon: 'Award' },
      ]}
      featuredActions={[
        {
          label: 'Mine målsetninger',
          href: '/maalsetninger/mine',
          icon: 'Target',
          variant: 'primary',
        },
        {
          label: 'Se progresjon',
          href: '/maalsetninger/progresjon',
          icon: 'TrendingUp',
          variant: 'secondary',
        },
      ]}
    />
  );
}
