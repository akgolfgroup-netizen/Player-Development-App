/**
 * AK Golf Academy - New Conversation
 * Design System v3.0 - Blue Palette 01
 *
 * Komponent for å starte en ny samtale.
 * Lar spilleren velge mottaker og skrive første melding.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  Search,
  X,
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  role: 'coach' | 'player' | 'parent';
  avatarInitials: string;
  avatarColor: string;
}

interface NewConversationProps {
  userId?: string;
}

export default function NewConversation({ userId }: NewConversationProps) {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Fetch available contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/v1/messages/contacts');
        if (response.ok) {
          const data = await response.json();
          setContacts(data.contacts || []);
        }
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
        // Mock data for development
        setContacts([
          {
            id: '1',
            name: 'Anders Kristiansen',
            role: 'coach',
            avatarInitials: 'AK',
            avatarColor: 'var(--achievement)',
          },
          {
            id: '2',
            name: 'Erik Hansen',
            role: 'coach',
            avatarInitials: 'EH',
            avatarColor: 'var(--accent)',
          },
          {
            id: '3',
            name: 'Lars Olsen',
            role: 'player',
            avatarInitials: 'LO',
            avatarColor: 'var(--success)',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Filter contacts by search
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Send message
  const handleSend = async () => {
    if (!selectedContact || !message.trim()) return;

    setSending(true);
    try {
      const response = await fetch('/api/v1/messages/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: selectedContact.id,
          message: message.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/meldinger/${data.conversationId}`);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // For development, navigate to messages
      navigate('/meldinger');
    } finally {
      setSending(false);
    }
  };

  // Get role label
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'coach':
        return 'Trener';
      case 'player':
        return 'Spiller';
      case 'parent':
        return 'Foresatt';
      default:
        return '';
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <button
          onClick={() => navigate('/meldinger')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            backgroundColor: 'var(--bg-primary)',
            border: `1px solid ${'var(--border-default)'}`,
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={20} color={'var(--text-primary)'} />
        </button>
        <h1
          style={{
            fontSize: '22px', lineHeight: '28px', fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          Ny melding
        </h1>
      </div>

      {/* Contact selection or message composer */}
      {!selectedContact ? (
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            border: `1px solid ${'var(--border-default)'}`,
            overflow: 'hidden',
          }}
        >
          {/* Search */}
          <div
            style={{
              padding: '16px',
              borderBottom: `1px solid ${'var(--bg-tertiary)'}`,
            }}
          >
            <div style={{ position: 'relative' }}>
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
                placeholder="Søk etter kontakt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Contact list */}
          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center' }}>
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
          ) : filteredContacts.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <p
                style={{
                  fontSize: '15px', lineHeight: '20px',
                  color: 'var(--text-secondary)',
                  margin: 0,
                }}
              >
                {searchQuery
                  ? 'Ingen kontakter funnet'
                  : 'Ingen tilgjengelige kontakter'}
              </p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: `1px solid ${'var(--bg-tertiary)'}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: contact.avatarColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--bg-primary)',
                    fontWeight: 700,
                    fontSize: '14px',
                    flexShrink: 0,
                  }}
                >
                  {contact.avatarInitials}
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: '17px', lineHeight: '22px', fontWeight: 600,
                      color: 'var(--text-primary)',
                      margin: '0 0 2px',
                    }}
                  >
                    {contact.name}
                  </p>
                  <p
                    style={{
                      fontSize: '13px', lineHeight: '18px',
                      color: 'var(--text-secondary)',
                      margin: 0,
                    }}
                  >
                    {getRoleLabel(contact.role)}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            border: `1px solid ${'var(--border-default)'}`,
            overflow: 'hidden',
          }}
        >
          {/* Selected contact header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              borderBottom: `1px solid ${'var(--bg-tertiary)'}`,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                backgroundColor: selectedContact.avatarColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--bg-primary)',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              {selectedContact.avatarInitials}
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: '17px', lineHeight: '22px', fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: '0 0 2px',
                }}
              >
                {selectedContact.name}
              </p>
              <p
                style={{
                  fontSize: '13px', lineHeight: '18px',
                  color: 'var(--text-secondary)',
                  margin: 0,
                }}
              >
                {getRoleLabel(selectedContact.role)}
              </p>
            </div>
            <button
              onClick={() => setSelectedContact(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                backgroundColor: 'var(--bg-tertiary)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              <X size={16} color={'var(--text-secondary)'} />
            </button>
          </div>

          {/* Message composer */}
          <div style={{ padding: '16px' }}>
            <textarea
              placeholder="Skriv din melding..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '12px',
                backgroundColor: 'var(--bg-tertiary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                lineHeight: '1.5',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Send button */}
          <div
            style={{
              padding: '16px',
              borderTop: `1px solid ${'var(--bg-tertiary)'}`,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <button
              onClick={handleSend}
              disabled={!message.trim() || sending}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: message.trim()
                  ? 'var(--accent)'
                  : 'var(--border-default)',
                color: 'var(--bg-primary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: message.trim() ? 'pointer' : 'not-allowed',
                opacity: sending ? 0.7 : 1,
              }}
            >
              <Send size={16} />
              {sending ? 'Sender...' : 'Send melding'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
