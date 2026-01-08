/**
 * Coach Spillere Hub Page
 * Landing page for the Spillere (Players) area - GREEN
 */

import React from 'react';
import { getCoachAreaById } from '../../config/coach-navigation-v3';
import CoachHubPage from '../../components/layout/CoachHubPage';

interface CoachSpillereHubProps {
  stats?: {
    totaltSpillere: number;
    aktiveDenneMnd: number;
    treningsplaner: number;
    evalueringer: number;
  };
}

export default function CoachSpillereHub({
  stats = {
    totaltSpillere: 24,
    aktiveDenneMnd: 18,
    treningsplaner: 12,
    evalueringer: 45,
  },
}: CoachSpillereHubProps) {
  const area = getCoachAreaById('spillere');

  if (!area) return null;

  return (
    <CoachHubPage
      area={area}
      title="Spillere"
      subtitle="Administrer utøvere, treningsplaner og evalueringer"
      helpText="Oversikt over alle dine spillere. Se status, opprett treningsplaner og gjennomfør evalueringer."
      quickStats={[
        { label: 'Totalt spillere', value: stats.totaltSpillere, icon: 'Users' },
        { label: 'Aktive denne mnd', value: stats.aktiveDenneMnd, icon: 'Activity' },
        { label: 'Treningsplaner', value: stats.treningsplaner, icon: 'ClipboardList' },
        { label: 'Evalueringer', value: stats.evalueringer, icon: 'CheckCircle' },
      ]}
      featuredAction={{
        label: 'Legg til spiller',
        href: '/coach/athletes/new',
        icon: 'UserPlus',
        variant: 'primary',
      }}
    />
  );
}
