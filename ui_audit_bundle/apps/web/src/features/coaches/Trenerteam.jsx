import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { PageTitle, SectionTitle, SubSectionTitle, CardTitle } from '../../components/typography';

// =====================================================
// AK GOLF - TRENERTEAM SKJERM
// IUP App - Individuell Utviklingsplan
// Versjon: 3.0
// Design System: Blue Palette 01 v3.0
// =====================================================


// =====================================================
// UI KOMPONENTER
// =====================================================

const Card = ({ children, className = '', onClick }) => (
  <div
    className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    {children}
  </div>
);

const Avatar = ({ name, size = 'md', image, role }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl'
  };

  const roleColors = {
    hovedtrener: 'var(--accent)',
    teknisk: 'var(--accent-light)',
    fysisk: 'var(--success)',
    mental: 'var(--achievement)',
    strategi: 'var(--warning)'
  };

  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const bgColor = roleColors[role] || 'var(--accent)';

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white`}
      style={{ backgroundColor: bgColor }}
    >
      {image ? (
        <img src={image} alt={name} className="w-full h-full rounded-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
};

const Badge = ({ children, variant = 'neutral' }) => {
  const variants = {
    neutral: { bg: 'var(--border-default)', color: 'var(--text-primary)' },
    accent: { bg: 'rgba(var(--accent-rgb), 0.08)', color: 'var(--accent)' },
    success: { bg: 'rgba(var(--success-rgb), 0.08)', color: 'var(--success)' },
    warning: { bg: 'rgba(var(--warning-rgb), 0.08)', color: 'var(--warning)' },
    achievement: { bg: 'rgba(var(--achievement-rgb), 0.08)', color: 'var(--achievement)' }
  };

  const style = variants[variant] || variants.neutral;

  return (
    <span
      className="px-2 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {children}
    </span>
  );
};

const Button = ({ children, variant = 'primary', size = 'md', onClick, icon }) => {
  const variants = {
    primary: { bg: 'var(--accent)', color: 'white' },
    secondary: { bg: 'var(--bg-secondary)', color: 'var(--accent)' },
    outline: { bg: 'transparent', color: 'var(--accent)', border: `1px solid ${'var(--accent)'}` },
    ghost: { bg: 'transparent', color: 'var(--text-secondary)' }
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const style = variants[variant];

  return (
    <button
      onClick={onClick}
      className={`${sizes[size]} rounded-xl font-medium flex items-center gap-2 transition-all hover:opacity-90`}
      style={{ backgroundColor: style.bg, color: style.color, border: style.border }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
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
      className={`p-4 transition-all ${isSelected ? 'ring-2' : 'hover:shadow-md'}`}
      onClick={() => onSelect(trainer.id)}
      style={{
        ringColor: isSelected ? 'var(--accent)' : 'transparent',
        borderColor: isSelected ? 'var(--accent)' : undefined
      }}
    >
      <div className="flex items-start gap-4">
        <Avatar name={trainer.name} size="lg" role={trainer.role} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <SubSectionTitle className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
                {trainer.name}
              </SubSectionTitle>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {roleLabels[trainer.role]}
              </p>
            </div>

            {trainer.isPrimary && (
              <Badge variant="achievement">Primær</Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {trainer.specializations.map((spec, idx) => (
              <Badge key={idx} variant="accent">{spec}</Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
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
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 text-center border-b" style={{ borderColor: 'var(--border-default)' }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-2xl"
            style={{ color: 'var(--text-secondary)' }}
          >
            ×
          </button>

          <Avatar name={trainer.name} size="xl" role={trainer.role} />

          <SectionTitle className="font-bold text-xl mt-4" style={{ color: 'var(--text-primary)' }}>
            {trainer.name}
          </SectionTitle>
          <p style={{ color: 'var(--text-secondary)' }}>{roleLabels[trainer.role]}</p>

          {trainer.isPrimary && (
            <Badge variant="achievement" className="mt-2">Primær kontakt</Badge>
          )}
        </div>

        {/* Info */}
        <div className="p-6 space-y-6">
          {/* Kontakt */}
          <div>
            <CardTitle className="font-medium text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
              Kontaktinfo
            </CardTitle>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <span>📧</span>
                <a href={`mailto:${trainer.email}`} style={{ color: 'var(--accent)' }}>
                  {trainer.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span>📱</span>
                <a href={`tel:${trainer.phone}`} style={{ color: 'var(--accent)' }}>
                  {trainer.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Spesialiseringer */}
          <div>
            <CardTitle className="font-medium text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
              Spesialiseringer
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              {trainer.specializations.map((spec, idx) => (
                <Badge key={idx} variant="accent">{spec}</Badge>
              ))}
            </div>
          </div>

          {/* Sertifiseringer */}
          <div>
            <CardTitle className="font-medium text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
              Sertifiseringer
            </CardTitle>
            <div className="space-y-2">
              {trainer.certifications.map((cert, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--success)' }}>✓</span>
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <CardTitle className="font-medium text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
              Om treneren
            </CardTitle>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {trainer.bio}
            </p>
          </div>

          {/* Statistikk */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="font-bold text-lg" style={{ color: 'var(--accent)' }}>
                {trainer.sessionsTotal}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Økter totalt</div>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="font-bold text-lg" style={{ color: 'var(--accent)' }}>
                {trainer.sessionsMonth}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Denne måned</div>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="font-bold text-lg" style={{ color: 'var(--accent)' }}>
                {trainer.startYear}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Siden år</div>
            </div>
          </div>

          {/* Handlinger */}
          <div className="flex gap-3 pt-2">
            <Button variant="primary" onClick={onMessage} className="flex-1">
              <span>💬</span> Send melding
            </Button>
            <Button variant="outline" onClick={onSchedule} className="flex-1">
              <span>📅</span> Book time
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const UpcomingSession = ({ session }) => {
  const typeColors = {
    teknisk: 'var(--accent-light)',
    fysisk: 'var(--success)',
    mental: 'var(--achievement)',
    strategi: 'var(--warning)',
    evaluering: 'var(--accent)'
  };

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-xl"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div
        className="w-1 h-12 rounded-full"
        style={{ backgroundColor: typeColors[session.type] || 'var(--accent)' }}
      />

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <CardTitle className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
            {session.title}
          </CardTitle>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {session.duration} min
          </span>
        </div>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
          med {session.trainer}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs" style={{ color: 'var(--accent)' }}>
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
    className="flex items-start gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-all"
    onClick={onView}
  >
    <Avatar name={message.from} size="sm" role={message.role} />

    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <CardTitle className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>
          {message.from}
        </CardTitle>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {message.time}
        </span>
      </div>
      <p
        className="text-xs truncate mt-0.5"
        style={{ color: message.unread ? 'var(--text-primary)' : 'var(--text-secondary)' }}
      >
        {message.preview}
      </p>
    </div>

    {message.unread && (
      <div
        className="w-2 h-2 rounded-full mt-2"
        style={{ backgroundColor: 'var(--accent)' }}
      />
    )}
  </div>
);

// =====================================================
// HOVEDKOMPONENT
// =====================================================

const Trenerteam = ({ trainers: apiTrainers = null, sessions: apiSessions = null, messages: apiMessages = null }) => {
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [activeTab, setActiveTab] = useState('team'); // team, schedule, messages

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

  // Use API data if available, otherwise use default
  const trainers = apiTrainers || defaultTrainers;

  // Default sessions data (fallback if no API data)
  const defaultSessions = [
    {
      id: 1,
      title: 'Driving Range - Langspill',
      trainer: 'Magnus Andersen',
      type: 'teknisk',
      date: 'Mandag 16. des',
      time: '14:00',
      duration: 60
    },
    {
      id: 2,
      title: 'Putting Lab',
      trainer: 'Line Eriksen',
      type: 'teknisk',
      date: 'Onsdag 18. des',
      time: '10:00',
      duration: 45
    },
    {
      id: 3,
      title: 'Styrketrening',
      trainer: 'Erik Haugen',
      type: 'fysisk',
      date: 'Torsdag 19. des',
      time: '08:00',
      duration: 60
    },
    {
      id: 4,
      title: 'Mental forberedelse - Turnering',
      trainer: 'Kristin Berg',
      type: 'mental',
      date: 'Fredag 20. des',
      time: '16:00',
      duration: 30
    }
  ];

  // Use API data if available, otherwise use default
  const upcomingSessions = apiSessions || defaultSessions;

  // Default messages data (fallback if no API data)
  const defaultMessages = [
    {
      id: 1,
      from: 'Magnus Andersen',
      role: 'hovedtrener',
      preview: 'Flott økt i dag! Husk å jobbe med...',
      time: 'I dag',
      unread: true
    },
    {
      id: 2,
      from: 'Line Eriksen',
      role: 'teknisk',
      preview: 'Analyse fra putting-økten er klar',
      time: 'I går',
      unread: true
    },
    {
      id: 3,
      from: 'Erik Haugen',
      role: 'fysisk',
      preview: 'Nytt treningsprogram lagt til i appen',
      time: 'Tir',
      unread: false
    }
  ];

  // Use API data if available, otherwise use default
  const messages = apiMessages || defaultMessages;

  const selectedTrainerData = trainers.find(t => t.id === selectedTrainer);

  const handleSelectTrainer = (id) => {
    setSelectedTrainer(id);
    setShowDetail(true);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      {/* Header */}
      <PageHeader
        title="Mitt Trenerteam"
        subtitle={`${trainers.length} trenere tilknyttet`}
      />

      {/* Tabs */}
      <div style={{ padding: '16px 24px 0', width: '100%' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {[
            { id: 'team', label: 'Team', icon: '👥' },
            { id: 'schedule', label: 'Økter', icon: '📅' },
            { id: 'messages', label: 'Meldinger', icon: '💬' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? 'var(--accent)' : 'var(--bg-primary)',
                color: activeTab === tab.id ? 'var(--bg-primary)' : 'var(--text-primary)',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.id === 'messages' && messages.filter(m => m.unread).length > 0 && (
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    backgroundColor: 'var(--error)',
                  }}
                >
                  {messages.filter(m => m.unread).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 24px 24px', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Team Tab */}
        {activeTab === 'team' && (
          <>
            {/* Primær trener highlight */}
            <Card className="p-4" style={{ backgroundColor: 'rgba(var(--achievement-rgb), 0.06)', borderColor: 'var(--achievement)' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-lg">⭐</span>
                <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                  Din primære kontakt
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Avatar
                  name={trainers[0].name}
                  size="lg"
                  role={trainers[0].role}
                />
                <div className="flex-1">
                  <SubSectionTitle className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {trainers[0].name}
                  </SubSectionTitle>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Hovedtrener • {trainers[0].sessionsTotal} økter sammen
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSelectTrainer(trainers[0].id)}
                >
                  Kontakt
                </Button>
              </div>
            </Card>

            {/* Alle trenere */}
            <div>
              <SubSectionTitle className="font-semibold text-sm mb-3 px-1" style={{ color: 'var(--text-primary)' }}>
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
              <SubSectionTitle className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
                Team-statistikk
              </SubSectionTitle>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                    {trainers.reduce((sum, t) => sum + t.sessionsTotal, 0)}
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Økter totalt
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                    {trainers.reduce((sum, t) => sum + t.sessionsMonth, 0)}
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Denne måned
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                    {trainers.length}
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Spesialister
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <>
            <div className="flex items-center justify-between mb-2">
              <SubSectionTitle className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
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
              <SubSectionTitle className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
                Book ny økt
              </SubSectionTitle>
              <div className="grid grid-cols-2 gap-3">
                {trainers.map(trainer => (
                  <button
                    key={trainer.id}
                    className="flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:shadow-md"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <Avatar name={trainer.name} size="sm" role={trainer.role} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {trainer.name.split(' ')[0]}
                      </div>
                      <div className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>
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
              <SubSectionTitle className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                Meldinger
              </SubSectionTitle>
              <Button variant="primary" size="sm" icon="✏️">
                Ny melding
              </Button>
            </div>

            <Card className="divide-y" style={{ borderColor: 'var(--border-default)' }}>
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
                <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
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
