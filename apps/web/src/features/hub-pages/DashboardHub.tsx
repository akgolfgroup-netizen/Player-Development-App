/**
 * ============================================================
 * DashboardHub - TIER Golf Design System v1.0
 * ============================================================
 *
 * Landing page for the Dashboard area.
 *
 * SIMPLIFIED LAYOUT (FASE 5):
 * - Max 4-5 cards per dashboard
 * - Priority sorting: urgent → in progress → upcoming
 * - Standardized dashboard layout
 *
 * ============================================================
 */

import React from 'react';
import {
  ProfileOverviewCard,
  QuickActions,
  FocusCardsGrid,
  WeeklyGoalCard,
  StreakCard,
  FocusAreaCard,
  AttentionItems,
  createAttentionItem,
} from '../../components/dashboard';
import { playerQuickActions } from '../../config/quick-actions';
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import PageContainer from '../../ui/raw-blocks/PageContainer.raw';
import ProfileImageUpload from '../../components/profile/ProfileImageUpload';
import { useToast } from '../../components/shadcn/use-toast';
import { Link } from 'react-router-dom';
import { Target } from 'lucide-react';

interface DashboardHubProps {
  playerName?: string;
  stats?: {
    treningsdager: number;
    kommendeTester: number;
    ukesMal: number;
    badges: number;
  };
}

export default function DashboardHub({
  playerName,
  stats = {
    treningsdager: 12,
    kommendeTester: 2,
    ukesMal: 75,
    badges: 8,
  },
}: DashboardHubProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  // Use auth user name if available
  const displayName = playerName || user?.firstName || 'Spiller';
  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : displayName;

  // Handle profile image upload
  const handleImageUpload = async (file: File) => {
    // TODO: Implement actual API call to upload image
    toast({
      title: 'Bilde lastet opp',
      description: `${file.name} er lastet opp successfully`,
    });
  };

  const handleImageRemove = async () => {
    // TODO: Implement actual API call to remove image
    toast({
      title: 'Bilde fjernet',
      description: 'Profilbildet ditt er fjernet',
    });
  };

  return (
    <div className="min-h-screen bg-tier-surface-base">
      {/* TIER-compliant PageHeader */}
      <PageHeader
        title="Dashboard"
        subtitle="Din oversikt over trening, mål og utvikling"
        helpText="Din hovedoversikt over treningsaktivitet, kommende økter og fremgang. Hold deg oppdatert på din golfutvikling."
      />

      <PageContainer paddingY="md" background="base">
        {/* 1. Profile Overview - User context */}
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

        {/* Profile Picture Upload */}
        <div className="mb-6 flex flex-col items-center">
          <ProfileImageUpload
            currentImageUrl={user?.profileImageUrl}
            userName={fullName}
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
            size="xl"
            className="mb-2"
          />
          <p className="text-sm text-tier-text-secondary">Last opp bilde</p>
        </div>

        {/* 2. Attention Items - Priority sorted: urgent → in progress → upcoming */}
        <section className="mb-6">
          <AttentionItems
            items={[
              createAttentionItem.scheduledTraining(
                '1',
                'Teknikk-økt med coach',
                'I dag kl. 14:00'
              ),
              createAttentionItem.goalNearCompletion(
                '2',
                'Ukentlig treningsmål',
                stats.ukesMal
              ),
              createAttentionItem.newMessage(
                '3',
                'Coach Hansen',
                'Husk å ta med...',
                new Date(Date.now() - 3600000)
              ),
            ]}
            maxItems={3}
            viewAllHref="/mer/meldinger"
          />
        </section>

        {/* 3. Focus Cards - Max 4 cards */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-tier-navy mb-4">
            Din fokus denne uken
          </h2>
          <FocusCardsGrid>
            <WeeklyGoalCard
              goalName="Treningsøkter"
              current={stats.treningsdager}
              target={15}
              unit="økter"
            />
            <StreakCard days={7} longestStreak={14} />
            <FocusAreaCard
              area="Putting"
              description="Fokuser på korte putter"
              exercisesCompleted={3}
              totalExercises={5}
            />
          </FocusCardsGrid>

          {/* See all goals button */}
          <div className="mt-4 flex justify-center">
            <Link
              to="/plan/maal"
              className="inline-flex items-center gap-2 px-6 py-3 bg-tier-gold hover:bg-tier-gold/90 text-white font-semibold rounded-lg transition-colors shadow-sm"
            >
              <Target size={20} />
              Se alle mål
            </Link>
          </div>
        </section>

        {/* 4. Quick Actions - Streamlined */}
        <QuickActions
          actions={playerQuickActions.slice(0, 4)}
          title="Hurtighandlinger"
          columns={4}
        />
      </PageContainer>
    </div>
  );
}
