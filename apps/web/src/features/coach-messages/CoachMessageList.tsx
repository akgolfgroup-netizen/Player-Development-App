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
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tokens as designTokens } from '../../design-tokens';
import { messagesAPI } from '../../services/api';

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
      case 'read': return <CheckCheck size={14} color="#16a34a" />;
      case 'delivered': return <Check size={14} color={designTokens.colors.text.tertiary} />;
      default: return <Clock size={14} color={designTokens.colors.text.tertiary} />;
    }
  };

  const getCategoryBadge = (category: string) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      training: { bg: 'rgba(59, 130, 246, 0.1)', text: '#2563eb', label: 'Trening' },
      tournament: { bg: 'rgba(168, 85, 247, 0.1)', text: '#7c3aed', label: 'Turnering' },
      general: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', label: 'Generelt' },
      urgent: { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626', label: 'Viktig' }
    };
    return styles[category] || styles.general;
  };

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: designTokens.colors.background.primary
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48,
            height: 48,
            border: `4px solid ${designTokens.colors.primary[200]}`,
            borderTop: `4px solid ${designTokens.colors.primary[500]}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ fontSize: '15px', color: designTokens.colors.text.secondary }}>
            Laster meldinger...
          </p>
        </div>
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
        backgroundColor: designTokens.colors.background.primary,
        padding: '24px'
      }}>
        <div style={{
          maxWidth: 400,
          textAlign: 'center',
          padding: '32px',
          backgroundColor: designTokens.colors.background.card,
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <AlertCircle size={48} color={designTokens.colors.error[500]} style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: designTokens.colors.text.primary, marginBottom: '8px' }}>
            Kunne ikke laste meldinger
          </h2>
          <p style={{ fontSize: '15px', color: designTokens.colors.text.secondary, marginBottom: '24px' }}>
            {error}
          </p>
          <button
            onClick={fetchMessages}
            style={{
              padding: '12px 24px',
              backgroundColor: designTokens.colors.primary[500],
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 600
            }}
          >
            Prøv igjen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', backgroundColor: designTokens.colors.background.primary, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${designTokens.colors.primary[500]}, ${designTokens.colors.primary[600]})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MessageCircle size={24} color="white" />
            </div>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: designTokens.colors.text.primary,
                margin: 0
              }}>
                Sendte beskjeder
              </h1>
              <p style={{
                fontSize: '14px',
                color: designTokens.colors.text.secondary,
                margin: 0
              }}>
                {stats.total} beskjeder sendt • {stats.read} lest
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/coach/messages/compose')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: designTokens.colors.primary[500],
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <Plus size={18} />
          Ny beskjed
        </button>
      </div>

      {/* Search and Filter */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: designTokens.colors.text.tertiary
            }}
          />
          <input
            type="text"
            placeholder="Søk i beskjeder..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              borderRadius: '10px',
              border: `1px solid ${designTokens.colors.border.light}`,
              backgroundColor: designTokens.colors.background.card,
              fontSize: '14px',
              color: designTokens.colors.text.primary,
              outline: 'none'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { key: 'all', label: 'Alle' },
            { key: 'training', label: 'Trening' },
            { key: 'tournament', label: 'Turnering' },
            { key: 'urgent', label: 'Viktig' }
          ].map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategoryFilter(cat.key)}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: categoryFilter === cat.key
                  ? designTokens.colors.primary[500]
                  : designTokens.colors.background.card,
                color: categoryFilter === cat.key
                  ? 'white'
                  : designTokens.colors.text.secondary,
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredMessages.map((message) => {
          const categoryStyle = getCategoryBadge(message.category);
          return (
            <div
              key={message.id}
              onClick={() => navigate(`/coach/messages/${message.id}`)}
              style={{
                backgroundColor: designTokens.colors.background.card,
                borderRadius: '12px',
                padding: '16px 20px',
                border: `1px solid ${designTokens.colors.border.light}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              {/* Left - Icon */}
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: message.recipients.type === 'player'
                  ? designTokens.colors.primary[100]
                  : message.recipients.type === 'group'
                    ? 'rgba(168, 85, 247, 0.1)'
                    : 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: message.recipients.type === 'player'
                  ? designTokens.colors.primary[600]
                  : message.recipients.type === 'group'
                    ? '#7c3aed'
                    : '#059669',
                flexShrink: 0
              }}>
                {getRecipientIcon(message.recipients.type)}
              </div>

              {/* Center - Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: designTokens.colors.text.primary,
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {message.subject}
                  </h3>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '500',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: categoryStyle.bg,
                    color: categoryStyle.text,
                    flexShrink: 0
                  }}>
                    {categoryStyle.label}
                  </span>
                </div>
                <p style={{
                  fontSize: '13px',
                  color: designTokens.colors.text.secondary,
                  margin: '0 0 6px 0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {message.preview}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {getRecipientIcon(message.recipients.type)}
                    <span style={{ fontSize: '12px', color: designTokens.colors.text.tertiary }}>
                      {message.recipients.name}
                      {message.recipients.count && ` (${message.recipients.count})`}
                    </span>
                  </div>
                  {message.hasAttachment && (
                    <span style={{ fontSize: '12px', color: designTokens.colors.text.tertiary }}>
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
                flexShrink: 0
              }}>
                <span style={{
                  fontSize: '12px',
                  color: designTokens.colors.text.tertiary
                }}>
                  {formatDate(message.sentAt)}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {getStatusIcon(message.status)}
                  <span style={{
                    fontSize: '11px',
                    color: message.status === 'read' ? '#16a34a' : designTokens.colors.text.tertiary
                  }}>
                    {message.status === 'read' ? 'Lest' : message.status === 'delivered' ? 'Levert' : 'Sender...'}
                  </span>
                </div>
              </div>

              <ChevronRight size={18} color={designTokens.colors.text.tertiary} />
            </div>
          );
        })}
      </div>

      {filteredMessages.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: designTokens.colors.background.card,
          borderRadius: '16px',
          border: `1px solid ${designTokens.colors.border.light}`
        }}>
          <Send size={48} color={designTokens.colors.text.tertiary} style={{ marginBottom: '16px' }} />
          <p style={{
            fontSize: '16px',
            color: designTokens.colors.text.secondary,
            margin: 0
          }}>
            Ingen beskjeder funnet
          </p>
        </div>
      )}
    </div>
  );
};

export default CoachMessageList;
