import React, { useState, useEffect } from 'react';
import {
  Video, Play, Plus, Calendar,
  Search, Upload, CheckCircle, AlertCircle
} from 'lucide-react';
import { tokens } from '../../design-tokens';
import { PageHeader } from '../../components/layout/PageHeader';
import apiClient from '../../services/apiClient';

// ============================================================================
// MOCK DATA
// ============================================================================

const VIDEO_PROOFS = [
  {
    id: 'v1',
    title: 'Driver sving - januar 2025',
    type: 'swing',
    category: 'Driving',
    date: '2025-01-18',
    duration: '0:45',
    thumbnail: null,
    verified: true,
    coachNote: 'Mye bedre tempo enn sist!',
    tags: ['driver', 'tempo', 'forbedring'],
  },
  {
    id: 'v2',
    title: 'Bunkerslag teknikk',
    type: 'drill',
    category: 'Kortspill',
    date: '2025-01-15',
    duration: '1:20',
    thumbnail: null,
    verified: true,
    coachNote: 'God bladapning. Fortsett slik!',
    tags: ['bunker', 'sand', 'teknikk'],
  },
  {
    id: 'v3',
    title: 'Putting rutine',
    type: 'routine',
    category: 'Putting',
    date: '2025-01-12',
    duration: '0:30',
    thumbnail: null,
    verified: false,
    coachNote: null,
    tags: ['putting', 'rutine', 'mental'],
  },
  {
    id: 'v4',
    title: 'Jernspill - 7 jern',
    type: 'swing',
    category: 'Jernspill',
    date: '2025-01-10',
    duration: '0:38',
    thumbnail: null,
    verified: true,
    coachNote: 'Konsistent impact. Bra jobb!',
    tags: ['jern', 'impact', 'ball-first'],
  },
  {
    id: 'v5',
    title: 'Driver sving - desember 2024',
    type: 'swing',
    category: 'Driving',
    date: '2024-12-20',
    duration: '0:42',
    thumbnail: null,
    verified: true,
    coachNote: 'Referansevideo for fremgang.',
    tags: ['driver', 'baseline'],
  },
  {
    id: 'v6',
    title: 'Chipping gate drill',
    type: 'drill',
    category: 'Kortspill',
    date: '2024-12-15',
    duration: '1:05',
    thumbnail: null,
    verified: true,
    coachNote: null,
    tags: ['chip', 'drill', 'gate'],
  },
];

const CATEGORIES = ['Alle', 'Driving', 'Jernspill', 'Kortspill', 'Putting', 'Fysisk'];

// ============================================================================
// VIDEO CARD
// ============================================================================

const VideoCard = ({ video, onClick }) => (
  <div
    onClick={() => onClick(video)}
    style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '14px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
    }}
  >
    {/* Thumbnail */}
    <div style={{
      position: 'relative',
      backgroundColor: tokens.colors.charcoal,
      height: '140px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Video size={40} color={tokens.colors.steel} />
      <div style={{
        position: 'absolute',
        bottom: '8px',
        right: '8px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: tokens.colors.white,
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 500,
      }}>
        {video.duration}
      </div>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Play size={18} color={tokens.colors.charcoal} fill={tokens.colors.charcoal} />
      </div>
    </div>

    {/* Content */}
    <div style={{ padding: '12px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '6px',
      }}>
        <span style={{
          fontSize: '10px',
          fontWeight: 500,
          padding: '2px 6px',
          borderRadius: '4px',
          backgroundColor: `${tokens.colors.primary}15`,
          color: tokens.colors.primary,
        }}>
          {video.category}
        </span>
        {video.verified && (
          <CheckCircle size={14} color={tokens.colors.success} />
        )}
      </div>

      <h4 style={{
        fontSize: '14px',
        fontWeight: 600,
        color: tokens.colors.charcoal,
        margin: '0 0 4px 0',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {video.title}
      </h4>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '11px',
        color: tokens.colors.steel,
      }}>
        <Calendar size={10} />
        {new Date(video.date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })}
      </div>

      {video.coachNote && (
        <div style={{
          marginTop: '8px',
          padding: '8px',
          backgroundColor: `${tokens.colors.success}10`,
          borderRadius: '6px',
          fontSize: '11px',
          color: tokens.colors.success,
        }}>
          💬 {video.coachNote}
        </div>
      )}
    </div>
  </div>
);

