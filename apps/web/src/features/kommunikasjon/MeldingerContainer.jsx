import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Search, Plus, ChevronRight, Check,
  CheckCheck, Clock, Send, Paperclip, User, Loader2
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { conversationsAPI } from '../../services/api';

// ============================================================================
// MOCK DATA
// ============================================================================

const CONVERSATIONS = [
  {
    id: 'c1',
    contact: {
      name: 'Anders Kristiansen',
      role: 'Hovedtrener',
      avatar: null,
    },
    lastMessage: 'Bra jobba pa treningen i dag! Husk a fokusere pa tempoet til neste gang.',
    timestamp: '2025-01-18T14:30:00',
    unread: 2,
    isOnline: true,
  },
  {
    id: 'c2',
    contact: {
      name: 'Maria Hansen',
      role: 'Kortspill-trener',
      avatar: null,
    },
    lastMessage: 'Kan vi flytte treningstimen pa onsdag til 14:00?',
    timestamp: '2025-01-17T10:15:00',
    unread: 0,
    isOnline: false,
  },
  {
    id: 'c3',
    contact: {
      name: 'Erik Olsen',
      role: 'Fysisk trener',
      avatar: null,
    },
    lastMessage: 'Ny PR i squat! 100 kg!',
    timestamp: '2025-01-15T16:45:00',
    unread: 0,
    isOnline: true,
  },
  {
    id: 'c4',
    contact: {
      name: 'NGF Junior',
      role: 'Administrasjon',
      avatar: null,
    },
    lastMessage: 'Pakmelding til Junior Masters er bekreftet.',
    timestamp: '2025-01-12T09:00:00',
    unread: 0,
    isOnline: false,
  },
];

const MESSAGES = {
  'c1': [
    {
      id: 'm1',
      sender: 'coach',
      text: 'Hei! Hvordan gikk treningen i dag?',
      timestamp: '2025-01-18T13:00:00',
      read: true,
    },
    {
      id: 'm2',
      sender: 'player',
      text: 'Det gikk veldig bra! Tempoet begynner virkelig a sitte na.',
      timestamp: '2025-01-18T13:15:00',
      read: true,
    },
    {
      id: 'm3',
      sender: 'coach',
      text: 'Bra jobba pa treningen i dag! Husk a fokusere pa tempoet til neste gang.',
      timestamp: '2025-01-18T14:30:00',
      read: false,
    },
    {
      id: 'm4',
      sender: 'coach',
      text: 'Jeg har lagt ut noen nye ovelser i treningsplanen din. Ta en titt nar du har tid.',
      timestamp: '2025-01-18T14:32:00',
      read: false,
    },
  ],
};

// ============================================================================
// CONVERSATION CARD
// ============================================================================

