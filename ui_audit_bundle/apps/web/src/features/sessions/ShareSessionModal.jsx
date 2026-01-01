/**
 * ShareSessionModal - Del økt med andre spillere
 *
 * Based on: APP_FUNCTIONALITY.md Section 12
 * Design Source: /packages/design-system/figma/ak_golf_complete_figma_kit.svg
 *
 * Features:
 * - Friend search/selection
 * - Optional message to recipients
 * - Share as template option (editable by recipient)
 * - Share results option (include your training data)
 * - Multi-recipient support
 */

import React, { useState, useMemo } from 'react';
import Button from '../../ui/primitives/Button';
import { SectionTitle } from '../../components/typography';

const colors = {
  // Brand Colors
  forest: 'var(--accent)',
  forestLight: 'var(--accent-light)',
  foam: 'var(--bg-secondary)',
  ivory: 'var(--bg-tertiary)',
  gold: 'var(--achievement)',

  // Semantic Colors
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--error)',

  // Neutrals
  charcoal: 'var(--text-primary)',
  steel: 'var(--text-secondary)',
  mist: 'var(--border-default)',
  cloud: 'var(--bg-tertiary)',
  white: 'var(--bg-primary)',
};

// ============================================================================
// Friend/Player Card Component
// ============================================================================
const FriendCard = ({ friend, selected, onToggle }) => {
  const categoryColors = {
    'A': colors.gold,
    'B': colors.forestLight,
    'C': colors.success,
    'Junior': colors.warning,
  };

  return (
    <button
      onClick={() => onToggle(friend.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        background: selected ? `${colors.forest}10` : colors.white,
        border: `1px solid ${selected ? colors.forest : colors.mist}`,
        borderRadius: '8px',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        transition: 'all 150ms ease',
      }}
    >
      {/* Checkbox */}
      <div
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '4px',
          border: `2px solid ${selected ? colors.forest : colors.steel}`,
          background: selected ? colors.forest : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {selected && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={colors.white} strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>

      {/* Avatar */}
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: colors.foam,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '16px' }}>👤</span>
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '15px',
            fontWeight: '600',
            color: colors.charcoal,
            lineHeight: '20px',
          }}
        >
          {friend.name}
        </div>
        <div
          style={{
            fontSize: '13px',
            color: colors.steel,
            lineHeight: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span
            style={{
              color: categoryColors[friend.category] || colors.steel,
              fontWeight: '500',
            }}
          >
            {friend.category}-kategori
          </span>
          <span>•</span>
          <span>{friend.club}</span>
        </div>
      </div>
    </button>
  );
};

// ============================================================================
// Session Preview Component
// ============================================================================
const SessionPreview = ({ session }) => {
  return (
    <div
      style={{
        padding: '16px',
        background: colors.foam,
        borderRadius: '8px',
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          fontSize: '17px',
          fontWeight: '600',
          color: colors.charcoal,
          marginBottom: '4px',
        }}
      >
        {session.title}
      </div>
      <div
        style={{
          fontSize: '14px',
          color: colors.steel,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>{session.date}</span>
        <span>•</span>
        <span>{session.duration} min</span>
        <span>•</span>
        <span>{session.blockCount} blokker</span>
      </div>
    </div>
  );
};

// ============================================================================
// Checkbox Option Component
// ============================================================================
const CheckboxOption = ({ checked, onChange, label, description }) => {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        cursor: 'pointer',
        padding: '8px 0',
      }}
    >
      <div
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '4px',
          border: `2px solid ${checked ? colors.forest : colors.steel}`,
          background: checked ? colors.forest : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '2px',
        }}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={colors.white} strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <div>
        <div
          style={{
            fontSize: '15px',
            fontWeight: '500',
            color: colors.charcoal,
            lineHeight: '20px',
          }}
        >
          {label}
        </div>
        {description && (
          <div
            style={{
              fontSize: '13px',
              color: colors.steel,
              lineHeight: '18px',
            }}
          >
            {description}
          </div>
        )}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ display: 'none' }}
      />
    </label>
  );
};

