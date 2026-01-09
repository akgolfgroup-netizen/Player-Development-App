/**
 * Min Utvikling Hub Page
 * Landing page for the Utvikling (Development) area - BLUE
 */

import React from 'react';
import { getAreaById } from '../../config/player-navigation-v4';
import HubPage from '../../components/layout/HubPage';

interface UtviklingHubProps {
  stats?: {
    kategoriFremgang: number;
    testScore: number;
    badgesOpptjent: number;
    ukentligForbedring: number;
  };
}

export default function UtviklingHub({
  stats = {
    kategoriFremgang: 68,
    testScore: 82,
    badgesOpptjent: 12,
    ukentligForbedring: 5,
  },
}: UtviklingHubProps) {
  const area = getAreaById('utvikling');

  if (!area) return null;

  return (
    <HubPage
      area={area}
      title="Min utvikling"
      subtitle="Følg med på din fremgang og se dine prestasjoner"
      helpText="Se din fremgang, statistikk og oppnådde merker. Analyser din utvikling over tid og identifiser forbedringsområder."
      quickStats={[
        { label: 'Kategori-fremgang', value: `${stats.kategoriFremgang}%`, icon: 'TrendingUp' },
        { label: 'Siste testscore', value: stats.testScore, icon: 'Target' },
        { label: 'Merker opptjent', value: stats.badgesOpptjent, icon: 'Award' },
        { label: 'Ukentlig forbedring', value: `+${stats.ukentligForbedring}%`, icon: 'ArrowUpRight' },
      ]}
      featuredAction={{
        label: 'Se min utvikling',
        href: '/utvikling/oversikt',
        icon: 'TrendingUp',
        variant: 'primary',
      }}
    />
  );
}
