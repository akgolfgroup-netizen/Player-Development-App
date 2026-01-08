/**
 * Coach Plan Hub Page
 * Landing page for the Plan (Planning) area - AMBER
 */

import React from 'react';
import { getCoachAreaById } from '../../config/coach-navigation-v3';
import CoachHubPage from '../../components/layout/CoachHubPage';

interface CoachPlanHubProps {
  stats?: {
    kommendeBookinger: number;
    turneringerDenneUke: number;
    samlingerPlanlagt: number;
    foresporselVenter: number;
  };
}

export default function CoachPlanHub({
  stats = {
    kommendeBookinger: 8,
    turneringerDenneUke: 2,
    samlingerPlanlagt: 3,
    foresporselVenter: 5,
  },
}: CoachPlanHubProps) {
  const area = getCoachAreaById('plan');

  if (!area) return null;

  return (
    <CoachHubPage
      area={area}
      title="Plan"
      subtitle="Kalender, booking og turneringer"
      helpText="Administrer din kalender, håndter bookingforespørsler og hold oversikt over turneringer og samlinger."
      quickStats={[
        { label: 'Kommende bookinger', value: stats.kommendeBookinger, icon: 'Calendar' },
        { label: 'Turneringer denne uke', value: stats.turneringerDenneUke, icon: 'Trophy' },
        { label: 'Samlinger planlagt', value: stats.samlingerPlanlagt, icon: 'Tent' },
        { label: 'Forespørsler venter', value: stats.foresporselVenter, icon: 'MessageSquare' },
      ]}
      featuredAction={{
        label: 'Åpne kalender',
        href: '/coach/booking',
        icon: 'Calendar',
        variant: 'primary',
      }}
    />
  );
}
