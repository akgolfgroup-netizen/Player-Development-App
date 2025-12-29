import React, { useState, useMemo, useEffect } from 'react';
import {
  MessageCircle,
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
      setMessages(response.data?.data || response.data || mockMessages);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Kunne ikke laste meldinger');
      // Fallback to mock data
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

  const formatDate = (dateString: string) => {
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
      case 'group': return <Users size={14} />;
      case 'all': return <Users size={14} />;
      default: return <User size={14} />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read': return <CheckCheck size={14} color="var(--success)" />;
      case 'delivered': return <Check size={14} color="var(--text-tertiary)" />;
      default: return <Clock size={14} color="var(--text-tertiary)" />;
    }
  };

  const getCategoryConfig = (category: string): { label: string; variant: 'accent' | 'warning' | 'neutral' | 'error' } => {
    switch (category) {
      case 'training': return { label: 'Trening', variant: 'accent' };
      case 'tournament': return { label: 'Turnering', variant: 'warning' };
      case 'urgent': return { label: 'Viktig', variant: 'error' };
      default: return { label: 'Generelt', variant: 'neutral' };
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
      }}>
        <StateCard variant="loading" title="Laster meldinger..." />
      </div>
    );
  }

  // Error state (with fallback to mock data)
  if (error && messages.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
        padding: '24px',
      }}>
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
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
      {/* Header - using PageHeader from design system */}
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

      <div style={{ padding: '0 24px 24px' }}>

      {/* Search and Filter */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap',
      }}>
        <Card variant="default" padding="sm" style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={18} color="var(--text-tertiary)" />
            <input
              type="text"
              placeholder="Søk i beskjeder..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '14px',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          </div>
        </Card>
        <div style={{ display: 'flex', gap: '8px' }}>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredMessages.map((message) => {
          const categoryConfig = getCategoryConfig(message.category);
          return (
            <Card
              key={message.id}
              variant="default"
              padding="md"
              onClick={() => navigate(`/coach/messages/${message.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Left - Icon */}
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: message.recipients.type === 'player'
                    ? 'var(--bg-accent-subtle)'
                    : message.recipients.type === 'group'
                      ? 'var(--bg-warning-subtle)'
                      : 'var(--bg-success-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: message.recipients.type === 'player'
                    ? 'var(--accent)'
                    : message.recipients.type === 'group'
                      ? 'var(--warning)'
                      : 'var(--success)',
                  flexShrink: 0,
                }}>
                  {getRecipientIcon(message.recipients.type)}
                </div>

                {/* Center - Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {message.subject}
                    </h3>
                    <Badge variant={categoryConfig.variant} size="sm">{categoryConfig.label}</Badge>
                  </div>
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    margin: '0 0 6px 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {message.preview}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-tertiary)' }}>
                      {getRecipientIcon(message.recipients.type)}
                      <span style={{ fontSize: '12px' }}>
                        {message.recipients.name}
                        {message.recipients.count && ` (${message.recipients.count})`}
                      </span>
                    </div>
                    {message.hasAttachment && (
                      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                        📎 Vedlegg
                      </span>
                    )}
                  </div>
                </div>

                {/* Right - Status and time */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '8px',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    {formatDate(message.sentAt)}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {getStatusIcon(message.status)}
                    <span style={{
                      fontSize: '11px',
                      color: message.status === 'read' ? 'var(--success)' : 'var(--text-tertiary)',
                    }}>
                      {message.status === 'read' ? 'Lest' : message.status === 'delivered' ? 'Levert' : 'Sender...'}
                    </span>
                  </div>
                </div>

                <ChevronRight size={18} color="var(--text-tertiary)" />
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
