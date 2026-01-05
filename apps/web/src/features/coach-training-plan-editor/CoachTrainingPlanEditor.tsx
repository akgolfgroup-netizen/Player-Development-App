/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * AK Golf Academy - Coach Training Plan Editor
 * Design System v3.0 - Premium Light
 *
 * Purpose:
 * - Enable coach to create, modify, and remove FUTURE training blocks
 * - Enforce strict immutability of past/completed records
 *
 * Contract references:
 * - COACH_ADMIN_IMPLEMENTATION_CONTRACT.md
 * - COACH_ADMIN_SCREEN_CONTRACT.md
 *
 * NON-NEGOTIABLE:
 * - Past blocks are READ-ONLY (no edit controls rendered)
 * - Completed blocks are READ-ONLY
 * - No backdating allowed
 * - No performance data shown
 * - No "effective" or "recommended" indicators
 * - All changes logged via audit trail
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */

import React, { useState } from "react";
import { ArrowLeft, ClipboardList, Plus, Trash2, Calendar, Clock, CheckCircle, Lock, Sparkles, X } from "lucide-react";
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import { PageTitle, SectionTitle } from '../../components/typography';
import AIPlanSuggestions, { SuggestionToApply } from './AIPlanSuggestions';

//////////////////////////////
// 1. TYPES
//////////////////////////////

type TrainingBlock = {
  id: string;
  name: string;
  description?: string;
  date: string; // ISO date YYYY-MM-DD
  durationMinutes?: number;
  completed: boolean;
};

type Props = {
  athleteId: string;
  athleteName?: string;
  blocks?: TrainingBlock[];
  onAddBlock: (athleteId: string, block: Omit<TrainingBlock, "id" | "completed">) => void;
  onUpdateBlock: (athleteId: string, blockId: string, updates: Partial<TrainingBlock>) => void;
  onRemoveBlock: (athleteId: string, blockId: string) => void;
  onBack: () => void;
};

//////////////////////////////
// 2. MOCK DATA
//////////////////////////////

const MOCK_BLOCKS: TrainingBlock[] = [
  { id: "b1", name: "Putting fokus", description: "Lag putts fra 1-3 meter", date: "2025-12-28", durationMinutes: 60, completed: false },
  { id: "b2", name: "Driver trening", description: "Fokus på tempo og balanse", date: "2025-12-30", durationMinutes: 90, completed: false },
  { id: "b3", name: "Kort spill", date: "2025-12-15", durationMinutes: 45, completed: true },
  { id: "b4", name: "Banespill", date: "2025-12-10", durationMinutes: 180, completed: true },
];

//////////////////////////////
// 3. HELPERS
//////////////////////////////

const getTodayISO = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const isInPast = (dateString: string): boolean => {
  return dateString < getTodayISO();
};

const isLocked = (block: TrainingBlock): boolean => {
  return isInPast(block.date) || block.completed;
};

