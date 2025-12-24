import React, { useState, useMemo } from 'react';
import {
  ClipboardList,
  Search,
  Users,
  User,
  ChevronRight,
  CheckCircle,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tokens as designTokens } from '../../design-tokens';

interface Player {
  id: string;
  name: string;
  category: 'A' | 'B' | 'C';
  hcp: number;
  hasActivePlan: boolean;
  planUpdated?: string;
  nextSession?: string;
  weeksInPlan?: number;
}

interface Group {
  id: string;
  name: string;
  memberCount: number;
  hasGroupPlan: boolean;
  planUpdated?: string;
}

const mockPlayers: Player[] = [
  { id: '1', name: 'Emma Larsen', category: 'A', hcp: 4.2, hasActivePlan: true, planUpdated: '2025-01-15', nextSession: '2025-01-20', weeksInPlan: 8 },
  { id: '2', name: 'Thomas Berg', category: 'B', hcp: 12.4, hasActivePlan: true, planUpdated: '2025-01-10', nextSession: '2025-01-22', weeksInPlan: 12 },
  { id: '3', name: 'Sofie Andersen', category: 'A', hcp: 2.8, hasActivePlan: true, planUpdated: '2025-01-18', nextSession: '2025-01-21', weeksInPlan: 16 },
  { id: '4', name: 'Jonas Pedersen', category: 'B', hcp: 16.8, hasActivePlan: false },
  { id: '5', name: 'Kristine Olsen', category: 'A', hcp: 7.5, hasActivePlan: true, planUpdated: '2025-01-12', nextSession: '2025-01-23', weeksInPlan: 6 },
  { id: '6', name: 'Erik Hansen', category: 'A', hcp: 5.5, hasActivePlan: true, planUpdated: '2025-01-14', nextSession: '2025-01-20', weeksInPlan: 10 },
  { id: '7', name: 'Mia Kristiansen', category: 'C', hcp: 28.5, hasActivePlan: false },
  { id: '8', name: 'Lars Johansen', category: 'A', hcp: 6.2, hasActivePlan: true, planUpdated: '2025-01-08', weeksInPlan: 8 },
];

const mockGroups: Group[] = [
  { id: 'g1', name: 'WANG Toppidrett', memberCount: 12, hasGroupPlan: true, planUpdated: '2025-01-16' },
  { id: 'g2', name: 'Team Junior', memberCount: 8, hasGroupPlan: true, planUpdated: '2025-01-14' },
  { id: 'g3', name: 'Turneringsspillere', memberCount: 15, hasGroupPlan: false },
  { id: 'g4', name: 'Nybegynnere 2025', memberCount: 6, hasGroupPlan: true, planUpdated: '2025-01-12' },
];

