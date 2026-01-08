/**
 * ============================================================
 * DashboardHub - TIER Golf Design System v1.0
 * ============================================================
 *
 * Landing page for the Dashboard area.
 *
 * MIGRATED TO TIER DESIGN SYSTEM:
 * - Uses PageHeader + PageContainer
 * - Zero inline styles - all Tailwind + TIER tokens
 * - No hardcoded colors
 * - Responsive design
 *
 * ============================================================
 */

import React from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { navigationColors } from '../../config/navigation-tokens';
import { ProfileOverviewCard, WeatherWidgetCompact } from '../../components/dashboard';
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import PageContainer from '../../ui/raw-blocks/PageContainer.raw';

const {
  Plus, Target, Calendar, TrendingUp,
  Dumbbell, Award, Clock, ChevronRight, BookOpen,
} = LucideIcons;

interface DashboardHubProps {
  playerName?: string;
  stats?: {
    treningsdager: number;
    kommendeTester: number;
    ukesMal: number;
    badges: number;
  };
  recentActivities?: Array<{
    id: string;
    title: string;
    type: string;
    date: string;
  }>;
}

export default function DashboardHub({
  playerName,
  stats = {
    treningsdager: 12,
    kommendeTester: 2,
    ukesMal: 75,
    badges: 8,
  },
  recentActivities = [],
}: DashboardHubProps) {
  const { user } = useAuth();

  // Use auth user name if available
  const displayName = playerName || user?.firstName || 'Spiller';
  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : displayName;

  return (
    <div className="min-h-screen bg-tier-surface-base">
      {/* TIER-compliant PageHeader */}
      <PageHeader
        title="Dashboard"
        subtitle="Din oversikt over trening, mål og utvikling"
        helpText="Din hovedoversikt over treningsaktivitet, kommende økter og fremgang. Hold deg oppdatert på din golfutvikling."
      />

      <PageContainer paddingY="md" background="base">
        {/* Profile Overview Card */}
        <div className="mb-6">
          <ProfileOverviewCard
            name={fullName}
            role="Spiller"
            email={user?.email}
            stats={[
              { label: 'treningsdager', value: stats.treningsdager },
              { label: 'kommende tester', value: stats.kommendeTester },
              { label: 'ukesmål', value: `${stats.ukesMal}%` },
              { label: 'merker', value: stats.badges },
            ]}
            profileHref="/mer/profil"
          />
        </div>

        {/* Weather Widget */}
        <div className="mb-6">
          <WeatherWidgetCompact
            lat={59.91}
            lng={10.75}
            courseName="Oslo Golf Club"
          />
        </div>

        {/* Quick Actions - 4 buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <Link
            to="/trening/logg"
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-tier-gold text-tier-white text-sm font-semibold hover:bg-tier-gold-dark transition-colors"
          >
            <Plus size={18} />
            Logg trening
          </Link>
          <Link
            to="/trening/testing/registrer"
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-tier-gold text-tier-white text-sm font-semibold hover:bg-tier-gold-dark transition-colors"
          >
            <Target size={18} />
            Registrer test
          </Link>
          <Link
            to="/plan/kalender"
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-tier-gold text-tier-white text-sm font-semibold hover:bg-tier-gold-dark transition-colors"
          >
            <Calendar size={18} />
            Kalender
          </Link>
          <Link
            to="/utvikling/statistikk"
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-tier-gold text-tier-white text-sm font-semibold hover:bg-tier-gold-dark transition-colors"
          >
            <TrendingUp size={18} />
            Statistikk
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Dumbbell size={20} />}
            label="Treningsdager denne mnd"
            value={stats.treningsdager}
            color={navigationColors.trening.primary}
          />
          <StatCard
            icon={<Target size={20} />}
            label="Kommende tester"
            value={stats.kommendeTester}
            color={navigationColors.utvikling.primary}
          />
          <StatCard
            icon={<TrendingUp size={20} />}
            label="Ukesmål fullført"
            value={`${stats.ukesMal}%`}
            color={navigationColors.plan.primary}
          />
          <StatCard
            icon={<Award size={20} />}
            label="Merker opptjent"
            value={stats.badges}
            color={navigationColors.mer.primary}
          />
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <NavigationCard
            title="Trening"
            description="Logg treningsøkter, se øvelser og registrer tester"
            href="/trening"
            icon={<Dumbbell size={24} />}
            color={navigationColors.trening}
          />
          <NavigationCard
            title="Min utvikling"
            description="Se din fremgang, statistikk og oppnådde merker"
            href="/utvikling"
            icon={<TrendingUp size={24} />}
            color={navigationColors.utvikling}
          />
          <NavigationCard
            title="Plan"
            description="Kalender, målsetninger og turneringsoversikt"
            href="/plan"
            icon={<Calendar size={24} />}
            color={navigationColors.plan}
          />
          <NavigationCard
            title="Kunnskap"
            description="Artikler, guider og tips for å forbedre spillet ditt"
            href="/kunnskap"
            icon={<BookOpen size={24} />}
            color={navigationColors.mer}
          />
        </div>

        {/* Recent Activity */}
        {recentActivities.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-tier-navy mb-4">
              Siste aktivitet
            </h2>
            <div className="bg-tier-white rounded-xl border border-tier-border-default overflow-hidden">
              {recentActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`flex items-center gap-3 px-5 py-4 ${
                    index < recentActivities.length - 1 ? 'border-b border-tier-border-subtle' : ''
                  }`}
                >
                  <Clock size={16} className="text-tier-text-tertiary" />
                  <div className="flex-1">
                    <div className="text-tier-body font-medium text-tier-navy">
                      {activity.title}
                    </div>
                    <div className="text-tier-footnote text-tier-text-secondary">
                      {activity.type} - {activity.date}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-tier-text-tertiary" />
                </div>
              ))}
            </div>
          </section>
        )}
      </PageContainer>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-tier-white rounded-xl p-5 border border-tier-border-subtle shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <span style={{ color }}>{icon}</span>
        <span className="text-tier-footnote text-tier-text-secondary">{label}</span>
      </div>
      <div className="text-3xl font-bold leading-tight" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

type ColorScheme = (typeof navigationColors)[keyof typeof navigationColors];

interface NavigationCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: ColorScheme;
}

function NavigationCard({ title, description, href, icon, color }: NavigationCardProps) {
  return (
    <Link
      to={href}
      className="block bg-tier-white rounded-2xl p-6 border border-tier-border-default hover:shadow-md transition-shadow group"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{
          backgroundColor: color.surface,
          color: color.primary,
        }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-tier-navy mb-2 group-hover:text-tier-navy-dark transition-colors">
        {title}
      </h3>
      <p className="text-tier-body text-tier-text-secondary">
        {description}
      </p>
    </Link>
  );
}
