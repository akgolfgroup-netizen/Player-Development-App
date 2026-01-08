/**
 * TrackMan Import Modal
 * Upload TrackMan CSV or PDF files and view import history
 */

import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Clock, X } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useImportTrackManCSV, useImportTrackManPDF, useTrackManImports } from '../../../hooks/useTechniquePlan';
import Button from '../../../ui/primitives/Button';
import Card from '../../../ui/primitives/Card';

interface TrackManImportModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const TrackManImportModal: React.FC<TrackManImportModalProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const playerId = user?.playerId || user?.id;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { importCSV, loading: csvLoading, error: csvError, progress: csvProgress } = useImportTrackManCSV();
  const { importPDF, loading: pdfLoading, error: pdfError, progress: pdfProgress } = useImportTrackManPDF();
  const { imports, loading: importsLoading, refetch: refetchImports } = useTrackManImports({ playerId });

  const loading = csvLoading || pdfLoading;
  const error = csvError || pdfError;
  const progress = csvProgress || pdfProgress;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !playerId) return;

    try {
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

      if (fileExtension === 'csv') {
        await importCSV(selectedFile, playerId);
      } else if (fileExtension === 'pdf') {
        await importPDF(selectedFile, playerId);
      } else {
        alert('Ugyldig filtype. Kun CSV og PDF støttes.');
        return;
      }

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      refetchImports();
      if (onSuccess) onSuccess();
      alert('TrackMan-data importert!');
    } catch (err) {
      console.error('Import error:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-tier-border-default">
          <div>
            <h2 className="text-2xl font-bold text-tier-navy">TrackMan Import</h2>
            <p className="text-sm text-tier-text-secondary mt-1">
              Last opp TrackMan CSV eller PDF for å spore teknisk fremgang
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-tier-surface-base rounded-lg transition-colors"
          >
            <X size={24} className="text-tier-text-secondary" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-tier-border-default">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'upload'
                ? 'text-tier-navy border-b-2 border-tier-navy'
                : 'text-tier-text-secondary hover:text-tier-navy'
            }`}
          >
            Last opp
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'history'
                ? 'text-tier-navy border-b-2 border-tier-navy'
                : 'text-tier-text-secondary hover:text-tier-navy'
            }`}
          >
            Historikk ({imports.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              {/* File Upload Area */}
              <div
                className="border-2 border-dashed border-tier-border-default rounded-xl p-12 text-center hover:border-tier-navy hover:bg-tier-surface-base transition-all cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={48} className="mx-auto text-tier-text-secondary mb-4" />
                <h3 className="text-lg font-semibold text-tier-navy mb-2">
                  {selectedFile ? selectedFile.name : 'Velg fil eller dra og slipp'}
                </h3>
                <p className="text-sm text-tier-text-secondary mb-4">
                  Støtter TrackMan CSV og PDF filer
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {!selectedFile && (
                  <Button variant="secondary" size="sm">
                    Velg fil
                  </Button>
                )}
              </div>

              {/* Selected File Info */}
              {selectedFile && (
                <Card>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText size={24} className="text-tier-navy" />
                      <div>
                        <p className="font-medium text-tier-navy">{selectedFile.name}</p>
                        <p className="text-xs text-tier-text-secondary">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="p-2 hover:bg-tier-surface-base rounded transition-colors"
                    >
                      <X size={20} className="text-tier-text-secondary" />
                    </button>
                  </div>
                </Card>
              )}

              {/* Progress Bar */}
              {loading && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-tier-text-secondary">Laster opp...</span>
                    <span className="text-sm font-semibold text-tier-navy">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-tier-surface-base rounded-full overflow-hidden">
                    <div
                      className="h-full bg-tier-navy transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-tier-error-light border border-tier-error rounded-lg">
                  <AlertCircle size={20} className="text-tier-error" />
                  <p className="text-sm text-tier-error">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={handleUpload}
                  disabled={!selectedFile || loading}
                  className="flex-1"
                >
                  {loading ? 'Laster opp...' : 'Last opp fil'}
                </Button>
                <Button variant="secondary" onClick={onClose}>
                  Avbryt
                </Button>
              </div>

              {/* Help Text */}
              <div className="bg-tier-navy-light rounded-lg p-4">
                <h4 className="font-semibold text-tier-navy mb-2 flex items-center gap-2">
                  <FileText size={16} />
                  Om TrackMan Import
                </h4>
                <ul className="text-sm text-tier-text-secondary space-y-1">
                  <li>• CSV: Standard TrackMan CSV eksportfil</li>
                  <li>• PDF: TrackMan kombinert rapport</li>
                  <li>• Data brukes til å spore teknisk fremgang og oppdatere mål automatisk</li>
                  <li>• Støtter klubbane, angrepsvink, smash factor, hastighet og mer</li>
                </ul>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {importsLoading ? (
                <div className="text-center py-12">
                  <p className="text-tier-text-secondary">Laster historikk...</p>
                </div>
              ) : imports.length === 0 ? (
                <div className="text-center py-12">
                  <FileText size={48} className="mx-auto text-tier-text-tertiary mb-4" />
                  <h3 className="text-lg font-semibold text-tier-navy mb-2">Ingen importer ennå</h3>
                  <p className="text-sm text-tier-text-secondary">
                    Last opp din første TrackMan-fil for å starte sporingen
                  </p>
                </div>
              ) : (
                imports.map((importItem: any) => (
                  <Card key={importItem.id}>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <FileText size={24} className="text-tier-navy" />
                          <div>
                            <p className="font-medium text-tier-navy">{importItem.fileName}</p>
                            <p className="text-xs text-tier-text-secondary">
                              {new Date(importItem.createdAt).toLocaleString('no-NO')}
                            </p>
                          </div>
                        </div>
                        {importItem.status === 'success' ? (
                          <CheckCircle size={20} className="text-tier-success" />
                        ) : importItem.status === 'processing' ? (
                          <Clock size={20} className="text-tier-warning" />
                        ) : (
                          <AlertCircle size={20} className="text-tier-error" />
                        )}
                      </div>

                      {importItem.summary && (
                        <div className="grid grid-cols-3 gap-4 p-3 bg-tier-surface-base rounded">
                          <div>
                            <p className="text-xs text-tier-text-secondary">Slag</p>
                            <p className="text-lg font-semibold text-tier-navy">
                              {importItem.summary.totalShots || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-tier-text-secondary">Klubber</p>
                            <p className="text-lg font-semibold text-tier-navy">
                              {importItem.summary.clubsCount || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-tier-text-secondary">Oppdatert</p>
                            <p className="text-lg font-semibold text-tier-navy">
                              {importItem.summary.goalsUpdated || 0}
                            </p>
                          </div>
                        </div>
                      )}

                      {importItem.errorMessage && (
                        <div className="mt-3 text-xs text-tier-error">
                          Feil: {importItem.errorMessage}
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackManImportModal;
