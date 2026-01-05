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
} from 'lucide-react';
import { PageTitle, SectionTitle } from '../../../components/typography';
import { messages, scheduledMessages, type Message } from '../../../lib/coachMockData';
import { messageCategories } from '../../../config/coach-navigation';

type TabType = 'sent' | 'scheduled';
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

// Category badge
function CategoryBadge({ category }: { category: Message['category'] }) {
  const config = messageCategories.find(c => c.id === category);
  const colorClasses = {
    training: 'bg-green-100 text-green-800',
    tournament: 'bg-purple-100 text-purple-800',
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
  onClick,
}: {
  message: Message;
  isScheduled?: boolean;
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

  return (
    <div
      onClick={onClick}
      className="p-4 bg-ak-surface-card rounded-xl border border-ak-border-default cursor-pointer hover:border-ak-primary transition-colors"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <RecipientIcon type={message.recipientType} />
          <span className="font-medium text-ak-text-primary">{message.recipientName}</span>
          {message.hasAttachment && (
            <Paperclip size={14} className="text-ak-text-tertiary" />
          )}
        </div>
        <CategoryBadge category={message.category} />
      </div>

      {/* Subject */}
      <h3 className="font-semibold text-ak-text-primary mb-1 truncate">
        {message.subject}
      </h3>

      {/* Preview */}
      <p className="text-sm text-ak-text-secondary mb-3 line-clamp-2">
        {message.preview}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-ak-text-tertiary">
        <div className="flex items-center gap-2">
          <StatusIcon status={message.status} />
          <span>
            {isScheduled
              ? `Planlagt: ${formatDate(message.scheduledFor!)}`
              : formatDate(message.sentAt)}
          </span>
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
  const [activeTab, setActiveTab] = useState<TabType>('sent');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  // Filter messages
  const filteredMessages = useMemo(() => {
    let result = activeTab === 'sent' ? [...messages] : [...scheduledMessages];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        m =>
          m.subject.toLowerCase().includes(search) ||
          m.preview.toLowerCase().includes(search) ||
          m.recipientName.toLowerCase().includes(search)
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
      <div className="flex gap-2 mb-6">
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
            {activeTab === 'scheduled' ? 'Ingen planlagte meldinger' : 'Ingen meldinger'}
          </h3>
          <p className="text-ak-text-secondary mb-4">
            {activeTab === 'scheduled'
              ? 'Du har ingen planlagte meldinger.'
              : searchTerm
              ? 'Prøv et annet søkeord.'
              : 'Kom i gang ved å sende din første melding.'}
          </p>
          <Link
            to="/coach/messages/compose"
            className="inline-flex items-center gap-2 px-4 py-2 bg-ak-primary text-white rounded-lg font-medium hover:bg-ak-primary/90 transition-colors"
          >
            <Send size={16} />
            Skriv ny melding
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map(message => (
            <MessageCard
              key={message.id}
              message={message}
              isScheduled={activeTab === 'scheduled'}
              onClick={() => handleMessageClick(message)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
