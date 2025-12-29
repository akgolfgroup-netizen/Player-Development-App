/**
 * AK Golf Academy - Coach Group Create
 * Design System v3.0 - Blue Palette 01
 *
 * Opprett ny gruppe med navn, beskrivelse, type og medlemmer.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  X,
  Search,
  Check,
  AlertCircle,
} from 'lucide-react';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';

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
  { value: 'var(--accent)', label: 'Blå' },
  { value: 'var(--success)', label: 'Grønn' },
  { value: 'var(--achievement)', label: 'Gull' },
  { value: 'var(--error)', label: 'Rød' },
  { value: '#60A5FA', label: 'Lys blå' },
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
    color: 'var(--accent)',
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
        backgroundColor: 'var(--bg-secondary)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header - using PageHeader from design system */}
      <PageHeader
        title="Opprett ny gruppe"
        subtitle="Legg til spillere og konfigurer gruppen"
        onBack={() => navigate('/coach/groups')}
      />

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
                backgroundColor: 'rgba(var(--error-rgb), 0.10)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
              }}
            >
              <AlertCircle size={18} color={'var(--error)'} />
              <span style={{ color: 'var(--error)', fontSize: '14px' }}>{error}</span>
            </div>
          )}

          {/* Basic info */}
          <div
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <h2
              style={{
                fontSize: '17px', lineHeight: '22px', fontWeight: 600,
                color: 'var(--text-primary)',
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
                  fontSize: '15px', lineHeight: '20px',
                  color: 'var(--text-primary)',
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
                  backgroundColor: 'var(--bg-secondary)',
                  border: `1px solid ${'var(--border-default)'}`,
                  borderRadius: 'var(--radius-md)',
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
                  fontSize: '15px', lineHeight: '20px',
                  color: 'var(--text-primary)',
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
                  backgroundColor: 'var(--bg-secondary)',
                  border: `1px solid ${'var(--border-default)'}`,
                  borderRadius: 'var(--radius-md)',
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
                  fontSize: '15px', lineHeight: '20px',
                  color: 'var(--text-primary)',
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
                          ? 'var(--accent)'
                          : 'var(--bg-secondary)',
                      color:
                        formData.type === type.key
                          ? 'var(--bg-primary)'
                          : 'var(--text-primary)',
                      border: `1px solid ${
                        formData.type === type.key
                          ? 'var(--accent)'
                          : 'var(--border-default)'
                      }`,
                      borderRadius: 'var(--radius-md)',
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
                  fontSize: '15px', lineHeight: '20px',
                  color: 'var(--text-primary)',
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
                      borderRadius: 'var(--radius-md)',
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
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <h2
              style={{
                fontSize: '17px', lineHeight: '22px', fontWeight: 600,
                color: 'var(--text-primary)',
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
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: formData.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--bg-primary)',
                  fontWeight: 700,
                  fontSize: '18px',
                }}
              >
                {formData.name ? getInitials(formData.name) : '??'}
              </div>
              <div>
                <p
                  style={{
                    fontSize: '17px', lineHeight: '22px', fontWeight: 600,
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}
                >
                  {formData.name || 'Gruppenavn'}
                </p>
                <p
                  style={{
                    fontSize: '12px', lineHeight: '16px',
                    color: 'var(--text-secondary)',
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
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: 'var(--shadow-card)',
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
                  fontSize: '17px', lineHeight: '22px', fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                Velg medlemmer *
              </h2>
              <span
                style={{
                  fontSize: '15px', lineHeight: '20px',
                  color: 'var(--accent)',
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
                  backgroundColor: `${'var(--accent)'}08`,
                  borderRadius: 'var(--radius-md)',
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
                      backgroundColor: 'var(--bg-primary)',
                      borderRadius: 'var(--radius-sm)',
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
                        backgroundColor: 'var(--border-default)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={12} color={'var(--text-secondary)'} />
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
                  color: 'var(--text-secondary)',
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
                  backgroundColor: 'var(--bg-secondary)',
                  border: `1px solid ${'var(--border-default)'}`,
                  borderRadius: 'var(--radius-md)',
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
                    border: `3px solid ${'var(--border-default)'}`,
                    borderTopColor: 'var(--accent)',
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
                          ? 'rgba(var(--accent-rgb), 0.10)'
                          : 'var(--bg-secondary)',
                        border: `1px solid ${
                          isSelected ? 'var(--accent)' : 'var(--border-default)'
                        }`,
                        borderRadius: 'var(--radius-md)',
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
                          backgroundColor: 'var(--accent)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--bg-primary)',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {player.avatarInitials}
                      </div>

                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontSize: '15px', lineHeight: '20px',
                            color: 'var(--text-primary)',
                            margin: 0,
                            fontWeight: 500,
                          }}
                        >
                          {player.name}
                        </p>
                        <p
                          style={{
                            fontSize: '12px', lineHeight: '16px',
                            color: 'var(--text-secondary)',
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
                            ? 'var(--accent)'
                            : 'var(--border-default)',
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
                color: 'var(--text-primary)',
                border: `1px solid ${'var(--border-default)'}`,
                borderRadius: 'var(--radius-md)',
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
                backgroundColor: 'var(--accent)',
                color: 'var(--bg-primary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
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
