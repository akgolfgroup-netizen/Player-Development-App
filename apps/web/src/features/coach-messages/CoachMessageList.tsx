/**
 * CoachMessageList
 *
 * List of sent messages for coaches.
 * Shows message subject, recipients, status, and category.
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 * (except dynamic icon background colors which require runtime values)
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Send,
  Users,
  User,
  Clock,
  CheckCheck,
  Check,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { messagesAPI } from '../../services/api';
import Button from '../../ui/primitives/Button';
import Card from '../../ui/primitives/Card';
import Badge from '../../ui/primitives/Badge.primitive';
import StateCard from '../../ui/composites/StateCard';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import { SubSectionTitle } from '../../components/typography';

// ============================================================================
// TYPES
// ============================================================================

interface Message {
  id: string;
  subject: string;
  preview: string;
  recipients: {
    type: 'player' | 'group' | 'all';
    name: string;
    count?: number;
  };
  sentAt: string;
  status: 'delivered' | 'read' | 'pending';
  hasAttachment: boolean;
  category: 'training' | 'tournament' | 'general' | 'urgent';
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockMessages: Message[] = [
  {
    id: '1',
    subject: 'Treningsoppdatering - Uke 4',
    preview: 'Hei alle! Denne uken fokuserer vi på putting og korte spill. Møt opp kl 09:00...',
    recipients: { type: 'group', name: 'WANG Toppidrett', count: 12 },
    sentAt: '2025-01-19T14:30:00',
    status: 'read',
    hasAttachment: false,
    category: 'training'
  },
  {
    id: '2',
    subject: 'Turneringsinfo - NM Kvalifisering',
    preview: 'Viktig info om kommende NM-kvalifisering. Påmelding må være inne innen fredag...',
    recipients: { type: 'all', name: 'Alle spillere', count: 28 },
    sentAt: '2025-01-18T10:15:00',
    status: 'delivered',
    hasAttachment: true,
    category: 'tournament'
  },
  {
    id: '3',
    subject: 'Personlig treningsplan',
    preview: 'Hei Emma! Jeg har sett på treningsresultatene dine og laget en ny plan...',
    recipients: { type: 'player', name: 'Emma Larsen' },
    sentAt: '2025-01-17T16:45:00',
    status: 'read',
    hasAttachment: true,
    category: 'training'
  },
  {
    id: '4',
    subject: 'Viktig: Endring av treningstid',
    preview: 'Obs! Morgendagens trening er flyttet til kl 10:00 pga. værmeldingen...',
    recipients: { type: 'group', name: 'Team Junior', count: 8 },
    sentAt: '2025-01-16T20:00:00',
    status: 'read',
    hasAttachment: false,
    category: 'urgent'
  },
  {
    id: '5',
    subject: 'Gratulerer med resultatet!',
    preview: 'Fantastisk innsats i helgens turnering, Thomas! Din utvikling de siste...',
    recipients: { type: 'player', name: 'Thomas Berg' },
    sentAt: '2025-01-15T09:30:00',
    status: 'read',
    hasAttachment: false,
    category: 'general'
  },
  {
    id: '6',
    subject: 'Videoanalyse klar',
    preview: 'Hei Sofie, jeg har lagt til kommentarer på svingvideoen din. Se spesielt...',
    recipients: { type: 'player', name: 'Sofie Andersen' },
    sentAt: '2025-01-14T11:20:00',
    status: 'read',
    hasAttachment: true,
    category: 'training'
  }
];

// ============================================================================
// HELPERS
// ============================================================================

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'I går';
  } else if (diffDays < 7) {
    return date.toLocaleDateString('nb-NO', { weekday: 'short' });
  }
  return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
};

const getRecipientIcon = (type: string) => {
  switch (type) {
    case 'group':
    case 'all':
      return <Users size={14} />;
    default:
      return <User size={14} />;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'read':
      return <CheckCheck size={14} className="text-ak-status-success" />;
    case 'delivered':
      return <Check size={14} className="text-ak-text-tertiary" />;
    default:
      return <Clock size={14} className="text-ak-text-tertiary" />;
  }
};

const getCategoryConfig = (category: string): { label: string; variant: 'accent' | 'warning' | 'neutral' | 'error' } => {
  switch (category) {
    case 'training':
      return { label: 'Trening', variant: 'accent' };
    case 'tournament':
      return { label: 'Turnering', variant: 'warning' };
    case 'urgent':
      return { label: 'Viktig', variant: 'error' };
    default:
      return { label: 'Generelt', variant: 'neutral' };
  }
};

const getRecipientIconBgClass = (type: string): string => {
  switch (type) {
    case 'player':
      return 'bg-ak-brand-primary/15 text-ak-brand-primary';
    case 'group':
      return 'bg-ak-status-warning/15 text-ak-status-warning';
    default:
      return 'bg-ak-status-success/15 text-ak-status-success';
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const CoachMessageList: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await messagesAPI.list({ type: 'sent' });
      setMessages((response.data?.data || response.data || mockMessages) as unknown as Message[]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Kunne ikke laste meldinger';
      setError(errorMessage);
      setMessages(mockMessages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = useMemo(() => {
    let filteredList = [...messages];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredList = filteredList.filter(m =>
        m.subject.toLowerCase().includes(query) ||
        m.preview.toLowerCase().includes(query) ||
        m.recipients.name.toLowerCase().includes(query)
      );
    }

    if (categoryFilter !== 'all') {
      filteredList = filteredList.filter(m => m.category === categoryFilter);
    }

    return filteredList;
  }, [searchQuery, categoryFilter, messages]);

  const stats = useMemo(() => ({
    total: messages.length,
    delivered: messages.filter(m => m.status === 'delivered').length,
    read: messages.filter(m => m.status === 'read').length
  }), [messages]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ak-surface-subtle">
        <StateCard variant="loading" title="Laster meldinger..." />
      </div>
    );
  }

  // Error state
  if (error && messages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ak-surface-subtle p-6">
        <StateCard
          variant="error"
          title="Kunne ikke laste meldinger"
          description={error}
          action={<Button variant="primary" onClick={fetchMessages}>Prøv igjen</Button>}
        />
      </div>
    );
  }

  return (
    <div className="bg-ak-surface-subtle min-h-screen">
      {/* Header */}
      <PageHeader
        title="Sendte beskjeder"
        subtitle={`${stats.total} beskjeder sendt • ${stats.read} lest`}
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus size={18} />}
            onClick={() => navigate('/coach/messages/compose')}
          >
            Ny beskjed
          </Button>
        }
      />

      <div className="px-6 pb-6">
        {/* Search and Filter */}
        <div className="flex gap-4 mb-5 flex-wrap">
          <Card variant="default" padding="sm" className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2">
              <Search size={18} className="text-ak-text-tertiary" />
              <input
                type="text"
                placeholder="Søk i beskjeder..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-none bg-transparent text-sm text-ak-text-primary outline-none"
              />
            </div>
          </Card>
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'Alle' },
              { key: 'training', label: 'Trening' },
              { key: 'tournament', label: 'Turnering' },
              { key: 'urgent', label: 'Viktig' },
            ].map(cat => (
              <Button
                key={cat.key}
                variant={categoryFilter === cat.key ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setCategoryFilter(cat.key)}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Message List */}
        <div className="flex flex-col gap-2">
          {filteredMessages.map((message) => {
            const categoryConfig = getCategoryConfig(message.category);
            return (
              <Card
                key={message.id}
                variant="default"
                padding="md"
                onClick={() => navigate(`/coach/messages/${message.id}`)}
                className="cursor-pointer hover:border-ak-brand-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Left - Icon */}
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${getRecipientIconBgClass(message.recipients.type)}`}
                  >
                    {getRecipientIcon(message.recipients.type)}
                  </div>

                  {/* Center - Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <SubSectionTitle className="text-sm font-semibold text-ak-text-primary m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                        {message.subject}
                      </SubSectionTitle>
                      <Badge variant={categoryConfig.variant} size="sm">
                        {categoryConfig.label}
                      </Badge>
                    </div>
                    <p className="text-[13px] text-ak-text-secondary m-0 mb-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
                      {message.preview}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-ak-text-tertiary">
                        {getRecipientIcon(message.recipients.type)}
                        <span className="text-xs">
                          {message.recipients.name}
                          {message.recipients.count && ` (${message.recipients.count})`}
                        </span>
                      </div>
                      {message.hasAttachment && (
                        <span className="text-xs text-ak-text-tertiary">
                          📎 Vedlegg
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right - Status and time */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-xs text-ak-text-tertiary">
                      {formatDate(message.sentAt)}
                    </span>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(message.status)}
                      <span
                        className={`text-[11px] ${
                          message.status === 'read' ? 'text-ak-status-success' : 'text-ak-text-tertiary'
                        }`}
                      >
                        {message.status === 'read' ? 'Lest' : message.status === 'delivered' ? 'Levert' : 'Sender...'}
                      </span>
                    </div>
                  </div>

                  <ChevronRight size={18} className="text-ak-text-tertiary" />
                </div>
              </Card>
            );
          })}
        </div>

        {filteredMessages.length === 0 && (
          <StateCard
            variant="empty"
            icon={Send}
            title="Ingen beskjeder funnet"
          />
        )}
      </div>
    </div>
  );
};

export default CoachMessageList;
