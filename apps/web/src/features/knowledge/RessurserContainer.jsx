import React, { useState } from 'react';
import {
  BookMarked, Play, FileText, Video, Link as LinkIcon, Download,
  Search, ChevronRight, Clock, Star, BookOpen, ExternalLink,
  Bookmark, BookmarkCheck, Eye
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import Button from '../../ui/primitives/Button';

// ============================================================================
// MOCK DATA - Will be replaced with API data
// ============================================================================

const MOCK_RESOURCES = [
  // Videos
  {
    id: 'v1',
    type: 'video',
    title: 'Perfekt Swing Teknikk',
    description: 'L\u00e6r grunnleggende swing-teknikk med fokus p\u00e5 rotasjon og balanse.',
    category: 'teknikk',
    duration: '12:45',
    thumbnail: null,
    author: 'Thomas Berg',
    views: 1234,
    rating: 4.8,
    isSaved: true,
    isNew: false,
    url: '#',
  },
  {
    id: 'v2',
    type: 'video',
    title: 'Putting Masterclass',
    description: 'Forbedre putting-spillet ditt med disse profesjonelle tipsene.',
    category: 'teknikk',
    duration: '18:30',
    thumbnail: null,
    author: 'Maria Hansen',
    views: 892,
    rating: 4.9,
    isSaved: false,
    isNew: true,
    url: '#',
  },
  {
    id: 'v3',
    type: 'video',
    title: 'Mental Forberedelse f\u00f8r Turnering',
    description: 'Slik forbereder du deg mentalt for viktige konkurranser.',
    category: 'mental',
    duration: '22:15',
    thumbnail: null,
    author: 'Erik Larsen',
    views: 567,
    rating: 4.7,
    isSaved: false,
    isNew: false,
    url: '#',
  },
  // Articles
  {
    id: 'a1',
    type: 'article',
    title: 'N\u00e6ring for Golfspillere',
    description: 'Optimal ern\u00e6ring for bedre prestasjon p\u00e5 banen.',
    category: 'fysisk',
    readTime: '8 min',
    author: 'Dr. Anne Nilsen',
    views: 2341,
    rating: 4.6,
    isSaved: true,
    isNew: false,
    url: '#',
  },
  {
    id: 'a2',
    type: 'article',
    title: 'Regelendringer 2025',
    description: 'Oversikt over nye golfregler som gjelder fra 2025.',
    category: 'regler',
    readTime: '5 min',
    author: 'NGF',
    views: 4521,
    rating: 4.5,
    isSaved: false,
    isNew: true,
    url: '#',
  },
  {
    id: 'a3',
    type: 'article',
    title: 'Treningsplanlegging for Juniorer',
    description: 'Hvordan strukturere trening for unge golfspillere.',
    category: 'trening',
    readTime: '12 min',
    author: 'Thomas Berg',
    views: 1876,
    rating: 4.8,
    isSaved: false,
    isNew: false,
    url: '#',
  },
  // Documents
  {
    id: 'd1',
    type: 'document',
    title: 'Treningsdagbok Template',
    description: 'Mal for \u00e5 f\u00f8re treningsdagbok gjennom sesongen.',
    category: 'trening',
    fileType: 'PDF',
    fileSize: '245 KB',
    downloads: 892,
    isSaved: false,
    isNew: false,
    url: '#',
  },
  {
    id: 'd2',
    type: 'document',
    title: 'Kategori B Krav',
    description: 'Komplett oversikt over krav for \u00e5 n\u00e5 Kategori B.',
    category: 'm\u00e5l',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    downloads: 1543,
    isSaved: true,
    isNew: false,
    url: '#',
  },
  // Links
  {
    id: 'l1',
    type: 'link',
    title: 'NGF Offisielle Regler',
    description: 'Offisielle golfregler fra Norges Golfforbund.',
    category: 'regler',
    domain: 'golf.no',
    isSaved: false,
    isNew: false,
    url: 'https://golf.no',
  },
  {
    id: 'l2',
    type: 'link',
    title: 'TrackMan University',
    description: 'L\u00e6ringsressurser for TrackMan-analyse.',
    category: 'teknikk',
    domain: 'trackmangolf.com',
    isSaved: false,
    isNew: true,
    url: 'https://trackmangolf.com',
  },
];

const CATEGORIES = [
  { key: 'all', label: 'Alle', icon: BookMarked },
  { key: 'teknikk', label: 'Teknikk', icon: Play },
  { key: 'mental', label: 'Mental', icon: BookOpen },
  { key: 'fysisk', label: 'Fysisk', icon: Star },
  { key: 'trening', label: 'Trening', icon: Clock },
  { key: 'regler', label: 'Regler', icon: FileText },
  { key: 'm\u00e5l', label: 'M\u00e5l', icon: Star },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getTypeConfig = (type) => {
  switch (type) {
    case 'video':
      return { icon: Video, color: 'var(--error)', label: 'Video' };
    case 'article':
      return { icon: FileText, color: 'var(--accent)', label: 'Artikkel' };
    case 'document':
      return { icon: Download, color: 'var(--success)', label: 'Dokument' };
    case 'link':
      return { icon: LinkIcon, color: 'var(--achievement)', label: 'Lenke' };
    default:
      return { icon: BookMarked, color: 'var(--text-secondary)', label: type };
  }
};

// ============================================================================
// RESOURCE CARD COMPONENT
// ============================================================================

const ResourceCard = ({ resource, onToggleSave, onOpen }) => {
  const typeConfig = getTypeConfig(resource.type);
  const TypeIcon = typeConfig.icon;

  return (
    <div
      onClick={() => onOpen(resource)}
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
      }}
    >
      {/* Thumbnail/Preview */}
      <div style={{
        height: '120px',
        backgroundColor: `${typeConfig.color}10`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <TypeIcon size={40} color={typeConfig.color} />

        {/* Type Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '6px',
          backgroundColor: 'var(--bg-primary)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <TypeIcon size={12} color={typeConfig.color} />
          <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-primary)' }}>
            {typeConfig.label}
          </span>
        </div>

        {/* New Badge */}
        {resource.isNew && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            padding: '4px 8px',
            borderRadius: '6px',
            backgroundColor: 'var(--success)',
            color: 'var(--bg-primary)',
            fontSize: '10px',
            fontWeight: 600,
          }}>
            NY
          </div>
        )}

        {/* Duration/Read Time */}
        {(resource.duration || resource.readTime) && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            borderRadius: '6px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'var(--bg-primary)',
          }}>
            <Clock size={12} />
            <span style={{ fontSize: '11px', fontWeight: 500 }}>
              {resource.duration || resource.readTime}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{
          fontSize: '15px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: '0 0 8px 0',
          lineHeight: 1.3,
        }}>
          {resource.title}
        </h3>

        <p style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          margin: '0 0 12px 0',
          lineHeight: 1.5,
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {resource.description}
        </p>

        {/* Meta */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-default)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {resource.rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={12} color={'var(--achievement)'} fill={'var(--achievement)'} />
                <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {resource.rating}
                </span>
              </div>
            )}
            {resource.views && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Eye size={12} color={'var(--text-secondary)'} />
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {resource.views.toLocaleString()}
                </span>
              </div>
            )}
            {resource.downloads && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Download size={12} color={'var(--text-secondary)'} />
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {resource.downloads.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(resource.id);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: resource.isSaved ? 'rgba(var(--accent-rgb), 0.15)' : 'var(--bg-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {resource.isSaved ? (
              <BookmarkCheck size={16} color={'var(--accent)'} />
            ) : (
              <Bookmark size={16} color={'var(--text-secondary)'} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// FEATURED RESOURCE COMPONENT
// ============================================================================

const FeaturedResource = ({ resource, onOpen }) => {
  const typeConfig = getTypeConfig(resource.type);
  const TypeIcon = typeConfig.icon;

  return (
    <div
      onClick={() => onOpen(resource)}
      style={{
        backgroundColor: 'var(--accent)',
        borderRadius: '20px',
        padding: '24px',
        color: 'var(--bg-primary)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.01)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Icon */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '16px',
        backgroundColor: 'rgba(255,255,255,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <TypeIcon size={36} color={'var(--bg-primary)'} />
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'inline-block',
          padding: '4px 10px',
          borderRadius: '6px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          fontSize: '11px',
          fontWeight: 600,
          marginBottom: '8px',
        }}>
          ANBEFALT
        </div>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 700,
          margin: '0 0 8px 0',
        }}>
          {resource.title}
        </h2>
        <p style={{
          fontSize: '14px',
          opacity: 0.85,
          margin: 0,
          lineHeight: 1.5,
        }}>
          {resource.description}
        </p>
      </div>

      {/* Arrow */}
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        backgroundColor: 'rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <ChevronRight size={24} />
      </div>
    </div>
  );
};

