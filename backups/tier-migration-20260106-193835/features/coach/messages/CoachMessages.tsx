/**
 * CoachMessages - Messages Hub Page
 *
 * Purpose: Coach outbound messaging.
 *
 * Features:
 * - Sent list with preview, search
 * - Categories: training, tournament, important, general
 * - Status: pending/delivered/read
 * - Compose flow (send now or schedule)
 * - Scheduled messages page
 */

import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Send,
  Clock,
  Mail,
  Users,
  User,
  Paperclip,
  Check,
  CheckCheck,
  Filter,
  Plus,
  Inbox,
  MailOpen,
} from 'lucide-react';
import { PageTitle, SectionTitle } from '../../../components/typography';
import { messages, scheduledMessages, inboxMessages, type Message } from '../../../lib/coachMockData';
import { messageCategories } from '../../../config/coach-navigation';

type TabType = 'inbox' | 'new' | 'sent' | 'scheduled';
type CategoryFilter = 'all' | Message['category'];

// Status icon
function StatusIcon({ status }: { status: Message['status'] }) {
  switch (status) {
    case 'delivered':
      return <Check size={14} className="text-green-600" />;
    case 'read':
      return <CheckCheck size={14} className="text-blue-600" />;
    default:
      return <Clock size={14} className="text-yellow-600" />;
  }
}

// Recipient icon
function RecipientIcon({ type }: { type: Message['recipientType'] }) {
  switch (type) {
    case 'group':
      return <Users size={14} className="text-ak-text-secondary" />;
    case 'all':
      return <Users size={14} className="text-ak-primary" />;
    default:
      return <User size={14} className="text-ak-text-secondary" />;
  }
}

// Message icon with colored background based on category
function MessageIcon({ category, type, isInbox }: {
  category: Message['category'];
  type: Message['recipientType'];
  isInbox?: boolean;
}) {
  // Color scheme based on category
  const categoryColors = {
    training: 'bg-blue-100 text-blue-600',      // Blue/teal for training
    tournament: 'bg-orange-100 text-orange-600', // Orange for tournament
    important: 'bg-red-100 text-red-600',        // Red for important
    general: 'bg-gray-100 text-gray-600',        // Gray for general
  };

  const bgColor = categoryColors[category];

  // Select appropriate icon
  const Icon = isInbox ? User : (type === 'group' || type === 'all' ? Users : User);

  return (
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${bgColor}`}>
      <Icon size={18} />
    </div>
  );
}

// Category badge
function CategoryBadge({ category }: { category: Message['category'] }) {
  const config = messageCategories.find(c => c.id === category);
  const colorClasses = {
    training: 'bg-blue-100 text-blue-800',      // Match icon colors
    tournament: 'bg-orange-100 text-orange-800',
    important: 'bg-red-100 text-red-800',
    general: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colorClasses[category]}`}>
      {config?.labelNO || category}
    </span>
  );
}

// Message card
function MessageCard({
  message,
  isScheduled = false,
  isInbox = false,
  onClick,
}: {
  message: Message;
  isScheduled?: boolean;
  isInbox?: boolean;
  onClick: () => void;
}) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const displayName = isInbox ? message.senderName : message.recipientName;
  const isUnread = isInbox && !message.isRead;

  return (
    <div
      onClick={onClick}
      className={`p-4 bg-ak-surface-card rounded-xl border cursor-pointer hover:border-ak-primary transition-colors ${
        isUnread ? 'border-ak-primary/30 bg-ak-primary/5' : 'border-ak-border-default'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* Header with icon */}
      <div className="flex items-start gap-3 mb-3">
        <MessageIcon
          category={message.category}
          type={message.recipientType}
          isInbox={isInbox}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className={`font-medium ${isUnread ? 'text-ak-text-primary font-semibold' : 'text-ak-text-primary'}`}>
                {displayName}
              </span>
              {message.hasAttachment && (
                <Paperclip size={14} className="text-ak-text-tertiary" />
              )}
              {isUnread && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-ak-primary text-white">
                  Ny
                </span>
              )}
            </div>
            <CategoryBadge category={message.category} />
          </div>

          {/* Subject */}
          <h3 className={`text-ak-text-primary mb-1 truncate ${isUnread ? 'font-bold' : 'font-semibold'}`}>
            {message.subject}
          </h3>

          {/* Preview */}
          <p className="text-sm text-ak-text-secondary mb-2 line-clamp-2">
            {message.preview}
          </p>

          {/* Footer */}
          <div className="flex items-center gap-2 text-xs text-ak-text-tertiary">
            {!isInbox && <StatusIcon status={message.status} />}
            <span>
              {isScheduled
                ? `Planlagt: ${formatDate(message.scheduledFor!)}`
                : formatDate(message.sentAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab button
function TabButton({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 font-medium rounded-lg transition-colors flex items-center gap-2 ${
        active
          ? 'bg-ak-primary text-white'
          : 'bg-ak-surface-subtle text-ak-text-secondary hover:text-ak-text-primary'
      }`}
    >
      {children}
      {count !== undefined && (
        <span className={`text-xs ${active ? 'opacity-80' : 'text-ak-text-tertiary'}`}>
          ({count})
        </span>
      )}
    </button>
  );
}