const sortByDateAsc = (blocks: TrainingBlock[]): TrainingBlock[] =>
  [...blocks].sort((a, b) => a.date.localeCompare(b.date));

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("nb-NO", {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

//////////////////////////////
// 4. COMPONENT
//////////////////////////////

export default function CoachTrainingPlanEditor({
  athleteId,
  athleteName = "Spiller",
  blocks: apiBlocks,
  onAddBlock,
  onUpdateBlock,
  onRemoveBlock,
  onBack,
}: Props) {
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  const blocks = apiBlocks || MOCK_BLOCKS;
  const sortedBlocks = sortByDateAsc(blocks);
  const pastBlocks = sortedBlocks.filter((b) => isLocked(b));
  const futureBlocks = sortedBlocks.filter((b) => !isLocked(b));

  const handleAdd = () => {
    if (!newName.trim() || !newDate) return;
    if (isInPast(newDate)) return;

    onAddBlock(athleteId, {
      name: newName.trim(),
      description: newDescription.trim() || undefined,
      date: newDate,
      durationMinutes: newDuration ? parseInt(newDuration, 10) : undefined,
    });

    setNewName("");
    setNewDescription("");
    setNewDate("");
    setNewDuration("");
    setShowAddForm(false);
  };

  const handleRemove = (block: TrainingBlock) => {
    if (isLocked(block)) return;
    onRemoveBlock(athleteId, block.id);
  };

  const handleApplyAISuggestion = (suggestion: SuggestionToApply) => {
    if (suggestion.type === 'session') {
      // Find next available date (tomorrow or later)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];

      onAddBlock(athleteId, {
        name: suggestion.name,
        description: suggestion.description,
        date: dateStr,
        durationMinutes: suggestion.durationMinutes,
      });
    }
  };

  return (
    <section
      aria-label="Training plan editor"
      className="min-h-screen bg-ak-surface-subtle font-['Inter',-apple-system,BlinkMacSystemFont,system-ui,sans-serif]"
    >
      {/* Header */}
      <div className="bg-ak-surface-base border-b border-ak-border-default py-4 px-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-transparent border-none text-ak-primary cursor-pointer p-0 mb-4 text-[15px] leading-5"
        >
          <ArrowLeft size={20} />
          <span>Tilbake</span>
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-ak-primary/10 flex items-center justify-center">
              <ClipboardList size={24} className="text-ak-primary" />
            </div>
            <div>
              <PageTitle className="text-[28px] leading-[34px] font-bold text-ak-text-primary m-0">
                Treningsplan
              </PageTitle>
              <p className="text-xs leading-4 text-ak-text-secondary m-0 mt-1">
                {athleteName} • {futureBlocks.length} kommende økter
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowAIPanel(!showAIPanel)}
              className={`flex items-center gap-2 py-3 px-5 rounded-lg text-ak-primary cursor-pointer text-[15px] leading-5 font-semibold ${
                showAIPanel
                  ? 'border-none bg-ak-primary/10'
                  : 'border border-ak-primary bg-transparent'
              }`}
            >
              {showAIPanel ? <X size={18} /> : <Sparkles size={18} />}
              {showAIPanel ? 'Skjul AI' : 'AI Assistent'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 py-3 px-5 rounded-lg border-none bg-ak-primary text-ak-surface-base cursor-pointer text-[15px] leading-5 font-semibold"
            >
              <Plus size={18} />
              Ny økt
            </button>
          </div>
        </div>
      </div>

      <div className={`p-6 ${showAIPanel ? 'grid grid-cols-[1fr_380px] gap-6' : 'block'}`}>
        {/* Main Content */}
        <div>
        {/* Add Block Form */}
        {showAddForm && (
          <div className="bg-ak-surface-base rounded-2xl shadow-ak-card p-5 mb-6 border-2 border-ak-primary">
            <SectionTitle className="text-[17px] leading-[22px] font-semibold text-ak-text-primary m-0 mb-5">
              Legg til ny økt
            </SectionTitle>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs leading-4 text-ak-text-secondary block mb-2">
                  Navn på økt *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="F.eks. Putting fokus"
                  className="w-full py-3 px-3.5 rounded-lg border border-ak-border-default text-[15px] leading-5 text-ak-text-primary outline-none box-border bg-ak-surface-base"
                />
              </div>

              <div>
                <label className="text-xs leading-4 text-ak-text-secondary block mb-2">
                  Dato *
                </label>
                <input
                  type="date"
                  value={newDate}
                  min={getTodayISO()}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full py-3 px-3.5 rounded-lg border border-ak-border-default text-[15px] leading-5 text-ak-text-primary outline-none box-border bg-ak-surface-base"
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs leading-4 text-ak-text-secondary block mb-2">
                  Beskrivelse
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Valgfri beskrivelse av økten..."
                  rows={2}
                  className="w-full py-3 px-3.5 rounded-lg border border-ak-border-default text-[15px] leading-5 text-ak-text-primary outline-none resize-y box-border bg-ak-surface-base"
                />
              </div>

              <div>
                <label className="text-xs leading-4 text-ak-text-secondary block mb-2">
                  Varighet (minutter)
                </label>
                <input
                  type="number"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  placeholder="F.eks. 60"
                  min="1"
                  className="w-full py-3 px-3.5 rounded-lg border border-ak-border-default text-[15px] leading-5 text-ak-text-primary outline-none box-border bg-ak-surface-base"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="py-3 px-5 rounded-lg border border-ak-border-default bg-transparent text-ak-text-secondary cursor-pointer text-[15px] leading-5 font-medium"
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={handleAdd}
                disabled={!newName.trim() || !newDate}
                className={`py-3 px-5 rounded-lg border-none text-[15px] leading-5 font-semibold ${
                  newName.trim() && newDate
                    ? 'bg-ak-primary text-ak-surface-base cursor-pointer'
                    : 'bg-ak-border-default text-ak-text-secondary cursor-not-allowed'
                }`}
              >
                Legg til økt
              </button>
            </div>
          </div>
        )}

        {/* Future Blocks */}
        <div className="bg-ak-surface-base rounded-2xl shadow-ak-card overflow-hidden mb-6">
          <div className="p-5 border-b border-ak-border-default">
            <SectionTitle className="text-[17px] leading-[22px] font-semibold text-ak-text-primary m-0">
              Kommende økter
            </SectionTitle>
          </div>

          {futureBlocks.length === 0 ? (
            <div className="py-12 px-6 text-center">
              <Calendar size={40} className="text-ak-border-default mb-3" />
              <p className="text-[15px] leading-5 text-ak-text-secondary">
                Ingen planlagte økter
              </p>
            </div>
          ) : (
            <div>
              {futureBlocks.map((block, index) => (
                <div
                  key={block.id}
                  className={`flex items-center gap-4 py-4 px-5 ${
                    index < futureBlocks.length - 1 ? 'border-b border-ak-border-default' : ''
                  }`}
                >
                  <div className="w-14 py-2 rounded-lg bg-ak-primary text-ak-surface-base text-center">
                    <div className="text-xs leading-4 font-semibold uppercase">
                      {formatDate(block.date).split(' ')[0]}
                    </div>
                    <div className="text-xl font-bold">
                      {new Date(block.date).getDate()}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="text-[15px] leading-5 font-semibold text-ak-text-primary">
                      {block.name}
                    </div>
                    {block.description && (
                      <p className="text-xs leading-4 text-ak-text-secondary m-0 mt-1">
                        {block.description}
                      </p>
                    )}
                    {block.durationMinutes && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock size={12} className="text-ak-text-secondary" />
                        <span className="text-xs leading-4 text-ak-text-secondary">
                          {block.durationMinutes} min
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(block)}
                    className="flex items-center justify-center w-10 h-10 rounded-lg border border-ak-status-error bg-transparent text-ak-status-error cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Blocks (Read-only) */}
        {pastBlocks.length > 0 && (
          <div className="bg-ak-surface-base rounded-2xl shadow-ak-card overflow-hidden opacity-80">
            <div className="p-5 border-b border-ak-border-default flex items-center gap-2">
              <Lock size={16} className="text-ak-text-secondary" />
              <SectionTitle className="text-[17px] leading-[22px] font-semibold text-ak-text-secondary m-0">
                Fullførte økter
              </SectionTitle>
            </div>

            <div>
              {pastBlocks.map((block, index) => (
                <div
                  key={block.id}
                  className={`flex items-center gap-4 py-4 px-5 bg-ak-surface-subtle ${
                    index < pastBlocks.length - 1 ? 'border-b border-ak-border-default' : ''
                  }`}
                >
                  <div className="w-14 py-2 rounded-lg bg-ak-border-default text-ak-text-secondary text-center">
                    <div className="text-xs leading-4 font-semibold uppercase">
                      {formatDate(block.date).split(' ')[0]}
                    </div>
                    <div className="text-xl font-bold">
                      {new Date(block.date).getDate()}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="text-[15px] leading-5 font-medium text-ak-text-secondary">
                      {block.name}
                    </div>
                    {block.durationMinutes && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock size={12} className="text-ak-text-secondary" />
                        <span className="text-xs leading-4 text-ak-text-secondary">
                          {block.durationMinutes} min
                        </span>
                      </div>
                    )}
                  </div>

                  {block.completed && (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle size={16} className="text-ak-status-success" />
                      <span className="text-xs leading-4 text-ak-status-success">
                        Fullført
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        </div>

        {/* AI Panel */}
        {showAIPanel && (
          <div className="sticky top-6 self-start">
            <AIPlanSuggestions
              playerId={athleteId}
              playerName={athleteName}
              onApplySuggestion={handleApplyAISuggestion}
            />
          </div>
        )}
      </div>
    </section>
  );
}

//////////////////////////////
// 5. STRICT NOTES
//////////////////////////////

/*
- Do NOT render edit controls for past/completed blocks.
- Do NOT allow backdating (min={getTodayISO()} on date input).
- Do NOT show performance outcomes of any block.
- Do NOT show "effective" or "successful" indicators.
- Do NOT show AI-generated suggestions or recommendations.
- Do NOT allow importing plans from other athletes.
- Do NOT show comparison to other athletes' plans.
- All mutations are logged by the API layer (not this component's responsibility).
*/
