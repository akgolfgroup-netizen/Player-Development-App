/**
 * AK Golf Academy - Coach Create Modal
 * Design System v3.0 - Premium Light
 *
 * Modal for creating new coach accounts.
 * Uses coachesAPI.create() backend endpoint.
 */

import React, { useState } from 'react';
import { X, Loader2, UserPlus } from 'lucide-react';
import { coachesAPI } from '../../services/api';
import Button from '../../ui/primitives/Button';

interface CoachCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CoachCreateModal: React.FC<CoachCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    specializations: '',
    maxPlayersPerSession: 4,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('Fyll ut alle obligatoriske felt');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await coachesAPI.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        specializations: formData.specializations
          ? formData.specializations.split(',').map((s) => s.trim())
          : [],
        maxPlayersPerSession: formData.maxPlayersPerSession,
      });

      onSuccess();
      onClose();

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        specializations: '',
        maxPlayersPerSession: 4,
      });
    } catch (err: unknown) {
      console.error('Failed to create coach:', err);
      const errorMessage = err instanceof Error ? err.message : 'Kunne ikke opprette trener';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-ak-surface-base rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-ak-border-default">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ak-brand-primary/10 flex items-center justify-center">
              <UserPlus size={20} className="text-ak-brand-primary" />
            </div>
            <h2 className="text-lg font-semibold text-ak-text-primary">
              Opprett ny trener
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-ak-surface-subtle rounded-lg transition-colors"
          >
            <X size={20} className="text-ak-text-tertiary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-ak-status-error/10 border border-ak-status-error/20 rounded-lg">
              <p className="text-sm text-ak-status-error">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ak-text-primary mb-1.5">
                Fornavn *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full py-2.5 px-3 rounded-lg border border-ak-border-default bg-ak-surface-base text-sm text-ak-text-primary outline-none focus:border-ak-brand-primary transition-colors"
                placeholder="Ola"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ak-text-primary mb-1.5">
                Etternavn *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full py-2.5 px-3 rounded-lg border border-ak-border-default bg-ak-surface-base text-sm text-ak-text-primary outline-none focus:border-ak-brand-primary transition-colors"
                placeholder="Nordmann"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ak-text-primary mb-1.5">
              E-post *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full py-2.5 px-3 rounded-lg border border-ak-border-default bg-ak-surface-base text-sm text-ak-text-primary outline-none focus:border-ak-brand-primary transition-colors"
              placeholder="ola@akgolf.no"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ak-text-primary mb-1.5">
              Spesialiseringer
            </label>
            <input
              type="text"
              value={formData.specializations}
              onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
              className="w-full py-2.5 px-3 rounded-lg border border-ak-border-default bg-ak-surface-base text-sm text-ak-text-primary outline-none focus:border-ak-brand-primary transition-colors"
              placeholder="Putting, Driving, Mental trening"
            />
            <p className="text-xs text-ak-text-tertiary mt-1">
              Separer med komma
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-ak-text-primary mb-1.5">
              Maks spillere per økt
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={formData.maxPlayersPerSession}
              onChange={(e) => setFormData({ ...formData, maxPlayersPerSession: parseInt(e.target.value) || 4 })}
              className="w-full py-2.5 px-3 rounded-lg border border-ak-border-default bg-ak-surface-base text-sm text-ak-text-primary outline-none focus:border-ak-brand-primary transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Oppretter...
                </>
              ) : (
                'Opprett trener'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoachCreateModal;
