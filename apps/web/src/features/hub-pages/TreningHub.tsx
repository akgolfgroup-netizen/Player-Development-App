/**
 * Trening Hub Page
 * Landing page for the Trening (Training) area - GREEN
 */

import React from 'react';
import { getAreaById } from '../../config/player-navigation-v3';
import HubPage from '../../components/layout/HubPage';

interface TreningHubProps {
  stats?: {
    okterDenneMnd: number;
    timerTrent: number;
    ovelserFullfort: number;
    testerGjennomfort: number;
  };
}

export default function TreningHub({
  stats = {
    okterDenneMnd: 15,
    timerTrent: 24,
    ovelserFullfort: 87,
    testerGjennomfort: 3,
  },
}: TreningHubProps) {
  const area = getAreaById('trening');

  if (!area) return null;

  return (
    <HubPage
      area={area}
      title="Trening"
      subtitle="Logg trening, se økter og registrer tester"
      helpText="Logg treningsøkter, se øvelsesbibliotek og registrer tester. Hold oversikt over all din treningsaktivitet."
      quickStats={[
        { label: 'Økter denne mnd', value: stats.okterDenneMnd, icon: 'Calendar' },
        { label: 'Timer trent', value: stats.timerTrent, icon: 'Clock' },
        { label: 'Øvelser fullført', value: stats.ovelserFullfort, icon: 'CheckCircle' },
        { label: 'Tester gjennomført', value: stats.testerGjennomfort, icon: 'Target' },
      ]}
      featuredAction={{
        label: 'Logg trening',
        href: '/trening/logg',
        icon: 'Plus',
        variant: 'primary',
      }}
    />
  );
}
