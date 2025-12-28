/**
 * AK Golf Academy - Coach Group List
 * Design System v3.0 - Blue Palette 01
 *
 * Oversikt over alle grupper treneren administrerer.
 * Støtter WANG Toppidrett, Team Norway, og egendefinerte grupper.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Plus,
  Search,
  ChevronRight,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
  ClipboardList,
} from 'lucide-react';
import Modal from '../../ui/composites/Modal.composite';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import StateCard from '../../ui/composites/StateCard';

interface GroupMember {
  id: string;
  name: string;
  avatarInitials: string;
  category: string;
}

interface CoachGroup {
  id: string;
  name: string;
  description?: string;
  type: 'wang' | 'team_norway' | 'custom';
  avatarColor: string;
  avatarInitials: string;
  memberCount: number;
  members: GroupMember[];
  hasTrainingPlan: boolean;
  nextSession?: string;
  createdAt: string;
}

export default function CoachGroupList() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<CoachGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'wang' | 'team_norway' | 'custom'>('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<CoachGroup | null>(null);

  // Fetch groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/v1/coach/groups');
        if (response.ok) {
          const data = await response.json();
          setGroups(data.groups || []);
        }
      } catch (error) {
        console.error('Failed to fetch groups:', error);
        // Mock data for development
        setGroups([
          {
            id: '1',
            name: 'WANG Toppidrett 2025',
            description: 'Hovedgruppe for WANG Toppidrett elever',
            type: 'wang',
            avatarColor: 'var(--accent)',
            avatarInitials: 'WT',
            memberCount: 8,
            members: [
              { id: 'p1', name: 'Anders Hansen', avatarInitials: 'AH', category: 'A' },
              { id: 'p2', name: 'Sofie Andersen', avatarInitials: 'SA', category: 'A' },
              { id: 'p3', name: 'Erik Johansen', avatarInitials: 'EJ', category: 'B' },
              { id: 'p4', name: 'Emma Berg', avatarInitials: 'EB', category: 'B' },
            ],
            hasTrainingPlan: true,
            nextSession: '2025-12-23T09:00:00Z',
            createdAt: '2025-01-15',
          },
          {
            id: '2',
            name: 'Team Norway U18',
            description: 'Landslagskandidater under 18 år',
            type: 'team_norway',
            avatarColor: 'var(--error)',
            avatarInitials: 'TN',
            memberCount: 5,
            members: [
              { id: 'p1', name: 'Anders Hansen', avatarInitials: 'AH', category: 'A' },
              { id: 'p5', name: 'Lars Olsen', avatarInitials: 'LO', category: 'A' },
              { id: 'p6', name: 'Mikkel Pedersen', avatarInitials: 'MP', category: 'A' },
            ],
            hasTrainingPlan: true,
            nextSession: '2025-12-28T10:00:00Z',
            createdAt: '2025-03-01',
          },
          {
            id: '3',
            name: 'Putting Fokus',
            description: 'Spillere som fokuserer på putting-forbedring',
            type: 'custom',
            avatarColor: 'var(--achievement)',
            avatarInitials: 'PF',
            memberCount: 4,
            members: [
              { id: 'p2', name: 'Sofie Andersen', avatarInitials: 'SA', category: 'A' },
              { id: 'p3', name: 'Erik Johansen', avatarInitials: 'EJ', category: 'B' },
            ],
            hasTrainingPlan: false,
            createdAt: '2025-11-10',
          },
          {
            id: '4',
            name: 'Nybegynnere 2025',
            description: 'Nye spillere i programmet',
            type: 'custom',
            avatarColor: 'var(--success)',
            avatarInitials: 'NB',
            memberCount: 6,
            members: [
              { id: 'p7', name: 'Ole Nilsen', avatarInitials: 'ON', category: 'C' },
              { id: 'p8', name: 'Kari Larsen', avatarInitials: 'KL', category: 'C' },
            ],
            hasTrainingPlan: true,
            nextSession: '2025-12-22T14:00:00Z',
            createdAt: '2025-09-01',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // Filter groups
  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !group.name.toLowerCase().includes(query) &&
          !group.description?.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Type filter
      if (filterType !== 'all' && group.type !== filterType) {
        return false;
      }

      return true;
    });
  }, [groups, searchQuery, filterType]);

  // Get type badge
  const getTypeBadge = (type: string) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      wang: { bg: 'rgba(var(--accent-rgb), 0.15)', text: 'var(--accent)', label: 'WANG' },
      team_norway: { bg: 'rgba(var(--error-rgb), 0.15)', text: 'var(--error)', label: 'Team Norway' },
      custom: { bg: 'rgba(var(--text-secondary-rgb), 0.15)', text: 'var(--text-secondary)', label: 'Egendefinert' },
    };
    return styles[type] || styles.custom;
  };

  // Format next session
  const formatNextSession = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'I dag';
    if (diffDays === 1) return 'I morgen';
    if (diffDays < 7) return `Om ${diffDays} dager`;
    return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
  };

  // Delete group - show confirmation modal
  const handleDeleteGroup = (group: CoachGroup) => {
    setActiveMenu(null);
    setGroupToDelete(group);
  };

  // Confirm and execute group deletion
  const handleConfirmDeleteGroup = async () => {
    if (!groupToDelete) return;

    try {
      await fetch(`/api/v1/coach/groups/${groupToDelete.id}`, { method: 'DELETE' });
      setGroups(groups.filter((g) => g.id !== groupToDelete.id));
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
    setGroupToDelete(null);
  };

  // Stats
  const totalMembers = new Set(groups.flatMap((g) => g.members.map((m) => m.id))).size;
  const groupsWithPlans = groups.filter((g) => g.hasTrainingPlan).length;

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

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-secondary)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ padding: '24px', paddingBottom: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '28px', lineHeight: '34px', fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Mine grupper
            </h1>
            <p
              style={{
                fontSize: '15px', lineHeight: '20px',
                color: 'var(--text-secondary)',
                margin: '4px 0 0',
              }}
            >
              {groups.length} grupper · {totalMembers} spillere totalt
            </p>
          </div>

          <button
            onClick={() => navigate('/coach/groups/create')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
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
            Ny gruppe
          </button>
        </div>

        {/* Quick stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          {[
            { label: 'Totalt grupper', value: groups.length, color: 'var(--accent)' },
            { label: 'Spillere', value: totalMembers, color: 'var(--success)' },
            { label: 'Med treningsplan', value: groupsWithPlans, color: 'var(--achievement)' },
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                padding: '16px',
                backgroundColor: 'var(--bg-primary)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-card)',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: stat.color,
                  margin: 0,
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontSize: '12px', lineHeight: '16px',
                  color: 'var(--text-secondary)',
                  margin: '4px 0 0',
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Search and filters */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Search */}
          <div style={{ flex: 1, position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)',
              }}
            />
            <input
              type="text"
              placeholder="Søk i grupper..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                backgroundColor: 'var(--bg-primary)',
                border: `1px solid ${'var(--border-default)'}`,
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {/* Filter buttons */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {[
              { key: 'all', label: 'Alle' },
              { key: 'wang', label: 'WANG' },
              { key: 'team_norway', label: 'Team Norway' },
              { key: 'custom', label: 'Egendefinert' },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterType(filter.key as any)}
                style={{
                  padding: '8px 14px',
                  backgroundColor:
                    filterType === filter.key
                      ? 'var(--accent)'
                      : 'var(--bg-primary)',
                  color:
                    filterType === filter.key
                      ? 'var(--bg-primary)'
                      : 'var(--text-primary)',
                  border: `1px solid ${
                    filterType === filter.key
                      ? 'var(--accent)'
                      : 'var(--border-default)'
                  }`,
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Groups list */}
      <div style={{ padding: '0 24px 24px' }}>
        {filteredGroups.length === 0 ? (
          <div
            style={{
              padding: '48px 24px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <Users
              size={48}
              color={'var(--border-default)'}
              style={{ marginBottom: '16px' }}
            />
            <p
              style={{
                fontSize: '17px', lineHeight: '22px', fontWeight: 600,
                color: 'var(--text-primary)',
                margin: '0 0 8px',
              }}
            >
              {searchQuery ? 'Ingen grupper funnet' : 'Ingen grupper ennå'}
            </p>
            <p
              style={{
                fontSize: '15px', lineHeight: '20px',
                color: 'var(--text-secondary)',
                margin: '0 0 20px',
              }}
            >
              {searchQuery
                ? 'Prøv et annet søkeord'
                : 'Opprett din første gruppe for å komme i gang'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate('/coach/groups/create')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
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
                Opprett gruppe
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredGroups.map((group) => {
              const typeBadge = getTypeBadge(group.type);
              const nextSession = formatNextSession(group.nextSession);

              return (
                <div
                  key={group.id}
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-card)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Main content - clickable */}
                  <div
                    onClick={() => navigate(`/coach/groups/${group.id}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      cursor: 'pointer',
                    }}
                  >
                    {/* Avatar */}
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
                        fontSize: '18px',
                        flexShrink: 0,
                      }}
                    >
                      {group.avatarInitials}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '4px',
                        }}
                      >
                        <h3
                          style={{
                            fontSize: '17px', lineHeight: '22px', fontWeight: 600,
                            color: 'var(--text-primary)',
                            margin: 0,
                          }}
                        >
                          {group.name}
                        </h3>
                        <span
                          style={{
                            padding: '2px 8px',
                            backgroundColor: typeBadge.bg,
                            color: typeBadge.text,
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          {typeBadge.label}
                        </span>
                      </div>

                      {group.description && (
                        <p
                          style={{
                            fontSize: '15px', lineHeight: '20px',
                            color: 'var(--text-secondary)',
                            margin: '0 0 8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {group.description}
                        </p>
                      )}

                      {/* Meta info */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                        }}
                      >
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px', lineHeight: '16px',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          <Users size={14} />
                          {group.memberCount} spillere
                        </span>

                        {group.hasTrainingPlan && (
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '12px', lineHeight: '16px',
                              color: 'var(--success)',
                            }}
                          >
                            <ClipboardList size={14} />
                            Treningsplan
                          </span>
                        )}

                        {nextSession && (
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '12px', lineHeight: '16px',
                              color: 'var(--accent)',
                            }}
                          >
                            <Calendar size={14} />
                            Neste: {nextSession}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Members preview */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginRight: '8px',
                      }}
                    >
                      {group.members.slice(0, 4).map((member, index) => (
                        <div
                          key={member.id}
                          title={member.name}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: 'var(--accent)',
                            color: 'var(--bg-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 600,
                            marginLeft: index > 0 ? '-10px' : 0,
                            border: `2px solid ${'var(--bg-primary)'}`,
                          }}
                        >
                          {member.avatarInitials}
                        </div>
                      ))}
                      {group.memberCount > 4 && (
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: 'var(--bg-tertiary)',
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: 600,
                            marginLeft: '-10px',
                            border: `2px solid ${'var(--bg-primary)'}`,
                          }}
                        >
                          +{group.memberCount - 4}
                        </div>
                      )}
                    </div>

                    {/* Menu button */}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === group.id ? null : group.id);
                        }}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor:
                            activeMenu === group.id
                              ? 'var(--bg-tertiary)'
                              : 'transparent',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <MoreVertical size={18} color={'var(--text-secondary)'} />
                      </button>

                      {/* Dropdown menu */}
                      {activeMenu === group.id && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '4px',
                            width: '180px',
                            backgroundColor: 'var(--bg-primary)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'var(--shadow-dropdown)',
                            border: `1px solid ${'var(--bg-tertiary)'}`,
                            zIndex: 100,
                            overflow: 'hidden',
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/coach/groups/${group.id}/edit`);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              width: '100%',
                              padding: '10px 14px',
                              backgroundColor: 'transparent',
                              border: 'none',
                              fontSize: '13px',
                              color: 'var(--text-primary)',
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                          >
                            <Edit size={16} />
                            Rediger gruppe
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/coach/groups/${group.id}/members`);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              width: '100%',
                              padding: '10px 14px',
                              backgroundColor: 'transparent',
                              border: 'none',
                              fontSize: '13px',
                              color: 'var(--text-primary)',
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                          >
                            <UserPlus size={16} />
                            Administrer medlemmer
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/coach/groups/${group.id}/plan`);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              width: '100%',
                              padding: '10px 14px',
                              backgroundColor: 'transparent',
                              border: 'none',
                              fontSize: '13px',
                              color: 'var(--text-primary)',
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                          >
                            <ClipboardList size={16} />
                            Treningsplan
                          </button>
                          <div
                            style={{
                              height: '1px',
                              backgroundColor: 'var(--bg-tertiary)',
                              margin: '4px 0',
                            }}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteGroup(group);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              width: '100%',
                              padding: '10px 14px',
                              backgroundColor: 'transparent',
                              border: 'none',
                              fontSize: '13px',
                              color: 'var(--error)',
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                          >
                            <Trash2 size={16} />
                            Slett gruppe
                          </button>
                        </div>
                      )}
                    </div>

                    <ChevronRight size={20} color={'var(--text-secondary)'} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {activeMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
          }}
          onClick={() => setActiveMenu(null)}
        />
      )}

      {/* Delete Group Confirmation Modal */}
      <Modal
        isOpen={!!groupToDelete}
        onClose={() => setGroupToDelete(null)}
        title="Slett gruppe"
        size="sm"
        footer={
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setGroupToDelete(null)}
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
              onClick={handleConfirmDeleteGroup}
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
              Slett gruppe
            </button>
          </div>
        }
      >
        <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Er du sikker på at du vil slette gruppen <strong style={{ color: 'var(--text-primary)' }}>{groupToDelete?.name}</strong>? Denne handlingen kan ikke angres.
        </p>
      </Modal>
    </div>
  );
}
