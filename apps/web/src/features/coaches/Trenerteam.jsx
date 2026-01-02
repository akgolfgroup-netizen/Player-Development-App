/**
 * AK Golf Academy - Trenerteam Screen
 * Design System v3.0 - Premium Light
 *
 * IUP App - Individuell Utviklingsplan
 * Shows the player's coaching team with contact info,
 * upcoming sessions, and messaging.
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */

import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { SectionTitle, SubSectionTitle, CardTitle } from '../../components/typography';
import Button from '../../ui/primitives/Button';
import Card from '../../ui/primitives/Card';
import Badge from '../../ui/primitives/Badge.primitive';

// =====================================================
// UI KOMPONENTER
// =====================================================

const Avatar = ({ name, size = 'md', role }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl'
  };

  const getRoleClasses = (roleType) => {
    switch (roleType) {
      case 'hovedtrener': return 'bg-ak-brand-primary';
      case 'teknisk': return 'bg-ak-brand-primary/80';
      case 'fysisk': return 'bg-ak-status-success';
      case 'mental': return 'bg-amber-500';
      case 'strategi': return 'bg-ak-status-warning';
      default: return 'bg-ak-brand-primary';
    }
  };

  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className={`${sizes[size]} ${getRoleClasses(role)} rounded-full flex items-center justify-center font-semibold text-white`}>
      {initials}
    </div>
  );
};

// =====================================================
// SPESIALISERTE KOMPONENTER
// =====================================================

