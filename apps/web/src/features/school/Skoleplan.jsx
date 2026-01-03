/**
 * AK Golf Academy - Skoleplan
 * Design System v3.0 - Premium Light
 *
 * School schedule management with subjects, timetable, and tasks.
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */

import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Button from '../../ui/primitives/Button';
import { SectionTitle, SubSectionTitle } from '../../components/typography';
import {
  GraduationCap,
  Plus,
  BookOpen,
  Clock,
  CheckCircle2,
  Circle,
  Edit2,
  X,
  Calendar,
  AlertCircle
} from 'lucide-react';

// ============================================================================
// CONSTANTS
// ============================================================================

const UKEDAGER = ['mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag'];
const UKEDAG_LABELS = {
  mandag: 'Man',
  tirsdag: 'Tir',
  onsdag: 'Ons',
  torsdag: 'Tor',
  fredag: 'Fre'
};

const PRIORITET_CONFIG = {
  low: { colorClasses: { dot: 'bg-ak-text-secondary' }, label: 'Lav' },
  medium: { colorClasses: { dot: 'bg-ak-status-warning' }, label: 'Medium' },
  high: { colorClasses: { dot: 'bg-ak-status-error' }, label: 'Hoy' }
};

const DEFAULT_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#EC4899', '#6366F1', '#84CC16', '#F97316'
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
};

const isOverdue = (frist) => {
  return new Date(frist) < new Date(new Date().toDateString());
};

const getDaysUntil = (frist) => {
  const today = new Date(new Date().toDateString());
  const deadline = new Date(frist);
  const diff = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  return diff;
};

// ============================================================================
// MODAL COMPONENT
// ============================================================================

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-[500px] w-[90%] max-h-[90vh] overflow-auto shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 px-6 border-b border-ak-border-default">
          <SectionTitle className="text-lg font-semibold text-ak-text-primary m-0">
            {title}
          </SectionTitle>
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer p-1 text-ak-text-secondary hover:text-ak-text-primary"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// FAG MODAL
// ============================================================================

