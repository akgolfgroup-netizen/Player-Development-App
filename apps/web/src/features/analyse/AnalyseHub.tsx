/**
 * ============================================================
 * ANALYSE HUB - Main landing page for the Analyse area
 * ============================================================
 *
 * This hub replaces the old "Min utvikling" area with a cleaner
 * card-based navigation system.
 *
 * Navigation cards lead to:
 * 1. Statistikk - Stats, fremgang, strokes gained, trender
 * 2. Sammenligninger - Peer, proff, multi-spiller comparisons
 * 3. Rapporter - Progress reports from coaches
 * 4. Tester - Test results and requirements
 * 5. Prestasjoner - Badges and achievements
 *
 * ============================================================
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';

interface AnalyseCard {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
  stats?: {
    label: string;
    value: string;
  }[];
}

const ANALYSE_CARDS: AnalyseCard[] = [
  {
    title: 'Statistikk',
    description: 'Se din utvikling, strokes gained, trender og status mot mål',
    href: '/analyse/statistikk',
    icon: '',
    color: 'blue',
    stats: [
      { label: 'Strokes Gained', value: '+2.4' },
      { label: 'Trend', value: '↗ Positive' },
    ],
  },
  {
    title: 'Sammenligninger',
    description: 'Sammenlign med peer group, proff-spillere og andre i systemet',
    href: '/analyse/sammenligninger',
    icon: '',
    color: 'purple',
    stats: [
      { label: 'Peer Rank', value: '#12 of 45' },
      { label: 'vs Tour Avg', value: '-8.2' },
    ],
  },
  {
    title: 'Rapporter',
    description: 'Fremdriftsrapporter og tilbakemeldinger fra dine trenere',
    href: '/analyse/rapporter',
    icon: '',
    color: 'green',
    stats: [
      { label: 'Nye rapporter', value: '2' },
      { label: 'Siste', value: '3 dager siden' },
    ],
  },
  {
    title: 'Tester',
    description: 'Testresultater, historikk og kategori-krav',
    href: '/analyse/tester',
    icon: '',
    color: 'amber',
    stats: [
      { label: 'Siste test', value: '85.5%' },
      { label: 'Kategori fremgang', value: '92%' },
    ],
  },
  {
    title: 'Prestasjoner',
    description: 'Dine merker, achievements og milepæler',
    href: '/analyse/prestasjoner',
    icon: '',
    color: 'yellow',
    stats: [
      { label: 'Merker', value: '24/50' },
      { label: 'Achievements', value: '18' },
    ],
  },
];

export default function AnalyseHub() {
  return (
    <div className="min-h-screen bg-tier-surface-base p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <PageHeader
          title="Analyse"
          subtitle="Følg din utvikling og få innsikt i din prestasjon"
          helpText="Dette området erstatter 'Min utvikling' med en mer strukturert tilnærming. Klikk på kort nedenfor for å utforske statistikk, sammenligninger, rapporter, tester og prestasjoner."
          actions={null}
        />

        {/* Navigation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {ANALYSE_CARDS.map((card) => (
            <Link
              key={card.href}
              to={card.href}
              className="group block"
            >
              <div className="bg-white rounded-xl border border-tier-border-default p-6 transition-all duration-200 hover:shadow-lg hover:scale-105 hover:border-tier-info">
                {/* Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{card.icon}</div>
                  <div className="text-tier-text-secondary group-hover:text-tier-info transition-colors">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-semibold text-tier-navy mb-2 group-hover:text-tier-info transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-tier-text-secondary mb-4">
                  {card.description}
                </p>

                {/* Stats */}
                {card.stats && card.stats.length > 0 && (
                  <div className="flex items-center gap-4 pt-4 border-t border-tier-border-default">
                    {card.stats.map((stat, index) => (
                      <div key={index} className="flex-1">
                        <div className="text-xs text-tier-text-secondary mb-1">
                          {stat.label}
                        </div>
                        <div className="text-sm font-semibold text-tier-navy">
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-tier-navy mb-6">Siste aktivitet</h2>
          <div className="bg-white rounded-xl border border-tier-border-default p-6">
            <div className="space-y-4">
              {/* Activity items - placeholder for now */}
              <div className="flex items-center gap-4 pb-4 border-b border-tier-border-default">
                <div className="w-10 h-10 bg-tier-info-light rounded-full flex items-center justify-center">
                  <span className="text-lg">[Chart]</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-tier-navy">Ny testresultat registrert</div>
                  <div className="text-xs text-tier-text-secondary">Kategori test - 85.5% • 2 timer siden</div>
                </div>
              </div>

              <div className="flex items-center gap-4 pb-4 border-b border-tier-border-default">
                <div className="w-10 h-10 bg-tier-success-light rounded-full flex items-center justify-center">
                  <span className="text-lg">[Trophy]</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-tier-navy">Nytt merke opptjent</div>
                  <div className="text-xs text-tier-text-secondary">Putting Excellence • 1 dag siden</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-tier-warning-light rounded-full flex items-center justify-center">
                  <span className="text-lg">[Doc]</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-tier-navy">Ny fremdriftsrapport fra trener</div>
                  <div className="text-xs text-tier-text-secondary">Månedlig vurdering • 3 dager siden</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-tier-info-light border border-tier-info rounded-xl p-6">
          <h3 className="text-lg font-semibold text-tier-info mb-2">
            Ny navigasjonsstruktur
          </h3>
          <p className="text-sm text-tier-navy">
            Vi har redesignet "Min utvikling" til "Analyse" med en mer intuitiv struktur.
            Alle dine tidligere funksjoner er fortsatt tilgjengelige, men nå organisert i
            tematiske hubs med tabs for enklere navigasjon.
          </p>
        </div>
      </div>
    </div>
  );
}
