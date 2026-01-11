/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
// @ts-nocheck
/**
 * TIER Golf - Coach Message Compose
 * Design System v3.0 - Premium Light
 *
 * Message composition form for coaches.
 * Supports recipients, categories, attachments, and scheduling.
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */

import React, { useState, useMemo } from 'react';
import {
  Send,
  Users,
  User,
  X,
  Paperclip,
  FileText,
  Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { messagesAPI } from '../../services/api';
import { sanitizeText, sanitizeSearchQuery } from '../../utils/sanitize';
import Button from '../../ui/primitives/Button';
import Card from '../../ui/primitives/Card';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import PageContainer from '../../ui/raw-blocks/PageContainer.raw';

interface Recipient {
  id: string;
  name: string;
  type: 'player' | 'group';
  avatar?: string;
  memberCount?: number;
  category?: string;
}

const mockPlayers: Recipient[] = [
  { id: 'p1', name: 'Emma Larsen', type: 'player', category: 'A' },
  { id: 'p2', name: 'Thomas Berg', type: 'player', category: 'B' },
  { id: 'p3', name: 'Sofie Andersen', type: 'player', category: 'A' },
  { id: 'p4', name: 'Jonas Pedersen', type: 'player', category: 'B' },
  { id: 'p5', name: 'Erik Hansen', type: 'player', category: 'A' },
  { id: 'p6', name: 'Mia Kristiansen', type: 'player', category: 'C' },
  { id: 'p7', name: 'Lars Johansen', type: 'player', category: 'A' },
  { id: 'p8', name: 'Ida Eriksen', type: 'player', category: 'B' },
];

const mockGroups: Recipient[] = [
  { id: 'g1', name: 'WANG Toppidrett', type: 'group', memberCount: 12 },
  { id: 'g2', name: 'Team Junior', type: 'group', memberCount: 8 },
  { id: 'g3', name: 'Turneringsspillere', type: 'group', memberCount: 15 },
  { id: 'g4', name: 'Nybegynnere 2025', type: 'group', memberCount: 6 },
];

export const CoachMessageCompose: React.FC = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);
  const [recipientSearch, setRecipientSearch] = useState('');
  const [showRecipientPicker, setShowRecipientPicker] = useState(false);
  const [sendToAll, setSendToAll] = useState(false);
  const [category, setCategory] = useState<'training' | 'tournament' | 'general' | 'urgent'>('general');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [attachments, setAttachments] = useState<{ name: string; type: string }[]>([]);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const allRecipients = useMemo(() => {
    return [...mockGroups, ...mockPlayers];
  }, []);

  const filteredRecipients = useMemo(() => {
    if (!recipientSearch) return allRecipients;
    const query = sanitizeSearchQuery(recipientSearch.toLowerCase());
    return allRecipients.filter(r => r.name.toLowerCase().includes(query));
  }, [recipientSearch, allRecipients]);

  const addRecipient = (recipient: Recipient) => {
    if (!selectedRecipients.find(r => r.id === recipient.id)) {
      setSelectedRecipients([...selectedRecipients, recipient]);
    }
    setRecipientSearch('');
    setShowRecipientPicker(false);
  };

  const removeRecipient = (recipientId: string) => {
    setSelectedRecipients(selectedRecipients.filter(r => r.id !== recipientId));
  };

  const handleSend = async () => {
    setSending(true);
    setSendError(null);

    // Sanitize user input before sending
    const messageData = {
      recipients: sendToAll ? ['all'] : selectedRecipients.map(r => r.id),
      subject: sanitizeText(subject),
      message: sanitizeText(message),
      category,
      ...(isScheduled && scheduleDate && scheduleTime ? {
        scheduledFor: new Date(`${scheduleDate}T${scheduleTime}`).toISOString()
      } : {}),
    };

    try {
      if (isScheduled) {
        await messagesAPI.schedule(messageData);
      } else {
        await messagesAPI.send(messageData);
      }
      navigate('/coach/messages');
    } catch (err: any) {
      setSendError(err.response?.data?.message || err.message || 'Kunne ikke sende beskjed.');
    } finally {
      setSending(false);
    }
  };

  const canSend = subject.trim() && message.trim() && (sendToAll || selectedRecipients.length > 0);

  return (
    <div className="min-h-screen bg-tier-surface-base">
      {/* TIER-compliant PageHeader */}
      <PageHeader
        title="Ny beskjed"
        subtitle="Send til spillere eller grupper"
        helpText="Send beskjeder til enkeltspillere, grupper eller alle dine spillere. Meldingene havner i spillernes meldingsboks og de får varsling."
        onBack={() => navigate('/coach/messages')}
      />

      <PageContainer paddingY="md" background="base">

      <Card variant="default" padding="none" className="overflow-hidden">
        {/* Recipients Section */}
        <div className="p-4 px-5 border-b border-tier-border-default">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-medium text-tier-text-secondary w-[60px]">
              Til:
            </span>
            <div className="flex-1">
              {sendToAll ? (
                <div className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-tier-success/15 rounded-full text-tier-success text-[13px] font-medium">
                  <Users size={14} />
                  Alle spillere
                  <button
                    onClick={() => setSendToAll(false)}
                    className="bg-transparent border-none cursor-pointer p-0.5 flex"
                  >
                    <X size={14} className="text-tier-success" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 items-center">
                  {selectedRecipients.map(recipient => (
                    <div
                      key={recipient.id}
                      className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-[13px] font-medium ${
                        recipient.type === 'group'
                          ? 'bg-tier-warning/15 text-tier-warning'
                          : 'bg-tier-navy/10 text-tier-navy'
                      }`}
                    >
                      {recipient.type === 'group' ? <Users size={14} /> : <User size={14} />}
                      {recipient.name}
                      {recipient.memberCount && ` (${recipient.memberCount})`}
                      <button
                        onClick={() => removeRecipient(recipient.id)}
                        className="bg-transparent border-none cursor-pointer p-0.5 flex"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Legg til mottaker..."
                      value={recipientSearch}
                      onChange={(e) => {
                        setRecipientSearch(e.target.value);
                        setShowRecipientPicker(true);
                      }}
                      onFocus={() => setShowRecipientPicker(true)}
                      className="border-none bg-transparent text-sm text-tier-navy outline-none w-[180px]"
                    />
                    {showRecipientPicker && (
                      <div className="absolute top-full left-0 w-[280px] max-h-[300px] overflow-y-auto bg-tier-white rounded-lg border border-tier-border-default shadow-lg z-[100] mt-1">
                        <div
                          onClick={() => {
                            setSendToAll(true);
                            setSelectedRecipients([]);
                            setShowRecipientPicker(false);
                          }}
                          className="p-3 px-4 cursor-pointer flex items-center gap-2.5 border-b border-tier-border-default bg-tier-success/15 hover:bg-tier-success/20"
                        >
                          <Users size={16} className="text-tier-success" />
                          <div>
                            <p className="text-sm font-medium text-tier-success m-0">
                              Alle spillere
                            </p>
                            <p className="text-xs text-tier-text-tertiary m-0">
                              Send til alle dine spillere
                            </p>
                          </div>
                        </div>
                        {filteredRecipients.map(recipient => (
                          <div
                            key={recipient.id}
                            onClick={() => addRecipient(recipient)}
                            className="p-3 px-4 cursor-pointer flex items-center gap-2.5 hover:bg-tier-surface-base"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                recipient.type === 'group'
                                  ? 'bg-tier-warning/15'
                                  : 'bg-tier-navy/10'
                              }`}
                            >
                              {recipient.type === 'group'
                                ? <Users size={14} className="text-tier-warning" />
                                : <User size={14} className="text-tier-navy" />
                              }
                            </div>
                            <div>
                              <p className="text-sm font-medium text-tier-navy m-0">
                                {recipient.name}
                              </p>
                              <p className="text-xs text-tier-text-tertiary m-0">
                                {recipient.type === 'group'
                                  ? `${recipient.memberCount} medlemmer`
                                  : `Kategori ${recipient.category}`
                                }
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Category Selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-tier-text-secondary w-[60px]">
              Type:
            </span>
            <div className="flex gap-2">
              {[
                { key: 'general', label: 'Generelt' },
                { key: 'training', label: 'Trening' },
                { key: 'tournament', label: 'Turnering' },
                { key: 'urgent', label: 'Viktig' },
              ].map(cat => {
                const isSelected = category === cat.key;
                return (
                  <Button
                    key={cat.key}
                    variant={isSelected ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setCategory(cat.key as typeof category)}
                  >
                    {cat.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Subject */}
        <div className="p-4 px-5 border-b border-tier-border-default">
          <input
            type="text"
            placeholder="Emne..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border-none bg-transparent text-base font-semibold text-tier-navy outline-none"
          />
        </div>

        {/* Message Body */}
        <div className="p-4 px-5">
          <textarea
            placeholder="Skriv din beskjed her..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full min-h-[200px] border-none bg-transparent text-sm leading-relaxed text-tier-navy outline-none resize-y"
          />
        </div>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="py-3 px-5 border-t border-tier-border-default flex gap-2 flex-wrap">
            {attachments.map((att, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 py-1.5 px-3 bg-tier-surface-base rounded text-[13px] text-tier-text-secondary"
              >
                <FileText size={14} />
                {att.name}
                <button
                  onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                  className="bg-transparent border-none cursor-pointer p-0.5 flex"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 px-5 border-t border-tier-border-default flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Paperclip size={16} />}
              onClick={() => setAttachments([...attachments, { name: 'Dokument.pdf', type: 'pdf' }])}
            >
              Vedlegg
            </Button>
            <Button
              variant={isScheduled ? 'primary' : 'ghost'}
              size="sm"
              leftIcon={<Clock size={16} />}
              onClick={() => setIsScheduled(!isScheduled)}
            >
              Planlegg
            </Button>
          </div>

          <div className="flex gap-3 items-center">
            {isScheduled && (
              <div className="flex gap-2">
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="py-2 px-3 rounded border border-tier-border-default text-[13px] text-tier-navy"
                />
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="py-2 px-3 rounded border border-tier-border-default text-[13px] text-tier-navy"
                />
              </div>
            )}
            <Button
              variant="primary"
              disabled={!canSend}
              leftIcon={isScheduled ? <Clock size={16} /> : <Send size={16} />}
              onClick={handleSend}
            >
              {isScheduled ? 'Planlegg' : 'Send'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Click outside to close picker */}
      {showRecipientPicker && (
        <div
          onClick={() => setShowRecipientPicker(false)}
          className="fixed inset-0 z-50"
        />
      )}
      </PageContainer>
    </div>
  );
};

export default CoachMessageCompose;
