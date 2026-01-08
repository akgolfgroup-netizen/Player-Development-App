/**
 * Player Annual Plan Overview
 * View and manage player annual plan
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerAnnualPlan } from './hooks/usePlayerAnnualPlan';
import { Card } from '../../components/shadcn/card';
import { Button } from '../../components/shadcn/button';
import { Badge } from '../../components/shadcn/badge';
import { PeriodTimeline } from './components/PeriodTimeline';
import { PERIOD_LABELS } from './utils/periodDefaults';
import { exportToPDF, exportToICal } from './utils/planExport';
import { Plus, Calendar, Target, TrendingUp, Download, FileText } from 'lucide-react';

export function PlayerAnnualPlanOverview() {
  const navigate = useNavigate();
  const { plan, hasActivePlan, isLoading, fetchPlan, cancelPlan } =
    usePlayerAnnualPlan();

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const handleCreateNew = () => {
    navigate('/plan/aarsplan/ny');
  };

  const handleCancelPlan = async () => {
    if (
      confirm(
        'Er du sikker på at du vil kansellere denne årsplanen? Dette kan ikke angres.'
      )
    ) {
      const success = await cancelPlan();
      if (success) {
        fetchPlan();
      }
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('nb-NO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tier-navy mx-auto mb-4" />
              <p className="text-tier-gray">Laster årsplan...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasActivePlan || !plan) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-tier-navy mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-tier-navy mb-2">
              Ingen årsplan funnet
            </h2>
            <p className="text-tier-gray mb-6">
              Opprett en årsplan for å strukturere din treningssesong
            </p>
            <Button
              onClick={handleCreateNew}
              className="bg-tier-navy hover:bg-tier-navy/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Opprett årsplan
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const periods = plan.periods as any[];

  // Calculate statistics
  const totalSessions = periods.reduce((sum, period) => {
    const start = new Date(period.startDate);
    const end = new Date(period.endDate);
    const weeks = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7)
    );
    return sum + weeks * period.weeklyFrequency;
  }, 0);

  const avgFrequency =
    periods.reduce((sum, p) => sum + p.weeklyFrequency, 0) / periods.length;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-tier-navy">{plan.name}</h1>
            <p className="text-tier-gray mt-1">
              {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() =>
                exportToPDF(plan.name, periods, plan.startDate, plan.endDate)
              }
            >
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                exportToICal(plan.name, periods, plan.startDate, plan.endDate)
              }
            >
              <Download className="w-4 h-4 mr-2" />
              iCal
            </Button>
            <Button variant="outline" onClick={handleCancelPlan}>
              Kanseller plan
            </Button>
            <Button onClick={handleCreateNew} className="bg-tier-navy hover:bg-tier-navy/90">
              <Plus className="w-4 h-4 mr-2" />
              Ny plan
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <Calendar className="w-10 h-10 text-tier-navy mb-3" />
              <p className="text-3xl font-bold text-tier-navy">{periods.length}</p>
              <p className="text-sm text-tier-gray mt-1">Perioder</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <Target className="w-10 h-10 text-tier-navy mb-3" />
              <p className="text-3xl font-bold text-tier-navy">
                {avgFrequency.toFixed(1)}
              </p>
              <p className="text-sm text-tier-gray mt-1">Gj.snitt økter/uke</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <TrendingUp className="w-10 h-10 text-tier-navy mb-3" />
              <p className="text-3xl font-bold text-tier-navy">{totalSessions}</p>
              <p className="text-sm text-tier-gray mt-1">Totalt økter</p>
            </div>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-tier-navy">Tidslinje</h2>
            <Badge variant="outline" className="text-xs">
              {plan.status}
            </Badge>
          </div>
          <PeriodTimeline
            periods={periods}
            startDate={plan.startDate}
            endDate={plan.endDate}
          />
        </Card>

        {/* Periods Details */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-tier-navy">Perioder</h2>
          <div className="space-y-4">
            {periods.map((period, index) => {
              const start = new Date(period.startDate);
              const end = new Date(period.endDate);
              const weeks = Math.ceil(
                (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7)
              );

              return (
                <div
                  key={period.id}
                  className="flex items-start space-x-4 p-5 rounded-lg border hover:border-tier-navy/30 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded flex-shrink-0 mt-1"
                    style={{ backgroundColor: period.color }}
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-tier-navy">
                        {index + 1}. {period.name}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {PERIOD_LABELS[period.type as 'E' | 'G' | 'S' | 'T']}
                      </Badge>
                    </div>
                    <p className="text-sm text-tier-gray">
                      {formatDate(period.startDate)} - {formatDate(period.endDate)} (
                      {weeks} uker)
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-tier-navy font-medium">
                        {period.weeklyFrequency} økter/uke
                      </span>
                      <span className="text-tier-gray">
                        ~{weeks * period.weeklyFrequency} totale økter
                      </span>
                    </div>
                    {period.description && (
                      <p className="text-sm text-tier-gray italic mt-2">
                        {period.description}
                      </p>
                    )}
                    {period.goals && period.goals.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-tier-navy mb-1">
                          Mål:
                        </p>
                        <ul className="space-y-1">
                          {period.goals.map((goal: string, i: number) => (
                            <li key={i} className="text-xs text-tier-gray flex items-start">
                              <span className="text-tier-gold mr-2">•</span>
                              {goal}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default PlayerAnnualPlanOverview;