// ============================================================================
// UPLOAD CARD
// ============================================================================

const UploadCard = () => (
  <div style={{
    backgroundColor: tokens.colors.white,
    borderRadius: '14px',
    border: `2px dashed ${tokens.colors.mist}`,
    height: '100%',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }}>
    <div style={{
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      backgroundColor: `${tokens.colors.primary}15`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '12px',
    }}>
      <Upload size={24} color={tokens.colors.primary} />
    </div>
    <span style={{
      fontSize: '14px',
      fontWeight: 500,
      color: tokens.colors.charcoal,
    }}>
      Last opp video
    </span>
    <span style={{
      fontSize: '12px',
      color: tokens.colors.steel,
      marginTop: '4px',
    }}>
      MP4, MOV (maks 100MB)
    </span>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const BevisContainer = () => {
  const [categoryFilter, setCategoryFilter] = useState('Alle');
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch video proofs from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.get('/video-proofs');
        setVideos(response.data?.data || response.data || VIDEO_PROOFS);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Kunne ikke laste videoer');
        // Fallback to mock data
        setVideos(VIDEO_PROOFS);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const filteredVideos = videos.filter((v) => {
    const matchesCategory = categoryFilter === 'Alle' || v.category === categoryFilter;
    const matchesSearch = searchQuery === '' ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const verifiedCount = videos.filter((v) => v.verified).length;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: tokens.colors.snow }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48,
            border: `4px solid ${tokens.colors.primary}20`,
            borderTop: `4px solid ${tokens.colors.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ fontSize: '15px', color: tokens.colors.steel }}>Laster videoer...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.snow }}>
      <PageHeader
        title="Videobevis"
        subtitle="Dokumenter din fremgang"
      />

      <div style={{ padding: '16px 24px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '10px',
          marginBottom: '24px',
        }}>
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.primary }}>
              {videos.length}
            </div>
            <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Totalt</div>
          </div>
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.success }}>
              {verifiedCount}
            </div>
            <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Verifisert</div>
          </div>
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.gold }}>
              {videos.filter((v) => v.coachNote).length}
            </div>
            <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Med feedback</div>
          </div>
          {error && (
            <div style={{
              backgroundColor: `${tokens.colors.error}10`,
              borderRadius: '12px',
              padding: '14px',
              gridColumn: '1 / -1',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <AlertCircle size={16} color={tokens.colors.error} />
              <span style={{ fontSize: '12px', color: tokens.colors.error }}>
                {error} (viser demo-data)
              </span>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: tokens.colors.white,
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '12px',
          }}>
            <Search size={18} color={tokens.colors.steel} />
            <input
              type="text"
              placeholder="Sok i videoer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                color: tokens.colors.charcoal,
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: categoryFilter === cat ? tokens.colors.primary : tokens.colors.white,
                    color: categoryFilter === cat ? tokens.colors.white : tokens.colors.charcoal,
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: tokens.colors.primary,
                color: tokens.colors.white,
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <Plus size={16} />
              Last opp
            </button>
          </div>
        </div>

        {/* Video Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px',
        }}>
          <UploadCard />
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => { /* TODO: Open video detail/player */ }}
            />
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: '14px',
            padding: '40px',
            textAlign: 'center',
            marginTop: '20px',
          }}>
            <Video size={40} color={tokens.colors.steel} style={{ marginBottom: '12px' }} />
            <p style={{ fontSize: '14px', color: tokens.colors.steel, margin: 0 }}>
              Ingen videoer funnet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BevisContainer;
