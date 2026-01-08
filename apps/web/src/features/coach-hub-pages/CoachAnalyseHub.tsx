/**
 * Coach Analyse Hub Page
 * Landing page for the Analyse (Analysis) area - BLUE
 */

import React from 'react';
import { getCoachAreaById } from '../../config/coach-navigation-v3';
import CoachHubPage from '../../components/layout/CoachHubPage';

interface CoachAnalyseHubProps {
  stats?: {
    ovelserBibliotek: number;
    mineOvelser: number;
    oktmaler: number;
    statistikkRapporter: number;
  };
}

export default function CoachAnalyseHub({
  stats = {
    ovelserBibliotek: 156,
    mineOvelser: 34,
    oktmaler: 8,
    statistikkRapporter: 12,
  },
}: CoachAnalyseHubProps) {
  const area = getCoachAreaById('analyse');

  if (!area) return null;

  return (
    <CoachHubPage
      area={area}
      title="Analyse"
      subtitle="Statistikk, øvelsesbibliotek og maler"
      helpText="Analyser spillerdata, utforsk øvelsesbiblioteket og administrer treningsmalene dine."
      quickStats={[
        { label: 'Øvelser i bibliotek', value: stats.ovelserBibliotek, icon: 'Dumbbell' },
        { label: 'Mine øvelser', value: stats.mineOvelser, icon: 'User' },
        { label: 'Øktmaler', value: stats.oktmaler, icon: 'FileText' },
        { label: 'Rapporter', value: stats.statistikkRapporter, icon: 'BarChart3' },
      ]}
      featuredAction={{
        label: 'Se statistikk',
        href: '/coach/stats',
        icon: 'BarChart3',
        variant: 'primary',
      }}
    />
  );
}
