import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Calendar, Tag, Edit, Trash2,
  Pin, Star, X, Check, MoreVertical
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  MoodIcon1, MoodIcon2, MoodIcon3, MoodIcon4, MoodIcon5,
  NotesIcon, ProfileIcon,
  TeamIcon
} from '../../components/icons';
import Modal from '../../ui/composites/Modal.composite';
import Button from '../../ui/primitives/Button';

// Icons wrapper for backwards compatibility
const Icons = {
  Plus: () => <Plus size={16} />,
  Search: () => <Search size={16} />,
  Calendar: () => <Calendar size={14} />,
  Tag: () => <Tag size={14} />,
  MoreVertical: () => <MoreVertical size={16} />,
  Edit: () => <Edit size={14} />,
  Trash: () => <Trash2 size={14} />,
  Pin: () => <Pin size={14} />,
  Star: () => <Star size={14} fill="currentColor" />,
  X: () => <X size={20} />,
  Check: () => <Check size={16} strokeWidth={3} />,
};

// ===== UI COMPONENTS =====
const Card = ({ children, className = '', padding = true }) => (
  <div className={`bg-white border border-ak-mist rounded-xl ${padding ? 'p-4' : ''} ${className}`}
       style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'neutral', size = 'sm' }) => {
  const variants = {
    neutral: 'bg-gray-100 text-gray-600',
    accent: 'bg-blue-50 text-blue-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-amber-50 text-amber-700',
    error: 'bg-red-50 text-red-700',
    mental: 'bg-gray-200 text-gray-600',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-[12px]',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

// ===== MAIN COMPONENT =====
const AKGolfNotater = ({ notes: apiNotes = null }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewNote, setShowNewNote] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  // Note form state
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    tags: [],
    mood: 4,
  });

  // Auto-save note draft
  useEffect(() => {
    const savedDraft = localStorage.getItem('ak_golf_note_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setNoteForm(parsed);
      } catch (e) {
        console.error('Failed to load note draft:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (noteForm.title || noteForm.content) {
      localStorage.setItem('ak_golf_note_draft', JSON.stringify(noteForm));
    }
  }, [noteForm]);

  // Tags
  const tags = [
    { id: 'all', label: 'Alle', color: 'var(--text-secondary)' },
    { id: 'trening', label: 'Trening', color: 'var(--success)' },
    { id: 'turnering', label: 'Turnering', color: 'var(--achievement)' },
    { id: 'mental', label: 'Mental', color: 'var(--text-secondary)' },
    { id: 'teknikk', label: 'Teknikk', color: 'var(--accent-light)' },
    { id: 'mål', label: 'Mål', color: 'var(--warning)' },
    { id: 'refleksjon', label: 'Refleksjon', color: 'var(--accent)' },
  ];

  // Default notes (fallback if no API data)
  const defaultNotes = [
    {
      id: 1,
      title: 'Gjennombrudd med driver',
      content: 'I dag oppdaget jeg at ved å fokusere på venstre skulder i nedsvingen, fikk jeg mye bedre kontakt. Klubbfarten økte fra 106 til 109 mph! \n\nNøkkelpunkter:\n- Hold venstre skulder "nede" lenger\n- Start nedsvingen med hofterotasjon\n- Ikke tenk på armer i det hele tatt\n\nMå fortsette å jobbe med dette på range.',
      date: '2025-12-14',
      tags: ['teknikk', 'trening'],
      pinned: true,
      mood: 5,
      sharedWithCoach: true,
    },
    {
      id: 2,
      title: 'Refleksjon: NM Kvalik',
      content: 'Spilte NM Kvalik i dag. Resultatet ble 74 (+2), som var under forventning.\n\nHva gikk bra:\n- Putting var solid (28 putts)\n- Mentalt sterkt på back 9\n\nHva kan forbedres:\n- Tapte 3 slag på innspill 80-100m\n- Lot meg stresse av paired-partner på hull 7\n\nLæring: Trenger mer trening på pressure putting og distansekontroll wedger.',
      date: '2025-12-10',
      tags: ['turnering', 'refleksjon'],
      pinned: false,
      mood: 3,
      sharedWithCoach: false,
    },
    {
      id: 3,
      title: 'Mental pre-shot rutine',
      content: 'Jobbet med Jan i dag på mental rutine:\n\n1. Pust dypt (4 sek inn, 6 sek ut)\n2. Visualiser ball flight\n3. Én swing thought\n4. Commit 100%\n\nMerket stor forskjell i fokus. Skal bruke dette på alle slag fremover.',
      date: '2025-12-08',
      tags: ['mental', 'teknikk'],
      pinned: true,
      mood: 4,
      sharedWithCoach: false,
    },
    {
      id: 4,
      title: 'Ukemål uke 50',
      content: '- 15 timer trening\n- Fokus på wedge PEI < 0.05\n- 3x styrketrening\n- Minst 200 putts per dag\n\nStatus midtuke: På god vei med alt unntatt styrke (bare 1x så langt).',
      date: '2025-12-09',
      tags: ['mål', 'trening'],
      pinned: false,
      mood: 4,
      sharedWithCoach: false,
    },
    {
      id: 5,
      title: 'Trening med Team Norway',
      content: 'Samling med Team Norway i dag. Fikk feedback fra landslagstrener:\n\n- Swing path er -2 til -3 (bra!)\n- Face angle ved impact: -1 (kan være mer nøytral)\n- Attack angle: +2 (perfekt for driver)\n\nGot tips om å bruke alignment sticks mer systematisk.',
      date: '2025-12-05',
      tags: ['trening', 'teknikk'],
      pinned: false,
      mood: 5,
      sharedWithCoach: false,
    },
  ];

  // Use API data if available, otherwise use default
  const [notes, setNotes] = useState(apiNotes || defaultNotes);

  // Mood icon mapping
  const moodIcons = {
    1: MoodIcon1,
    2: MoodIcon2,
    3: MoodIcon3,
    4: MoodIcon4,
    5: MoodIcon5,
  };

  // Helper to render mood icon
  const renderMoodIcon = (mood, size = 24) => {
    const MoodComponent = moodIcons[mood];
    return MoodComponent ? <MoodComponent size={size} /> : null;
  };

  // Filter notes
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Sort: pinned first, then by date
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'I dag';
    if (diffDays === 1) return 'I går';
    if (diffDays < 7) return `${diffDays} dager siden`;

    return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
  };

  // Toggle pin
  const togglePin = (id) => {
    setNotes(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  // Delete note
  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
    if (selectedNote?.id === id) setSelectedNote(null);
  };

  // Toggle share with coach
  const toggleShareWithCoach = (id) => {
    setNotes(notes.map(n => n.id === id ? { ...n, sharedWithCoach: !n.sharedWithCoach } : n));
    if (selectedNote?.id === id) {
      setSelectedNote({ ...selectedNote, sharedWithCoach: !selectedNote.sharedWithCoach });
    }
  };

  // Save new note
  const saveNewNote = () => {
    if (!noteForm.title.trim()) {
      alert('Vennligst skriv en tittel');
      return;
    }

    const newNote = {
      id: Date.now(),
      title: noteForm.title,
      content: noteForm.content,
      date: new Date().toISOString().split('T')[0],
      tags: noteForm.tags,
      pinned: false,
      mood: noteForm.mood,
      sharedWithCoach: false,
    };

    setNotes([newNote, ...notes]);
    setNoteForm({ title: '', content: '', tags: [], mood: 4 });
    localStorage.removeItem('ak_golf_note_draft');
    setShowNewNote(false);
  };

  // Edit note
  const saveEditNote = () => {
    if (!noteForm.title.trim()) {
      alert('Vennligst skriv en tittel');
      return;
    }

    setNotes(notes.map(n =>
      n.id === selectedNote.id
        ? { ...n, title: noteForm.title, content: noteForm.content, tags: noteForm.tags, mood: noteForm.mood }
        : n
    ));

    setSelectedNote({ ...selectedNote, title: noteForm.title, content: noteForm.content, tags: noteForm.tags, mood: noteForm.mood });
    localStorage.removeItem('ak_golf_note_draft');
    setIsEditing(false);
  };

  // Open note for editing
  const startEditNote = (note) => {
    setNoteForm({
      title: note.title,
      content: note.content,
      tags: note.tags,
      mood: note.mood,
    });
    setIsEditing(true);
  };

  // Toggle tag selection
  const toggleTag = (tagId) => {
    setNoteForm({
      ...noteForm,
      tags: noteForm.tags.includes(tagId)
        ? noteForm.tags.filter(t => t !== tagId)
        : [...noteForm.tags, tagId]
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <PageHeader
        title="Notater"
        subtitle="Treningsdagbok og refleksjoner"
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={() => setShowNewNote(true)}
          >
            Nytt notat
          </Button>
        }
      />

      <div style={{ padding: '24px', maxWidth: '1536px', margin: '0 auto' }}>
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block w-56 flex-shrink-0 space-y-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ak-steel">
                <Icons.Search />
              </div>
              <input
                type="text"
                placeholder="Søk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-ak-mist rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-ak-primary/20"
              />
            </div>

            {/* Tags */}
            <Card padding={false}>
              <div className="p-4 border-b border-ak-mist">
                <h3 className="text-[13px] font-semibold text-ak-charcoal">Tagger</h3>
              </div>
              <div className="py-2">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTag(tag.id)}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors ${
                      selectedTag === tag.id
                        ? 'bg-ak-primary/5 text-ak-primary'
                        : 'text-ak-charcoal hover:bg-ak-snow'
                    }`}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="text-[13px]">{tag.label}</span>
                    <span className="ml-auto text-[11px] text-ak-steel">
                      {tag.id === 'all'
                        ? notes.length
                        : notes.filter(n => n.tags.includes(tag.id)).length}
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card>
              <h3 className="text-[13px] font-semibold text-ak-charcoal mb-3">Statistikk</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-ak-steel">Totalt notater</span>
                  <span className="text-[14px] font-semibold text-ak-charcoal">{notes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-ak-steel">Denne uken</span>
                  <span className="text-[14px] font-semibold text-ak-success">
                    {notes.filter(n => {
                      const noteDate = new Date(n.date);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return noteDate > weekAgo;
                    }).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-ak-steel">Festet</span>
                  <span className="text-[14px] font-semibold text-ak-gold">
                    {notes.filter(n => n.pinned).length}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Notes List */}
          <div className="flex-1">
            {/* Mobile Search */}
            <div className="lg:hidden mb-4">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ak-steel">
                  <Icons.Search />
                </div>
                <input
                  type="text"
                  placeholder="Søk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-ak-mist rounded-xl text-[13px] focus:outline-none"
                />
              </div>
            </div>

            {/* Mobile Tags */}
            <div className="lg:hidden flex gap-2 mb-4 overflow-x-auto pb-2">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(tag.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                    selectedTag === tag.id
                      ? 'bg-ak-primary text-white'
                      : 'bg-white text-ak-charcoal border border-ak-mist'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* Notes Count */}
            <p className="text-[13px] text-ak-steel mb-4">
              {sortedNotes.length} notater
            </p>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedNotes.map(note => (
                <Card
                  key={note.id}
                  className={`cursor-pointer hover:shadow-lg transition-all ${
                    note.pinned ? 'ring-2 ring-ak-gold/30' : ''
                  }`}
                  onClick={() => setSelectedNote(note)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {note.pinned && (
                        <span className="text-ak-gold"><Icons.Star /></span>
                      )}
                      {note.sharedWithCoach && (
                        <span className="text-ak-primary" title="Delt med trener"><TeamIcon size={14} /></span>
                      )}
                      <h3 className="text-[14px] font-semibold text-ak-charcoal line-clamp-1">
                        {note.title}
                      </h3>
                    </div>
                    <span className="text-ak-gold">{renderMoodIcon(note.mood, 20)}</span>
                  </div>

                  <p className="text-[12px] text-ak-steel line-clamp-3 mb-3 whitespace-pre-line">
                    {note.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] text-ak-steel">
                      <Icons.Calendar />
                      <span>{formatDate(note.date)}</span>
                    </div>
                    <div className="flex gap-1">
                      {note.tags.slice(0, 2).map(tagId => {
                        const tag = tags.find(t => t.id === tagId);
                        return tag ? (
                          <span
                            key={tagId}
                            className="px-1.5 py-0.5 rounded text-[9px] font-medium"
                            style={{
                              backgroundColor: `${tag.color}15`,
                              color: tag.color
                            }}
                          >
                            {tag.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {sortedNotes.length === 0 && (
              <div className="text-center py-12">
                <span className="mb-4 block text-ak-steel"><NotesIcon size={48} /></span>
                <p className="text-[15px] font-medium text-ak-charcoal">Ingen notater</p>
                <p className="text-[13px] text-ak-steel">
                  {searchQuery || selectedTag !== 'all'
                    ? 'Prøv et annet søk eller filter'
                    : 'Opprett ditt første notat'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Note Detail Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" padding={false}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-ak-mist p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-ak-gold">{renderMoodIcon(selectedNote.mood, 28)}</span>
                <div>
                  <h2 className="text-[17px] font-bold text-ak-charcoal">{selectedNote.title}</h2>
                  <div className="flex items-center gap-2 text-[12px] text-ak-steel">
                    <Icons.Calendar />
                    <span>{formatDate(selectedNote.date)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleShareWithCoach(selectedNote.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    selectedNote.sharedWithCoach ? 'bg-ak-primary/10 text-ak-primary' : 'hover:bg-ak-snow text-ak-steel'
                  }`}
                  title={selectedNote.sharedWithCoach ? 'Delt med trener' : 'Del med trener'}
                >
                  {selectedNote.sharedWithCoach ? <TeamIcon size={16} /> : <ProfileIcon size={16} />}
                </button>
                <button
                  onClick={() => togglePin(selectedNote.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    selectedNote.pinned ? 'bg-ak-gold/10 text-ak-gold' : 'hover:bg-ak-snow text-ak-steel'
                  }`}
                >
                  <Icons.Pin />
                </button>
                <button
                  onClick={() => startEditNote(selectedNote)}
                  className="p-2 rounded-lg hover:bg-ak-snow text-ak-steel"
                >
                  <Icons.Edit />
                </button>
                <button
                  onClick={() => setNoteToDelete(selectedNote)}
                  className="p-2 rounded-lg hover:bg-ak-error/10 text-ak-error"
                >
                  <Icons.Trash />
                </button>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="p-2 rounded-lg hover:bg-ak-snow text-ak-steel"
                >
                  <Icons.X />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Tags */}
              <div className="flex gap-2 mb-4">
                {selectedNote.tags.map(tagId => {
                  const tag = tags.find(t => t.id === tagId);
                  return tag ? (
                    <Badge
                      key={tagId}
                      variant="neutral"
                      size="md"
                    >
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.label}
                      </span>
                    </Badge>
                  ) : null;
                })}
              </div>

              {/* Note Content */}
              <div className="prose prose-sm max-w-none">
                <p className="text-[14px] text-ak-charcoal whitespace-pre-line leading-relaxed">
                  {selectedNote.content}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Note Modal */}
      {isEditing && selectedNote && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl" padding={false}>
            <div className="p-4 border-b border-ak-mist flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-ak-charcoal">Rediger notat</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-lg hover:bg-ak-snow text-ak-steel"
              >
                <Icons.X />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-[12px] text-ak-steel mb-1">Tittel</label>
                <input
                  type="text"
                  placeholder="Skriv en tittel..."
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-ak-snow border border-ak-mist rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-ak-primary/20"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-[12px] text-ak-steel mb-1">Innhold</label>
                <textarea
                  placeholder="Skriv dine tanker, refleksjoner eller notater..."
                  rows={8}
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                  className="w-full px-4 py-3 bg-ak-snow border border-ak-mist rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-ak-primary/20 resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-[12px] text-ak-steel mb-2">Tagger</label>
                <div className="flex flex-wrap gap-2">
                  {tags.filter(t => t.id !== 'all').map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
                        noteForm.tags.includes(tag.id)
                          ? 'bg-ak-primary text-white border-ak-primary'
                          : 'border-ak-mist hover:bg-ak-snow'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: noteForm.tags.includes(tag.id) ? 'white' : tag.color }}
                        />
                        {tag.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div>
                <label className="block text-[12px] text-ak-steel mb-2">Humør</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map(mood => (
                    <button
                      key={mood}
                      onClick={() => setNoteForm({ ...noteForm, mood })}
                      className={`hover:scale-110 transition-transform ${
                        noteForm.mood === mood ? 'scale-125 text-ak-gold' : 'opacity-50 text-ak-steel'
                      }`}
                    >
                      {renderMoodIcon(mood, 28)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="primary"
                  leftIcon={<Icons.Check />}
                  onClick={saveEditNote}
                  style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
                >
                  Lagre endringer
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                  style={{ padding: '12px 24px' }}
                >
                  Avbryt
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* New Note Modal */}
      {showNewNote && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl" padding={false}>
            <div className="p-4 border-b border-ak-mist flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-ak-charcoal">Nytt notat</h2>
              <button
                onClick={() => setShowNewNote(false)}
                className="p-2 rounded-lg hover:bg-ak-snow text-ak-steel"
              >
                <Icons.X />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-[12px] text-ak-steel mb-1">Tittel</label>
                <input
                  type="text"
                  placeholder="Skriv en tittel..."
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-ak-snow border border-ak-mist rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-ak-primary/20"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-[12px] text-ak-steel mb-1">Innhold</label>
                <textarea
                  placeholder="Skriv dine tanker, refleksjoner eller notater..."
                  rows={8}
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                  className="w-full px-4 py-3 bg-ak-snow border border-ak-mist rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-ak-primary/20 resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-[12px] text-ak-steel mb-2">Tagger</label>
                <div className="flex flex-wrap gap-2">
                  {tags.filter(t => t.id !== 'all').map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
                        noteForm.tags.includes(tag.id)
                          ? 'bg-ak-primary text-white border-ak-primary'
                          : 'border-ak-mist hover:bg-ak-snow'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: noteForm.tags.includes(tag.id) ? 'white' : tag.color }}
                        />
                        {tag.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div>
                <label className="block text-[12px] text-ak-steel mb-2">Humør</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map(mood => (
                    <button
                      key={mood}
                      onClick={() => setNoteForm({ ...noteForm, mood })}
                      className={`hover:scale-110 transition-transform ${
                        noteForm.mood === mood ? 'scale-125 text-ak-gold' : 'opacity-50 text-ak-steel'
                      }`}
                    >
                      {renderMoodIcon(mood, 28)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="primary"
                  leftIcon={<Icons.Check />}
                  onClick={saveNewNote}
                  style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
                >
                  Lagre notat
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowNewNote(false)}
                  style={{ padding: '12px 24px' }}
                >
                  Avbryt
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Note Confirmation Modal */}
      <Modal
        isOpen={!!noteToDelete}
        onClose={() => setNoteToDelete(null)}
        title="Slett notat"
        size="sm"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setNoteToDelete(null)}>
              Avbryt
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                deleteNote(noteToDelete.id);
                setNoteToDelete(null);
              }}
              style={{ backgroundColor: 'var(--error)' }}
            >
              Slett notat
            </Button>
          </div>
        }
      >
        <p className="text-ak-steel m-0 leading-relaxed">
          Er du sikker på at du vil slette <strong className="text-ak-charcoal">{noteToDelete?.title}</strong>? Denne handlingen kan ikke angres.
        </p>
      </Modal>

    </div>
  );
};

export default AKGolfNotater;