const TrainerCard = ({ trainer, isSelected, onSelect }) => {
  const roleLabels = {
    hovedtrener: 'Hovedtrener',
    teknisk: 'Teknisk Trener',
    fysisk: 'Fysisk Trener',
    mental: 'Mental Trener',
    strategi: 'Strategisk Rådgiver'
  };

  return (
    <Card
      className={`p-4 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-ak-brand-primary border-ak-brand-primary' : 'hover:shadow-md'}`}
      onClick={() => onSelect(trainer.id)}
    >
      <div className="flex items-start gap-4">
        <Avatar name={trainer.name} size="lg" role={trainer.role} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <SubSectionTitle className="font-semibold text-base text-ak-text-primary m-0">
                {trainer.name}
              </SubSectionTitle>
              <p className="text-sm text-ak-text-secondary m-0">
                {roleLabels[trainer.role]}
              </p>
            </div>

            {trainer.isPrimary && (
              <Badge variant="warning">Primær</Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {trainer.specializations.map((spec, idx) => (
              <Badge key={idx} variant="primary">{spec}</Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-ak-text-secondary">
            <span className="flex items-center gap-1">
              <span>📅</span>
              <span>Siden {trainer.startYear}</span>
            </span>
            <span className="flex items-center gap-1">
              <span>📊</span>
              <span>{trainer.sessionsTotal} økter</span>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

const TrainerDetail = ({ trainer, onClose, onMessage, onSchedule }) => {
  const roleLabels = {
    hovedtrener: 'Hovedtrener',
    teknisk: 'Teknisk Trener',
    fysisk: 'Fysisk Trener',
    mental: 'Mental Trener',
    strategi: 'Strategisk Rådgiver'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="p-6 text-center border-b border-ak-border-default">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-2xl text-ak-text-secondary bg-transparent border-none cursor-pointer"
          >
            ×
          </button>

          <Avatar name={trainer.name} size="xl" role={trainer.role} />

          <SectionTitle className="font-bold text-xl mt-4 text-ak-text-primary m-0">
            {trainer.name}
          </SectionTitle>
          <p className="text-ak-text-secondary m-0">{roleLabels[trainer.role]}</p>

          {trainer.isPrimary && (
            <Badge variant="warning" className="mt-2">Primær kontakt</Badge>
          )}
        </div>

        {/* Info */}
        <div className="p-6 space-y-6">
          {/* Kontakt */}
          <div>
            <CardTitle className="font-medium text-sm mb-3 text-ak-text-primary m-0">
              Kontaktinfo
            </CardTitle>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <span>📧</span>
                <a href={`mailto:${trainer.email}`} className="text-ak-brand-primary">
                  {trainer.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span>📱</span>
                <a href={`tel:${trainer.phone}`} className="text-ak-brand-primary">
                  {trainer.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Spesialiseringer */}
          <div>
            <CardTitle className="font-medium text-sm mb-3 text-ak-text-primary m-0">
              Spesialiseringer
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              {trainer.specializations.map((spec, idx) => (
                <Badge key={idx} variant="primary">{spec}</Badge>
              ))}
            </div>
          </div>

          {/* Sertifiseringer */}
          <div>
            <CardTitle className="font-medium text-sm mb-3 text-ak-text-primary m-0">
              Sertifiseringer
            </CardTitle>
            <div className="space-y-2">
              {trainer.certifications.map((cert, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-ak-text-secondary">
                  <span className="text-ak-status-success">✓</span>
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <CardTitle className="font-medium text-sm mb-3 text-ak-text-primary m-0">
              Om treneren
            </CardTitle>
            <p className="text-sm leading-relaxed text-ak-text-secondary m-0">
              {trainer.bio}
            </p>
          </div>

          {/* Statistikk */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl bg-ak-surface-subtle">
              <div className="font-bold text-lg text-ak-brand-primary">
                {trainer.sessionsTotal}
              </div>
              <div className="text-xs text-ak-text-secondary">Økter totalt</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-ak-surface-subtle">
              <div className="font-bold text-lg text-ak-brand-primary">
                {trainer.sessionsMonth}
              </div>
              <div className="text-xs text-ak-text-secondary">Denne måned</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-ak-surface-subtle">
              <div className="font-bold text-lg text-ak-brand-primary">
                {trainer.startYear}
              </div>
              <div className="text-xs text-ak-text-secondary">Siden år</div>
            </div>
          </div>

          {/* Handlinger */}
          <div className="flex gap-3 pt-2">
            <Button variant="primary" onClick={onMessage} className="flex-1">
              <span>💬</span> Send melding
            </Button>
            <Button variant="secondary" onClick={onSchedule} className="flex-1">
              <span>📅</span> Book time
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const UpcomingSession = ({ session }) => {
  const getTypeClasses = (type) => {
    switch (type) {
      case 'teknisk': return 'bg-ak-brand-primary/80';
      case 'fysisk': return 'bg-ak-status-success';
      case 'mental': return 'bg-amber-500';
      case 'strategi': return 'bg-ak-status-warning';
      case 'evaluering': return 'bg-ak-brand-primary';
      default: return 'bg-ak-brand-primary';
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-ak-surface-subtle">
      <div className={`w-1 h-12 rounded-full ${getTypeClasses(session.type)}`} />

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <CardTitle className="font-medium text-sm text-ak-text-primary m-0">
            {session.title}
          </CardTitle>
          <span className="text-xs text-ak-text-secondary">
            {session.duration} min
          </span>
        </div>
        <p className="text-xs mt-1 text-ak-text-secondary m-0">
          med {session.trainer}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-ak-brand-primary">
            {session.date} • {session.time}
          </span>
        </div>
      </div>

      <Button variant="ghost" size="sm">→</Button>
    </div>
  );
};

const MessagePreview = ({ message, onView }) => (
  <div
    className="flex items-start gap-3 p-3 rounded-xl cursor-pointer hover:bg-ak-surface-subtle transition-all"
    onClick={onView}
  >
    <Avatar name={message.from} size="sm" role={message.role} />

    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <CardTitle className="font-medium text-sm truncate text-ak-text-primary m-0">
          {message.from}
        </CardTitle>
        <span className="text-xs text-ak-text-secondary">
          {message.time}
        </span>
      </div>
      <p className={`text-xs truncate mt-0.5 m-0 ${message.unread ? 'text-ak-text-primary' : 'text-ak-text-secondary'}`}>
        {message.preview}
      </p>
    </div>

    {message.unread && (
      <div className="w-2 h-2 rounded-full mt-2 bg-ak-brand-primary" />
    )}
  </div>
);

// =====================================================
// HOVEDKOMPONENT
// =====================================================

const Trenerteam = ({ trainers: apiTrainers = null, sessions: apiSessions = null, messages: apiMessages = null }) => {
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [activeTab, setActiveTab] = useState('team');

  // Default trainers data (fallback if no API data)
  const defaultTrainers = [
    {
      id: 1,
      name: 'Magnus Andersen',
      role: 'hovedtrener',
      isPrimary: true,
      email: 'magnus@akgolf.no',
      phone: '+47 900 12 345',
      specializations: ['Langspill', 'Strategi', 'Turnering'],
      certifications: ['PGA Coach Level 3', 'Team Norway Sertifisert', 'TPI Level 2'],
      startYear: 2022,
      sessionsTotal: 156,
      sessionsMonth: 8,
      bio: 'Magnus har vært profesjonell golftrener i over 15 år og har trent flere spillere til Team Norway. Spesialisert på langspill og turneringsforberedelse.'
    },
    {
      id: 2,
      name: 'Line Eriksen',
      role: 'teknisk',
      isPrimary: false,
      email: 'line@akgolf.no',
      phone: '+47 900 23 456',
      specializations: ['Shortgame', 'Putting', 'Innspill'],
      certifications: ['PGA Coach Level 2', 'Trackman Certified', 'SAM PuttLab'],
      startYear: 2023,
      sessionsTotal: 67,
      sessionsMonth: 6,
      bio: 'Line er ekspert på shortgame og putting-analyse. Bruker Trackman og SAM PuttLab for detaljert analyse og forbedring.'
    },
    {
      id: 3,
      name: 'Erik Haugen',
      role: 'fysisk',
      isPrimary: false,
      email: 'erik@akgolf.no',
      phone: '+47 900 34 567',
      specializations: ['Styrke', 'Mobilitet', 'Rotasjonskraft'],
      certifications: ['TPI Level 3', 'NSCA-CSCS', 'Fysioterapeut'],
      startYear: 2023,
      sessionsTotal: 45,
      sessionsMonth: 4,
      bio: 'Erik kombinerer fysioterapi-bakgrunn med golfspesifikk trening. Fokus på å bygge en sterk og mobil kropp for optimal sving.'
    },
    {
      id: 4,
      name: 'Kristin Berg',
      role: 'mental',
      isPrimary: false,
      email: 'kristin@akgolf.no',
      phone: '+47 900 45 678',
      specializations: ['Mental styrke', 'Fokus', 'Turneringspress'],
      certifications: ['Idrettspsykolog', 'Mental Trener NGF', 'Mindfulness Instructor'],
      startYear: 2024,
      sessionsTotal: 23,
      sessionsMonth: 3,
      bio: 'Kristin er utdannet idrettspsykolog og jobber med mental forberedelse, fokusteknikker og håndtering av konkurransepress.'
    }
  ];

  const trainers = apiTrainers || defaultTrainers;

  const defaultSessions = [
    { id: 1, title: 'Driving Range - Langspill', trainer: 'Magnus Andersen', type: 'teknisk', date: 'Mandag 16. des', time: '14:00', duration: 60 },
    { id: 2, title: 'Putting Lab', trainer: 'Line Eriksen', type: 'teknisk', date: 'Onsdag 18. des', time: '10:00', duration: 45 },
    { id: 3, title: 'Styrketrening', trainer: 'Erik Haugen', type: 'fysisk', date: 'Torsdag 19. des', time: '08:00', duration: 60 },
    { id: 4, title: 'Mental forberedelse - Turnering', trainer: 'Kristin Berg', type: 'mental', date: 'Fredag 20. des', time: '16:00', duration: 30 }
  ];

  const upcomingSessions = apiSessions || defaultSessions;

  const defaultMessages = [
    { id: 1, from: 'Magnus Andersen', role: 'hovedtrener', preview: 'Flott økt i dag! Husk å jobbe med...', time: 'I dag', unread: true },
    { id: 2, from: 'Line Eriksen', role: 'teknisk', preview: 'Analyse fra putting-økten er klar', time: 'I går', unread: true },
    { id: 3, from: 'Erik Haugen', role: 'fysisk', preview: 'Nytt treningsprogram lagt til i appen', time: 'Tir', unread: false }
  ];

  const messages = apiMessages || defaultMessages;
  const selectedTrainerData = trainers.find(t => t.id === selectedTrainer);

  const handleSelectTrainer = (id) => {
    setSelectedTrainer(id);
    setShowDetail(true);
  };

  const tabs = [
    { id: 'team', label: 'Team', icon: '👥' },
    { id: 'schedule', label: 'Økter', icon: '📅' },
    { id: 'messages', label: 'Meldinger', icon: '💬' }
  ];

  return (
    <div className="min-h-screen bg-ak-surface-subtle">
      {/* Header */}
      <PageHeader
        title="Mitt Trenerteam"
        subtitle={`${trainers.length} trenere tilknyttet`}
      />

      {/* Tabs */}
      <div className="px-6 pt-4">
        <div className="flex gap-2 mb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 border-none cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? 'bg-ak-brand-primary text-white'
                  : 'bg-ak-surface-base text-ak-text-primary'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.id === 'messages' && messages.filter(m => m.unread).length > 0 && (
                <span className="w-5 h-5 rounded-full text-[11px] flex items-center justify-center text-white bg-ak-status-error">
                  {messages.filter(m => m.unread).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        <div className="flex flex-col gap-4">
          {/* Team Tab */}
          {activeTab === 'team' && (
            <>
              {/* Primær trener highlight */}
              <Card className="p-4 bg-amber-500/[0.06] border-amber-500">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-lg">⭐</span>
                  <span className="font-medium text-sm text-ak-text-primary">
                    Din primære kontakt
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar name={trainers[0].name} size="lg" role={trainers[0].role} />
                  <div className="flex-1">
                    <SubSectionTitle className="font-semibold text-ak-text-primary m-0">
                      {trainers[0].name}
                    </SubSectionTitle>
                    <p className="text-sm text-ak-text-secondary m-0">
                      Hovedtrener • {trainers[0].sessionsTotal} økter sammen
                    </p>
                  </div>
                  <Button variant="primary" size="sm" onClick={() => handleSelectTrainer(trainers[0].id)}>
                    Kontakt
                  </Button>
                </div>
              </Card>

              {/* Alle trenere */}
              <div>
                <SubSectionTitle className="font-semibold text-sm mb-3 px-1 text-ak-text-primary m-0">
                  Hele teamet
                </SubSectionTitle>
                <div className="space-y-3">
                  {trainers.map(trainer => (
                    <TrainerCard
                      key={trainer.id}
                      trainer={trainer}
                      isSelected={selectedTrainer === trainer.id}
                      onSelect={handleSelectTrainer}
                    />
                  ))}
                </div>
              </div>

              {/* Team statistikk */}
              <Card className="p-4">
                <SubSectionTitle className="font-semibold text-sm mb-4 text-ak-text-primary m-0">
                  Team-statistikk
                </SubSectionTitle>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-ak-brand-primary">
                      {trainers.reduce((sum, t) => sum + t.sessionsTotal, 0)}
                    </div>
                    <div className="text-xs mt-1 text-ak-text-secondary">Økter totalt</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-ak-brand-primary">
                      {trainers.reduce((sum, t) => sum + t.sessionsMonth, 0)}
                    </div>
                    <div className="text-xs mt-1 text-ak-text-secondary">Denne måned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-ak-brand-primary">
                      {trainers.length}
                    </div>
                    <div className="text-xs mt-1 text-ak-text-secondary">Spesialister</div>
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <>
              <div className="flex items-center justify-between mb-2">
                <SubSectionTitle className="font-semibold text-sm text-ak-text-primary m-0">
                  Kommende økter med trenere
                </SubSectionTitle>
                <Button variant="ghost" size="sm">Se alle</Button>
              </div>

              <div className="space-y-3">
                {upcomingSessions.map(session => (
                  <UpcomingSession key={session.id} session={session} />
                ))}
              </div>

              {/* Book ny økt */}
              <Card className="p-4 mt-4">
                <SubSectionTitle className="font-semibold text-sm mb-3 text-ak-text-primary m-0">
                  Book ny økt
                </SubSectionTitle>
                <div className="grid grid-cols-2 gap-3">
                  {trainers.map(trainer => (
                    <button
                      key={trainer.id}
                      className="flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:shadow-md bg-ak-surface-subtle border-none cursor-pointer"
                    >
                      <Avatar name={trainer.name} size="sm" role={trainer.role} />
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate text-ak-text-primary">
                          {trainer.name.split(' ')[0]}
                        </div>
                        <div className="text-xs capitalize text-ak-text-secondary">
                          {trainer.role}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <>
              <div className="flex items-center justify-between mb-2">
                <SubSectionTitle className="font-semibold text-sm text-ak-text-primary m-0">
                  Meldinger
                </SubSectionTitle>
                <Button variant="primary" size="sm">
                  ✏️ Ny melding
                </Button>
              </div>

              <Card className="divide-y divide-ak-border-default">
                {messages.map(message => (
                  <MessagePreview
                    key={message.id}
                    message={message}
                    onView={() => {}}
                  />
                ))}
              </Card>

              {messages.length === 0 && (
                <div className="text-center py-12">
                  <span className="text-4xl">💬</span>
                  <p className="mt-4 text-sm text-ak-text-secondary">
                    Ingen meldinger ennå
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Trainer Detail Modal */}
      {showDetail && selectedTrainerData && (
        <TrainerDetail
          trainer={selectedTrainerData}
          onClose={() => setShowDetail(false)}
          onMessage={() => {
            setShowDetail(false);
            setActiveTab('messages');
          }}
          onSchedule={() => {
            setShowDetail(false);
            setActiveTab('schedule');
          }}
        />
      )}
    </div>
  );
};

export default Trenerteam;