const ConversationCard = ({ conversation, selected, onClick }) => {
  const { contact, lastMessage, timestamp, unread, isOnline } = conversation;
  const time = new Date(timestamp);
  const isToday = time.toDateString() === new Date().toDateString();
  const timeStr = isToday
    ? time.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })
    : time.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });

  return (
    <div
      onClick={() => onClick(conversation)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        backgroundColor: selected ? `${'var(--accent)'}10` : 'var(--bg-primary)',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        borderLeft: selected ? `3px solid ${'var(--accent)'}` : '3px solid transparent',
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
      }}
    >
      <div style={{ position: 'relative' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--bg-primary)',
          fontSize: '16px',
          fontWeight: 600,
        }}>
          {contact.name.split(' ').map((n) => n[0]).join('')}
        </div>
        {isOnline && (
          <div style={{
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: 'var(--success)',
            border: '2px solid white',
          }} />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2px',
        }}>
          <h4 style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: 0,
          }}>
            {contact.name}
          </h4>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            {timeStr}
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <p style={{
            fontSize: '13px',
            color: unread > 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: unread > 0 ? 500 : 400,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '200px',
          }}>
            {lastMessage}
          </p>
          {unread > 0 && (
            <div style={{
              minWidth: '20px',
              height: '20px',
              borderRadius: '10px',
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-primary)',
              fontSize: '11px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 6px',
            }}>
              {unread}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MESSAGE BUBBLE
// ============================================================================

const MessageBubble = ({ message, isOwn }) => {
  const time = new Date(message.timestamp);

  return (
    <div style={{
      display: 'flex',
      justifyContent: isOwn ? 'flex-end' : 'flex-start',
      marginBottom: '8px',
    }}>
      <div style={{
        maxWidth: '70%',
        padding: '10px 14px',
        borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        backgroundColor: isOwn ? 'var(--accent)' : 'var(--bg-primary)',
        color: isOwn ? 'var(--bg-primary)' : 'var(--text-primary)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      }}>
        <p style={{
          fontSize: '14px',
          margin: 0,
          lineHeight: 1.4,
        }}>
          {message.text}
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '4px',
          marginTop: '4px',
        }}>
          <span style={{
            fontSize: '10px',
            color: isOwn ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)',
          }}>
            {time.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isOwn && (
            message.read ? (
              <CheckCheck size={12} color="rgba(255,255,255,0.7)" />
            ) : (
              <Check size={12} color="rgba(255,255,255,0.7)" />
            )
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CHAT VIEW
// ============================================================================

const ChatView = ({ conversation, messages, onMessageSent, isLoading }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!newMessage.trim() || !conversation) return;

    setIsSending(true);
    try {
      await conversationsAPI.sendMessage(conversation.id, newMessage.trim());
      setNewMessage('');
      if (onMessageSent) onMessageSent();
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  if (!conversation) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '14px',
      }}>
        <MessageSquare size={48} color={'var(--text-secondary)'} style={{ marginBottom: '12px' }} />
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Velg en samtale for a starte
        </p>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '14px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        backgroundColor: 'var(--bg-primary)',
        borderBottom: `1px solid ${'var(--border-default)'}`,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--bg-primary)',
          fontSize: '14px',
          fontWeight: 600,
        }}>
          {conversation.contact.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <div>
          <h3 style={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: 0,
          }}>
            {conversation.contact.name}
          </h3>
          <p style={{
            fontSize: '12px',
            color: conversation.isOnline ? 'var(--success)' : 'var(--text-secondary)',
            margin: 0,
          }}>
            {conversation.isOnline ? 'Online' : conversation.contact.role}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
      }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <Loader2 size={24} color="var(--accent)" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.sender === 'player'}
            />
          ))
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: 'var(--bg-primary)',
        borderTop: `1px solid ${'var(--border-default)'}`,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <button style={{
          padding: '8px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
        }}>
          <Paperclip size={20} color={'var(--text-secondary)'} />
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Skriv en melding..."
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '20px',
            border: `1px solid ${'var(--border-default)'}`,
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim() || isSending}
          style={{
            padding: '10px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: newMessage.trim() && !isSending ? 'var(--accent)' : 'var(--border-default)',
            cursor: newMessage.trim() && !isSending ? 'pointer' : 'not-allowed',
            opacity: isSending ? 0.7 : 1,
          }}
        >
          <Send size={18} color={newMessage.trim() && !isSending ? 'var(--bg-primary)' : 'var(--text-secondary)'} />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const MeldingerContainer = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Fetch conversations from API
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const response = await conversationsAPI.getAll();
        if (response?.data?.conversations && Array.isArray(response.data.conversations)) {
          // Transform API data to match component format
          const apiConversations = response.data.conversations.map(conv => ({
            id: conv.id,
            contact: {
              id: conv.participants.find(p => p.id !== localStorage.getItem('userId'))?.id,
              name: conv.name || 'Unknown',
              role: conv.participants[0]?.role || 'coach',
              avatar: conv.participants[0]?.avatar,
            },
            lastMessage: conv.lastMessage?.content || '',
            timestamp: conv.lastMessage?.sentAt || conv.updatedAt,
            unread: conv.unreadCount || 0,
            isOnline: false, // WebSocket status would update this
          }));
          setConversations(apiConversations.length > 0 ? apiConversations : CONVERSATIONS);
        } else {
          setConversations(CONVERSATIONS);
        }
      } catch (err) {
        console.warn('Failed to fetch conversations, using mock data:', err);
        setConversations(CONVERSATIONS);
        setMessages(MESSAGES);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      // Check if we already have messages for this conversation
      if (messages[selectedConversation.id]) return;

      setLoadingMessages(true);
      try {
        const response = await conversationsAPI.getById(selectedConversation.id);
        if (response?.data?.messages && Array.isArray(response.data.messages)) {
          const userId = localStorage.getItem('userId');
          const apiMessages = response.data.messages.map(msg => ({
            id: msg.id,
            sender: msg.senderId === userId ? 'player' : 'coach',
            text: msg.content,
            timestamp: msg.createdAt,
            read: msg.readBy?.some(r => r.userId !== msg.senderId),
          }));
          setMessages(prev => ({
            ...prev,
            [selectedConversation.id]: apiMessages,
          }));
        } else if (!messages[selectedConversation.id]) {
          // Use mock data as fallback
          setMessages(prev => ({
            ...prev,
            [selectedConversation.id]: MESSAGES[selectedConversation.id] || [],
          }));
        }
      } catch (err) {
        console.warn('Failed to fetch messages, using mock data:', err);
        if (!messages[selectedConversation.id]) {
          setMessages(prev => ({
            ...prev,
            [selectedConversation.id]: MESSAGES[selectedConversation.id] || [],
          }));
        }
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedConversation, messages]);

  const filteredConversations = conversations.filter((c) =>
    c.contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages = selectedConversation
    ? messages[selectedConversation.id] || []
    : [];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <PageHeader
        title="Meldinger"
        subtitle="Kommuniser med trenere og administrasjon"
      />

      <div style={{
        padding: '24px',
        maxWidth: '1536px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '20px',
        height: 'calc(100vh - 140px)',
      }}>
        {/* Conversations List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {/* Search */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '10px',
            padding: '10px 14px',
          }}>
            <Search size={18} color={'var(--text-secondary)'} />
            <input
              type="text"
              placeholder="Sok i samtaler..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Conversations */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}>
            {filteredConversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                selected={selectedConversation?.id === conversation.id}
                onClick={setSelectedConversation}
              />
            ))}
          </div>
        </div>

        {/* Chat View */}
        <ChatView
          conversation={selectedConversation}
          messages={currentMessages}
          isLoading={loadingMessages}
          onMessageSent={() => {
            // Refresh messages after sending
            setMessages(prev => ({ ...prev }));
          }}
        />
      </div>

      {/* Loading overlay for initial load */}
      {loading && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }}>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            padding: '24px 32px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <Loader2 size={24} color="var(--accent)" style={{ animation: 'spin 1s linear infinite' }} />
            <span>Laster samtaler...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeldingerContainer;
