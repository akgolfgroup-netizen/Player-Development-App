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
import Modal from '../../ui/composites/Modal.composite';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import Button from '../../ui/primitives/Button';
import MembersList, { Member } from '../../ui/composites/MembersList.composite';
import { SectionTitle, SubSectionTitle, CardTitle } from '../../components/typography';

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
  teknikk: { bg: 'rgba(var(--accent-rgb), 0.15)', text: 'var(--accent)', label: 'Teknikk' },
  putting: { bg: 'rgba(var(--success-rgb), 0.15)', text: 'var(--success)', label: 'Putting' },
  kort_spill: { bg: 'rgba(var(--achievement-rgb), 0.15)', text: 'var(--achievement)', label: 'Kort spill' },
  langt_spill: { bg: 'rgba(var(--accent-rgb), 0.15)', text: 'var(--accent)', label: 'Langt spill' },
  bane: { bg: 'rgba(var(--warning-rgb), 0.15)', text: 'var(--warning)', label: 'Bane' },
  mental: { bg: 'rgba(139, 92, 246, 0.15)', text: 'var(--ak-accent-purple)', label: 'Mental' },
  fysisk: { bg: 'rgba(var(--error-rgb), 0.15)', text: 'var(--error)', label: 'Fysisk' },
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
  const [memberToRemove, setMemberToRemove] = useState<GroupMember | null>(null);

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
          avatarColor: 'var(--accent)',
          avatarInitials: 'WT',
          members: [
            {
              id: 'p1',
              name: 'Anders Hansen',
              avatarInitials: 'AH',
              avatarColor: 'var(--accent)',
              category: 'A',
              lastActive: '2025-12-21',
              sessionsThisWeek: 4,
              trend: 'up',
            },
            {
              id: 'p2',
              name: 'Sofie Andersen',
              avatarInitials: 'SA',
              avatarColor: 'var(--achievement)',
              category: 'A',
              lastActive: '2025-12-20',
              sessionsThisWeek: 3,
              trend: 'stable',
            },
            {
              id: 'p3',
              name: 'Erik Johansen',
              avatarInitials: 'EJ',
              avatarColor: 'var(--success)',
              category: 'B',
              lastActive: '2025-12-19',
              sessionsThisWeek: 2,
              trend: 'down',
            },
            {
              id: 'p4',
              name: 'Emma Berg',
              avatarInitials: 'EB',
              avatarColor: 'var(--accent)',
              category: 'B',
              lastActive: '2025-12-21',
              sessionsThisWeek: 5,
              trend: 'up',
            },
            {
              id: 'p5',
              name: 'Lars Olsen',
              avatarInitials: 'LO',
              avatarColor: 'var(--error)',
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
        return { color: 'var(--success)', rotation: '-45deg' };
      case 'down':
        return { color: 'var(--error)', rotation: '45deg' };
      default:
        return { color: 'var(--text-secondary)', rotation: '0deg' };
    }
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('nb-NO', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  // Remove member - show confirmation modal
  const handleRemoveMember = (member: GroupMember) => {
    setMemberToRemove(member);
  };

  // Confirm and execute member removal
  const handleConfirmRemoveMember = async () => {
    if (!memberToRemove) return;

    try {
      await fetch(`/api/v1/coach/groups/${groupId}/members/${memberToRemove.id}`, {
        method: 'DELETE',
      });
      if (group) {
        setGroup({
          ...group,
          members: group.members.filter((m) => m.id !== memberToRemove.id),
        });
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
    setMemberToRemove(null);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: `4px solid ${'var(--border-default)'}`,
            borderTopColor: 'var(--accent)',
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
        backgroundColor: 'var(--bg-secondary)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header - using PageHeader from design system */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '24px 24px 0' }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 'var(--radius-md)',
            backgroundColor: group.avatarColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--bg-primary)',
            fontWeight: 700,
            fontSize: '20px',
            flexShrink: 0,
          }}
        >
          {group.avatarInitials}
        </div>
        <div style={{ flex: 1 }}>
          <PageHeader
            title={group.name}
            subtitle={group.description}
            onBack={() => navigate('/coach/groups')}
            actions={
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Settings size={16} />}
                onClick={() => navigate(`/coach/groups/${groupId}/edit`)}
              >
                Innstillinger
              </Button>
            }
            divider={false}
          />
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: '10px', padding: '16px 24px', borderBottom: '1px solid var(--border-default)' }}>
        <Button
          variant="primary"
          leftIcon={<ClipboardList size={18} />}
          onClick={() => navigate(`/coach/groups/${groupId}/plan`)}
        >
          Treningsplan
        </Button>
        <Button
          variant="secondary"
          leftIcon={<MessageSquare size={18} />}
          onClick={() => navigate(`/coach/groups/${groupId}/message`)}
        >
          Send melding
        </Button>
        <Button
          variant="secondary"
          leftIcon={<Calendar size={18} />}
          onClick={() => navigate(`/coach/groups/${groupId}/session/new`)}
        >
          Planlegg økt
        </Button>
      </div>

      {/* Stats bar */}
      <div style={{ padding: '16px 24px', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent)', margin: 0 }}>
              {group.members.length}
            </p>
            <p style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Medlemmer
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)', margin: 0 }}>
              {group.stats.avgAttendance}%
            </p>
            <p style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Snitt oppmøte
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--achievement)', margin: 0 }}>
              {group.stats.totalSessions}
            </p>
            <p style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Økter totalt
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent)', margin: 0 }}>
              {group.stats.avgSessionsPerWeek}
            </p>
            <p style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
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
          backgroundColor: 'var(--bg-primary)',
          borderBottom: `1px solid ${'var(--border-default)'}`,
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
              backgroundColor: activeTab === tab.key ? 'var(--accent)' : 'transparent',
              color: activeTab === tab.key ? 'var(--bg-primary)' : 'var(--text-primary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
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
              <SectionTitle style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                Gruppemedlemmer ({group.members.length})
              </SectionTitle>
              <button
                onClick={() => navigate(`/coach/groups/${groupId}/members/add`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} />
                Legg til medlem
              </button>
            </div>

            {/* Members List using reusable component */}
            <div
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-card)',
                overflow: 'hidden',
              }}
            >
              <MembersList
                members={group.members.map((m): Member => ({
                  id: m.id,
                  name: m.name,
                  avatarInitials: m.avatarInitials,
                  avatarColor: m.avatarColor,
                  category: `Kat. ${m.category}`,
                  role: `${m.sessionsThisWeek} økter/uke`,
                  lastSeen: formatDate(m.lastActive),
                  type: 'player',
                }))}
                onMemberClick={(member) => navigate(`/coach/athletes/${member.id}`)}
                showEmail={false}
                showStatus={true}
                size="lg"
              />
            </div>

            {/* Additional member actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
              {group.members.map((member) => {
                const trendStyle = getTrendStyle(member.trend);
                return (
                  <div
                    key={`actions-${member.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      backgroundColor: 'var(--bg-primary)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-card)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          backgroundColor: member.avatarColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--bg-primary)',
                          fontWeight: 600,
                          fontSize: '12px',
                        }}
                      >
                        {member.avatarInitials}
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {member.name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <TrendingUp
                          size={16}
                          color={trendStyle.color}
                          style={{ transform: `rotate(${trendStyle.rotation})` }}
                        />
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          {member.sessionsThisWeek} økter
                        </span>
                      </div>

                      <button
                        onClick={() => navigate(`/coach/athletes/${member.id}`)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: 'var(--bg-tertiary)',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '12px',
                          fontWeight: 500,
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                        }}
                      >
                        Se profil
                      </button>

                      <button
                        onClick={() => handleRemoveMember(member)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 'var(--radius-sm)',
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
                        <UserMinus size={16} color={'var(--error)'} />
                      </button>
                    </div>
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
              <SectionTitle style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px' }}>
                Kommende økter
              </SectionTitle>
              {group.upcomingSessions.length === 0 ? (
                <p style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-secondary)' }}>
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
                        backgroundColor: 'var(--bg-primary)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-card)',
                        borderLeft: `3px solid ${'var(--accent)'}`,
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--accent)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--bg-primary)',
                        }}
                      >
                        <span style={{ fontSize: '14px', fontWeight: 700 }}>{session.time}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                          {session.title}
                        </p>
                        <p style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                          {formatDate(session.date)} · {session.duration} min
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--success)', margin: 0 }}>
                          {session.attendees}/{session.totalMembers}
                        </p>
                        <p style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--text-secondary)', margin: 0 }}>
                          bekreftet
                        </p>
                      </div>
                      <ChevronRight size={18} color={'var(--text-secondary)'} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent sessions */}
            <div>
              <SectionTitle style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px' }}>
                Tidligere økter
              </SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {group.recentSessions.map((session) => (
                  <div
                    key={session.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px 16px',
                      backgroundColor: 'var(--bg-primary)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-card)',
                      opacity: 0.8,
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--border-default)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <span style={{ fontSize: '14px', fontWeight: 700 }}>{session.time}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                        {session.title}
                      </p>
                      <p style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                        {formatDate(session.date)} · {session.duration} min
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                        {session.attendees}/{session.totalMembers}
                      </p>
                      <p style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--text-secondary)', margin: 0 }}>
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
                <SectionTitle style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  {group.trainingPlan?.name || 'Treningsplan'}
                </SectionTitle>
                {group.trainingPlan && (
                  <p style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
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
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
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
                    backgroundColor: 'var(--accent)',
                    color: 'var(--bg-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
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
                backgroundColor: 'var(--bg-primary)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '16px',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <button
                onClick={() => setCurrentWeekOffset((prev) => prev - 1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                }}
              >
                <ChevronLeft size={16} />
                Forrige uke
              </button>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Uke {(() => {
                    const now = new Date();
                    now.setDate(now.getDate() + currentWeekOffset * 7);
                    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
                    const pastDaysOfYear = (now.getTime() - firstDayOfYear.getTime()) / 86400000;
                    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
                  })()}
                </p>
                <p style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
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
                  backgroundColor: 'var(--bg-tertiary)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
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
                        backgroundColor: 'rgba(var(--accent-rgb), 0.10)',
                        borderRadius: 'var(--radius-lg)',
                        marginBottom: '16px',
                        borderLeft: `4px solid ${'var(--accent)'}`,
                      }}
                    >
                      {currentWeek.theme && (
                        <p style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--accent)', margin: 0 }}>
                          {currentWeek.theme}
                        </p>
                      )}
                      {currentWeek.focus && (
                        <p style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-primary)', margin: '4px 0 0' }}>
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
                            backgroundColor: 'var(--bg-primary)',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-card)',
                            border: isToday ? `2px solid ${'var(--accent)'}` : 'none',
                          }}
                        >
                          {/* Day header */}
                          <div
                            style={{
                              padding: '10px 12px',
                              backgroundColor: isToday ? 'var(--accent)' : 'var(--bg-tertiary)',
                              borderBottom: `1px solid ${'var(--border-default)'}`,
                            }}
                          >
                            <p
                              style={{
                                fontSize: '13px', lineHeight: '18px',
                                fontWeight: 600,
                                color: isToday ? 'var(--bg-primary)' : 'var(--text-primary)',
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
                                  backgroundColor: 'var(--bg-tertiary)',
                                  border: `1px dashed ${'var(--border-default)'}`,
                                  borderRadius: 'var(--radius-sm)',
                                  color: 'var(--text-secondary)',
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
                                    backgroundColor: `${'var(--accent)'}08`,
                                    borderRadius: 'var(--radius-sm)',
                                    marginBottom: '6px',
                                    cursor: 'pointer',
                                    borderLeft: `3px solid ${'var(--accent)'}`,
                                  }}
                                  onClick={() => setEditingSession(session.id)}
                                >
                                  <p
                                    style={{
                                      fontSize: '13px', lineHeight: '18px',
                                      fontWeight: 600,
                                      color: 'var(--text-primary)',
                                      margin: 0,
                                    }}
                                  >
                                    {session.time}
                                  </p>
                                  <p
                                    style={{
                                      fontSize: '11px',
                                      color: 'var(--text-primary)',
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
                                      const catStyle = categoryColors[ex.category] || { bg: 'var(--bg-tertiary)', text: 'var(--text-secondary)', label: ex.category };
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
                                          backgroundColor: 'var(--bg-tertiary)',
                                          color: 'var(--text-secondary)',
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
                          backgroundColor: 'var(--bg-primary)',
                          borderRadius: 'var(--radius-lg)',
                          boxShadow: 'var(--shadow-card)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            padding: '16px 20px',
                            backgroundColor: 'var(--accent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>
                            <SubSectionTitle style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--bg-primary)', margin: 0 }}>
                              {session.title}
                            </SubSectionTitle>
                            <p style={{ fontSize: '13px', lineHeight: '18px', color: 'rgba(255,255,255,0.8)', margin: '2px 0 0' }}>
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
                            <X size={18} color={'var(--bg-primary)'} />
                          </button>
                        </div>

                        <div style={{ padding: '20px' }}>
                          <CardTitle
                            style={{
                              fontSize: '13px', lineHeight: '18px',
                              color: 'var(--text-secondary)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              margin: '0 0 12px',
                            }}
                          >
                            Øvelser ({session.exercises.length})
                          </CardTitle>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {session.exercises
                              .sort((a, b) => a.order - b.order)
                              .map((exercise, index) => {
                                const catStyle = categoryColors[exercise.category] || { bg: 'var(--bg-tertiary)', text: 'var(--text-secondary)', label: exercise.category };
                                return (
                                  <div
                                    key={exercise.id}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '12px',
                                      padding: '12px 14px',
                                      backgroundColor: 'var(--bg-tertiary)',
                                      borderRadius: 'var(--radius-md)',
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--accent)',
                                        color: 'var(--bg-primary)',
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
                                      <p style={{ fontSize: '15px', lineHeight: '20px', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>
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
                                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                          {exercise.duration} min
                                        </span>
                                      </div>
                                    </div>
                                    <GripVertical size={16} color={'var(--border-default)'} style={{ cursor: 'grab' }} />
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
                              borderTop: `1px solid ${'var(--border-default)'}`,
                            }}
                          >
                            <button
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                backgroundColor: 'var(--accent)',
                                color: 'var(--bg-primary)',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
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
                                backgroundColor: 'var(--bg-tertiary)',
                                color: 'var(--text-primary)',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
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
                                backgroundColor: 'var(--bg-tertiary)',
                                color: 'var(--text-primary)',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
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
                                backgroundColor: 'rgba(var(--error-rgb), 0.10)',
                                color: 'var(--error)',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
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
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '48px 24px',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <ClipboardList size={48} color={'var(--border-default)'} style={{ marginBottom: '16px' }} />
                <SubSectionTitle style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Ingen treningsplan
                </SubSectionTitle>
                <p style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-secondary)', margin: '8px 0 20px' }}>
                  Opprett en treningsplan for å strukturere gruppens økter
                </p>
                <button
                  onClick={() => navigate(`/coach/groups/${groupId}/plan/create`)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    backgroundColor: 'var(--accent)',
                    color: 'var(--bg-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
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
            <SectionTitle style={{ fontSize: '17px', lineHeight: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px' }}>
              Gruppestatistikk
            </SectionTitle>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Trophy size={20} color={'var(--achievement)'} />
                  <span style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-secondary)' }}>
                    Topp utøver denne måneden
                  </span>
                </div>
                <p style={{ fontSize: '22px', lineHeight: '28px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {group.stats.topPerformer}
                </p>
              </div>

              <div
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Target size={20} color={'var(--success)'} />
                  <span style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-secondary)' }}>
                    Gjennomsnittlig oppmøte
                  </span>
                </div>
                <p style={{ fontSize: '22px', lineHeight: '28px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {group.stats.avgAttendance}%
                </p>
              </div>

              <div
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Clock size={20} color={'var(--accent)'} />
                  <span style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-secondary)' }}>
                    Økter per uke (snitt)
                  </span>
                </div>
                <p style={{ fontSize: '22px', lineHeight: '28px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {group.stats.avgSessionsPerWeek}
                </p>
              </div>

              <div
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Calendar size={20} color={'var(--accent)'} />
                  <span style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-secondary)' }}>
                    Totalt antall økter
                  </span>
                </div>
                <p style={{ fontSize: '22px', lineHeight: '28px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {group.stats.totalSessions}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Remove Member Confirmation Modal */}
      <Modal
        isOpen={!!memberToRemove}
        onClose={() => setMemberToRemove(null)}
        title="Fjern medlem"
        size="sm"
        footer={
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setMemberToRemove(null)}
              style={{
                padding: '10px 18px',
                backgroundColor: 'transparent',
                border: `1px solid ${'var(--border-default)'}`,
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Avbryt
            </button>
            <button
              onClick={handleConfirmRemoveMember}
              style={{
                padding: '10px 18px',
                backgroundColor: 'var(--error)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: 'var(--bg-primary)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Fjern medlem
            </button>
          </div>
        }
      >
        <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Er du sikker på at du vil fjerne <strong style={{ color: 'var(--text-primary)' }}>{memberToRemove?.name}</strong> fra gruppen?
        </p>
      </Modal>
    </div>
  );
}