// Filter chip
function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
        active
          ? 'bg-ak-text-primary text-white'
          : 'bg-ak-surface-subtle text-ak-text-secondary hover:bg-ak-border-default'
      }`}
    >
      {children}
    </button>
  );
}

export default function CoachMessages() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('inbox');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  // Filter messages
  const filteredMessages = useMemo(() => {
    let result: Message[] = [];

    // Select messages based on active tab
    if (activeTab === 'inbox') {
      result = [...inboxMessages];
    } else if (activeTab === 'new') {
      result = inboxMessages.filter(m => !m.isRead);
    } else if (activeTab === 'sent') {
      result = [...messages];
    } else if (activeTab === 'scheduled') {
      result = [...scheduledMessages];
    }

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        m =>
          m.subject.toLowerCase().includes(search) ||
          m.preview.toLowerCase().includes(search) ||
          (m.recipientName && m.recipientName.toLowerCase().includes(search)) ||
          (m.senderName && m.senderName.toLowerCase().includes(search))
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(m => m.category === categoryFilter);
    }

    // Sort by date (newest first)
    return result.sort((a, b) => {
      const dateA = new Date(a.scheduledFor || a.sentAt);
      const dateB = new Date(b.scheduledFor || b.sentAt);
      return dateB.getTime() - dateA.getTime();
    });
  }, [activeTab, searchTerm, categoryFilter]);

  const handleMessageClick = (message: Message) => {
    navigate(`/coach/messages/${message.id}`);
  };

  // Calculate unread count for "Ny meldinger"
  const unreadCount = inboxMessages.filter(m => !m.isRead).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <PageTitle>Meldinger</PageTitle>
          <p className="text-ak-text-secondary mt-1">
            Send og administrer meldinger til spillere og grupper
          </p>
        </div>

        <Link
          to="/coach/messages/compose"
          className="flex items-center gap-2 px-4 py-2.5 bg-ak-primary text-white rounded-lg font-medium hover:bg-ak-primary/90 transition-colors"
        >
          <Plus size={18} />
          Ny melding
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <TabButton
          active={activeTab === 'inbox'}
          onClick={() => setActiveTab('inbox')}
          count={inboxMessages.length}
        >
          <Inbox size={18} />
          Innboks
        </TabButton>
        <TabButton
          active={activeTab === 'new'}
          onClick={() => setActiveTab('new')}
          count={unreadCount}
        >
          <MailOpen size={18} />
          Ny meldinger
        </TabButton>
        <TabButton
          active={activeTab === 'sent'}
          onClick={() => setActiveTab('sent')}
          count={messages.length}
        >
          <Mail size={18} />
          Sendt
        </TabButton>
        <TabButton
          active={activeTab === 'scheduled'}
          onClick={() => setActiveTab('scheduled')}
          count={scheduledMessages.length}
        >
          <Clock size={18} />
          Planlagt
        </TabButton>
      </div>

      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="flex items-center gap-3 px-4 py-3 bg-ak-surface-card rounded-xl border border-ak-border-default">
          <Search size={20} className="text-ak-text-secondary" />
          <input
            type="text"
            placeholder="Søk i meldinger..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-ak-text-primary placeholder:text-ak-text-tertiary"
          />
        </div>

        {/* Category filters */}
        <div className="flex gap-2 flex-wrap">
          <FilterChip
            active={categoryFilter === 'all'}
            onClick={() => setCategoryFilter('all')}
          >
            Alle
          </FilterChip>
          {messageCategories.map(cat => (
            <FilterChip
              key={cat.id}
              active={categoryFilter === cat.id}
              onClick={() => setCategoryFilter(cat.id as CategoryFilter)}
            >
              {cat.icon} {cat.labelNO}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* Messages list */}
      {filteredMessages.length === 0 ? (
        <div className="text-center py-16 bg-ak-surface-card rounded-xl border border-ak-border-default">
          <Mail size={48} className="mx-auto text-ak-text-tertiary mb-4" />
          <h3 className="text-lg font-semibold text-ak-text-primary mb-2">
            {activeTab === 'inbox'
              ? 'Ingen meldinger i innboksen'
              : activeTab === 'new'
              ? 'Ingen nye meldinger'
              : activeTab === 'scheduled'
              ? 'Ingen planlagte meldinger'
              : 'Ingen meldinger'}
          </h3>
          <p className="text-ak-text-secondary mb-4">
            {activeTab === 'inbox'
              ? 'Du har ingen meldinger i innboksen.'
              : activeTab === 'new'
              ? 'Du har ingen uleste meldinger.'
              : activeTab === 'scheduled'
              ? 'Du har ingen planlagte meldinger.'
              : searchTerm
              ? 'Prøv et annet søkeord.'
              : 'Kom i gang ved å sende din første melding.'}
          </p>
          {activeTab === 'sent' && (
            <Link
              to="/coach/messages/compose"
              className="inline-flex items-center gap-2 px-4 py-2 bg-ak-primary text-white rounded-lg font-medium hover:bg-ak-primary/90 transition-colors"
            >
              <Send size={16} />
              Skriv ny melding
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map(message => (
            <MessageCard
              key={message.id}
              message={message}
              isScheduled={activeTab === 'scheduled'}
              isInbox={activeTab === 'inbox' || activeTab === 'new'}
              onClick={() => handleMessageClick(message)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
