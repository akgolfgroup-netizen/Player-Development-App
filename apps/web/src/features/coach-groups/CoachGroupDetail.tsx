/**
 * AK Golf Academy - Coach Group Detail
 * Design System v3.0 - Blue Palette 01
 *
 * Detaljvisning av en gruppe med medlemmer, treningsplan og statistikk.
 * Inkluderer gruppeplan-funksjonalitet med ukentlig planlegging.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Calendar,
  ClipboardList,
  MessageSquare,
  Settings,
  ChevronRight,
  ChevronLeft,
  Plus,
  UserMinus,
  TrendingUp,
  Target,
  Trophy,
  Clock,
  BarChart3,
  Edit3,
  Copy,
  Trash2,
  X,
  GripVertical,
  Play,
} from 'lucide-react';
import { tokens } from '../../design-tokens';

interface GroupMember {
  id: string;
  name: string;
  avatarInitials: string;
  avatarColor: string;
  category: string;
  lastActive: string;
  sessionsThisWeek: number;
  trend: 'up' | 'down' | 'stable';
}

interface GroupSession {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  attendees: number;
  totalMembers: number;
}

interface GroupStats {
  totalSessions: number;
  avgAttendance: number;
  avgSessionsPerWeek: number;
  topPerformer: string;
}

// Training Plan types
interface PlannedExercise {
  id: string;
  name: string;
  category: 'teknikk' | 'putting' | 'kort_spill' | 'langt_spill' | 'bane' | 'mental' | 'fysisk';
  duration: number; // minutes
  description?: string;
  order: number;
}

interface PlannedSession {
  id: string;
  dayOfWeek: number; // 0-6, Monday = 0
  time: string;
  title: string;
  type: 'individual' | 'group' | 'competition';
  exercises: PlannedExercise[];
  notes?: string;
}

interface WeeklyPlan {
  weekNumber: number;
  year: number;
  theme?: string;
  focus?: string;
  sessions: PlannedSession[];
}

interface GroupTrainingPlan {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  weeks: WeeklyPlan[];
  isActive: boolean;
}

interface GroupDetail {
  id: string;
  name: string;
  description?: string;
  type: 'wang' | 'team_norway' | 'custom';
  avatarColor: string;
  avatarInitials: string;
  members: GroupMember[];
  upcomingSessions: GroupSession[];
  recentSessions: GroupSession[];
  stats: GroupStats;
  hasTrainingPlan: boolean;
  trainingPlan?: GroupTrainingPlan;
  createdAt: string;
}

// Exercise category colors
const categoryColors: Record<string, { bg: string; text: string; label: string }> = {
  teknikk: { bg: `${tokens.colors.primary}15`, text: tokens.colors.primary, label: 'Teknikk' },
  putting: { bg: `${tokens.colors.success}15`, text: tokens.colors.success, label: 'Putting' },
  kort_spill: { bg: `${tokens.colors.gold}15`, text: tokens.colors.gold, label: 'Kort spill' },
  langt_spill: { bg: `${tokens.colors.primaryLight}15`, text: tokens.colors.primaryLight, label: 'Langt spill' },
  bane: { bg: `${tokens.colors.warning}15`, text: tokens.colors.warning, label: 'Bane' },
  mental: { bg: '#8B5CF615', text: '#8B5CF6', label: 'Mental' },
  fysisk: { bg: `${tokens.colors.error}15`, text: tokens.colors.error, label: 'Fysisk' },
};

const dayNames = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];

export default function CoachGroupDetail() {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'members' | 'sessions' | 'plan' | 'stats'>('members');
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDay, setSelectedDay] = useState<number>(0);

  // Fetch group details
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await fetch(`/api/v1/coach/groups/${groupId}`);
        if (response.ok) {
          const data = await response.json();
          setGroup(data.group);
        }
      } catch (error) {
        console.error('Failed to fetch group:', error);
        // Mock data for development
        setGroup({
          id: groupId || '1',
          name: 'WANG Toppidrett 2025',
          description: 'Hovedgruppe for WANG Toppidrett elever. Fokus på helhetlig utvikling.',
          type: 'wang',
          avatarColor: tokens.colors.primary,
          avatarInitials: 'WT',
          members: [
            {
              id: 'p1',
              name: 'Anders Hansen',
              avatarInitials: 'AH',
              avatarColor: tokens.colors.primary,
              category: 'A',
              lastActive: '2025-12-21',
              sessionsThisWeek: 4,
              trend: 'up',
            },
            {
              id: 'p2',
              name: 'Sofie Andersen',
              avatarInitials: 'SA',
              avatarColor: tokens.colors.gold,
              category: 'A',
              lastActive: '2025-12-20',
              sessionsThisWeek: 3,
              trend: 'stable',
            },
            {
              id: 'p3',
              name: 'Erik Johansen',
              avatarInitials: 'EJ',
              avatarColor: tokens.colors.success,
              category: 'B',
              lastActive: '2025-12-19',
              sessionsThisWeek: 2,
              trend: 'down',
            },
            {
              id: 'p4',
              name: 'Emma Berg',
              avatarInitials: 'EB',
              avatarColor: tokens.colors.primaryLight,
              category: 'B',
              lastActive: '2025-12-21',
              sessionsThisWeek: 5,
              trend: 'up',
            },
            {
              id: 'p5',
              name: 'Lars Olsen',
              avatarInitials: 'LO',
              avatarColor: tokens.colors.error,
              category: 'A',
              lastActive: '2025-12-18',
              sessionsThisWeek: 3,
              trend: 'stable',
            },
          ],
          upcomingSessions: [
            {
              id: 's1',
              title: 'Teknikktrening',
              date: '2025-12-23',
              time: '09:00',
              duration: 120,
              attendees: 5,
              totalMembers: 5,
            },
            {
              id: 's2',
              title: 'Putting workshop',
              date: '2025-12-24',
              time: '14:00',
              duration: 90,
              attendees: 4,
              totalMembers: 5,
            },
          ],
          recentSessions: [
            {
              id: 's3',
              title: 'Banetrening',
              date: '2025-12-20',
              time: '10:00',
              duration: 180,
              attendees: 5,
              totalMembers: 5,
            },
            {
              id: 's4',
              title: 'Kort spill fokus',
              date: '2025-12-18',
              time: '09:00',
              duration: 120,
              attendees: 4,
              totalMembers: 5,
            },
          ],
          stats: {
            totalSessions: 48,
            avgAttendance: 87,
            avgSessionsPerWeek: 3.2,
            topPerformer: 'Emma Berg',
          },
          hasTrainingPlan: true,
          trainingPlan: {
            id: 'plan1',
            name: 'Vår 2025 Treningsplan',
            startDate: '2025-01-06',
            endDate: '2025-06-30',
            isActive: true,
            weeks: [
              {
                weekNumber: 52,
                year: 2024,
                theme: 'Teknikk-fokus',
                focus: 'Grunnleggende slag og posisjon',
                sessions: [
                  {
                    id: 'ps1',
                    dayOfWeek: 0,
                    time: '09:00',
                    title: 'Teknikktrening',
                    type: 'group',
                    exercises: [
                      { id: 'e1', name: 'Oppvarming', category: 'fysisk', duration: 15, order: 1 },
                      { id: 'e2', name: 'Grip og stance', category: 'teknikk', duration: 30, order: 2 },
                      { id: 'e3', name: 'Jern 7 drill', category: 'teknikk', duration: 45, order: 3 },
                    ],
                  },
                  {
                    id: 'ps2',
                    dayOfWeek: 2,
                    time: '14:00',
                    title: 'Putting fokus',
                    type: 'group',
                    exercises: [
                      { id: 'e4', name: 'Gate drill', category: 'putting', duration: 20, order: 1 },
                      { id: 'e5', name: 'Avstandskontroll', category: 'putting', duration: 30, order: 2 },
                      { id: 'e6', name: 'Konkurranseputting', category: 'putting', duration: 30, order: 3 },
                    ],
                  },
                  {
                    id: 'ps3',
                    dayOfWeek: 4,
                    time: '10:00',
                    title: 'Banetrening',
                    type: 'group',
                    exercises: [
                      { id: 'e7', name: '9 hull simulering', category: 'bane', duration: 90, order: 1 },
                      { id: 'e8', name: 'Kursanalyse', category: 'mental', duration: 30, order: 2 },
                    ],
                  },
                ],
              },
              {
                weekNumber: 1,
                year: 2025,
                theme: 'Kort spill',
                focus: 'Chipping og pitching',
                sessions: [
                  {
                    id: 'ps4',
                    dayOfWeek: 0,
                    time: '09:00',
                    title: 'Kort spill intensiv',
                    type: 'group',
                    exercises: [
                      { id: 'e9', name: 'Oppvarming', category: 'fysisk', duration: 15, order: 1 },
                      { id: 'e10', name: 'Chipping teknikk', category: 'kort_spill', duration: 45, order: 2 },
                      { id: 'e11', name: 'Pitching variasjon', category: 'kort_spill', duration: 45, order: 3 },
                    ],
                  },
                  {
                    id: 'ps5',
                    dayOfWeek: 3,
                    time: '14:00',
                    title: 'Bunkertrening',
                    type: 'group',
                    exercises: [
                      { id: 'e12', name: 'Bunker exit', category: 'kort_spill', duration: 30, order: 1 },
                      { id: 'e13', name: 'Greenside bunker', category: 'kort_spill', duration: 30, order: 2 },
                      { id: 'e14', name: 'Fairway bunker', category: 'kort_spill', duration: 30, order: 3 },
                    ],
                  },
                ],
              },
            ],
          },
          createdAt: '2025-01-15',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId]);

  // Get trend icon and color
  const getTrendStyle = (trend: string) => {
    switch (trend) {
      case 'up':
        return { color: tokens.colors.success, rotation: '-45deg' };
      case 'down':
        return { color: tokens.colors.error, rotation: '45deg' };
      default:
        return { color: tokens.colors.steel, rotation: '0deg' };
    }
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('nb-NO', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  // Remove member
  const handleRemoveMember = async (memberId: string) => {
    if (!window.confirm('Er du sikker på at du vil fjerne dette medlemmet fra gruppen?')) return;

    try {
      await fetch(`/api/v1/coach/groups/${groupId}/members/${memberId}`, {
        method: 'DELETE',
      });
      if (group) {
        setGroup({
          ...group,
          members: group.members.filter((m) => m.id !== memberId),
        });
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: tokens.colors.snow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: `4px solid ${tokens.colors.gray300}`,
            borderTopColor: tokens.colors.primary,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
    );
  }

  if (!group) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p>Gruppe ikke funnet</p>
        <button onClick={() => navigate('/coach/groups')}>Tilbake til grupper</button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: tokens.colors.snow,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: tokens.colors.white,
          borderBottom: `1px solid ${tokens.colors.gray200}`,
          padding: '20px 24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <button
            onClick={() => navigate('/coach/groups')}
            style={{
              width: 40,
              height: 40,
              borderRadius: tokens.radius.md,
              backgroundColor: tokens.colors.gray100,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={20} color={tokens.colors.charcoal} />
          </button>

          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: tokens.radius.md,
              backgroundColor: group.avatarColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: tokens.colors.white,
              fontWeight: 700,
              fontSize: '20px',
            }}
          >
            {group.avatarInitials}
          </div>

          <div style={{ flex: 1 }}>
            <h1
              style={{
                ...tokens.typography.title2,
                color: tokens.colors.charcoal,
                margin: 0,
              }}
            >
              {group.name}
            </h1>
            {group.description && (
              <p
                style={{
                  ...tokens.typography.subheadline,
                  color: tokens.colors.steel,
                  margin: '4px 0 0',
                }}
              >
                {group.description}
              </p>
            )}
          </div>

          <button
            onClick={() => navigate(`/coach/groups/${groupId}/edit`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: 'transparent',
              border: `1px solid ${tokens.colors.gray300}`,
              borderRadius: tokens.radius.md,
              fontSize: '13px',
              fontWeight: 500,
              color: tokens.colors.charcoal,
              cursor: 'pointer',
            }}
          >
            <Settings size={16} />
            Innstillinger
          </button>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate(`/coach/groups/${groupId}/plan`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: tokens.colors.primary,
              color: tokens.colors.white,
              border: 'none',
              borderRadius: tokens.radius.md,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <ClipboardList size={18} />
            Treningsplan
          </button>
          <button
            onClick={() => navigate(`/coach/groups/${groupId}/message`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: tokens.colors.white,
              color: tokens.colors.charcoal,
              border: `1px solid ${tokens.colors.gray300}`,
              borderRadius: tokens.radius.md,
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <MessageSquare size={18} />
            Send melding
          </button>
          <button
            onClick={() => navigate(`/coach/groups/${groupId}/session/new`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: tokens.colors.white,
              color: tokens.colors.charcoal,
              border: `1px solid ${tokens.colors.gray300}`,
              borderRadius: tokens.radius.md,
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <Calendar size={18} />
            Planlegg økt
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ padding: '16px 24px', backgroundColor: tokens.colors.white }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.primary, margin: 0 }}>
              {group.members.length}
            </p>
            <p style={{ ...tokens.typography.caption1, color: tokens.colors.steel, margin: '4px 0 0' }}>
              Medlemmer
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.success, margin: 0 }}>
              {group.stats.avgAttendance}%
            </p>
            <p style={{ ...tokens.typography.caption1, color: tokens.colors.steel, margin: '4px 0 0' }}>
              Snitt oppmøte
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.gold, margin: 0 }}>
              {group.stats.totalSessions}
            </p>
            <p style={{ ...tokens.typography.caption1, color: tokens.colors.steel, margin: '4px 0 0' }}>
              Økter totalt
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.primaryLight, margin: 0 }}>
              {group.stats.avgSessionsPerWeek}
            </p>
            <p style={{ ...tokens.typography.caption1, color: tokens.colors.steel, margin: '4px 0 0' }}>
              Økter/uke
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          padding: '16px 24px',
          backgroundColor: tokens.colors.white,
          borderBottom: `1px solid ${tokens.colors.gray200}`,
        }}
      >
        {[
          { key: 'members', label: 'Medlemmer', icon: Users },
          { key: 'sessions', label: 'Økter', icon: Calendar },
          { key: 'plan', label: 'Treningsplan', icon: ClipboardList },
          { key: 'stats', label: 'Statistikk', icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              backgroundColor: activeTab === tab.key ? tokens.colors.primary : 'transparent',
              color: activeTab === tab.key ? tokens.colors.white : tokens.colors.charcoal,
              border: 'none',
              borderRadius: tokens.radius.md,
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: '24px' }}>
        {/* Members tab */}
        {activeTab === 'members' && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <h2 style={{ ...tokens.typography.headline, color: tokens.colors.charcoal, margin: 0 }}>
                Gruppemedlemmer ({group.members.length})
              </h2>
              <button
                onClick={() => navigate(`/coach/groups/${groupId}/members/add`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  backgroundColor: tokens.colors.primary,
                  color: tokens.colors.white,
                  border: 'none',
                  borderRadius: tokens.radius.md,
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} />
                Legg til medlem
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {group.members.map((member) => {
                const trendStyle = getTrendStyle(member.trend);
                return (
                  <div
                    key={member.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px 16px',
                      backgroundColor: tokens.colors.white,
                      borderRadius: tokens.radius.md,
                      boxShadow: tokens.shadows.card,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        backgroundColor: member.avatarColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: tokens.colors.white,
                        fontWeight: 600,
                        fontSize: '14px',
                      }}
                    >
                      {member.avatarInitials}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            ...tokens.typography.headline,
                            color: tokens.colors.charcoal,
                          }}
                        >
                          {member.name}
                        </span>
                        <span
                          style={{
                            padding: '2px 8px',
                            backgroundColor: `${tokens.colors.primary}15`,
                            color: tokens.colors.primary,
                            borderRadius: tokens.radius.sm,
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          Kat. {member.category}
                        </span>
                      </div>
                      <p
                        style={{
                          ...tokens.typography.caption1,
                          color: tokens.colors.steel,
                          margin: '2px 0 0',
                        }}
                      >
                        Sist aktiv: {formatDate(member.lastActive)}
                      </p>
                    </div>

                    <div style={{ textAlign: 'center', marginRight: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 600, color: tokens.colors.charcoal }}>
                          {member.sessionsThisWeek}
                        </span>
                        <TrendingUp
                          size={16}
                          color={trendStyle.color}
                          style={{ transform: `rotate(${trendStyle.rotation})` }}
                        />
                      </div>
                      <p style={{ ...tokens.typography.caption1, color: tokens.colors.steel, margin: 0 }}>
                        økter/uke
                      </p>
                    </div>

                    <button
                      onClick={() => navigate(`/coach/athletes/${member.id}`)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: tokens.colors.gray100,
                        border: 'none',
                        borderRadius: tokens.radius.sm,
                        fontSize: '12px',
                        fontWeight: 500,
                        color: tokens.colors.charcoal,
                        cursor: 'pointer',
                      }}
                    >
                      Se profil
                    </button>

                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: tokens.radius.sm,
                        backgroundColor: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        opacity: 0.6,
                      }}
                      title="Fjern fra gruppe"
                    >
                      <UserMinus size={16} color={tokens.colors.error} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sessions tab */}
        {activeTab === 'sessions' && (
          <div>
            {/* Upcoming sessions */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ ...tokens.typography.headline, color: tokens.colors.charcoal, margin: '0 0 16px' }}>
                Kommende økter
              </h2>
              {group.upcomingSessions.length === 0 ? (
                <p style={{ ...tokens.typography.subheadline, color: tokens.colors.steel }}>
                  Ingen planlagte økter
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {group.upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '14px 16px',
                        backgroundColor: tokens.colors.white,
                        borderRadius: tokens.radius.md,
                        boxShadow: tokens.shadows.card,
                        borderLeft: `3px solid ${tokens.colors.primary}`,
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: tokens.radius.md,
                          backgroundColor: tokens.colors.primary,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: tokens.colors.white,
                        }}
                      >
                        <span style={{ fontSize: '14px', fontWeight: 700 }}>{session.time}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ ...tokens.typography.headline, color: tokens.colors.charcoal, margin: 0 }}>
                          {session.title}
                        </p>
                        <p style={{ ...tokens.typography.caption1, color: tokens.colors.steel, margin: '2px 0 0' }}>
                          {formatDate(session.date)} · {session.duration} min
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ ...tokens.typography.headline, color: tokens.colors.success, margin: 0 }}>
                          {session.attendees}/{session.totalMembers}
                        </p>
                        <p style={{ ...tokens.typography.caption1, color: tokens.colors.steel, margin: 0 }}>
                          bekreftet
                        </p>
                      </div>
                      <ChevronRight size={18} color={tokens.colors.steel} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent sessions */}
            <div>
              <h2 style={{ ...tokens.typography.headline, color: tokens.colors.charcoal, margin: '0 0 16px' }}>
                Tidligere økter
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {group.recentSessions.map((session) => (
                  <div
                    key={session.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px 16px',
                      backgroundColor: tokens.colors.white,
                      borderRadius: tokens.radius.md,
                      boxShadow: tokens.shadows.card,
                      opacity: 0.8,
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: tokens.radius.md,
                        backgroundColor: tokens.colors.gray200,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: tokens.colors.steel,
                      }}
                    >
                      <span style={{ fontSize: '14px', fontWeight: 700 }}>{session.time}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ ...tokens.typography.headline, color: tokens.colors.charcoal, margin: 0 }}>
                        {session.title}
                      </p>
                      <p style={{ ...tokens.typography.caption1, color: tokens.colors.steel, margin: '2px 0 0' }}>
                        {formatDate(session.date)} · {session.duration} min
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ ...tokens.typography.headline, color: tokens.colors.charcoal, margin: 0 }}>
                        {session.attendees}/{session.totalMembers}
                      </p>
                      <p style={{ ...tokens.typography.caption1, color: tokens.colors.steel, margin: 0 }}>
                        deltok
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Plan tab */}
        {activeTab === 'plan' && (
          <div>
            {/* Plan header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <div>
                <h2 style={{ ...tokens.typography.headline, color: tokens.colors.charcoal, margin: 0 }}>
                  {group.trainingPlan?.name || 'Treningsplan'}
                </h2>
                {group.trainingPlan && (
                  <p style={{ ...tokens.typography.caption1, color: tokens.colors.steel, margin: '4px 0 0' }}>
                    Aktiv plan: {new Date(group.trainingPlan.startDate).toLocaleDateString('nb-NO')} - {new Date(group.trainingPlan.endDate).toLocaleDateString('nb-NO')}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => navigate(`/coach/groups/${groupId}/plan/edit`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    backgroundColor: tokens.colors.gray100,
                    color: tokens.colors.charcoal,
                    border: 'none',
                    borderRadius: tokens.radius.md,
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  <Edit3 size={16} />
                  Rediger plan
                </button>
                <button
                  onClick={() => setShowAddSessionModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    backgroundColor: tokens.colors.primary,
                    color: tokens.colors.white,
                    border: 'none',
                    borderRadius: tokens.radius.md,
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={16} />
                  Legg til økt
                </button>
              </div>
            </div>

            {/* Week navigation */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                backgroundColor: tokens.colors.white,
                borderRadius: tokens.radius.lg,
                marginBottom: '16px',
                boxShadow: tokens.shadows.card,
              }}
            >
              <button
                onClick={() => setCurrentWeekOffset((prev) => prev - 1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  backgroundColor: tokens.colors.gray100,
                  border: 'none',
                  borderRadius: tokens.radius.md,
                  fontSize: '13px',
                  fontWeight: 500,
                  color: tokens.colors.charcoal,
                  cursor: 'pointer',
                }}
              >
                <ChevronLeft size={16} />
                Forrige uke
              </button>

              <div style={{ textAlign: 'center' }}>
                <p style={{ ...tokens.typography.headline, color: tokens.colors.charcoal, margin: 0 }}>
                  Uke {(() => {
                    const now = new Date();
                    now.setDate(now.getDate() + currentWeekOffset * 7);
                    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
                    const pastDaysOfYear = (now.getTime() - firstDayOfYear.getTime()) / 86400000;
                    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
                  })()}
                </p>
                <p style={{ ...tokens.typography.caption1, color: tokens.colors.steel, margin: '2px 0 0' }}>
                  {(() => {
                    const now = new Date();
                    now.setDate(now.getDate() + currentWeekOffset * 7);
                    const monday = new Date(now);
                    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
                    const sunday = new Date(monday);
                    sunday.setDate(monday.getDate() + 6);
                    return `${monday.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })} - ${sunday.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })}`;
                  })()}
                </p>
              </div>

              <button
                onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  backgroundColor: tokens.colors.gray100,
                  border: 'none',
                  borderRadius: tokens.radius.md,
                  fontSize: '13px',
                  fontWeight: 500,
                  color: tokens.colors.charcoal,
                  cursor: 'pointer',
                }}
              >
                Neste uke
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Current week info */}
            {group.trainingPlan && (() => {
              const currentWeek = group.trainingPlan.weeks[Math.abs(currentWeekOffset) % group.trainingPlan.weeks.length];
              if (!currentWeek) return null;

              return (
                <>
                  {/* Week theme/focus */}
                  {(currentWeek.theme || currentWeek.focus) && (
                    <div
                      style={{
                        padding: '16px 20px',
                        backgroundColor: `${tokens.colors.primary}10`,
                        borderRadius: tokens.radius.lg,
                        marginBottom: '16px',
                        borderLeft: `4px solid ${tokens.colors.primary}`,
                      }}
                    >
                      {currentWeek.theme && (
                        <p style={{ ...tokens.typography.headline, color: tokens.colors.primary, margin: 0 }}>
                          {currentWeek.theme}
                        </p>
                      )}
                      {currentWeek.focus && (
                        <p style={{ ...tokens.typography.subheadline, color: tokens.colors.charcoal, margin: '4px 0 0' }}>
                          Fokus: {currentWeek.focus}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Weekly schedule grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                    {dayNames.map((day, index) => {
                      const sessionsForDay = currentWeek.sessions.filter((s) => s.dayOfWeek === index);
                      const isToday = (() => {
                        const today = new Date();
                        const dayOfWeek = (today.getDay() + 6) % 7;
                        return dayOfWeek === index && currentWeekOffset === 0;
                      })();

                      return (
                        <div
                          key={day}
                          style={{
                            backgroundColor: tokens.colors.white,
                            borderRadius: tokens.radius.md,
                            overflow: 'hidden',
                            boxShadow: tokens.shadows.card,
                            border: isToday ? `2px solid ${tokens.colors.primary}` : 'none',
                          }}
                        >
                          {/* Day header */}
                          <div
                            style={{
                              padding: '10px 12px',
                              backgroundColor: isToday ? tokens.colors.primary : tokens.colors.gray50,
                              borderBottom: `1px solid ${tokens.colors.gray200}`,
                            }}
                          >
                            <p
                              style={{
                                ...tokens.typography.footnote,
                                fontWeight: 600,
                                color: isToday ? tokens.colors.white : tokens.colors.charcoal,
                                margin: 0,
                                textAlign: 'center',
                              }}
                            >
                              {day.slice(0, 3)}
                            </p>
                          </div>

                          {/* Sessions for day */}
                          <div style={{ padding: '8px', minHeight: '120px' }}>
                            {sessionsForDay.length === 0 ? (
                              <button
                                onClick={() => {
                                  setSelectedDay(index);
                                  setShowAddSessionModal(true);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '12px',
                                  backgroundColor: tokens.colors.gray50,
                                  border: `1px dashed ${tokens.colors.gray300}`,
                                  borderRadius: tokens.radius.sm,
                                  color: tokens.colors.steel,
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '4px',
                                }}
                              >
                                <Plus size={12} />
                                Legg til
                              </button>
                            ) : (
                              sessionsForDay.map((session) => (
                                <div
                                  key={session.id}
                                  style={{
                                    padding: '8px',
                                    backgroundColor: `${tokens.colors.primary}08`,
                                    borderRadius: tokens.radius.sm,
                                    marginBottom: '6px',
                                    cursor: 'pointer',
                                    borderLeft: `3px solid ${tokens.colors.primary}`,
                                  }}
                                  onClick={() => setEditingSession(session.id)}
                                >
                                  <p
                                    style={{
                                      ...tokens.typography.caption1,
                                      fontWeight: 600,
                                      color: tokens.colors.charcoal,
                                      margin: 0,
                                    }}
                                  >
                                    {session.time}
                                  </p>
                                  <p
                                    style={{
                                      fontSize: '11px',
                                      color: tokens.colors.charcoal,
                                      margin: '2px 0 0',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {session.title}
                                  </p>
                                  <div
                                    style={{
                                      display: 'flex',
                                      gap: '2px',
                                      marginTop: '4px',
                                      flexWrap: 'wrap',
                                    }}
                                  >
                                    {session.exercises.slice(0, 2).map((ex) => {
                                      const catStyle = categoryColors[ex.category] || { bg: tokens.colors.gray100, text: tokens.colors.steel, label: ex.category };
                                      return (
                                        <span
                                          key={ex.id}
                                          style={{
                                            fontSize: '9px',
                                            padding: '1px 4px',
                                            backgroundColor: catStyle.bg,
                                            color: catStyle.text,
                                            borderRadius: '3px',
                                          }}
                                        >
                                          {catStyle.label || ex.category}
                                        </span>
                                      );
                                    })}
                                    {session.exercises.length > 2 && (
                                      <span
                                        style={{
                                          fontSize: '9px',
                                          padding: '1px 4px',
                                          backgroundColor: tokens.colors.gray100,
                                          color: tokens.colors.steel,
                                          borderRadius: '3px',
                                        }}
                                      >
                                        +{session.exercises.length - 2}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Session detail panel */}
                  {editingSession && (() => {
                    const session = currentWeek.sessions.find((s) => s.id === editingSession);
                    if (!session) return null;

                    return (
                      <div
                        style={{
                          marginTop: '24px',
                          backgroundColor: tokens.colors.white,
                          borderRadius: tokens.radius.lg,
                          boxShadow: tokens.shadows.elevated,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            padding: '16px 20px',
                            backgroundColor: tokens.colors.primary,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>
                            <h3 style={{ ...tokens.typography.headline, color: tokens.colors.white, margin: 0 }}>
                              {session.title}
                            </h3>
                            <p style={{ ...tokens.typography.caption1, color: 'rgba(255,255,255,0.8)', margin: '2px 0 0' }}>
                              {dayNames[session.dayOfWeek]} kl. {session.time}
                            </p>
                          </div>
                          <button
                            onClick={() => setEditingSession(null)}
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <X size={18} color={tokens.colors.white} />
                          </button>
                        </div>

                        <div style={{ padding: '20px' }}>
                          <h4
                            style={{
                              ...tokens.typography.footnote,
                              color: tokens.colors.steel,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              margin: '0 0 12px',
                            }}
                          >
                            Øvelser ({session.exercises.length})
                          </h4>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {session.exercises
                              .sort((a, b) => a.order - b.order)
                              .map((exercise, index) => {
                                const catStyle = categoryColors[exercise.category] || { bg: tokens.colors.gray100, text: tokens.colors.steel, label: exercise.category };
                                return (
                                  <div
                                    key={exercise.id}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '12px',
                                      padding: '12px 14px',
                                      backgroundColor: tokens.colors.gray50,
                                      borderRadius: tokens.radius.md,
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        backgroundColor: tokens.colors.primary,
                                        color: tokens.colors.white,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        flexShrink: 0,
                                      }}
                                    >
                                      {index + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <p style={{ ...tokens.typography.subheadline, fontWeight: 500, color: tokens.colors.charcoal, margin: 0 }}>
                                        {exercise.name}
                                      </p>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                                        <span
                                          style={{
                                            fontSize: '11px',
                                            padding: '2px 6px',
                                            backgroundColor: catStyle.bg,
                                            color: catStyle.text,
                                            borderRadius: '4px',
                                            fontWeight: 500,
                                          }}
                                        >
                                          {catStyle.label}
                                        </span>
                                        <span style={{ fontSize: '11px', color: tokens.colors.steel }}>
                                          {exercise.duration} min
                                        </span>
                                      </div>
                                    </div>
                                    <GripVertical size={16} color={tokens.colors.gray300} style={{ cursor: 'grab' }} />
                                  </div>
                                );
                              })}
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              gap: '10px',
                              marginTop: '16px',
                              paddingTop: '16px',
                              borderTop: `1px solid ${tokens.colors.gray200}`,
                            }}
                          >
                            <button
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                backgroundColor: tokens.colors.primary,
                                color: tokens.colors.white,
                                border: 'none',
                                borderRadius: tokens.radius.md,
                                fontSize: '13px',
                                fontWeight: 500,
                                cursor: 'pointer',
                              }}
                            >
                              <Play size={16} />
                              Start økt
                            </button>
                            <button
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                backgroundColor: tokens.colors.gray100,
                                color: tokens.colors.charcoal,
                                border: 'none',
                                borderRadius: tokens.radius.md,
                                fontSize: '13px',
                                fontWeight: 500,
                                cursor: 'pointer',
                              }}
                            >
                              <Edit3 size={16} />
                              Rediger
                            </button>
                            <button
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                backgroundColor: tokens.colors.gray100,
                                color: tokens.colors.charcoal,
                                border: 'none',
                                borderRadius: tokens.radius.md,
                                fontSize: '13px',
                                fontWeight: 500,
                                cursor: 'pointer',
                              }}
                            >
                              <Copy size={16} />
                              Kopier
                            </button>
                            <button
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                backgroundColor: `${tokens.colors.error}10`,
                                color: tokens.colors.error,
                                border: 'none',
                                borderRadius: tokens.radius.md,
                                fontSize: '13px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                marginLeft: 'auto',
                              }}
                            >
                              <Trash2 size={16} />
                              Slett
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </>
              );
            })()}

            {/* No plan message */}
            {!group.trainingPlan && (
              <div
                style={{
                  backgroundColor: tokens.colors.white,
                  borderRadius: tokens.radius.lg,
                  padding: '48px 24px',
                  textAlign: 'center',
                  boxShadow: tokens.shadows.card,
                }}
              >
                <ClipboardList size={48} color={tokens.colors.gray300} style={{ marginBottom: '16px' }} />
                <h3 style={{ ...tokens.typography.headline, color: tokens.colors.charcoal, margin: 0 }}>
                  Ingen treningsplan
                </h3>
                <p style={{ ...tokens.typography.subheadline, color: tokens.colors.steel, margin: '8px 0 20px' }}>
                  Opprett en treningsplan for å strukturere gruppens økter
                </p>
                <button
                  onClick={() => navigate(`/coach/groups/${groupId}/plan/create`)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    backgroundColor: tokens.colors.primary,
                    color: tokens.colors.white,
                    border: 'none',
                    borderRadius: tokens.radius.md,
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={18} />
                  Opprett treningsplan
                </button>
              </div>
            )}
          </div>
        )}

        {/* Stats tab */}
        {activeTab === 'stats' && (
          <div>
            <h2 style={{ ...tokens.typography.headline, color: tokens.colors.charcoal, margin: '0 0 16px' }}>
              Gruppestatistikk
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div
                style={{
                  padding: '20px',
                  backgroundColor: tokens.colors.white,
                  borderRadius: tokens.radius.lg,
                  boxShadow: tokens.shadows.card,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Trophy size={20} color={tokens.colors.gold} />
                  <span style={{ ...tokens.typography.subheadline, color: tokens.colors.steel }}>
                    Topp utøver denne måneden
                  </span>
                </div>
                <p style={{ ...tokens.typography.title2, color: tokens.colors.charcoal, margin: 0 }}>
                  {group.stats.topPerformer}
                </p>
              </div>

              <div
                style={{
                  padding: '20px',
                  backgroundColor: tokens.colors.white,
                  borderRadius: tokens.radius.lg,
                  boxShadow: tokens.shadows.card,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Target size={20} color={tokens.colors.success} />
                  <span style={{ ...tokens.typography.subheadline, color: tokens.colors.steel }}>
                    Gjennomsnittlig oppmøte
                  </span>
                </div>
                <p style={{ ...tokens.typography.title2, color: tokens.colors.charcoal, margin: 0 }}>
                  {group.stats.avgAttendance}%
                </p>
              </div>

              <div
                style={{
                  padding: '20px',
                  backgroundColor: tokens.colors.white,
                  borderRadius: tokens.radius.lg,
                  boxShadow: tokens.shadows.card,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Clock size={20} color={tokens.colors.primary} />
                  <span style={{ ...tokens.typography.subheadline, color: tokens.colors.steel }}>
                    Økter per uke (snitt)
                  </span>
                </div>
                <p style={{ ...tokens.typography.title2, color: tokens.colors.charcoal, margin: 0 }}>
                  {group.stats.avgSessionsPerWeek}
                </p>
              </div>

              <div
                style={{
                  padding: '20px',
                  backgroundColor: tokens.colors.white,
                  borderRadius: tokens.radius.lg,
                  boxShadow: tokens.shadows.card,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Calendar size={20} color={tokens.colors.primaryLight} />
                  <span style={{ ...tokens.typography.subheadline, color: tokens.colors.steel }}>
                    Totalt antall økter
                  </span>
                </div>
                <p style={{ ...tokens.typography.title2, color: tokens.colors.charcoal, margin: 0 }}>
                  {group.stats.totalSessions}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
