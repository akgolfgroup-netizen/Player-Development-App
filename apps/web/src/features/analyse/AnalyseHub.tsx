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
import {
  BarChart3,
  Users,
  FileText,
  Target,
  Trophy,
  ChevronRight
} from 'lucide-react';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';

// Sparkline Component
interface SparklineProps {
  data: number[];
  color: string;
  height?: number;
}

const Sparkline: React.FC<SparklineProps> = ({ data, color, height = 60 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg
      width="100%"
      height={height}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="opacity-30"
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="3"
        points={points}
      />
    </svg>
  );
};

interface AnalyseCard {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  stats?: {
    label: string;
    value: string;
  }[];
  sparklineData?: number[];
  sparklineColor?: string;
}

const ANALYSE_CARDS: AnalyseCard[] = [
  {
    title: 'Statistikk',
    description: 'Se din utvikling, strokes gained, trender og status mot mål',
    href: '/analyse/statistikk',
    icon: <BarChart3 size={24} className="text-tier-info" />,
    color: 'blue',
    stats: [
      { label: 'Strokes Gained', value: '+2.4' },
      { label: 'Trend', value: '↗ Positive' },
    ],
    sparklineData: [2.0, 2.1, 2.0, 2.3, 2.2, 2.4, 2.4],
    sparklineColor: 'var(--tier-info)',
  },
  {
    title: 'Sammenligninger',
    description: 'Sammenlign med peer group, proff-spillere og andre i systemet',
    href: '/analyse/sammenligninger',
    icon: <Users size={24} className="text-purple-500" />,
    color: 'purple',
    stats: [
      { label: 'Peer Rank', value: '#12 of 45' },
      { label: 'vs Tour Avg', value: '-8.2' },
    ],
    sparklineData: [14, 13, 13, 12, 12, 12, 12],
    sparklineColor: 'rgb(168, 85, 247)',
  },
  {
    title: 'Rapporter',
    description: 'Fremdriftsrapporter og tilbakemeldinger fra dine trenere',
    href: '/analyse/rapporter',
    icon: <FileText size={24} className="text-tier-success" />,
    color: 'green',
    stats: [
      { label: 'Nye rapporter', value: '2' },
      { label: 'Siste', value: '3 dager siden' },
    ],
    sparklineData: [1, 2, 1, 0, 1, 2, 2],
    sparklineColor: 'var(--tier-success)',
  },
  {
    title: 'Tester',
    description: 'Testresultater, historikk og kategori-krav',
    href: '/analyse/tester',
    icon: <Target size={24} className="text-amber-500" />,
    color: 'amber',
    stats: [
      { label: 'Siste test', value: '85.5%' },
      { label: 'Kategori fremgang', value: '92%' },
    ],
    sparklineData: [78, 76, 82, 80, 84, 83, 85.5],
    sparklineColor: 'rgb(245, 158, 11)',
  },
  {
    title: 'Prestasjoner',
    description: 'Dine merker, achievements og milepæler',
    href: '/analyse/prestasjoner',
    icon: <Trophy size={24} className="text-tier-gold" />,
    color: 'yellow',
    stats: [
      { label: 'Merker', value: '24/50' },
      { label: 'Achievements', value: '18' },
    ],
    sparklineData: [18, 19, 20, 21, 22, 23, 24],
    sparklineColor: 'var(--tier-gold)',
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
        />

        {/* Navigation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {ANALYSE_CARDS.map((card) => (
            <Link
              key={card.href}
              to={card.href}
              className="group block"
            >
              <div className="bg-white rounded-xl border border-tier-border-default p-6 transition-all duration-300 ease-out hover:shadow-tier-card-hover hover:scale-[1.02] hover:border-tier-info hover:-translate-y-1 hover:bg-gradient-to-br hover:from-white hover:to-tier-info-light/20 backdrop-blur-sm group">
                {/* Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">{card.icon}</div>
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

                {/* Sparkline */}
                {card.sparklineData && card.sparklineColor && (
                  <div className="mb-4 h-[60px] relative overflow-hidden rounded-lg bg-tier-surface-base">
                    <Sparkline
                      data={card.sparklineData}
                      color={card.sparklineColor}
                      height={60}
                    />
                  </div>
                )}

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
          <h3 className="text-xl font-semibold text-tier-navy mb-6">Siste aktivitet</h3>
          <div className="bg-white rounded-xl border border-tier-border-default p-6">
            <div className="space-y-4">
              {/* Activity items - placeholder for now */}
              <Link
                to="/analyse/tester?tab=resultater"
                className="flex items-center gap-4 pb-4 border-b border-tier-border-default group cursor-pointer transition-all duration-200 hover:bg-tier-surface-base rounded-lg px-2 -mx-2 py-2"
              >
                <div className="w-10 h-10 bg-tier-info-light rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                  <BarChart3 size={20} className="text-tier-info" />
                </div>
                <div className="flex-1 transition-transform duration-200 group-hover:translate-x-1">
                  <div className="text-sm font-medium text-tier-navy group-hover:text-tier-info">
                    Ny testresultat registrert
                  </div>
                  <div className="text-xs text-tier-text-secondary">
                    Kategori test - 85.5% • 2 timer siden
                  </div>
                </div>
                <ChevronRight size={16} className="text-tier-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>

              <Link
                to="/analyse/prestasjoner"
                className="flex items-center gap-4 pb-4 border-b border-tier-border-default group cursor-pointer transition-all duration-200 hover:bg-tier-surface-base rounded-lg px-2 -mx-2 py-2"
              >
                <div className="w-10 h-10 bg-tier-success-light rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                  <Trophy size={20} className="text-tier-success" />
                </div>
                <div className="flex-1 transition-transform duration-200 group-hover:translate-x-1">
                  <div className="text-sm font-medium text-tier-navy group-hover:text-tier-success">
                    Nytt merke opptjent
                  </div>
                  <div className="text-xs text-tier-text-secondary">
                    Putting Excellence • 1 dag siden
                  </div>
                </div>
                <ChevronRight size={16} className="text-tier-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>

              <Link
                to="/analyse/rapporter"
                className="flex items-center gap-4 group cursor-pointer transition-all duration-200 hover:bg-tier-surface-base rounded-lg px-2 -mx-2 py-2"
              >
                <div className="w-10 h-10 bg-tier-warning-light rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                  <FileText size={20} className="text-tier-warning" />
                </div>
                <div className="flex-1 transition-transform duration-200 group-hover:translate-x-1">
                  <div className="text-sm font-medium text-tier-navy group-hover:text-tier-warning">
                    Ny fremdriftsrapport fra trener
                  </div>
                  <div className="text-xs text-tier-text-secondary">
                    Månedlig vurdering • 3 dager siden
                  </div>
                </div>
                <ChevronRight size={16} className="text-tier-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>
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