export const CoachPlanningHub: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'players' | 'groups'>('players');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState<'all' | 'with' | 'without'>('all');

  const filteredPlayers = useMemo(() => {
    let players = [...mockPlayers];

    if (searchQuery) {
      players = players.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterPlan === 'with') {
      players = players.filter(p => p.hasActivePlan);
    } else if (filterPlan === 'without') {
      players = players.filter(p => !p.hasActivePlan);
    }

    return players;
  }, [searchQuery, filterPlan]);

  const filteredGroups = useMemo(() => {
    let groups = [...mockGroups];

    if (searchQuery) {
      groups = groups.filter(g =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterPlan === 'with') {
      groups = groups.filter(g => g.hasGroupPlan);
    } else if (filterPlan === 'without') {
      groups = groups.filter(g => !g.hasGroupPlan);
    }

    return groups;
  }, [searchQuery, filterPlan]);

  const stats = useMemo(() => ({
    playersWithPlan: mockPlayers.filter(p => p.hasActivePlan).length,
    playersWithoutPlan: mockPlayers.filter(p => !p.hasActivePlan).length,
    groupsWithPlan: mockGroups.filter(g => g.hasGroupPlan).length,
    groupsWithoutPlan: mockGroups.filter(g => !g.hasGroupPlan).length
  }), []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'A': return { bg: '#dcfce7', text: '#166534' };
      case 'B': return { bg: '#dbeafe', text: '#1e40af' };
      case 'C': return { bg: '#fef3c7', text: '#92400e' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
  };

  return (
    <div style={{ padding: '24px', backgroundColor: designTokens.colors.background.primary, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${designTokens.colors.primary[500]}, ${designTokens.colors.primary[600]})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ClipboardList size={24} color="white" />
            </div>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: designTokens.colors.text.primary,
                margin: 0
              }}>
                Treningsplanlegger
              </h1>
              <p style={{
                fontSize: '14px',
                color: designTokens.colors.text.secondary,
                margin: 0
              }}>
                Velg spiller eller gruppe for å opprette/redigere treningsplan
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/coach/exercises/templates')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '10px',
              border: `1px solid ${designTokens.colors.border.light}`,
              backgroundColor: designTokens.colors.background.card,
              color: designTokens.colors.text.secondary,
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            <FileText size={18} />
            Maler
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: designTokens.colors.background.card,
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${designTokens.colors.border.light}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <User size={16} color={designTokens.colors.primary[500]} />
            <span style={{ fontSize: '12px', color: designTokens.colors.text.secondary }}>Spillere med plan</span>
          </div>
          <p style={{ fontSize: '24px', fontWeight: '700', color: designTokens.colors.primary[600], margin: 0 }}>
            {stats.playersWithPlan}
          </p>
        </div>
        <div style={{
          backgroundColor: designTokens.colors.background.card,
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${designTokens.colors.border.light}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <User size={16} color="#f59e0b" />
            <span style={{ fontSize: '12px', color: designTokens.colors.text.secondary }}>Mangler plan</span>
          </div>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b', margin: 0 }}>
            {stats.playersWithoutPlan}
          </p>
        </div>
        <div style={{
          backgroundColor: designTokens.colors.background.card,
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${designTokens.colors.border.light}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Users size={16} color="#16a34a" />
            <span style={{ fontSize: '12px', color: designTokens.colors.text.secondary }}>Grupper med plan</span>
          </div>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#16a34a', margin: 0 }}>
            {stats.groupsWithPlan}
          </p>
        </div>
        <div style={{
          backgroundColor: designTokens.colors.background.card,
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${designTokens.colors.border.light}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Users size={16} color="#dc2626" />
            <span style={{ fontSize: '12px', color: designTokens.colors.text.secondary }}>Grupper uten plan</span>
          </div>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#dc2626', margin: 0 }}>
            {stats.groupsWithoutPlan}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '20px',
        padding: '4px',
        backgroundColor: designTokens.colors.background.secondary,
        borderRadius: '12px',
        width: 'fit-content'
      }}>
        <button
          onClick={() => setActiveTab('players')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeTab === 'players' ? designTokens.colors.background.card : 'transparent',
            color: activeTab === 'players' ? designTokens.colors.text.primary : designTokens.colors.text.secondary,
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'players' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          <User size={16} />
          Spillere ({mockPlayers.length})
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeTab === 'groups' ? designTokens.colors.background.card : 'transparent',
            color: activeTab === 'groups' ? designTokens.colors.text.primary : designTokens.colors.text.secondary,
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'groups' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          <Users size={16} />
          Grupper ({mockGroups.length})
        </button>
      </div>

      {/* Search and Filter */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '400px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: designTokens.colors.text.tertiary
            }}
          />
          <input
            type="text"
            placeholder={activeTab === 'players' ? 'Søk etter spiller...' : 'Søk etter gruppe...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              borderRadius: '10px',
              border: `1px solid ${designTokens.colors.border.light}`,
              backgroundColor: designTokens.colors.background.card,
              fontSize: '14px',
              color: designTokens.colors.text.primary,
              outline: 'none'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { key: 'all', label: 'Alle' },
            { key: 'with', label: 'Med plan' },
            { key: 'without', label: 'Uten plan' }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setFilterPlan(filter.key as typeof filterPlan)}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: filterPlan === filter.key
                  ? designTokens.colors.primary[500]
                  : designTokens.colors.background.card,
                color: filterPlan === filter.key
                  ? 'white'
                  : designTokens.colors.text.secondary,
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'players' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
          {filteredPlayers.map(player => {
            const catColors = getCategoryColor(player.category);
            return (
              <div
                key={player.id}
                onClick={() => navigate(`/coach/athletes/${player.id}/plan`)}
                style={{
                  backgroundColor: designTokens.colors.background.card,
                  borderRadius: '12px',
                  padding: '16px',
                  border: `1px solid ${designTokens.colors.border.light}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: player.hasActivePlan
                    ? 'rgba(34, 197, 94, 0.1)'
                    : 'rgba(245, 158, 11, 0.1)',
                  border: `2px solid ${player.hasActivePlan ? '#16a34a' : '#f59e0b'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: player.hasActivePlan ? '#16a34a' : '#f59e0b'
                }}>
                  {player.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: designTokens.colors.text.primary,
                      margin: 0
                    }}>
                      {player.name}
                    </h3>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '600',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: catColors.bg,
                      color: catColors.text
                    }}>
                      {player.category}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: designTokens.colors.text.tertiary }}>
                      HCP {player.hcp}
                    </span>
                    {player.hasActivePlan ? (
                      <>
                        <span style={{
                          fontSize: '11px',
                          color: '#16a34a',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <CheckCircle size={12} />
                          {player.weeksInPlan}u plan
                        </span>
                        {player.planUpdated && (
                          <span style={{ fontSize: '11px', color: designTokens.colors.text.tertiary }}>
                            Oppdatert {formatDate(player.planUpdated)}
                          </span>
                        )}
                      </>
                    ) : (
                      <span style={{
                        fontSize: '11px',
                        color: '#f59e0b',
                        fontWeight: '500'
                      }}>
                        Ingen aktiv plan
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight size={18} color={designTokens.colors.text.tertiary} />
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
          {filteredGroups.map(group => (
            <div
              key={group.id}
              onClick={() => navigate(`/coach/groups/${group.id}/plan`)}
              style={{
                backgroundColor: designTokens.colors.background.card,
                borderRadius: '12px',
                padding: '16px',
                border: `1px solid ${designTokens.colors.border.light}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: group.hasGroupPlan
                  ? 'rgba(34, 197, 94, 0.1)'
                  : 'rgba(245, 158, 11, 0.1)',
                border: `2px solid ${group.hasGroupPlan ? '#16a34a' : '#f59e0b'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={20} color={group.hasGroupPlan ? '#16a34a' : '#f59e0b'} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: designTokens.colors.text.primary,
                  margin: '0 0 4px 0'
                }}>
                  {group.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', color: designTokens.colors.text.tertiary }}>
                    {group.memberCount} medlemmer
                  </span>
                  {group.hasGroupPlan ? (
                    <>
                      <span style={{
                        fontSize: '11px',
                        color: '#16a34a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <CheckCircle size={12} />
                        Aktiv plan
                      </span>
                      {group.planUpdated && (
                        <span style={{ fontSize: '11px', color: designTokens.colors.text.tertiary }}>
                          Oppdatert {formatDate(group.planUpdated)}
                        </span>
                      )}
                    </>
                  ) : (
                    <span style={{
                      fontSize: '11px',
                      color: '#f59e0b',
                      fontWeight: '500'
                    }}>
                      Ingen gruppeplan
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight size={18} color={designTokens.colors.text.tertiary} />
            </div>
          ))}
        </div>
      )}

      {((activeTab === 'players' && filteredPlayers.length === 0) ||
        (activeTab === 'groups' && filteredGroups.length === 0)) && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: designTokens.colors.background.card,
          borderRadius: '16px',
          border: `1px solid ${designTokens.colors.border.light}`
        }}>
          <ClipboardList size={48} color={designTokens.colors.text.tertiary} style={{ marginBottom: '16px' }} />
          <p style={{
            fontSize: '16px',
            color: designTokens.colors.text.secondary,
            margin: 0
          }}>
            Ingen {activeTab === 'players' ? 'spillere' : 'grupper'} funnet
          </p>
        </div>
      )}
    </div>
  );
};

export default CoachPlanningHub;
