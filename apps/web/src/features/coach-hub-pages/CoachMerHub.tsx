/**
 * Coach Mer Hub Page
 * Landing page for the Mer (More) area - PURPLE
 */

import React from 'react';
import { getCoachAreaById } from '../../config/coach-navigation-v3';
import CoachHubPage from '../../components/layout/CoachHubPage';

interface CoachMerHubProps {
  stats?: {
    ulesteMeldinger: number;
    grupper: number;
    endringsforesporsler: number;
  };
  unreadMessages?: number;
}

export default function CoachMerHub({
  stats = {
    ulesteMeldinger: 3,
    grupper: 5,
    endringsforesporsler: 2,
  },
  unreadMessages = 3,
}: CoachMerHubProps) {
  const area = getCoachAreaById('mer');

  if (!area) return null;

  return (
    <CoachHubPage
      area={area}
      title="Mer"
      subtitle="Meldinger, grupper og innstillinger"
      helpText="Kommuniser med spillere, administrer grupper og tilpass innstillingene dine."
      quickStats={[
        { label: 'Uleste meldinger', value: unreadMessages || stats.ulesteMeldinger, icon: 'MessageSquare' },
        { label: 'Grupper', value: stats.grupper, icon: 'Users' },
        { label: 'Endringsforespørsler', value: stats.endringsforesporsler, icon: 'GitPullRequest' },
      ]}
      featuredAction={{
        label: 'Ny melding',
        href: '/coach/messages/compose',
        icon: 'PenSquare',
        variant: 'primary',
      }}
    />
  );
}
