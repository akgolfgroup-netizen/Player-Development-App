/**
 * AK Golf Academy - Samling Detail
 * Detail view with tabs for info, participants, sessions, and calendar
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  Info,
  CheckCircle,
  Send,
  MoreVertical,
  Plus,
  Trash2,
  UserPlus,
  Edit,
  X,
} from 'lucide-react';
import api from '../../services/api';

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  category: string;
  avatar?: string;
}

interface Participant {
  id: string;
  playerId: string;
  invitationStatus: string;
  addedVia: string;
  syncedToTrainingPlan: boolean;
  player: Player;
}

interface Session {
  id: string;
  sessionDate: string;
  startTime: string;
  endTime?: string;
  duration: number;
  title: string;
  description?: string;
  sessionType: string;
  location?: string;
}

interface Samling {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  venue?: string;
  address?: string;
  accommodation?: string;
  meetingPoint?: string;
  transportInfo?: string;
  status: 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled';
  maxParticipants?: number;
  notes?: string;
  publishedAt?: string;
  coach: {
    id: string;
    firstName: string;
    lastName: string;
  };
  participants: Participant[];
  sessions: Session[];
  _count: {
    participants: number;
    sessions: number;
  };
}

const statusConfig = {
  draft: { label: 'Utkast', color: 'var(--text-tertiary)', bg: 'var(--bg-tertiary)' },
  published: { label: 'Publisert', color: 'var(--accent)', bg: 'rgba(var(--accent-rgb), 0.15)' },
  in_progress: { label: 'Pagar', color: 'var(--success)', bg: 'rgba(var(--success-rgb), 0.15)' },
  completed: { label: 'Fullfort', color: 'var(--achievement)', bg: 'rgba(var(--achievement-rgb), 0.15)' },
  cancelled: { label: 'Avlyst', color: 'var(--error)', bg: 'rgba(var(--error-rgb), 0.15)' },
};

const invitationStatusLabels: Record<string, { label: string; color: string }> = {
  invited: { label: 'Invitert', color: 'var(--warning)' },
  confirmed: { label: 'Bekreftet', color: 'var(--success)' },
  declined: { label: 'Avslatt', color: 'var(--error)' },
  tentative: { label: 'Usikker', color: 'var(--text-secondary)' },
};

const tabs = [
  { key: 'info', label: 'Informasjon', icon: Info },
  { key: 'participants', label: 'Deltakere', icon: Users },
  { key: 'sessions', label: 'Treninger', icon: Clock },
  { key: 'calendar', label: 'Kalender', icon: Calendar },
];

const SamlingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [samling, setSamling] = useState<Samling | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [showAddParticipants, setShowAddParticipants] = useState(false);
  const [showAddSession, setShowAddSession] = useState(false);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);

  // Session form state
  const [sessionForm, setSessionForm] = useState({
    title: '',
    sessionDate: '',
    startTime: '09:00',
    duration: 60,
    sessionType: 'teknikk',
    location: '',
    description: '',
  });
  const [creatingSession, setCreatingSession] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSamling();
    }
  }, [id]);

  const fetchSamling = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ success: boolean; data: Samling }>(`/samling/${id}`);
      if (response.data.success) {
        setSamling(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching samling:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailablePlayers = async () => {
    try {
      const response = await api.get<{ success: boolean; data: { athletes: Player[] } }>('/coaches/athletes');
      if (response.data.success) {
        // Filter out players already in the samling
        const existingIds = samling?.participants.map(p => p.playerId) || [];
        setAvailablePlayers(
          response.data.data.athletes.filter(p => !existingIds.includes(p.id))
        );
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const handlePublish = async () => {
    if (!samling) return;

    try {
      setPublishing(true);
      const response = await api.post<{ success: boolean }>(`/samling/${samling.id}/publish`);
      if (response.data.success) {
        fetchSamling();
      }
    } catch (error) {
      console.error('Error publishing samling:', error);
    } finally {
      setPublishing(false);
    }
  };

  const handleAddParticipants = async () => {
    if (selectedPlayerIds.length === 0) return;

    try {
      await api.post(`/samling/${id}/participants`, {
        type: 'individual',
        playerIds: selectedPlayerIds,
      });
      setShowAddParticipants(false);
      setSelectedPlayerIds([]);
      fetchSamling();
    } catch (error) {
      console.error('Error adding participants:', error);
    }
  };

  const handleRemoveParticipant = async (playerId: string) => {
    try {
      await api.delete(`/samling/${id}/participants/${playerId}`);
      fetchSamling();
    } catch (error) {
      console.error('Error removing participant:', error);
    }
  };

  const handleCreateSession = async () => {
    if (!sessionForm.title || !sessionForm.sessionDate || !sessionForm.startTime) return;

    try {
      setCreatingSession(true);
      await api.post(`/samling/${id}/sessions`, {
        title: sessionForm.title,
        sessionDate: sessionForm.sessionDate,
        startTime: sessionForm.startTime,
        duration: sessionForm.duration,
        sessionType: sessionForm.sessionType,
        location: sessionForm.location || undefined,
        description: sessionForm.description || undefined,
      });
      setShowAddSession(false);
      setSessionForm({
        title: '',
        sessionDate: '',
        startTime: '09:00',
        duration: 60,
        sessionType: 'teknikk',
        location: '',
        description: '',
      });
      fetchSamling();
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setCreatingSession(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('no-NO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };

    return `${startDate.toLocaleDateString('no-NO', options)} - ${endDate.toLocaleDateString('no-NO', { ...options, year: 'numeric' })}`;
  };

  if (loading) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Laster samling...
      </div>
    );
  }

  if (!samling) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Samling ikke funnet
      </div>
    );
  }

  const status = statusConfig[samling.status];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => navigate('/coach/samlinger')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            cursor: 'pointer',
            marginBottom: '16px',
          }}
        >
          <ArrowLeft size={18} />
          Tilbake til samlinger
        </button>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '24px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{
                fontSize: '24px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: 0
              }}>
                {samling.name}
              </h1>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: status.color,
                  backgroundColor: status.bg,
                }}
              >
                {status.label}
              </span>
            </div>

            <div style={{
              display: 'flex',
              gap: '20px',
              color: 'var(--text-secondary)',
              fontSize: '14px'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} />
                {formatDateRange(samling.startDate, samling.endDate)}
              </span>
              {samling.venue && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} />
                  {samling.venue}
                </span>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} />
                {samling._count.participants} deltakere
              </span>
            </div>
          </div>

          {samling.status === 'draft' && (
            <button
              onClick={handlePublish}
              disabled={publishing || samling._count.sessions === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: publishing ? 'var(--bg-tertiary)' : 'var(--accent)',
                color: publishing ? 'var(--text-secondary)' : 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: publishing ? 'not-allowed' : 'pointer',
              }}
              title={samling._count.sessions === 0 ? 'Legg til minst en okt for a publisere' : ''}
            >
              <Send size={18} />
              {publishing ? 'Publiserer...' : 'Publiser samling'}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        borderBottom: '1px solid var(--border-secondary)',
        marginBottom: '24px',
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '14px',
                fontWeight: isActive ? 500 : 400,
                cursor: 'pointer',
                marginBottom: '-1px',
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Description */}
          {samling.description && (
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '12px',
              padding: '20px',
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px' }}>
                Beskrivelse
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, whiteSpace: 'pre-wrap' }}>
                {samling.description}
              </p>
            </div>
          )}

          {/* Dates & Location */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
          }}>
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '12px',
              padding: '20px',
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} />
                Datoer
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 4px' }}>
                <strong>Start:</strong> {formatDate(samling.startDate)}
              </p>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                <strong>Slutt:</strong> {formatDate(samling.endDate)}
              </p>
            </div>

            {(samling.venue || samling.address || samling.meetingPoint) && (
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '12px',
                padding: '20px',
              }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} />
                  Lokasjon
                </h3>
                {samling.venue && (
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 4px' }}>
                    <strong>Sted:</strong> {samling.venue}
                  </p>
                )}
                {samling.address && (
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 4px' }}>
                    <strong>Adresse:</strong> {samling.address}
                  </p>
                )}
                {samling.meetingPoint && (
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                    <strong>Motepunkt:</strong> {samling.meetingPoint}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Accommodation & Transport */}
          {(samling.accommodation || samling.transportInfo) && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
            }}>
              {samling.accommodation && (
                <div style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  padding: '20px',
                }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px' }}>
                    Overnatting
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, whiteSpace: 'pre-wrap' }}>
                    {samling.accommodation}
                  </p>
                </div>
              )}
              {samling.transportInfo && (
                <div style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  padding: '20px',
                }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px' }}>
                    Transport
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, whiteSpace: 'pre-wrap' }}>
                    {samling.transportInfo}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {samling.notes && (
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '12px',
              padding: '20px',
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px' }}>
                Notater
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, whiteSpace: 'pre-wrap' }}>
                {samling.notes}
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'participants' && (
        <div>
          {/* Add participants button */}
          {samling.status === 'draft' && (
            <div style={{ marginBottom: '16px' }}>
              <button
                onClick={() => {
                  setShowAddParticipants(true);
                  fetchAvailablePlayers();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                <UserPlus size={18} />
                Legg til deltakere
              </button>
            </div>
          )}

          {/* Participants list */}
          {samling.participants.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '12px',
            }}>
              <Users size={48} style={{ color: 'var(--text-tertiary)', marginBottom: '16px' }} />
              <h3 style={{ color: 'var(--text-primary)', margin: '0 0 8px' }}>
                Ingen deltakere enna
              </h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                Legg til spillere for a invitere dem til samlingen
              </p>
            </div>
          ) : (
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              {samling.participants.map((participant, index) => {
                const invStatus = invitationStatusLabels[participant.invitationStatus] ||
                  { label: participant.invitationStatus, color: 'var(--text-secondary)' };

                return (
                  <div
                    key={participant.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderBottom: index < samling.participants.length - 1 ? '1px solid var(--border-secondary)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '14px',
                      }}>
                        {participant.player.firstName[0]}{participant.player.lastName[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                          {participant.player.firstName} {participant.player.lastName}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          Kategori {participant.player.category}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: invStatus.color,
                        backgroundColor: `${invStatus.color}15`,
                      }}>
                        {invStatus.label}
                      </span>

                      {participant.syncedToTrainingPlan && (
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 500,
                          color: 'var(--success)',
                          backgroundColor: 'rgba(var(--success-rgb), 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}>
                          <CheckCircle size={12} />
                          Synkronisert
                        </span>
                      )}

                      {samling.status === 'draft' && (
                        <button
                          onClick={() => handleRemoveParticipant(participant.playerId)}
                          style={{
                            padding: '6px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: 'var(--error)',
                            cursor: 'pointer',
                            borderRadius: '4px',
                          }}
                          title="Fjern deltaker"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add participants modal */}
          {showAddParticipants && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}>
              <div style={{
                backgroundColor: 'var(--bg-primary)',
                borderRadius: '12px',
                padding: '24px',
                width: '90%',
                maxWidth: '500px',
                maxHeight: '80vh',
                overflow: 'auto',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Legg til deltakere
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddParticipants(false);
                      setSelectedPlayerIds([]);
                    }}
                    style={{
                      padding: '4px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {availablePlayers.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px' }}>
                    Ingen tilgjengelige spillere a legge til
                  </p>
                ) : (
                  <>
                    <div style={{ marginBottom: '16px' }}>
                      {availablePlayers.map((player) => (
                        <label
                          key={player.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            backgroundColor: selectedPlayerIds.includes(player.id)
                              ? 'rgba(var(--accent-rgb), 0.1)'
                              : 'transparent',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedPlayerIds.includes(player.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPlayerIds([...selectedPlayerIds, player.id]);
                              } else {
                                setSelectedPlayerIds(selectedPlayerIds.filter(id => id !== player.id));
                              }
                            }}
                            style={{ width: '18px', height: '18px' }}
                          />
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--accent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '12px',
                          }}>
                            {player.firstName[0]}{player.lastName[0]}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                              {player.firstName} {player.lastName}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              Kategori {player.category}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          setShowAddParticipants(false);
                          setSelectedPlayerIds([]);
                        }}
                        style={{
                          padding: '10px 16px',
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--text-primary)',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          cursor: 'pointer',
                        }}
                      >
                        Avbryt
                      </button>
                      <button
                        onClick={handleAddParticipants}
                        disabled={selectedPlayerIds.length === 0}
                        style={{
                          padding: '10px 16px',
                          backgroundColor: selectedPlayerIds.length === 0 ? 'var(--bg-tertiary)' : 'var(--accent)',
                          color: selectedPlayerIds.length === 0 ? 'var(--text-secondary)' : 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          cursor: selectedPlayerIds.length === 0 ? 'not-allowed' : 'pointer',
                        }}
                      >
                        Legg til {selectedPlayerIds.length > 0 ? `(${selectedPlayerIds.length})` : ''}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'sessions' && (
        <div>
          {/* Add session button */}
          {samling.status === 'draft' && (
            <div style={{ marginBottom: '16px' }}>
              <button
                onClick={() => setShowAddSession(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                <Plus size={18} />
                Legg til okt
              </button>
            </div>
          )}

          {/* Sessions list */}
          {samling.sessions.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '12px',
            }}>
              <Clock size={48} style={{ color: 'var(--text-tertiary)', marginBottom: '16px' }} />
              <h3 style={{ color: 'var(--text-primary)', margin: '0 0 8px' }}>
                Ingen okter enna
              </h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                Legg til treningsokter for samlingen
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {samling.sessions.map((session) => (
                <div
                  key={session.id}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{
                      fontSize: '12px',
                      color: 'var(--text-tertiary)',
                      marginBottom: '4px',
                    }}>
                      {new Date(session.sessionDate).toLocaleDateString('no-NO', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })}
                    </div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      marginBottom: '4px',
                    }}>
                      {session.title}
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        {session.startTime} - {session.endTime || `${session.duration} min`}
                      </span>
                      <span style={{
                        padding: '2px 6px',
                        backgroundColor: 'var(--bg-tertiary)',
                        borderRadius: '4px',
                        fontSize: '11px',
                        textTransform: 'capitalize',
                      }}>
                        {session.sessionType}
                      </span>
                      {session.location && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} />
                          {session.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add session modal */}
          {showAddSession && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}>
              <div style={{
                backgroundColor: 'var(--bg-primary)',
                borderRadius: '12px',
                padding: '24px',
                width: '90%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflow: 'auto',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Legg til treningsokt
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddSession(false);
                      setSessionForm({
                        title: '',
                        sessionDate: '',
                        startTime: '09:00',
                        duration: 60,
                        sessionType: 'teknikk',
                        location: '',
                        description: '',
                      });
                    }}
                    style={{
                      padding: '4px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Title */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Tittel *
                    </label>
                    <input
                      type="text"
                      value={sessionForm.title}
                      onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                      placeholder="F.eks. Putting trening"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-secondary)',
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Dato *
                    </label>
                    <input
                      type="date"
                      value={sessionForm.sessionDate}
                      onChange={(e) => setSessionForm({ ...sessionForm, sessionDate: e.target.value })}
                      min={samling.startDate.split('T')[0]}
                      max={samling.endDate.split('T')[0]}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-secondary)',
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  {/* Time and Duration row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '6px' }}>
                        Starttid *
                      </label>
                      <input
                        type="time"
                        value={sessionForm.startTime}
                        onChange={(e) => setSessionForm({ ...sessionForm, startTime: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-secondary)',
                          backgroundColor: 'var(--bg-secondary)',
                          color: 'var(--text-primary)',
                          fontSize: '14px',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '6px' }}>
                        Varighet (min)
                      </label>
                      <input
                        type="number"
                        value={sessionForm.duration}
                        onChange={(e) => setSessionForm({ ...sessionForm, duration: parseInt(e.target.value) || 60 })}
                        min="15"
                        step="15"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-secondary)',
                          backgroundColor: 'var(--bg-secondary)',
                          color: 'var(--text-primary)',
                          fontSize: '14px',
                        }}
                      />
                    </div>
                  </div>

                  {/* Session Type */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Type okt
                    </label>
                    <select
                      value={sessionForm.sessionType}
                      onChange={(e) => setSessionForm({ ...sessionForm, sessionType: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-secondary)',
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                      }}
                    >
                      <option value="teknikk">Teknikk</option>
                      <option value="putting">Putting</option>
                      <option value="driving">Driving</option>
                      <option value="kort_spill">Kort spill</option>
                      <option value="banespill">Banespill</option>
                      <option value="fysisk">Fysisk trening</option>
                      <option value="mental">Mental trening</option>
                      <option value="video">Videoanalyse</option>
                      <option value="annet">Annet</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Sted (valgfritt)
                    </label>
                    <input
                      type="text"
                      value={sessionForm.location}
                      onChange={(e) => setSessionForm({ ...sessionForm, location: e.target.value })}
                      placeholder="F.eks. Driving range"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-secondary)',
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Beskrivelse (valgfritt)
                    </label>
                    <textarea
                      value={sessionForm.description}
                      onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })}
                      placeholder="Kort beskrivelse av okten..."
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-secondary)',
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                        resize: 'vertical',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button
                    onClick={() => {
                      setShowAddSession(false);
                      setSessionForm({
                        title: '',
                        sessionDate: '',
                        startTime: '09:00',
                        duration: 60,
                        sessionType: 'teknikk',
                        location: '',
                        description: '',
                      });
                    }}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    Avbryt
                  </button>
                  <button
                    onClick={handleCreateSession}
                    disabled={!sessionForm.title || !sessionForm.sessionDate || !sessionForm.startTime || creatingSession}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: (!sessionForm.title || !sessionForm.sessionDate || !sessionForm.startTime || creatingSession)
                        ? 'var(--bg-tertiary)'
                        : 'var(--accent)',
                      color: (!sessionForm.title || !sessionForm.sessionDate || !sessionForm.startTime || creatingSession)
                        ? 'var(--text-secondary)'
                        : 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: (!sessionForm.title || !sessionForm.sessionDate || !sessionForm.startTime || creatingSession)
                        ? 'not-allowed'
                        : 'pointer',
                    }}
                  >
                    {creatingSession ? 'Oppretter...' : 'Legg til okt'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'calendar' && (
        <div style={{
          textAlign: 'center',
          padding: '48px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '12px',
        }}>
          <Calendar size={48} style={{ color: 'var(--text-tertiary)', marginBottom: '16px' }} />
          <h3 style={{ color: 'var(--text-primary)', margin: '0 0 8px' }}>
            Kalendervisning
          </h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Kalendervisning kommer snart
          </p>
        </div>
      )}
    </div>
  );
};

export default SamlingDetail;