const FagModal = ({ isOpen, onClose, fag, onSave, onDelete }) => {
  const [form, setForm] = useState({
    navn: fag?.navn || '',
    larer: fag?.larer || '',
    rom: fag?.rom || '',
    farge: fag?.farge || DEFAULT_COLORS[0]
  });
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.navn.trim()) return;

    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      console.error('Error saving fag:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      await onDelete();
      onClose();
    } catch (err) {
      console.error('Error deleting fag:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={fag ? 'Rediger fag' : 'Nytt fag'}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-ak-text-primary mb-1.5">
            Fagnavn *
          </label>
          <input
            type="text"
            value={form.navn}
            onChange={e => setForm({ ...form, navn: e.target.value })}
            placeholder="f.eks. Matematikk"
            className="w-full py-2.5 px-3 border border-ak-border-default rounded-lg text-[15px] box-border focus:outline-none focus:border-ak-brand-primary"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-ak-text-primary mb-1.5">
            Larer
          </label>
          <input
            type="text"
            value={form.larer}
            onChange={e => setForm({ ...form, larer: e.target.value })}
            placeholder="Larerens navn"
            className="w-full py-2.5 px-3 border border-ak-border-default rounded-lg text-[15px] box-border focus:outline-none focus:border-ak-brand-primary"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-ak-text-primary mb-1.5">
            Rom
          </label>
          <input
            type="text"
            value={form.rom}
            onChange={e => setForm({ ...form, rom: e.target.value })}
            placeholder="f.eks. A101"
            className="w-full py-2.5 px-3 border border-ak-border-default rounded-lg text-[15px] box-border focus:outline-none focus:border-ak-brand-primary"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-ak-text-primary mb-2">
            Farge
          </label>
          <div className="flex gap-2 flex-wrap">
            {DEFAULT_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setForm({ ...form, farge: color })}
                className={`w-8 h-8 rounded-lg cursor-pointer transition-all ${
                  form.farge === color ? 'border-[3px] border-ak-text-primary' : 'border-2 border-transparent'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          {fag && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleDelete}
              className="bg-ak-status-error/15 text-ak-status-error hover:bg-ak-status-error/25"
            >
              Slett
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="secondary" onClick={onClose}>
            Avbryt
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={saving || !form.navn.trim()}
            loading={saving}
          >
            {saving ? 'Lagrer...' : (fag ? 'Oppdater' : 'Opprett')}
          </Button>
        </div>
      </form>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Slett fag"
        message="Er du sikker på at du vil slette dette faget? Alle timer og oppgaver tilknyttet faget vil også bli slettet."
        confirmLabel="Slett"
        cancelLabel="Avbryt"
        variant="danger"
      />
    </Modal>
  );
};

// ============================================================================
// TIME MODAL
// ============================================================================

const TimeModal = ({ isOpen, onClose, time, fag, allFag, onSave, onDelete }) => {
  const [form, setForm] = useState({
    fagId: time?.fagId || fag?.id || (allFag[0]?.id || ''),
    ukedag: time?.ukedag || 'mandag',
    startTid: time?.startTid || '08:00',
    sluttTid: time?.sluttTid || '09:00'
  });
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fagId) return;

    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      console.error('Error saving time:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      await onDelete();
      onClose();
    } catch (err) {
      console.error('Error deleting time:', err);
    }
  };

  if (allFag.length === 0) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Legg til time">
        <div className="text-center py-5">
          <BookOpen size={48} className="text-ak-text-secondary mb-4 mx-auto" />
          <p className="text-ak-text-secondary mb-4">
            Du ma opprette minst ett fag for du kan legge til timer.
          </p>
          <Button variant="primary" onClick={onClose}>
            OK
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={time ? 'Rediger time' : 'Ny time'}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-ak-text-primary mb-1.5">
            Fag *
          </label>
          <select
            value={form.fagId}
            onChange={e => setForm({ ...form, fagId: e.target.value })}
            className="w-full py-2.5 px-3 border border-ak-border-default rounded-lg text-[15px] box-border bg-white focus:outline-none focus:border-ak-brand-primary"
            required
          >
            {allFag.map(f => (
              <option key={f.id} value={f.id}>{f.navn}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-ak-text-primary mb-1.5">
            Ukedag *
          </label>
          <select
            value={form.ukedag}
            onChange={e => setForm({ ...form, ukedag: e.target.value })}
            className="w-full py-2.5 px-3 border border-ak-border-default rounded-lg text-[15px] box-border bg-white focus:outline-none focus:border-ak-brand-primary"
            required
          >
            {UKEDAGER.map(dag => (
              <option key={dag} value={dag}>
                {dag.charAt(0).toUpperCase() + dag.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-ak-text-primary mb-1.5">
              Start *
            </label>
            <input
              type="time"
              value={form.startTid}
              onChange={e => setForm({ ...form, startTid: e.target.value })}
              className="w-full py-2.5 px-3 border border-ak-border-default rounded-lg text-[15px] box-border focus:outline-none focus:border-ak-brand-primary"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-ak-text-primary mb-1.5">
              Slutt *
            </label>
            <input
              type="time"
              value={form.sluttTid}
              onChange={e => setForm({ ...form, sluttTid: e.target.value })}
              className="w-full py-2.5 px-3 border border-ak-border-default rounded-lg text-[15px] box-border focus:outline-none focus:border-ak-brand-primary"
              required
            />
          </div>
        </div>

        <div className="flex gap-3">
          {time && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleDelete}
              className="bg-ak-status-error/15 text-ak-status-error hover:bg-ak-status-error/25"
            >
              Slett
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="secondary" onClick={onClose}>
            Avbryt
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={saving}
            loading={saving}
          >
            {saving ? 'Lagrer...' : (time ? 'Oppdater' : 'Opprett')}
          </Button>
        </div>
      </form>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Slett time"
        message="Er du sikker på at du vil slette denne timen?"
        confirmLabel="Slett"
        cancelLabel="Avbryt"
        variant="danger"
      />
    </Modal>
  );
};

// ============================================================================
// OPPGAVE MODAL
// ============================================================================

const OppgaveModal = ({ isOpen, onClose, oppgave, allFag, onSave, onDelete }) => {
  const [form, setForm] = useState({
    fagId: oppgave?.fagId || (allFag[0]?.id || ''),
    tittel: oppgave?.tittel || '',
    beskrivelse: oppgave?.beskrivelse || '',
    frist: oppgave?.frist ? new Date(oppgave.frist).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    prioritet: oppgave?.prioritet || 'medium'
  });
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fagId || !form.tittel.trim()) return;

    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      console.error('Error saving oppgave:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      await onDelete();
      onClose();
    } catch (err) {
      console.error('Error deleting oppgave:', err);
    }
  };

  if (allFag.length === 0) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Legg til oppgave">
        <div className="text-center py-5">
          <BookOpen size={48} className="text-ak-text-secondary mb-4 mx-auto" />
          <p className="text-ak-text-secondary mb-4">
            Du ma opprette minst ett fag for du kan legge til oppgaver.
          </p>
          <Button variant="primary" onClick={onClose}>
            OK
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={oppgave ? 'Rediger oppgave' : 'Ny oppgave'}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-ak-text-primary mb-1.5">
            Fag *
          </label>
          <select
            value={form.fagId}
            onChange={e => setForm({ ...form, fagId: e.target.value })}
            className="w-full py-2.5 px-3 border border-ak-border-default rounded-lg text-[15px] box-border bg-white focus:outline-none focus:border-ak-brand-primary"
            required
          >
            {allFag.map(f => (
              <option key={f.id} value={f.id}>{f.navn}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-ak-text-primary mb-1.5">
            Tittel *
          </label>
          <input
            type="text"
            value={form.tittel}
            onChange={e => setForm({ ...form, tittel: e.target.value })}
            placeholder="Hva skal gjores?"
            className="w-full py-2.5 px-3 border border-ak-border-default rounded-lg text-[15px] box-border focus:outline-none focus:border-ak-brand-primary"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-ak-text-primary mb-1.5">
            Beskrivelse
          </label>
          <textarea
            value={form.beskrivelse}
            onChange={e => setForm({ ...form, beskrivelse: e.target.value })}
            placeholder="Mer detaljer..."
            rows={3}
            className="w-full py-2.5 px-3 border border-ak-border-default rounded-lg text-[15px] box-border resize-y focus:outline-none focus:border-ak-brand-primary"
          />
        </div>

        <div className="flex gap-3 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-ak-text-primary mb-1.5">
              Frist *
            </label>
            <input
              type="date"
              value={form.frist}
              onChange={e => setForm({ ...form, frist: e.target.value })}
              className="w-full py-2.5 px-3 border border-ak-border-default rounded-lg text-[15px] box-border focus:outline-none focus:border-ak-brand-primary"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-ak-text-primary mb-1.5">
              Prioritet
            </label>
            <select
              value={form.prioritet}
              onChange={e => setForm({ ...form, prioritet: e.target.value })}
              className="w-full py-2.5 px-3 border border-ak-border-default rounded-lg text-[15px] box-border bg-white focus:outline-none focus:border-ak-brand-primary"
            >
              <option value="low">Lav</option>
              <option value="medium">Medium</option>
              <option value="high">Hoy</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          {oppgave && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleDelete}
              className="bg-ak-status-error/15 text-ak-status-error hover:bg-ak-status-error/25"
            >
              Slett
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="secondary" onClick={onClose}>
            Avbryt
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={saving || !form.tittel.trim()}
            loading={saving}
          >
            {saving ? 'Lagrer...' : (oppgave ? 'Oppdater' : 'Opprett')}
          </Button>
        </div>
      </form>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Slett oppgave"
        message="Er du sikker på at du vil slette denne oppgaven?"
        confirmLabel="Slett"
        cancelLabel="Avbryt"
        variant="danger"
      />
    </Modal>
  );
};

// ============================================================================
// TIMEPLAN COMPONENT
// ============================================================================

const Timeplan = ({ timer, fag, onAddTime, onEditTime }) => {
  const timerByDag = UKEDAGER.reduce((acc, dag) => {
    acc[dag] = timer
      .filter(t => t.ukedag === dag)
      .sort((a, b) => a.startTid.localeCompare(b.startTid));
    return acc;
  }, {});

  const getFagForTime = (time) => {
    return fag.find(f => f.id === time.fagId) || time.fag;
  };

  return (
    <div className="bg-white rounded-xl border border-ak-border-default overflow-hidden">
      <div className="flex justify-between items-center p-4 px-5 border-b border-ak-border-default">
        <div className="flex items-center gap-2.5">
          <Clock size={20} className="text-ak-brand-primary" />
          <SubSectionTitle className="text-base font-semibold text-ak-text-primary m-0">
            Timeplan
          </SubSectionTitle>
        </div>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Plus size={16} />}
          onClick={onAddTime}
        >
          Legg til
        </Button>
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-[600px]">
          {UKEDAGER.map(dag => (
            <div key={dag} className={`flex-1 ${dag !== 'fredag' ? 'border-r border-ak-border-default' : ''}`}>
              <div className="p-3 text-center bg-ak-surface-subtle border-b border-ak-border-default font-semibold text-[13px] text-ak-text-primary">
                {UKEDAG_LABELS[dag]}
              </div>
              <div className="min-h-[200px] p-2">
                {timerByDag[dag].length === 0 ? (
                  <div className="h-full flex items-center justify-center text-ak-text-secondary text-xs">
                    Ingen timer
                  </div>
                ) : (
                  timerByDag[dag].map(time => {
                    const fagInfo = getFagForTime(time);
                    return (
                      <div
                        key={time.id}
                        onClick={() => onEditTime(time)}
                        className="p-2.5 mb-1.5 rounded-md cursor-pointer transition-transform hover:scale-[1.02]"
                        style={{
                          backgroundColor: `${fagInfo?.farge || '#3B82F6'}15`,
                          borderLeft: `3px solid ${fagInfo?.farge || '#3B82F6'}`
                        }}
                      >
                        <div className="text-xs text-ak-text-secondary mb-1">
                          {time.startTid} - {time.sluttTid}
                        </div>
                        <div className="text-[13px] font-semibold text-ak-text-primary">
                          {fagInfo?.navn || 'Ukjent fag'}
                        </div>
                        {fagInfo?.rom && (
                          <div className="text-[11px] text-ak-text-secondary mt-0.5">
                            Rom: {fagInfo.rom}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// OPPGAVE LISTE COMPONENT
// ============================================================================

const OppgaveListe = ({ oppgaver, fag, onToggleStatus, onEdit, onAdd }) => {
  const [filter, setFilter] = useState('all');
  const [fagFilter, setFagFilter] = useState('all');

  const filteredOppgaver = oppgaver
    .filter(o => filter === 'all' || o.status === filter)
    .filter(o => fagFilter === 'all' || o.fagId === fagFilter)
    .sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 'pending' ? -1 : 1;
      }
      return new Date(a.frist) - new Date(b.frist);
    });

  const getFagForOppgave = (oppgave) => {
    return fag.find(f => f.id === oppgave.fagId) || oppgave.fag;
  };

  const pendingCount = oppgaver.filter(o => o.status === 'pending').length;
  const overdueCount = oppgaver.filter(o => o.status === 'pending' && isOverdue(o.frist)).length;

  return (
    <div className="bg-white rounded-xl border border-ak-border-default overflow-hidden">
      <div className="flex justify-between items-center p-4 px-5 border-b border-ak-border-default flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <BookOpen size={20} className="text-ak-brand-primary" />
          <SubSectionTitle className="text-base font-semibold text-ak-text-primary m-0">
            Oppgaver
          </SubSectionTitle>
          {pendingCount > 0 && (
            <span className="py-0.5 px-2 bg-ak-brand-primary text-white rounded-xl text-xs font-medium">
              {pendingCount}
            </span>
          )}
          {overdueCount > 0 && (
            <span className="py-0.5 px-2 bg-ak-status-error text-white rounded-xl text-xs font-medium">
              {overdueCount} forsinket
            </span>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <select
            value={fagFilter}
            onChange={e => setFagFilter(e.target.value)}
            className="py-1.5 px-2.5 border border-ak-border-default rounded-md text-[13px] bg-white"
          >
            <option value="all">Alle fag</option>
            {fag.map(f => (
              <option key={f.id} value={f.id}>{f.navn}</option>
            ))}
          </select>

          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="py-1.5 px-2.5 border border-ak-border-default rounded-md text-[13px] bg-white"
          >
            <option value="all">Alle</option>
            <option value="pending">Ugjort</option>
            <option value="completed">Fullfort</option>
          </select>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={onAdd}
          >
            Ny oppgave
          </Button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-auto">
        {filteredOppgaver.length === 0 ? (
          <div className="p-10 text-center text-ak-text-secondary">
            <CheckCircle2 size={40} className="mb-3 opacity-50 mx-auto" />
            <p className="m-0">Ingen oppgaver a vise</p>
          </div>
        ) : (
          filteredOppgaver.map(oppgave => {
            const fagInfo = getFagForOppgave(oppgave);
            const overdue = oppgave.status === 'pending' && isOverdue(oppgave.frist);
            const daysUntil = getDaysUntil(oppgave.frist);

            return (
              <div
                key={oppgave.id}
                className={`flex items-start gap-3 py-3.5 px-5 border-b border-ak-border-default ${
                  oppgave.status === 'completed' ? 'bg-ak-surface-subtle' : 'bg-white'
                }`}
              >
                <button
                  onClick={() => onToggleStatus(oppgave.id, oppgave.status)}
                  className="bg-transparent border-none cursor-pointer p-0.5 mt-0.5"
                >
                  {oppgave.status === 'completed' ? (
                    <CheckCircle2 size={22} className="text-ak-status-success" />
                  ) : (
                    <Circle size={22} className="text-ak-text-secondary" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="py-0.5 px-2 rounded text-[11px] font-medium"
                      style={{
                        backgroundColor: `${fagInfo?.farge || '#3B82F6'}20`,
                        color: fagInfo?.farge || '#3B82F6'
                      }}
                    >
                      {fagInfo?.navn || 'Ukjent'}
                    </span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${PRIORITET_CONFIG[oppgave.prioritet]?.colorClasses?.dot || 'bg-ak-text-secondary'}`}
                      title={`Prioritet: ${PRIORITET_CONFIG[oppgave.prioritet]?.label || oppgave.prioritet}`}
                    />
                  </div>

                  <div className={`text-sm font-medium mb-1 ${
                    oppgave.status === 'completed' ? 'text-ak-text-secondary line-through' : 'text-ak-text-primary'
                  }`}>
                    {oppgave.tittel}
                  </div>

                  {oppgave.beskrivelse && (
                    <div className="text-[13px] text-ak-text-secondary mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
                      {oppgave.beskrivelse}
                    </div>
                  )}

                  <div className={`flex items-center gap-1.5 text-xs ${overdue ? 'text-ak-status-error' : 'text-ak-text-secondary'}`}>
                    {overdue && <AlertCircle size={12} />}
                    <Calendar size={12} />
                    <span>
                      {formatDate(oppgave.frist)}
                      {oppgave.status === 'pending' && (
                        <span className="ml-1">
                          {overdue
                            ? `(${Math.abs(daysUntil)} dager forsinket)`
                            : daysUntil === 0
                              ? '(i dag)'
                              : daysUntil === 1
                                ? '(i morgen)'
                                : `(om ${daysUntil} dager)`
                          }
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onEdit(oppgave)}
                  className="bg-transparent border-none cursor-pointer p-1 text-ak-text-secondary hover:text-ak-text-primary"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// ============================================================================
// FAG LISTE COMPONENT
// ============================================================================

const FagListe = ({ fag, onEdit, onAdd }) => {
  return (
    <div className="bg-white rounded-xl border border-ak-border-default overflow-hidden">
      <div className="flex justify-between items-center p-4 px-5 border-b border-ak-border-default">
        <div className="flex items-center gap-2.5">
          <GraduationCap size={20} className="text-ak-brand-primary" />
          <SubSectionTitle className="text-base font-semibold text-ak-text-primary m-0">
            Fag
          </SubSectionTitle>
          <span className="py-0.5 px-2 bg-ak-surface-subtle text-ak-text-secondary rounded-xl text-xs font-medium">
            {fag.length}
          </span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Plus size={16} />}
          onClick={onAdd}
        >
          Nytt fag
        </Button>
      </div>

      {fag.length === 0 ? (
        <div className="p-10 text-center text-ak-text-secondary">
          <BookOpen size={40} className="mb-3 opacity-50 mx-auto" />
          <p className="m-0">Ingen fag enda. Opprett ditt forste fag!</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2.5 p-4">
          {fag.map(f => (
            <div
              key={f.id}
              onClick={() => onEdit(f)}
              className="flex items-center gap-2.5 py-2.5 px-3.5 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: `${f.farge || '#3B82F6'}15`,
                borderLeft: `3px solid ${f.farge || '#3B82F6'}`
              }}
            >
              <div>
                <div className="text-sm font-semibold text-ak-text-primary">
                  {f.navn}
                </div>
                {(f.larer || f.rom) && (
                  <div className="text-xs text-ak-text-secondary">
                    {f.larer}{f.larer && f.rom && ' | '}{f.rom}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN SKOLEPLAN COMPONENT
// ============================================================================

const Skoleplan = ({
  fag,
  timer,
  oppgaver,
  onCreateFag,
  onUpdateFag,
  onDeleteFag,
  onCreateTimer,
  onUpdateTimer,
  onDeleteTimer,
  onCreateOppgave,
  onUpdateOppgave,
  onToggleOppgaveStatus,
  onDeleteOppgave
}) => {
  const [fagModalOpen, setFagModalOpen] = useState(false);
  const [editingFag, setEditingFag] = useState(null);
  const [timeModalOpen, setTimeModalOpen] = useState(false);
  const [editingTime, setEditingTime] = useState(null);
  const [oppgaveModalOpen, setOppgaveModalOpen] = useState(false);
  const [editingOppgave, setEditingOppgave] = useState(null);

  const handleAddFag = () => {
    setEditingFag(null);
    setFagModalOpen(true);
  };

  const handleEditFag = (f) => {
    setEditingFag(f);
    setFagModalOpen(true);
  };

  const handleSaveFag = async (data) => {
    if (editingFag) {
      await onUpdateFag(editingFag.id, data);
    } else {
      await onCreateFag(data);
    }
  };

  const handleDeleteFag = async () => {
    if (editingFag) {
      await onDeleteFag(editingFag.id);
    }
  };

  const handleAddTime = () => {
    setEditingTime(null);
    setTimeModalOpen(true);
  };

  const handleEditTime = (t) => {
    setEditingTime(t);
    setTimeModalOpen(true);
  };

  const handleSaveTime = async (data) => {
    if (editingTime) {
      await onUpdateTimer(editingTime.id, data);
    } else {
      await onCreateTimer(data);
    }
  };

  const handleDeleteTime = async () => {
    if (editingTime) {
      await onDeleteTimer(editingTime.id);
    }
  };

  const handleAddOppgave = () => {
    setEditingOppgave(null);
    setOppgaveModalOpen(true);
  };

  const handleEditOppgave = (o) => {
    setEditingOppgave(o);
    setOppgaveModalOpen(true);
  };

  const handleSaveOppgave = async (data) => {
    if (editingOppgave) {
      await onUpdateOppgave(editingOppgave.id, data);
    } else {
      await onCreateOppgave(data);
    }
  };

  const handleDeleteOppgave = async () => {
    if (editingOppgave) {
      await onDeleteOppgave(editingOppgave.id);
    }
  };

  return (
    <div className="min-h-screen bg-ak-surface-subtle">
      <PageHeader
        title="Skoleplan"
        subtitle="Administrer timeplan, fag og oppgaver"
      />

      <div className="p-6 w-full">
        <div className="mb-6">
          <FagListe fag={fag} onEdit={handleEditFag} onAdd={handleAddFag} />
        </div>

        <div className="mb-6">
          <Timeplan timer={timer} fag={fag} onAddTime={handleAddTime} onEditTime={handleEditTime} />
        </div>

        <div>
          <OppgaveListe
            oppgaver={oppgaver}
            fag={fag}
            onToggleStatus={onToggleOppgaveStatus}
            onEdit={handleEditOppgave}
            onAdd={handleAddOppgave}
          />
        </div>

        <FagModal
          isOpen={fagModalOpen}
          onClose={() => setFagModalOpen(false)}
          fag={editingFag}
          onSave={handleSaveFag}
          onDelete={handleDeleteFag}
        />

        <TimeModal
          isOpen={timeModalOpen}
          onClose={() => setTimeModalOpen(false)}
          time={editingTime}
          allFag={fag}
          onSave={handleSaveTime}
          onDelete={handleDeleteTime}
        />

        <OppgaveModal
          isOpen={oppgaveModalOpen}
          onClose={() => setOppgaveModalOpen(false)}
          oppgave={editingOppgave}
          allFag={fag}
          onSave={handleSaveOppgave}
          onDelete={handleDeleteOppgave}
        />
      </div>
    </div>
  );
};

export default Skoleplan;