// ============================================================================
// CATEGORY FILTER COMPONENT
// ============================================================================

const CategoryFilter = ({ activeCategory, onCategoryChange, resources }) => {
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
      paddingBottom: '4px',
    }}>
      {CATEGORIES.map((category) => {
        const Icon = category.icon;
        const count = category.key === 'all'
          ? resources.length
          : resources.filter(r => r.category === category.key).length;

        return (
          <button
            key={category.key}
            onClick={() => onCategoryChange(category.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeCategory === category.key ? 'var(--accent)' : 'var(--bg-primary)',
              color: activeCategory === category.key ? 'var(--bg-primary)' : 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              boxShadow: activeCategory === category.key ? 'none' : '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <Icon size={16} />
            {category.label}
            <span style={{
              fontSize: '11px',
              padding: '2px 6px',
              borderRadius: '6px',
              backgroundColor: activeCategory === category.key
                ? 'rgba(255,255,255,0.2)'
                : 'var(--bg-secondary)',
            }}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

// ============================================================================
// SEARCH BAR COMPONENT
// ============================================================================

const SearchBar = ({ value, onChange }) => {
  return (
    <div style={{
      position: 'relative',
      marginBottom: '20px',
    }}>
      <Search
        size={18}
        color={'var(--text-secondary)'}
        style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      <input
        type="text"
        placeholder="S\u00f8k i ressurser..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '14px 16px 14px 48px',
          borderRadius: '12px',
          border: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-primary)',
          fontSize: '14px',
          color: 'var(--text-primary)',
          outline: 'none',
          transition: 'border-color 0.2s ease',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--accent)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--border-default)';
        }}
      />
    </div>
  );
};

// ============================================================================
// RESOURCE DETAIL MODAL
// ============================================================================

const ResourceDetailModal = ({ resource, onClose }) => {
  if (!resource) return null;

  const typeConfig = getTypeConfig(resource.type);
  const TypeIcon = typeConfig.icon;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }} onClick={onClose}>
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '20px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto',
      }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          height: '180px',
          backgroundColor: `${typeConfig.color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <TypeIcon size={64} color={typeConfig.color} />
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: 'var(--bg-primary)',
              cursor: 'pointer',
              fontSize: '20px',
              color: 'var(--text-secondary)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            \u00d7
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
          }}>
            <span style={{
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: `${typeConfig.color}15`,
              color: typeConfig.color,
              fontSize: '12px',
              fontWeight: 500,
            }}>
              {typeConfig.label}
            </span>
            {resource.isNew && (
              <span style={{
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor: 'var(--success)',
                color: 'var(--bg-primary)',
                fontSize: '10px',
                fontWeight: 600,
              }}>
                NY
              </span>
            )}
          </div>

          <h2 style={{
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: '0 0 12px 0',
          }}>
            {resource.title}
          </h2>

          <p style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            margin: '0 0 20px 0',
          }}>
            {resource.description}
          </p>

          {/* Meta info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '24px',
          }}>
            {resource.author && (
              <div style={{
                padding: '12px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '10px',
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Forfatter
                </div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {resource.author}
                </div>
              </div>
            )}
            {(resource.duration || resource.readTime) && (
              <div style={{
                padding: '12px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '10px',
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  {resource.type === 'video' ? 'Varighet' : 'Lesetid'}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {resource.duration || resource.readTime}
                </div>
              </div>
            )}
            {resource.fileType && (
              <div style={{
                padding: '12px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '10px',
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Filtype
                </div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {resource.fileType} ({resource.fileSize})
                </div>
              </div>
            )}
            {resource.domain && (
              <div style={{
                padding: '12px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '10px',
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Kilde
                </div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {resource.domain}
                </div>
              </div>
            )}
          </div>

          {/* Action button */}
          <button
            onClick={() => window.open(resource.url, '_blank')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-primary)',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
          >
            {resource.type === 'video' && <><Play size={18} /> Se video</>}
            {resource.type === 'article' && <><BookOpen size={18} /> Les artikkel</>}
            {resource.type === 'document' && <><Download size={18} /> Last ned</>}
            {resource.type === 'link' && <><ExternalLink size={18} /> \u00c5pne lenke</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const RessurserContainer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [resources, setResources] = useState(MOCK_RESOURCES);
  const [selectedResource, setSelectedResource] = useState(null);

  const filteredResources = resources.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || r.category === category;
    return matchesSearch && matchesCategory;
  });

  const savedResources = resources.filter(r => r.isSaved);
  const featuredResource = resources.find(r => r.rating >= 4.8 && r.type === 'video');

  const handleToggleSave = (resourceId) => {
    setResources((prev) =>
      prev.map((r) =>
        r.id === resourceId ? { ...r, isSaved: !r.isSaved } : r
      )
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <PageHeader
        title="Ressurser"
        subtitle="Videoer, artikler og læringsmateriale"
      />

      <div style={{ padding: '24px', maxWidth: '1536px', margin: '0 auto' }}>
        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent)' }}>
              {resources.length}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Ressurser</div>
          </div>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--error)' }}>
              {resources.filter(r => r.type === 'video').length}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Videoer</div>
          </div>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)' }}>
              {resources.filter(r => r.type === 'article').length}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Artikler</div>
          </div>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--achievement)' }}>
              {savedResources.length}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Lagret</div>
          </div>
        </div>

        {/* Featured Resource */}
        {featuredResource && (
          <div style={{ marginBottom: '24px' }}>
            <FeaturedResource
              resource={featuredResource}
              onOpen={setSelectedResource}
            />
          </div>
        )}

        {/* Search */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* Category Filter */}
        <div style={{ marginBottom: '24px' }}>
          <CategoryFilter
            activeCategory={category}
            onCategoryChange={setCategory}
            resources={resources}
          />
        </div>

        {/* Saved Resources Section */}
        {savedResources.length > 0 && category === 'all' && !searchQuery && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <BookmarkCheck size={20} color={'var(--accent)'} />
              Lagrede ressurser
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}>
              {savedResources.slice(0, 3).map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onToggleSave={handleToggleSave}
                  onOpen={setSelectedResource}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Resources */}
        <div>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: '0 0 16px 0',
          }}>
            {category === 'all' ? 'Alle ressurser' : CATEGORIES.find(c => c.key === category)?.label}
            <span style={{
              fontSize: '14px',
              fontWeight: 400,
              color: 'var(--text-secondary)',
              marginLeft: '8px',
            }}>
              ({filteredResources.length})
            </span>
          </h2>

          {filteredResources.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}>
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onToggleSave={handleToggleSave}
                  onOpen={setSelectedResource}
                />
              ))}
            </div>
          ) : (
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '16px',
              padding: '60px 20px',
              textAlign: 'center',
            }}>
              <Search size={40} color={'var(--text-secondary)'} style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                Ingen ressurser funnet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <ResourceDetailModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
      />
    </div>
  );
};

export default RessurserContainer;
