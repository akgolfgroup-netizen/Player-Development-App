import React, { useState, useMemo, useEffect } from 'react';
import {
  ClipboardList,
  Search,
  Users,
  User,
  ChevronRight,
  CheckCircle,
  FileText,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

export const CoachPlanningHub: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'players' | 'groups'>('players');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState<'all' | 'with' | 'without'>('all');
  const [players, setPlayers] = useState<Player[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch players and groups from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch coach's players with their plan status
        const playersRes = await fetch('/api/v1/coaches/me/players', { headers });
        if (playersRes.ok) {
          const playersData = await playersRes.json();
          const mappedPlayers: Player[] = (playersData.data || []).map((p: any) => ({
            id: p.id,
            name: p.name || `${p.firstName} ${p.lastName}`,
            category: p.category || 'C',
            hcp: p.handicap ? Number(p.handicap) : 54,
            hasActivePlan: !!p.hasActivePlan,
            planUpdated: p.planUpdated,
            nextSession: p.nextSession,
            weeksInPlan: p.weeksInPlan,
          }));
          setPlayers(mappedPlayers);
        }

        // Fetch groups (ChatGroups with type 'team' for now)
        // Groups feature is planned but not yet implemented
        // Show empty state until groups API is available
        setGroups([]);
      } catch (error) {
        console.error('Error fetching planning data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPlayers = useMemo(() => {
    let filtered = [...players];

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterPlan === 'with') {
      filtered = filtered.filter(p => p.hasActivePlan);
    } else if (filterPlan === 'without') {
      filtered = filtered.filter(p => !p.hasActivePlan);
    }

    return filtered;
  }, [players, searchQuery, filterPlan]);

  const filteredGroups = useMemo(() => {
    let filtered = [...groups];

    if (searchQuery) {
      filtered = filtered.filter(g =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterPlan === 'with') {
      filtered = filtered.filter(g => g.hasGroupPlan);
    } else if (filterPlan === 'without') {
      filtered = filtered.filter(g => !g.hasGroupPlan);
    }

    return filtered;
  }, [groups, searchQuery, filterPlan]);

  const stats = useMemo(() => ({
    playersWithPlan: players.filter(p => p.hasActivePlan).length,
    playersWithoutPlan: players.filter(p => !p.hasActivePlan).length,
    groupsWithPlan: groups.filter(g => g.hasGroupPlan).length,
    groupsWithoutPlan: groups.filter(g => !g.hasGroupPlan).length
  }), [players, groups]);

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

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Loader2 size={40} color={'var(--accent)'} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${'var(--accent)'}, ${'var(--accent)'})`,
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
                color: 'var(--text-primary)',
                margin: 0
              }}>
                Treningsplanlegger
              </h1>
              <p style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
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
              border: `1px solid ${'var(--border-default)'}`,
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-secondary)',
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
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${'var(--border-default)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <User size={16} color={'var(--accent)'} />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Spillere med plan</span>
          </div>
          <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent)', margin: 0 }}>
            {stats.playersWithPlan}
          </p>
        </div>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${'var(--border-default)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <User size={16} color="var(--warning)" />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Mangler plan</span>
          </div>
          <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--warning)', margin: 0 }}>
            {stats.playersWithoutPlan}
          </p>
        </div>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${'var(--border-default)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Users size={16} color="var(--success)" />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Grupper med plan</span>
          </div>
          <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--success)', margin: 0 }}>
            {stats.groupsWithPlan}
          </p>
        </div>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${'var(--border-default)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Users size={16} color="var(--error)" />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Grupper uten plan</span>
          </div>
          <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--error)', margin: 0 }}>
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
        backgroundColor: 'var(--bg-tertiary)',
        borderRadius: '12px',
        width: 'fit-content'
      }}>
        <button
          onClick={() => setActiveTab('players')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeTab === 'players' ? 'var(--bg-primary)' : 'transparent',
            color: activeTab === 'players' ? 'var(--text-primary)' : 'var(--text-secondary)',
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
          Spillere ({players.length})
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeTab === 'groups' ? 'var(--bg-primary)' : 'transparent',
            color: activeTab === 'groups' ? 'var(--text-primary)' : 'var(--text-secondary)',
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
          Grupper ({groups.length})
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
              color: 'var(--text-tertiary)'
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
              border: `1px solid ${'var(--border-default)'}`,
              backgroundColor: 'var(--bg-primary)',
              fontSize: '14px',
              color: 'var(--text-primary)',
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
                  ? 'var(--accent)'
                  : 'var(--bg-primary)',
                color: filterPlan === filter.key
                  ? 'white'
                  : 'var(--text-secondary)',
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
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: `1px solid ${'var(--border-default)'}`,
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
                      color: 'var(--text-primary)',
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
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
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
                          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
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
                <ChevronRight size={18} color={'var(--text-tertiary)'} />
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
                backgroundColor: 'var(--bg-primary)',
                borderRadius: '12px',
                padding: '16px',
                border: `1px solid ${'var(--border-default)'}`,
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
                  color: 'var(--text-primary)',
                  margin: '0 0 4px 0'
                }}>
                  {group.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
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
                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
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
              <ChevronRight size={18} color={'var(--text-tertiary)'} />
            </div>
          ))}
        </div>
      )}

      {((activeTab === 'players' && filteredPlayers.length === 0) ||
        (activeTab === 'groups' && filteredGroups.length === 0)) && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '16px',
          border: `1px solid ${'var(--border-default)'}`
        }}>
          <ClipboardList size={48} color={'var(--text-tertiary)'} style={{ marginBottom: '16px' }} />
          <p style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
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