// ============================================================================
// Main ShareSessionModal Component
// ============================================================================
const ShareSessionModal = ({
  isOpen,
  onClose,
  onShare,
  session = null,
}) => {
  // State
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [shareAsTemplate, setShareAsTemplate] = useState(true);
  const [includeResults, setIncludeResults] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Demo data - replace with API call
  const friends = [
    { id: '1', name: 'Ole Hansen', category: 'B', club: 'Samme klubb' },
    { id: '2', name: 'Kari Nordmann', category: 'B', club: 'Annen klubb' },
    { id: '3', name: 'Erik Svendsen', category: 'C', club: 'Samme klubb' },
    { id: '4', name: 'Lisa Pettersen', category: 'A', club: 'Annen klubb' },
    { id: '5', name: 'Magnus Carlsen', category: 'A', club: 'Samme klubb' },
    { id: '6', name: 'Ingrid Olsen', category: 'Junior', club: 'Annen klubb' },
  ];

  // Demo session data
  const demoSession = session || {
    id: 'session-1',
    title: 'Langspill fokus',
    date: 'Mandag 16. desember',
    duration: 120,
    blockCount: 4,
    blocks: [
      { name: 'Pyramiden', duration: 30 },
      { name: 'Scattered', duration: 30 },
      { name: '9-holes putting', duration: 30 },
      { name: 'Fysisk mobilitet', duration: 30 },
    ],
  };

  // Filter friends by search
  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return friends;
    const query = searchQuery.toLowerCase();
    return friends.filter(
      friend =>
        friend.name.toLowerCase().includes(query) ||
        friend.club.toLowerCase().includes(query) ||
        friend.category.toLowerCase().includes(query)
    );
  }, [friends, searchQuery]);

  // Toggle friend selection
  const toggleFriend = (friendId) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  // Handle share
  const handleShare = async () => {
    if (selectedFriends.length === 0) return;

    setIsSharing(true);

    const shareData = {
      sessionId: demoSession.id,
      recipientIds: selectedFriends,
      message: message.trim(),
      shareAsTemplate,
      includeResults,
      sharedAt: new Date().toISOString(),
    };

    try {
      if (onShare) {
        await onShare(shareData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to share session:', error);
    } finally {
      setIsSharing(false);
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 1000,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: colors.white,
          borderRadius: '16px',
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: `1px solid ${colors.mist}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <SectionTitle>
            Del økt
          </SectionTitle>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              background: colors.cloud,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.steel} strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
          }}
        >
          {/* Session Preview */}
          <SessionPreview session={demoSession} />

          {/* Search */}
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: colors.steel,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Velg mottakere
            </label>
            <div
              style={{
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '16px',
                }}
              >
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Søk etter spiller..."
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 12px 0 40px',
                  border: `1px solid ${colors.mist}`,
                  borderRadius: '8px',
                  fontSize: '15px',
                  color: colors.charcoal,
                  background: colors.white,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Friends List */}
          <div
            style={{
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: colors.steel,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '12px',
              }}
            >
              Mine venner
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '200px',
                overflowY: 'auto',
              }}
            >
              {filteredFriends.map(friend => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                  selected={selectedFriends.includes(friend.id)}
                  onToggle={toggleFriend}
                />
              ))}
              {filteredFriends.length === 0 && (
                <div
                  style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: colors.steel,
                    fontSize: '14px',
                  }}
                >
                  Ingen venner funnet
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: colors.steel,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Beskrivelse (valgfritt)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Skriv en melding til mottakerne..."
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${colors.mist}`,
                borderRadius: '8px',
                fontSize: '15px',
                color: colors.charcoal,
                background: colors.white,
                outline: 'none',
                resize: 'vertical',
                minHeight: '80px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Share Options */}
          <div
            style={{
              padding: '16px',
              background: colors.foam,
              borderRadius: '8px',
            }}
          >
            <div
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: colors.steel,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '12px',
              }}
            >
              Delingsalternativer
            </div>
            <CheckboxOption
              checked={shareAsTemplate}
              onChange={(e) => setShareAsTemplate(e.target.checked)}
              label="Del som mal"
              description="Mottaker kan redigere økten"
            />
            <CheckboxOption
              checked={includeResults}
              onChange={(e) => setIncludeResults(e.target.checked)}
              label="Del resultat"
              description="Inkluder dine data fra økten"
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: `1px solid ${colors.mist}`,
            background: colors.white,
          }}
        >
          <Button
            variant="primary"
            onClick={handleShare}
            disabled={selectedFriends.length === 0 || isSharing}
            loading={isSharing}
            style={{ width: '100%', height: '48px', fontSize: '17px', fontWeight: 600 }}
          >
            {isSharing
              ? 'Deler...'
              : selectedFriends.length === 0
              ? 'Velg mottakere'
              : `Del med ${selectedFriends.length} spiller${selectedFriends.length > 1 ? 'e' : ''}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ReceivedSessionModal - For displaying received shared sessions
// ============================================================================
export const ReceivedSessionModal = ({
  isOpen,
  onClose,
  onAccept,
  onDecline,
  sharedSession = null,
}) => {
  // Demo data
  const demoSharedSession = sharedSession || {
    id: 'shared-1',
    sender: {
      name: 'Per Olsen',
      avatar: null,
    },
    sharedAt: '16. desember 2025, 14:32',
    message: 'Hei! Her er økten jeg brukte i dag. Fungerte veldig bra for innspill. Anbefaler å starte med pyramiden for å varme opp teknikken.',
    session: {
      title: 'Langspill fokus',
      duration: 120,
      blockCount: 4,
      blocks: [
        { name: 'Pyramiden', duration: 30 },
        { name: 'Scattered', duration: 30 },
        { name: '9-holes putting', duration: 30 },
        { name: 'Fysisk mobilitet', duration: 30 },
      ],
    },
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 1000,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: colors.white,
          borderRadius: '16px',
          width: '100%',
          maxWidth: '420px',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: `1px solid ${colors.mist}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px' }}>📩</span>
            <SectionTitle>
              Ny delt økt
            </SectionTitle>
          </div>
          <div style={{ fontSize: '14px', color: colors.steel }}>
            Fra: <span style={{ fontWeight: '500', color: colors.charcoal }}>{demoSharedSession.sender.name}</span>
          </div>
          <div style={{ fontSize: '13px', color: colors.steel }}>
            Delt: {demoSharedSession.sharedAt}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          {/* Session Info */}
          <div
            style={{
              padding: '16px',
              background: colors.foam,
              borderRadius: '8px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                fontSize: '17px',
                fontWeight: '600',
                color: colors.charcoal,
                marginBottom: '4px',
              }}
            >
              {demoSharedSession.session.title}
            </div>
            <div
              style={{
                fontSize: '14px',
                color: colors.steel,
                marginBottom: '12px',
              }}
            >
              {demoSharedSession.session.duration} min • {demoSharedSession.session.blockCount} blokker
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {demoSharedSession.session.blocks.map((block, index) => (
                <div
                  key={index}
                  style={{
                    fontSize: '14px',
                    color: colors.charcoal,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ color: colors.steel }}>•</span>
                  <span>Blokk {index + 1}: {block.name} ({block.duration} min)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Message */}
          {demoSharedSession.message && (
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: colors.steel,
                  marginBottom: '8px',
                }}
              >
                Melding fra {demoSharedSession.sender.name}:
              </div>
              <div
                style={{
                  padding: '12px',
                  background: colors.cloud,
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: colors.charcoal,
                  lineHeight: '20px',
                  fontStyle: 'italic',
                }}
              >
                "{demoSharedSession.message}"
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Button
              variant="primary"
              onClick={() => onAccept && onAccept(demoSharedSession)}
              style={{ width: '100%', height: '48px', fontSize: '17px', fontWeight: 600 }}
            >
              Legg til i mine økter
            </Button>
            <Button
              variant="secondary"
              onClick={onClose}
              style={{ width: '100%', height: '44px', fontSize: '15px', fontWeight: 600 }}
            >
              Se detaljer
            </Button>
            <Button
              variant="ghost"
              onClick={() => onDecline && onDecline(demoSharedSession)}
              style={{ width: '100%', height: '40px', fontSize: '14px', color: colors.steel }}
            >
              Avvis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareSessionModal;
