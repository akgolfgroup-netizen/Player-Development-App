/**
 * DashboardPage
 *
 * Archetype: C - Dashboard/Calendar Page
 * Purpose: Main dashboard using the new UI templates
 * Composes AppShellTemplate + StatsGridTemplate + Card
 * Data fetched via useDashboardData hook
 *
 * DEV: Test states via querystring:
 *   /dashboard-v2?state=loading
 *   /dashboard-v2?state=error
 *   /dashboard-v2?state=empty
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import AppShellTemplate from '../../ui/templates/AppShellTemplate';
import StatsGridTemplate from '../../ui/templates/StatsGridTemplate';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import StateCard from '../../ui/composites/StateCard';
import { Plus, RefreshCw } from 'lucide-react';
import { useDashboardData } from '../../data';
import type { DashboardSession } from '../../data';
import { getSimState } from '../../dev/simulateState';
import { useScreenView } from '../../analytics/useScreenView';
import { SectionTitle } from '../../components/typography/Headings';

// Pure functions - moved outside component to avoid recreation
const getStatusText = (status: DashboardSession['status']) => {
  switch (status) {
    case 'completed':
      return 'Fullført';
    case 'in_progress':
      return 'Pågår';
    default:
      return 'Planlagt';
  }
};

const getStatusColorClass = (status: DashboardSession['status']) => {
  switch (status) {
    case 'completed':
      return 'text-tier-success';
    case 'in_progress':
      return 'text-tier-navy';
    default:
      return 'text-tier-text-secondary';
  }
};

const DashboardPage: React.FC = () => {
  useScreenView('Dashboard');
  const location = useLocation();
  const simState = getSimState(location.search);

  const hookResult = useDashboardData();

  // Override data based on simState (DEV only)
  const { data, isLoading, error, refetch } = simState
    ? {
        data: simState === 'empty' ? { sessions: [], stats: [] } : null,
        isLoading: simState === 'loading',
        error: simState === 'error' ? 'Simulert feil (DEV)' : null,
        refetch: hookResult.refetch,
      }
    : hookResult;

  // Action button for header
  const headerActions = (
    <Button size="sm" leftIcon={<Plus size={16} />}>
      Ny økt
    </Button>
  );

  // Loading state
  if (isLoading && !data) {
    return (
      <AppShellTemplate
        title="Oversikt"
        subtitle="Velkommen tilbake"
        helpText="Hovedoversikt (dashboard) som viser din treningsstatus og aktivitet. KPI-statistikk med totalt antall økter, fullførte økter denne måneden, kommende økter og nåværende streak. Liste over kommende økter med tidspunkt, tittel, kategori, intensitet og varighet. Liste over nylige økter med dato, kategori, intensitet og evalueringsstatus (venter/fullført). Hurtiglenker til nøkkelfunksjoner (Ny økt, Kalender, Statistikk, Breaking Points). Bruk for å få rask oversikt over treningsstatus og planlegge aktiviteter."
      >
        <section className="mb-6">
          <StateCard
            variant="info"
            title="Laster..."
            description="Henter dine data"
          />
        </section>
      </AppShellTemplate>
    );
  }

  const sessions = data?.sessions ?? [];
  const stats = data?.stats ?? [];

  return (
    <AppShellTemplate
      title="Oversikt"
      subtitle="Velkommen tilbake"
      helpText="Hovedoversikt (dashboard) som viser din treningsstatus og aktivitet. KPI-statistikk med totalt antall økter, fullførte økter denne måneden, kommende økter og nåværende streak. Liste over kommende økter med tidspunkt, tittel, kategori, intensitet og varighet. Liste over nylige økter med dato, kategori, intensitet og evalueringsstatus (venter/fullført). Hurtiglenker til nøkkelfunksjoner (Ny økt, Kalender, Statistikk, Breaking Points). Bruk for å få rask oversikt over treningsstatus og planlegge aktiviteter."
      actions={headerActions}
    >
      {/* Error message */}
      {error && (
        <section className="mb-6">
          <StateCard
            variant="error"
            title="Noe gikk galt"
            description={error}
            action={
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<RefreshCw size={14} />}
                onClick={refetch}
              >
                Prøv igjen
              </Button>
            }
          />
        </section>
      )}

      {/* Stats Grid */}
      <section className="mb-6">
        <StatsGridTemplate items={stats} columns={2} />
      </section>

      {/* Today's Sessions */}
      <section className="mb-6">
        <SectionTitle className="text-lg font-semibold text-tier-navy mb-3">
          Dine økter i dag
        </SectionTitle>
        <div className="flex flex-col gap-3">
          {sessions.length === 0 ? (
            <StateCard
              variant="empty"
              title="Ingen økter i dag"
              description="Planlegg en treningsøkt for å komme i gang"
              action={
                <Button size="sm" leftIcon={<Plus size={14} />}>
                  Ny økt
                </Button>
              }
            />
          ) : (
            sessions.map((session) => (
              <Card key={session.id} className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-tier-navy">
                    {session.title}
                  </span>
                  <span
                    className={`text-xs font-medium ${getStatusColorClass(session.status)}`}
                  >
                    {getStatusText(session.status)}
                  </span>
                </div>
                <div className="text-xs text-tier-text-secondary">
                  {session.start} - {session.end}
                </div>
              </Card>
            ))
          )}
        </div>
      </section>
    </AppShellTemplate>
  );
};

export default DashboardPage;
