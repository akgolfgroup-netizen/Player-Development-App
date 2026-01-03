/**
 * AK Golf Academy - New Conversation
 * Design System v3.0 - Premium Light
 *
 * Komponent for å starte en ny samtale.
 * Lar spilleren velge mottaker og skrive første melding.
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 * (except dynamic avatar background colors which require runtime values)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  Search,
  X,
} from 'lucide-react';
import Button from '../../ui/primitives/Button';
import { SectionTitle } from '../../components/typography';

// ============================================================================
// TYPES
// ============================================================================

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

// ============================================================================
// HELPERS
// ============================================================================

const getRoleLabel = (role: string): string => {
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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

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
            avatarColor: 'var(--ak-status-warning)',
          },
          {
            id: '2',
            name: 'Erik Hansen',
            role: 'coach',
            avatarInitials: 'EH',
            avatarColor: 'var(--ak-brand-primary)',
          },
          {
            id: '3',
            name: 'Lars Olsen',
            role: 'player',
            avatarInitials: 'LO',
            avatarColor: 'var(--ak-status-success)',
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

  return (
    <div className="max-w-[600px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/meldinger')}
          className="flex items-center justify-center w-10 h-10 bg-ak-surface-base border border-ak-border-default rounded-lg cursor-pointer hover:bg-ak-surface-subtle transition-colors"
        >
          <ArrowLeft size={20} className="text-ak-text-primary" />
        </button>
        <SectionTitle className="text-[22px] leading-7 font-bold text-ak-text-primary m-0">
          Ny melding
        </SectionTitle>
      </div>

      {/* Contact selection or message composer */}
      {!selectedContact ? (
        <div className="bg-ak-surface-base rounded-xl border border-ak-border-default overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b border-ak-surface-subtle">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ak-text-secondary"
              />
              <input
                type="text"
                placeholder="Søk etter kontakt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2.5 pr-3 pl-10 bg-ak-surface-subtle border-none rounded-lg text-sm text-ak-text-primary outline-none focus:ring-2 focus:ring-ak-brand-primary/30"
              />
            </div>
          </div>

          {/* Contact list */}
          {loading ? (
            <div className="py-8 text-center">
              <div className="w-8 h-8 border-[3px] border-ak-border-default border-t-ak-brand-primary rounded-full mx-auto animate-spin" />
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-[15px] leading-5 text-ak-text-secondary m-0">
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
                className="flex items-center gap-3 w-full py-3.5 px-4 bg-transparent border-none border-b border-ak-surface-subtle cursor-pointer text-left hover:bg-ak-surface-subtle transition-colors"
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: contact.avatarColor }}
                >
                  {contact.avatarInitials}
                </div>
                <div className="flex-1">
                  <p className="text-[17px] leading-[22px] font-semibold text-ak-text-primary m-0 mb-0.5">
                    {contact.name}
                  </p>
                  <p className="text-[13px] leading-[18px] text-ak-text-secondary m-0">
                    {getRoleLabel(contact.role)}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      ) : (
        <div className="bg-ak-surface-base rounded-xl border border-ak-border-default overflow-hidden">
          {/* Selected contact header */}
          <div className="flex items-center gap-3 p-4 border-b border-ak-surface-subtle">
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: selectedContact.avatarColor }}
            >
              {selectedContact.avatarInitials}
            </div>
            <div className="flex-1">
              <p className="text-[17px] leading-[22px] font-semibold text-ak-text-primary m-0 mb-0.5">
                {selectedContact.name}
              </p>
              <p className="text-[13px] leading-[18px] text-ak-text-secondary m-0">
                {getRoleLabel(selectedContact.role)}
              </p>
            </div>
            <button
              onClick={() => setSelectedContact(null)}
              className="flex items-center justify-center w-8 h-8 bg-ak-surface-subtle border-none rounded cursor-pointer hover:bg-ak-border-default transition-colors"
            >
              <X size={16} className="text-ak-text-secondary" />
            </button>
          </div>

          {/* Message composer */}
          <div className="p-4">
            <textarea
              placeholder="Skriv din melding..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full min-h-[120px] p-3 bg-ak-surface-subtle border-none rounded-lg text-sm leading-relaxed resize-y outline-none font-[inherit] text-ak-text-primary focus:ring-2 focus:ring-ak-brand-primary/30"
            />
          </div>

          {/* Send button */}
          <div className="p-4 border-t border-ak-surface-subtle flex justify-end">
            <Button
              variant="primary"
              onClick={handleSend}
              disabled={!message.trim() || sending}
              loading={sending}
              leftIcon={<Send size={16} />}
            >
              {sending ? 'Sender...' : 'Send melding'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
