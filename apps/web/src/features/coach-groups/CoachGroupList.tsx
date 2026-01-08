/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * CoachGroupList.tsx
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
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
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import { SubSectionTitle } from "../../ui/components/typography";

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
            avatarColor: 'var(--status-error)',
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
            avatarColor: 'var(--status-success)',
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
      team_norway: { bg: 'rgba(var(--error-rgb), 0.15)', text: 'var(--status-error)', label: 'Team Norway' },
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
      <div className="min-h-screen bg-tier-surface-base flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-tier-border-default border-t-tier-navy rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tier-surface-base font-sans">
      {/* Header - using PageHeader from design system */}
      <PageHeader
        title="Mine grupper"
        subtitle={`${groups.length} grupper · ${totalMembers} spillere totalt`}
        helpText="Administrer alle dine treningsgrupper. Opprett nye grupper, legg til medlemmer og planlegg gruppeaktiviteter."
        actions={
          <Button
            variant="primary"
            onClick={() => navigate('/coach/groups/create')}
            leftIcon={<Plus size={18} />}
          >
            Ny gruppe
          </Button>
        }
      />

      <div className="px-6">

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Totalt grupper', value: groups.length, colorClass: 'text-tier-navy' },
            { label: 'Spillere', value: totalMembers, colorClass: 'text-tier-success' },
            { label: 'Med treningsplan', value: groupsWithPlans, colorClass: 'text-tier-warning' },
          ].map((stat, index) => (
            <div
              key={index}
              className="p-4 bg-tier-white rounded-lg shadow-sm text-center"
            >
              <p className={`text-2xl font-bold m-0 ${stat.colorClass}`}>
                {stat.value}
              </p>
              <p className="text-xs leading-4 text-tier-text-secondary mt-1 mb-0">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Search and filters */}
        <div className="flex gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-tier-text-secondary"
            />
            <input
              type="text"
              placeholder="Søk i grupper..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 pl-10 pr-3 bg-tier-white border border-tier-border-default rounded-lg text-sm outline-none focus:border-tier-navy"
            />
          </div>

          {/* Filter buttons */}
          <div className="flex gap-1">
            {[
              { key: 'all', label: 'Alle' },
              { key: 'wang', label: 'WANG' },
              { key: 'team_norway', label: 'Team Norway' },
              { key: 'custom', label: 'Egendefinert' },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterType(filter.key as 'all' | 'wang' | 'team_norway' | 'custom')}
                className={`py-2 px-3.5 rounded text-[13px] font-medium cursor-pointer whitespace-nowrap ${
                  filterType === filter.key
                    ? 'bg-tier-navy text-white border border-tier-navy'
                    : 'bg-tier-white text-tier-navy border border-tier-border-default'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Groups list */}
      <div className="px-6 pb-6">
        {filteredGroups.length === 0 ? (
          <div className="py-12 px-6 bg-tier-white rounded-xl text-center shadow-sm">
            <Users size={48} className="text-tier-border-default mb-4" />
            <p className="text-[17px] leading-[22px] font-semibold text-tier-navy m-0 mb-2">
              {searchQuery ? 'Ingen grupper funnet' : 'Ingen grupper ennå'}
            </p>
            <p className="text-[15px] leading-5 text-tier-text-secondary m-0 mb-5">
              {searchQuery
                ? 'Prøv et annet søkeord'
                : 'Opprett din første gruppe for å komme i gang'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate('/coach/groups/create')}
                className="inline-flex items-center gap-2 py-2.5 px-5 bg-tier-navy text-white border-none rounded-lg text-sm font-semibold cursor-pointer"
              >
                <Plus size={18} />
                Opprett gruppe
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredGroups.map((group) => {
              const typeBadge = getTypeBadge(group.type);
              const nextSession = formatNextSession(group.nextSession);

              return (
                <div
                  key={group.id}
                  className="bg-tier-white rounded-xl shadow-sm overflow-hidden"
                >
                  {/* Main content - clickable */}
                  <div
                    onClick={() => navigate(`/coach/groups/${group.id}`)}
                    className="flex items-center gap-4 p-4 cursor-pointer"
                  >
                    {/* Avatar */}
                    <div
                      className="w-14 h-14 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0"
                      style={{ backgroundColor: group.avatarColor }}
                    >
                      {group.avatarInitials}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1">
                        <SubSectionTitle className="m-0">
                          {group.name}
                        </SubSectionTitle>
                        <span
                          className="py-0.5 px-2 rounded text-[11px] font-semibold"
                          style={{ backgroundColor: typeBadge.bg, color: typeBadge.text }}
                        >
                          {typeBadge.label}
                        </span>
                      </div>

                      {group.description && (
                        <p className="text-[15px] leading-5 text-tier-text-secondary m-0 mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                          {group.description}
                        </p>
                      )}

                      {/* Meta info */}
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-xs leading-4 text-tier-text-secondary">
                          <Users size={14} />
                          {group.memberCount} spillere
                        </span>

                        {group.hasTrainingPlan && (
                          <span className="flex items-center gap-1 text-xs leading-4 text-tier-success">
                            <ClipboardList size={14} />
                            Treningsplan
                          </span>
                        )}

                        {nextSession && (
                          <span className="flex items-center gap-1 text-xs leading-4 text-tier-navy">
                            <Calendar size={14} />
                            Neste: {nextSession}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Members preview */}
                    <div className="flex items-center gap-1 mr-2">
                      {group.members.slice(0, 4).map((member, index) => (
                        <div
                          key={member.id}
                          title={member.name}
                          className={`w-8 h-8 rounded-full bg-tier-navy text-white flex items-center justify-center text-[11px] font-semibold border-2 border-tier-white ${index > 0 ? '-ml-2.5' : ''}`}
                        >
                          {member.avatarInitials}
                        </div>
                      ))}
                      {group.memberCount > 4 && (
                        <div className="w-8 h-8 rounded-full bg-tier-surface-base text-tier-text-secondary flex items-center justify-center text-[10px] font-semibold -ml-2.5 border-2 border-tier-white">
                          +{group.memberCount - 4}
                        </div>
                      )}
                    </div>

                    {/* Menu button */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === group.id ? null : group.id);
                        }}
                        className={`w-9 h-9 rounded flex items-center justify-center border-none cursor-pointer ${
                          activeMenu === group.id ? 'bg-tier-surface-base' : 'bg-transparent'
                        }`}
                      >
                        <MoreVertical size={18} className="text-tier-text-secondary" />
                      </button>

                      {/* Dropdown menu */}
                      {activeMenu === group.id && (
                        <div className="absolute top-full right-0 mt-1 w-[180px] bg-tier-white rounded-lg shadow-lg border border-tier-surface-base z-[100] overflow-hidden">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/coach/groups/${group.id}/edit`);
                            }}
                            className="flex items-center gap-2.5 w-full py-2.5 px-3.5 bg-transparent border-none text-[13px] text-tier-navy cursor-pointer text-left hover:bg-tier-surface-base"
                          >
                            <Edit size={16} />
                            Rediger gruppe
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/coach/groups/${group.id}/members`);
                            }}
                            className="flex items-center gap-2.5 w-full py-2.5 px-3.5 bg-transparent border-none text-[13px] text-tier-navy cursor-pointer text-left hover:bg-tier-surface-base"
                          >
                            <UserPlus size={16} />
                            Administrer medlemmer
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/coach/groups/${group.id}/plan`);
                            }}
                            className="flex items-center gap-2.5 w-full py-2.5 px-3.5 bg-transparent border-none text-[13px] text-tier-navy cursor-pointer text-left hover:bg-tier-surface-base"
                          >
                            <ClipboardList size={16} />
                            Treningsplan
                          </button>
                          <div className="h-px bg-tier-surface-base my-1" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteGroup(group);
                            }}
                            className="flex items-center gap-2.5 w-full py-2.5 px-3.5 bg-transparent border-none text-[13px] text-tier-error cursor-pointer text-left hover:bg-tier-surface-base"
                          >
                            <Trash2 size={16} />
                            Slett gruppe
                          </button>
                        </div>
                      )}
                    </div>

                    <ChevronRight size={20} className="text-tier-text-secondary" />
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
          className="fixed inset-0 z-50"
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
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setGroupToDelete(null)}
              className="py-2.5 px-[18px] bg-transparent border border-tier-border-default rounded-lg text-tier-navy text-sm font-medium cursor-pointer"
            >
              Avbryt
            </button>
            <button
              onClick={handleConfirmDeleteGroup}
              className="py-2.5 px-[18px] bg-tier-error border-none rounded-lg text-white text-sm font-semibold cursor-pointer"
            >
              Slett gruppe
            </button>
          </div>
        }
      >
        <p className="m-0 text-tier-text-secondary leading-relaxed">
          Er du sikker på at du vil slette gruppen <strong className="text-tier-navy">{groupToDelete?.name}</strong>? Denne handlingen kan ikke angres.
        </p>
      </Modal>
    </div>
  );
}
