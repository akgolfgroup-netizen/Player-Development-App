/**
 * AK Golf Academy - Coach Group Create
 * Design System v3.0 - Blue Palette 01
 *
 * Opprett ny gruppe med navn, beskrivelse, type og medlemmer.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  X,
  Search,
  Check,
  AlertCircle,
} from 'lucide-react';
import { tokens } from '../../design-tokens';

interface AvailablePlayer {
  id: string;
  name: string;
  avatarInitials: string;
  category: string;
  currentGroups: string[];
}

interface GroupFormData {
  name: string;
  description: string;
  type: 'wang' | 'team_norway' | 'custom';
  color: string;
  memberIds: string[];
}

const GROUP_COLORS = [
  { value: tokens.colors.primary, label: 'Blå' },
  { value: tokens.colors.success, label: 'Grønn' },
  { value: tokens.colors.gold, label: 'Gull' },
  { value: tokens.colors.error, label: 'Rød' },
  { value: tokens.colors.primaryLight, label: 'Lys blå' },
  { value: '#8B5CF6', label: 'Lilla' },
  { value: '#EC4899', label: 'Rosa' },
  { value: '#14B8A6', label: 'Turkis' },
];

export default function CoachGroupCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    description: '',
    type: 'custom',
    color: tokens.colors.primary,
    memberIds: [],
  });
  const [availablePlayers, setAvailablePlayers] = useState<AvailablePlayer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch available players
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('/api/v1/coach/athletes');
        if (response.ok) {
          const data = await response.json();
          setAvailablePlayers(data.athletes || []);
        }
      } catch (error) {
        console.error('Failed to fetch players:', error);
        // Mock data for development
        setAvailablePlayers([
          { id: 'p1', name: 'Anders Hansen', avatarInitials: 'AH', category: 'A', currentGroups: ['WANG'] },
          { id: 'p2', name: 'Sofie Andersen', avatarInitials: 'SA', category: 'A', currentGroups: ['WANG'] },
          { id: 'p3', name: 'Erik Johansen', avatarInitials: 'EJ', category: 'B', currentGroups: [] },
          { id: 'p4', name: 'Emma Berg', avatarInitials: 'EB', category: 'B', currentGroups: ['Team Norway'] },
          { id: 'p5', name: 'Lars Olsen', avatarInitials: 'LO', category: 'A', currentGroups: ['WANG', 'Team Norway'] },
          { id: 'p6', name: 'Mikkel Pedersen', avatarInitials: 'MP', category: 'C', currentGroups: [] },
          { id: 'p7', name: 'Ole Nilsen', avatarInitials: 'ON', category: 'C', currentGroups: [] },
          { id: 'p8', name: 'Kari Larsen', avatarInitials: 'KL', category: 'C', currentGroups: [] },
        ]);
      } finally {
        setLoadingPlayers(false);
      }
    };

    fetchPlayers();
  }, []);

  // Filter players by search
  const filteredPlayers = availablePlayers.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle member selection
  const toggleMember = (playerId: string) => {
    setFormData((prev) => ({
      ...prev,
      memberIds: prev.memberIds.includes(playerId)
        ? prev.memberIds.filter((id) => id !== playerId)
        : [...prev.memberIds, playerId],
    }));
  };

  // Get selected players
  const selectedPlayers = availablePlayers.filter((p) =>
    formData.memberIds.includes(p.id)
  );

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Gruppenavn er påkrevd');
      return;
    }

    if (formData.memberIds.length === 0) {
      setError('Velg minst ett medlem');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/v1/coach/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          type: formData.type,
          avatarColor: formData.color,
          avatarInitials: getInitials(formData.name),
          memberIds: formData.memberIds,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/coach/groups/${data.group.id}`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Kunne ikke opprette gruppe');
      }
    } catch (error) {
      console.error('Failed to create group:', error);
      // For development, just navigate back
      navigate('/coach/groups');
    } finally {
      setLoading(false);
    }
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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

          <div>
            <h1
              style={{
                ...tokens.typography.title2,
                color: tokens.colors.charcoal,
                margin: 0,
              }}
            >
              Opprett ny gruppe
            </h1>
            <p
              style={{
                ...tokens.typography.subheadline,
                color: tokens.colors.steel,
                margin: '4px 0 0',
              }}
            >
              Legg til spillere og konfigurer gruppen
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ padding: '24px', maxWidth: '800px' }}>
          {/* Error message */}
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                backgroundColor: `${tokens.colors.error}10`,
                borderRadius: tokens.radius.md,
                marginBottom: '20px',
              }}
            >
              <AlertCircle size={18} color={tokens.colors.error} />
              <span style={{ color: tokens.colors.error, fontSize: '14px' }}>{error}</span>
            </div>
          )}

          {/* Basic info */}
          <div
            style={{
              backgroundColor: tokens.colors.white,
              borderRadius: tokens.radius.lg,
              padding: '20px',
              marginBottom: '20px',
              boxShadow: tokens.shadows.card,
            }}
          >
            <h2
              style={{
                ...tokens.typography.headline,
                color: tokens.colors.charcoal,
                margin: '0 0 16px',
              }}
            >
              Grunnleggende informasjon
            </h2>

            {/* Name */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  ...tokens.typography.subheadline,
                  color: tokens.colors.charcoal,
                  marginBottom: '6px',
                  fontWeight: 500,
                }}
              >
                Gruppenavn *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="F.eks. WANG Toppidrett 2025"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: tokens.colors.snow,
                  border: `1px solid ${tokens.colors.gray300}`,
                  borderRadius: tokens.radius.md,
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  ...tokens.typography.subheadline,
                  color: tokens.colors.charcoal,
                  marginBottom: '6px',
                  fontWeight: 500,
                }}
              >
                Beskrivelse
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Kort beskrivelse av gruppen..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: tokens.colors.snow,
                  border: `1px solid ${tokens.colors.gray300}`,
                  borderRadius: tokens.radius.md,
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Type */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  ...tokens.typography.subheadline,
                  color: tokens.colors.charcoal,
                  marginBottom: '6px',
                  fontWeight: 500,
                }}
              >
                Gruppetype
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[
                  { key: 'wang', label: 'WANG Toppidrett' },
                  { key: 'team_norway', label: 'Team Norway' },
                  { key: 'custom', label: 'Egendefinert' },
                ].map((type) => (
                  <button
                    key={type.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.key as any })}
                    style={{
                      padding: '10px 18px',
                      backgroundColor:
                        formData.type === type.key
                          ? tokens.colors.primary
                          : tokens.colors.snow,
                      color:
                        formData.type === type.key
                          ? tokens.colors.white
                          : tokens.colors.charcoal,
                      border: `1px solid ${
                        formData.type === type.key
                          ? tokens.colors.primary
                          : tokens.colors.gray300
                      }`,
                      borderRadius: tokens.radius.md,
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <label
                style={{
                  display: 'block',
                  ...tokens.typography.subheadline,
                  color: tokens.colors.charcoal,
                  marginBottom: '6px',
                  fontWeight: 500,
                }}
              >
                Gruppefarge
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {GROUP_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    title={color.label}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: tokens.radius.md,
                      backgroundColor: color.value,
                      border:
                        formData.color === color.value
                          ? '3px solid white'
                          : 'none',
                      boxShadow:
                        formData.color === color.value
                          ? `0 0 0 2px ${color.value}`
                          : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {formData.color === color.value && (
                      <Check size={18} color="white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div
            style={{
              backgroundColor: tokens.colors.white,
              borderRadius: tokens.radius.lg,
              padding: '20px',
              marginBottom: '20px',
              boxShadow: tokens.shadows.card,
            }}
          >
            <h2
              style={{
                ...tokens.typography.headline,
                color: tokens.colors.charcoal,
                margin: '0 0 16px',
              }}
            >
              Forhåndsvisning
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: tokens.radius.md,
                  backgroundColor: formData.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: tokens.colors.white,
                  fontWeight: 700,
                  fontSize: '18px',
                }}
              >
                {formData.name ? getInitials(formData.name) : '??'}
              </div>
              <div>
                <p
                  style={{
                    ...tokens.typography.headline,
                    color: tokens.colors.charcoal,
                    margin: 0,
                  }}
                >
                  {formData.name || 'Gruppenavn'}
                </p>
                <p
                  style={{
                    ...tokens.typography.caption1,
                    color: tokens.colors.steel,
                    margin: '2px 0 0',
                  }}
                >
                  {formData.memberIds.length} medlemmer valgt
                </p>
              </div>
            </div>
          </div>

          {/* Members selection */}
          <div
            style={{
              backgroundColor: tokens.colors.white,
              borderRadius: tokens.radius.lg,
              padding: '20px',
              marginBottom: '20px',
              boxShadow: tokens.shadows.card,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <h2
                style={{
                  ...tokens.typography.headline,
                  color: tokens.colors.charcoal,
                  margin: 0,
                }}
              >
                Velg medlemmer *
              </h2>
              <span
                style={{
                  ...tokens.typography.subheadline,
                  color: tokens.colors.primary,
                }}
              >
                {formData.memberIds.length} valgt
              </span>
            </div>

            {/* Selected members */}
            {selectedPlayers.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '16px',
                  padding: '12px',
                  backgroundColor: `${tokens.colors.primary}08`,
                  borderRadius: tokens.radius.md,
                }}
              >
                {selectedPlayers.map((player) => (
                  <div
                    key={player.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 10px',
                      backgroundColor: tokens.colors.white,
                      borderRadius: tokens.radius.sm,
                      fontSize: '13px',
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>{player.name}</span>
                    <button
                      type="button"
                      onClick={() => toggleMember(player.id)}
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        backgroundColor: tokens.colors.gray200,
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={12} color={tokens.colors.steel} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: tokens.colors.steel,
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Søk etter spillere..."
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  backgroundColor: tokens.colors.snow,
                  border: `1px solid ${tokens.colors.gray300}`,
                  borderRadius: tokens.radius.md,
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Player list */}
            {loadingPlayers ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    border: `3px solid ${tokens.colors.gray300}`,
                    borderTopColor: tokens.colors.primary,
                    borderRadius: '50%',
                    margin: '0 auto',
                    animation: 'spin 1s linear infinite',
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                {filteredPlayers.map((player) => {
                  const isSelected = formData.memberIds.includes(player.id);
                  return (
                    <button
                      key={player.id}
                      type="button"
                      onClick={() => toggleMember(player.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 14px',
                        backgroundColor: isSelected
                          ? `${tokens.colors.primary}10`
                          : tokens.colors.snow,
                        border: `1px solid ${
                          isSelected ? tokens.colors.primary : tokens.colors.gray200
                        }`,
                        borderRadius: tokens.radius.md,
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          backgroundColor: tokens.colors.primary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: tokens.colors.white,
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {player.avatarInitials}
                      </div>

                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            ...tokens.typography.subheadline,
                            color: tokens.colors.charcoal,
                            margin: 0,
                            fontWeight: 500,
                          }}
                        >
                          {player.name}
                        </p>
                        <p
                          style={{
                            ...tokens.typography.caption1,
                            color: tokens.colors.steel,
                            margin: '2px 0 0',
                          }}
                        >
                          Kategori {player.category}
                          {player.currentGroups.length > 0 &&
                            ` · ${player.currentGroups.join(', ')}`}
                        </p>
                      </div>

                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: isSelected
                            ? tokens.colors.primary
                            : tokens.colors.gray200,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isSelected && <Check size={14} color="white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => navigate('/coach/groups')}
              style={{
                padding: '12px 24px',
                backgroundColor: 'transparent',
                color: tokens.colors.charcoal,
                border: `1px solid ${tokens.colors.gray300}`,
                borderRadius: tokens.radius.md,
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: tokens.colors.primary,
                color: tokens.colors.white,
                border: 'none',
                borderRadius: tokens.radius.md,
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              <Users size={18} />
              {loading ? 'Oppretter...' : 'Opprett gruppe'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
