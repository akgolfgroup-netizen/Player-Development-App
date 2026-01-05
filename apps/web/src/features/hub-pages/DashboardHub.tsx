/**
 * Dashboard Hub Page
 * Landing page for the Dashboard area
 */

import React from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { getAreaById } from '../../config/player-navigation-v3';
import { navigationColors } from '../../config/navigation-tokens';
import { ProfileOverviewCard } from '../../components/dashboard';
import { useAuth } from '../../contexts/AuthContext';

const {
  Plus, Target, Calendar, TrendingUp,
  Dumbbell, Award, Clock, ChevronRight,
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
  const area = getAreaById('dashboard');
  const colors = navigationColors.dashboard;

  // Use auth user name if available
  const displayName = playerName || user?.firstName || 'Spiller';
  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : displayName;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Profile Overview Card */}
      <div style={{ marginBottom: 24 }}>
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

      {/* Quick Actions */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 32,
          flexWrap: 'wrap',
        }}
      >
        <Link
          to="/trening/logg"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            borderRadius: 10,
            backgroundColor: 'var(--ak-gold, #B8860B)',
            color: '#FFFFFF',
            fontSize: 15,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <Plus size={18} />
          Logg trening
        </Link>
        <Link
          to="/trening/testing/registrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
            color: 'var(--ak-gold, #B8860B)',
            border: '2px solid var(--ak-gold, #B8860B)',
            fontSize: 15,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <Target size={18} />
          Registrer test
        </Link>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}
      >
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
      </div>

      {/* Recent Activity */}
      {recentActivities.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: '#111827',
              margin: '0 0 16px',
            }}
          >
            Siste aktivitet
          </h2>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              border: '1px solid #E5E7EB',
              overflow: 'hidden',
            }}
          >
            {recentActivities.map((activity, index) => (
              <div
                key={activity.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '16px 20px',
                  borderBottom: index < recentActivities.length - 1 ? '1px solid #E5E7EB' : 'none',
                }}
              >
                <Clock size={16} style={{ color: '#9CA3AF' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: '#111827' }}>
                    {activity.title}
                  </div>
                  <div style={{ fontSize: 13, color: '#6B7280' }}>
                    {activity.type} - {activity.date}
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: '#9CA3AF' }} />
              </div>
            ))}
          </div>
        </section>
      )}
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
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        border: '1px solid #E5E7EB',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ color }}>{icon}</span>
        <span style={{ fontSize: 13, color: '#6B7280' }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
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
      style={{
        display: 'block',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        border: '1px solid #E5E7EB',
        textDecoration: 'none',
        transition: 'all 0.2s',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          backgroundColor: color.surface,
          color: color.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        {icon}
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: '#111827', margin: '0 0 8px' }}>
        {title}
      </h3>
      <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
        {description}
      </p>
    </Link>
  );
}
