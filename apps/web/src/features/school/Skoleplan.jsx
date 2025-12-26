import React, { useState } from 'react';
import { tokens } from '../../design-tokens';
import { PageHeader } from '../../components/layout/PageHeader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
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

// Time slots available for scheduling (unused for now, kept for future features)
// const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

const PRIORITET_COLORS = {
  low: tokens.colors.steel,
  medium: tokens.colors.warning,
  high: tokens.colors.error
};

const PRIORITET_LABELS = {
  low: 'Lav',
  medium: 'Medium',
  high: 'Hoy'
};

const DEFAULT_COLORS = [
  '#10456A', '#4A7C59', '#C9A227', '#C45B4E', '#6B5B95',
  '#88B04B', '#F7CAC9', '#92A8D1', '#955251', '#009B77'
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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: `1px solid ${tokens.colors.mist}`
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: tokens.colors.charcoal, margin: 0 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: tokens.colors.steel
            }}
          >
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '24px' }}>
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
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal, marginBottom: '6px' }}>
            Fagnavn *
          </label>
          <input
            type="text"
            value={form.navn}
            onChange={e => setForm({ ...form, navn: e.target.value })}
            placeholder="f.eks. Matematikk"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${tokens.colors.mist}`,
              borderRadius: '8px',
              fontSize: '15px',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal, marginBottom: '6px' }}>
            Larer
          </label>
          <input
            type="text"
            value={form.larer}
            onChange={e => setForm({ ...form, larer: e.target.value })}
            placeholder="Larerens navn"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${tokens.colors.mist}`,
              borderRadius: '8px',
              fontSize: '15px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal, marginBottom: '6px' }}>
            Rom
          </label>
          <input
            type="text"
            value={form.rom}
            onChange={e => setForm({ ...form, rom: e.target.value })}
            placeholder="f.eks. A101"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${tokens.colors.mist}`,
              borderRadius: '8px',
              fontSize: '15px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal, marginBottom: '8px' }}>
            Farge
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {DEFAULT_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setForm({ ...form, farge: color })}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: color,
                  border: form.farge === color ? '3px solid ' + tokens.colors.charcoal : '2px solid transparent',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {fag && (
            <button
              type="button"
              onClick={handleDelete}
              style={{
                padding: '10px 16px',
                backgroundColor: `${tokens.colors.error}15`,
                color: tokens.colors.error,
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Slett
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 16px',
              backgroundColor: tokens.colors.cloud,
              color: tokens.colors.charcoal,
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Avbryt
          </button>
          <button
            type="submit"
            disabled={saving || !form.navn.trim()}
            style={{
              padding: '10px 20px',
              backgroundColor: tokens.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: saving ? 'wait' : 'pointer',
              opacity: saving || !form.navn.trim() ? 0.6 : 1
            }}
          >
            {saving ? 'Lagrer...' : (fag ? 'Oppdater' : 'Opprett')}
          </button>
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
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <BookOpen size={48} color={tokens.colors.steel} style={{ marginBottom: '16px' }} />
          <p style={{ color: tokens.colors.steel, marginBottom: '16px' }}>
            Du ma opprette minst ett fag for du kan legge til timer.
          </p>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: tokens.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            OK
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={time ? 'Rediger time' : 'Ny time'}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal, marginBottom: '6px' }}>
            Fag *
          </label>
          <select
            value={form.fagId}
            onChange={e => setForm({ ...form, fagId: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${tokens.colors.mist}`,
              borderRadius: '8px',
              fontSize: '15px',
              boxSizing: 'border-box',
              backgroundColor: 'white'
            }}
            required
          >
            {allFag.map(f => (
              <option key={f.id} value={f.id}>{f.navn}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal, marginBottom: '6px' }}>
            Ukedag *
          </label>
          <select
            value={form.ukedag}
            onChange={e => setForm({ ...form, ukedag: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${tokens.colors.mist}`,
              borderRadius: '8px',
              fontSize: '15px',
              boxSizing: 'border-box',
              backgroundColor: 'white'
            }}
            required
          >
            {UKEDAGER.map(dag => (
              <option key={dag} value={dag}>
                {dag.charAt(0).toUpperCase() + dag.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal, marginBottom: '6px' }}>
              Start *
            </label>
            <input
              type="time"
              value={form.startTid}
              onChange={e => setForm({ ...form, startTid: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${tokens.colors.mist}`,
                borderRadius: '8px',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal, marginBottom: '6px' }}>
              Slutt *
            </label>
            <input
              type="time"
              value={form.sluttTid}
              onChange={e => setForm({ ...form, sluttTid: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${tokens.colors.mist}`,
                borderRadius: '8px',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {time && (
            <button
              type="button"
              onClick={handleDelete}
              style={{
                padding: '10px 16px',
                backgroundColor: `${tokens.colors.error}15`,
                color: tokens.colors.error,
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Slett
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 16px',
              backgroundColor: tokens.colors.cloud,
              color: tokens.colors.charcoal,
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Avbryt
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '10px 20px',
              backgroundColor: tokens.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: saving ? 'wait' : 'pointer',
              opacity: saving ? 0.6 : 1
            }}
          >
            {saving ? 'Lagrer...' : (time ? 'Oppdater' : 'Opprett')}
          </button>
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
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <BookOpen size={48} color={tokens.colors.steel} style={{ marginBottom: '16px' }} />
          <p style={{ color: tokens.colors.steel, marginBottom: '16px' }}>
            Du ma opprette minst ett fag for du kan legge til oppgaver.
          </p>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: tokens.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            OK
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={oppgave ? 'Rediger oppgave' : 'Ny oppgave'}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal, marginBottom: '6px' }}>
            Fag *
          </label>
          <select
            value={form.fagId}
            onChange={e => setForm({ ...form, fagId: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${tokens.colors.mist}`,
              borderRadius: '8px',
              fontSize: '15px',
              boxSizing: 'border-box',
              backgroundColor: 'white'
            }}
            required
          >
            {allFag.map(f => (
              <option key={f.id} value={f.id}>{f.navn}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal, marginBottom: '6px' }}>
            Tittel *
          </label>
          <input
            type="text"
            value={form.tittel}
            onChange={e => setForm({ ...form, tittel: e.target.value })}
            placeholder="Hva skal gjores?"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${tokens.colors.mist}`,
              borderRadius: '8px',
              fontSize: '15px',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal, marginBottom: '6px' }}>
            Beskrivelse
          </label>
          <textarea
            value={form.beskrivelse}
            onChange={e => setForm({ ...form, beskrivelse: e.target.value })}
            placeholder="Mer detaljer..."
            rows={3}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${tokens.colors.mist}`,
              borderRadius: '8px',
              fontSize: '15px',
              boxSizing: 'border-box',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal, marginBottom: '6px' }}>
              Frist *
            </label>
            <input
              type="date"
              value={form.frist}
              onChange={e => setForm({ ...form, frist: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${tokens.colors.mist}`,
                borderRadius: '8px',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal, marginBottom: '6px' }}>
              Prioritet
            </label>
            <select
              value={form.prioritet}
              onChange={e => setForm({ ...form, prioritet: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${tokens.colors.mist}`,
                borderRadius: '8px',
                fontSize: '15px',
                boxSizing: 'border-box',
                backgroundColor: 'white'
              }}
            >
              <option value="low">Lav</option>
              <option value="medium">Medium</option>
              <option value="high">Hoy</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {oppgave && (
            <button
              type="button"
              onClick={handleDelete}
              style={{
                padding: '10px 16px',
                backgroundColor: `${tokens.colors.error}15`,
                color: tokens.colors.error,
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Slett
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 16px',
              backgroundColor: tokens.colors.cloud,
              color: tokens.colors.charcoal,
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Avbryt
          </button>
          <button
            type="submit"
            disabled={saving || !form.tittel.trim()}
            style={{
              padding: '10px 20px',
              backgroundColor: tokens.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: saving ? 'wait' : 'pointer',
              opacity: saving || !form.tittel.trim() ? 0.6 : 1
            }}
          >
            {saving ? 'Lagrer...' : (oppgave ? 'Oppdater' : 'Opprett')}
          </button>
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
  // Group timer by ukedag and sort by time
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
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      border: `1px solid ${tokens.colors.mist}`,
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: `1px solid ${tokens.colors.mist}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Clock size={20} color={tokens.colors.primary} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: tokens.colors.charcoal, margin: 0 }}>
            Timeplan
          </h3>
        </div>
        <button
          onClick={onAddTime}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            backgroundColor: `${tokens.colors.primary}10`,
            color: tokens.colors.primary,
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          Legg til
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'flex', minWidth: '600px' }}>
          {UKEDAGER.map(dag => (
            <div key={dag} style={{ flex: 1, borderRight: dag !== 'fredag' ? `1px solid ${tokens.colors.mist}` : 'none' }}>
              <div style={{
                padding: '12px',
                textAlign: 'center',
                backgroundColor: tokens.colors.cloud,
                borderBottom: `1px solid ${tokens.colors.mist}`,
                fontWeight: 600,
                fontSize: '13px',
                color: tokens.colors.charcoal
              }}>
                {UKEDAG_LABELS[dag]}
              </div>
              <div style={{ minHeight: '200px', padding: '8px' }}>
                {timerByDag[dag].length === 0 ? (
                  <div style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: tokens.colors.steel,
                    fontSize: '12px'
                  }}>
                    Ingen timer
                  </div>
                ) : (
                  timerByDag[dag].map(time => {
                    const fagInfo = getFagForTime(time);
                    return (
                      <div
                        key={time.id}
                        onClick={() => onEditTime(time)}
                        style={{
                          padding: '10px',
                          marginBottom: '6px',
                          backgroundColor: `${fagInfo?.farge || tokens.colors.primary}15`,
                          borderLeft: `3px solid ${fagInfo?.farge || tokens.colors.primary}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'transform 0.1s'
                        }}
                      >
                        <div style={{
                          fontSize: '12px',
                          color: tokens.colors.steel,
                          marginBottom: '4px'
                        }}>
                          {time.startTid} - {time.sluttTid}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: tokens.colors.charcoal
                        }}>
                          {fagInfo?.navn || 'Ukjent fag'}
                        </div>
                        {fagInfo?.rom && (
                          <div style={{
                            fontSize: '11px',
                            color: tokens.colors.steel,
                            marginTop: '2px'
                          }}>
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
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [fagFilter, setFagFilter] = useState('all');

  const filteredOppgaver = oppgaver
    .filter(o => filter === 'all' || o.status === filter)
    .filter(o => fagFilter === 'all' || o.fagId === fagFilter)
    .sort((a, b) => {
      // Pending first, then by date
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
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      border: `1px solid ${tokens.colors.mist}`,
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: `1px solid ${tokens.colors.mist}`,
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookOpen size={20} color={tokens.colors.primary} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: tokens.colors.charcoal, margin: 0 }}>
            Oppgaver
          </h3>
          {pendingCount > 0 && (
            <span style={{
              padding: '2px 8px',
              backgroundColor: tokens.colors.primary,
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 500
            }}>
              {pendingCount}
            </span>
          )}
          {overdueCount > 0 && (
            <span style={{
              padding: '2px 8px',
              backgroundColor: tokens.colors.error,
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 500
            }}>
              {overdueCount} forsinket
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={fagFilter}
            onChange={e => setFagFilter(e.target.value)}
            style={{
              padding: '6px 10px',
              border: `1px solid ${tokens.colors.mist}`,
              borderRadius: '6px',
              fontSize: '13px',
              backgroundColor: 'white'
            }}
          >
            <option value="all">Alle fag</option>
            {fag.map(f => (
              <option key={f.id} value={f.id}>{f.navn}</option>
            ))}
          </select>

          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{
              padding: '6px 10px',
              border: `1px solid ${tokens.colors.mist}`,
              borderRadius: '6px',
              fontSize: '13px',
              backgroundColor: 'white'
            }}
          >
            <option value="all">Alle</option>
            <option value="pending">Ugjort</option>
            <option value="completed">Fullfort</option>
          </select>

          <button
            onClick={onAdd}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              backgroundColor: `${tokens.colors.primary}10`,
              color: tokens.colors.primary,
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <Plus size={16} />
            Ny oppgave
          </button>
        </div>
      </div>

      <div style={{ maxHeight: '400px', overflow: 'auto' }}>
        {filteredOppgaver.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: tokens.colors.steel
          }}>
            <CheckCircle2 size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
            <p style={{ margin: 0 }}>Ingen oppgaver a vise</p>
          </div>
        ) : (
          filteredOppgaver.map(oppgave => {
            const fagInfo = getFagForOppgave(oppgave);
            const overdue = oppgave.status === 'pending' && isOverdue(oppgave.frist);
            const daysUntil = getDaysUntil(oppgave.frist);

            return (
              <div
                key={oppgave.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '14px 20px',
                  borderBottom: `1px solid ${tokens.colors.mist}`,
                  backgroundColor: oppgave.status === 'completed' ? `${tokens.colors.cloud}50` : 'white'
                }}
              >
                <button
                  onClick={() => onToggleStatus(oppgave.id, oppgave.status)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    marginTop: '2px'
                  }}
                >
                  {oppgave.status === 'completed' ? (
                    <CheckCircle2 size={22} color={tokens.colors.success} />
                  ) : (
                    <Circle size={22} color={tokens.colors.steel} />
                  )}
                </button>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        backgroundColor: `${fagInfo?.farge || tokens.colors.primary}20`,
                        color: fagInfo?.farge || tokens.colors.primary,
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 500
                      }}
                    >
                      {fagInfo?.navn || 'Ukjent'}
                    </span>
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: PRIORITET_COLORS[oppgave.prioritet]
                      }}
                      title={`Prioritet: ${PRIORITET_LABELS[oppgave.prioritet]}`}
                    />
                  </div>

                  <div style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: oppgave.status === 'completed' ? tokens.colors.steel : tokens.colors.charcoal,
                    textDecoration: oppgave.status === 'completed' ? 'line-through' : 'none',
                    marginBottom: '4px'
                  }}>
                    {oppgave.tittel}
                  </div>

                  {oppgave.beskrivelse && (
                    <div style={{
                      fontSize: '13px',
                      color: tokens.colors.steel,
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {oppgave.beskrivelse}
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    color: overdue ? tokens.colors.error : tokens.colors.steel
                  }}>
                    {overdue && <AlertCircle size={12} />}
                    <Calendar size={12} />
                    <span>
                      {formatDate(oppgave.frist)}
                      {oppgave.status === 'pending' && (
                        <span style={{ marginLeft: '4px' }}>
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
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: tokens.colors.steel
                  }}
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
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      border: `1px solid ${tokens.colors.mist}`,
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: `1px solid ${tokens.colors.mist}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <GraduationCap size={20} color={tokens.colors.primary} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: tokens.colors.charcoal, margin: 0 }}>
            Fag
          </h3>
          <span style={{
            padding: '2px 8px',
            backgroundColor: tokens.colors.cloud,
            color: tokens.colors.steel,
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 500
          }}>
            {fag.length}
          </span>
        </div>
        <button
          onClick={onAdd}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            backgroundColor: `${tokens.colors.primary}10`,
            color: tokens.colors.primary,
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          Nytt fag
        </button>
      </div>

      {fag.length === 0 ? (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          color: tokens.colors.steel
        }}>
          <BookOpen size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
          <p style={{ margin: 0 }}>Ingen fag enda. Opprett ditt forste fag!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '16px' }}>
          {fag.map(f => (
            <div
              key={f.id}
              onClick={() => onEdit(f)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                backgroundColor: `${f.farge || tokens.colors.primary}15`,
                borderLeft: `3px solid ${f.farge || tokens.colors.primary}`,
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: tokens.colors.charcoal }}>
                  {f.navn}
                </div>
                {(f.larer || f.rom) && (
                  <div style={{ fontSize: '12px', color: tokens.colors.steel }}>
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
  // Modal states
  const [fagModalOpen, setFagModalOpen] = useState(false);
  const [editingFag, setEditingFag] = useState(null);
  const [timeModalOpen, setTimeModalOpen] = useState(false);
  const [editingTime, setEditingTime] = useState(null);
  const [oppgaveModalOpen, setOppgaveModalOpen] = useState(false);
  const [editingOppgave, setEditingOppgave] = useState(null);

  // Fag handlers
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

  // Time handlers
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

  // Oppgave handlers
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
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.snow }}>
      <PageHeader
        title="Skoleplan"
        subtitle="Administrer timeplan, fag og oppgaver"
      />

      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>

      {/* Fag section */}
      <div style={{ marginBottom: '24px' }}>
        <FagListe fag={fag} onEdit={handleEditFag} onAdd={handleAddFag} />
      </div>

      {/* Timeplan section */}
      <div style={{ marginBottom: '24px' }}>
        <Timeplan timer={timer} fag={fag} onAddTime={handleAddTime} onEditTime={handleEditTime} />
      </div>

      {/* Oppgaver section */}
      <div>
        <OppgaveListe
          oppgaver={oppgaver}
          fag={fag}
          onToggleStatus={onToggleOppgaveStatus}
          onEdit={handleEditOppgave}
          onAdd={handleAddOppgave}
        />
      </div>

      {/* Modals */}
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
