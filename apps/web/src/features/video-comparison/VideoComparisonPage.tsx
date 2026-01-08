/**
 * Video Comparison Page
 * Side-by-side video comparison with synchronized playback
 */

import React, { useState } from 'react';
import { Play, Pause, Plus, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  useVideoComparisons,
  useVideoComparison,
  useCreateVideoComparison,
  useUpdateVideoComparison,
  useDeleteVideoComparison,
} from '../../hooks/useVideoComparisons';
import { useVideos as usePlayerVideos } from '../../hooks/useVideos';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import PageHeader from '../../components/layout/PageHeader';

const VideoComparisonPage: React.FC = () => {
  const [selectedComparisonId, setSelectedComparisonId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingComparison, setEditingComparison] = useState<any>(null);

  const { comparisons, loading, error, refetch } = useVideoComparisons();
  const { comparison, loading: comparisonLoading, refetch: refetchComparison } = useVideoComparison(selectedComparisonId || '');
  const { deleteComparison } = useDeleteVideoComparison();

  const handleDelete = async (comparisonId: string) => {
    if (!confirm('Slette denne sammenligningen?')) return;
    try {
      await deleteComparison(comparisonId);
      if (selectedComparisonId === comparisonId) {
        setSelectedComparisonId(null);
      }
      refetch();
    } catch (err) {
      console.error('Error deleting comparison:', err);
    }
  };

  return (
    <div className="min-h-screen bg-tier-surface-base p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Video Sammenligning"
          subtitle="Sammenlign videoer side-ved-side med synkronisert avspilling"
          icon={<Play size={28} className="text-tier-navy" />}
        />

        <div className="mb-6">
          <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setShowCreateModal(true)}>
            Ny sammenligning
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Comparisons List */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-tier-navy mb-4">Mine sammenligninger</h2>
                {loading ? (
                  <p className="text-center text-tier-text-secondary py-8">Laster...</p>
                ) : error ? (
                  <p className="text-center text-tier-error py-8">{error}</p>
                ) : comparisons.length === 0 ? (
                  <div className="text-center py-8">
                    <Play size={48} className="mx-auto text-tier-text-tertiary mb-4" />
                    <p className="text-sm text-tier-text-secondary">Ingen sammenligninger ennå</p>
                    <Button variant="secondary" size="sm" className="mt-4" onClick={() => setShowCreateModal(true)}>
                      Opprett første sammenligning
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {comparisons.map((comp: any) => (
                      <div
                        key={comp.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedComparisonId === comp.id
                            ? 'border-tier-navy bg-tier-navy-light'
                            : 'border-tier-border-default hover:border-tier-navy hover:bg-tier-surface-base'
                        }`}
                        onClick={() => setSelectedComparisonId(comp.id)}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="font-medium text-tier-navy text-sm line-clamp-2">
                            {comp.title || 'Sammenligning uten tittel'}
                          </p>
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingComparison(comp);
                              }}
                              className="p-1 hover:bg-tier-surface-base rounded"
                            >
                              <Edit2 size={14} className="text-tier-text-secondary" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(comp.id);
                              }}
                              className="p-1 hover:bg-tier-error-light rounded"
                            >
                              <Trash2 size={14} className="text-tier-error" />
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-tier-text-secondary">
                          Opprettet {new Date(comp.createdAt).toLocaleDateString('no-NO')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Comparison Viewer */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-4">
                {!selectedComparisonId ? (
                  <div className="text-center py-12">
                    <Play size={64} className="mx-auto text-tier-text-tertiary mb-4" />
                    <h3 className="text-lg font-semibold text-tier-navy mb-2">Velg en sammenligning</h3>
                    <p className="text-sm text-tier-text-secondary">Velg en sammenligning fra listen for å se videoene side-ved-side</p>
                  </div>
                ) : comparisonLoading ? (
                  <div className="text-center py-12">
                    <p className="text-tier-text-secondary">Laster sammenligning...</p>
                  </div>
                ) : comparison ? (
                  <ComparisonViewer comparison={comparison} />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-tier-error">Kunne ikke laste sammenligning</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Create Comparison Modal */}
        {showCreateModal && (
          <CreateComparisonModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              refetch();
            }}
          />
        )}

        {/* Edit Comparison Modal */}
        {editingComparison && (
          <EditComparisonModal
            comparison={editingComparison}
            onClose={() => setEditingComparison(null)}
            onSuccess={() => {
              setEditingComparison(null);
              refetch();
              if (selectedComparisonId === editingComparison.id) {
                refetchComparison();
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

// ============================================================================
// Comparison Viewer Component
// ============================================================================

interface ComparisonViewerProps {
  comparison: any;
}

const ComparisonViewer: React.FC<ComparisonViewerProps> = ({ comparison }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-tier-border-default">
        <h2 className="text-xl font-bold text-tier-navy mb-2">
          {comparison.title || 'Sammenligning uten tittel'}
        </h2>
        {comparison.notes && (
          <p className="text-sm text-tier-text-secondary">{comparison.notes}</p>
        )}
      </div>

      {/* Side-by-side Video Players */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-tier-navy">Primær video</p>
          <div className="bg-tier-surface-base rounded-lg border border-tier-border-default aspect-video flex items-center justify-center">
            <Play size={48} className="text-tier-text-tertiary" />
            <p className="text-sm text-tier-text-secondary ml-2">Video spiller kommer her</p>
          </div>
          <p className="text-xs text-tier-text-secondary">Synkpunkt: {comparison.syncPoint1}s</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-tier-navy">Sammenlign med</p>
          <div className="bg-tier-surface-base rounded-lg border border-tier-border-default aspect-video flex items-center justify-center">
            <Play size={48} className="text-tier-text-tertiary" />
            <p className="text-sm text-tier-text-secondary ml-2">Video spiller kommer her</p>
          </div>
          <p className="text-xs text-tier-text-secondary">Synkpunkt: {comparison.syncPoint2}s</p>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="bg-tier-surface-base rounded-xl border border-tier-border-default p-4">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button variant="secondary" size="sm" leftIcon={<ChevronLeft size={16} />}>
            -0.1s
          </Button>
          <Button
            variant={isPlaying ? 'secondary' : 'primary'}
            size="lg"
            leftIcon={isPlaying ? <Pause size={20} /> : <Play size={20} />}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? 'Pause' : 'Spill av'}
          </Button>
          <Button variant="secondary" size="sm" rightIcon={<ChevronRight size={16} />}>
            +0.1s
          </Button>
        </div>

        {/* Timeline Slider */}
        <div className="w-full">
          <input
            type="range"
            min="0"
            max="100"
            value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            className="w-full h-2 bg-tier-border-default rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-tier-text-secondary mt-1">
            <span>0:00</span>
            <span>Synkronisert avspilling</span>
            <span>0:10</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-tier-text-secondary">
            Videoer synkroniseres basert på synkpunktene du har satt
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Create Comparison Modal
// ============================================================================

interface CreateComparisonModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateComparisonModal: React.FC<CreateComparisonModalProps> = ({ onClose, onSuccess }) => {
  const { createComparison, loading } = useCreateVideoComparison();
  const { videos } = usePlayerVideos({}, { autoLoad: true });

  const [formData, setFormData] = useState({
    primaryVideoId: '',
    comparisonVideoId: '',
    title: '',
    notes: '',
    syncPoint1: 0,
    syncPoint2: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.primaryVideoId || !formData.comparisonVideoId) {
      alert('Velg både primær video og sammenligning video');
      return;
    }
    try {
      await createComparison(formData);
      onSuccess();
    } catch (err) {
      console.error('Error creating comparison:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-tier-navy mb-4">Ny video sammenligning</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-tier-navy mb-1">Tittel (valgfri)</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-tier-border-default rounded"
              placeholder="F.eks. Driver swing sammenligning"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-tier-navy mb-1">Primær video *</label>
              <select
                value={formData.primaryVideoId}
                onChange={(e) => setFormData({ ...formData, primaryVideoId: e.target.value })}
                className="w-full px-3 py-2 border border-tier-border-default rounded"
                required
              >
                <option value="">Velg video</option>
                {videos.map((video: any) => (
                  <option key={video.id} value={video.id}>
                    {video.title || 'Uten tittel'} - {new Date(video.uploadedAt).toLocaleDateString('no-NO')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-tier-navy mb-1">Sammenlign med *</label>
              <select
                value={formData.comparisonVideoId}
                onChange={(e) => setFormData({ ...formData, comparisonVideoId: e.target.value })}
                className="w-full px-3 py-2 border border-tier-border-default rounded"
                required
              >
                <option value="">Velg video</option>
                {videos.map((video: any) => (
                  <option key={video.id} value={video.id}>
                    {video.title || 'Uten tittel'} - {new Date(video.uploadedAt).toLocaleDateString('no-NO')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-tier-navy mb-1">
                Synkpunkt primær (sekunder) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.syncPoint1}
                onChange={(e) => setFormData({ ...formData, syncPoint1: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-tier-border-default rounded"
                required
              />
              <p className="text-xs text-tier-text-secondary mt-1">
                Tidspunkt å starte avspilling fra
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-tier-navy mb-1">
                Synkpunkt sammenligning (sekunder) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.syncPoint2}
                onChange={(e) => setFormData({ ...formData, syncPoint2: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-tier-border-default rounded"
                required
              />
              <p className="text-xs text-tier-text-secondary mt-1">
                Tidspunkt å starte avspilling fra
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-tier-navy mb-1">Notater (valgfri)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-tier-border-default rounded"
              rows={3}
              placeholder="Hva vil du sammenligne? Hva ser du for forskjeller?"
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
              {loading ? 'Oppretter...' : 'Opprett sammenligning'}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Avbryt
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// Edit Comparison Modal
// ============================================================================

interface EditComparisonModalProps {
  comparison: any;
  onClose: () => void;
  onSuccess: () => void;
}

const EditComparisonModal: React.FC<EditComparisonModalProps> = ({ comparison, onClose, onSuccess }) => {
  const { updateComparison, loading } = useUpdateVideoComparison();

  const [formData, setFormData] = useState({
    title: comparison.title || '',
    notes: comparison.notes || '',
    syncPoint1: comparison.syncPoint1,
    syncPoint2: comparison.syncPoint2,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateComparison(comparison.id, formData);
      onSuccess();
    } catch (err) {
      console.error('Error updating comparison:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6">
        <h2 className="text-xl font-bold text-tier-navy mb-4">Rediger sammenligning</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-tier-navy mb-1">Tittel</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-tier-border-default rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-tier-navy mb-1">
                Synkpunkt primær (sekunder)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.syncPoint1}
                onChange={(e) => setFormData({ ...formData, syncPoint1: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-tier-border-default rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-tier-navy mb-1">
                Synkpunkt sammenligning (sekunder)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.syncPoint2}
                onChange={(e) => setFormData({ ...formData, syncPoint2: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-tier-border-default rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-tier-navy mb-1">Notater</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-tier-border-default rounded"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
              {loading ? 'Lagrer...' : 'Lagre endringer'}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Avbryt
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoComparisonPage;
