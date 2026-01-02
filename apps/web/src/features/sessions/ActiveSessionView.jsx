/**
 * AK Golf Academy - Active Session View
 * Design System v3.0 - Premium Light
 *
 * Focused training view with timer and block navigation.
 * Based on: APP_FUNCTIONALITY.md Section 7
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BlockRatingModal from './BlockRatingModal';
import Button from '../../ui/primitives/Button';

// Format time as HH:MM:SS
function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Progress bar component
function ProgressBar({ current, total, color }) {
  const percentage = (current / total) * 100;
  return (
    <div className="w-full h-2 bg-ak-border-default rounded-full overflow-hidden">
      <div
        className="h-full transition-all duration-300 ease-out"
        style={{
          width: `${percentage}%`,
          backgroundColor: color || 'var(--ak-brand-primary)',
        }}
      />
    </div>
  );
}

// Rep counter component
function RepCounter({ current, target, onIncrement, onDecrement }) {
  return (
    <div className="bg-ak-surface-base rounded-xl p-6 text-center">
      <span className="text-xs text-ak-text-secondary">
        Repetisjonsteller
      </span>

      <div className="flex items-center justify-center gap-8 mt-4">
        <button
          onClick={onDecrement}
          className="w-14 h-14 rounded-lg bg-ak-surface-subtle border-none text-2xl text-ak-brand-primary cursor-pointer hover:bg-ak-surface-base transition-colors"
        >
          −
        </button>

        <span className="text-5xl font-bold text-ak-text-primary">
          {current}
        </span>

        <button
          onClick={onIncrement}
          className="w-14 h-14 rounded-lg bg-ak-brand-primary border-none text-2xl text-white cursor-pointer hover:opacity-90 transition-opacity"
        >
          +
        </button>
      </div>

      {/* Quick add buttons */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => onIncrement(10)}
          className="py-2 px-4 rounded-lg bg-ak-surface-subtle border-none text-ak-brand-primary cursor-pointer text-xs font-medium hover:bg-ak-surface-base transition-colors"
        >
          + 10
        </button>
        <button
          onClick={() => onIncrement(25)}
          className="py-2 px-4 rounded-lg bg-ak-surface-subtle border-none text-ak-brand-primary cursor-pointer text-xs font-medium hover:bg-ak-surface-base transition-colors"
        >
          + 25
        </button>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <ProgressBar current={current} total={target} />
        <span className="text-xs text-ak-text-secondary">
          {current} / {target} repetisjoner ({Math.round((current / target) * 100)}%)
        </span>
      </div>
    </div>
  );
}

// Block navigation chips
function BlockNavigationChips({ blocks, currentIndex, completedIndices, onSelectBlock }) {
  const getChipClasses = (index) => {
    const isActive = index === currentIndex;
    const isCompleted = completedIndices.includes(index);

    if (isActive) {
      return 'bg-ak-brand-primary text-white border-none';
    }
    if (isCompleted) {
      return 'bg-ak-status-success text-white border-none';
    }
    return 'bg-ak-surface-base text-ak-text-primary border border-ak-border-default';
  };

  return (
    <div className="p-4">
      <span className="text-xs text-ak-text-secondary mb-2 block">
        Alle blokker
      </span>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {blocks.map((block, index) => {
          const isCompleted = completedIndices.includes(index);

          return (
            <button
              key={index}
              onClick={() => onSelectBlock(index)}
              className={`min-w-16 p-2 rounded-lg cursor-pointer text-center ${getChipClasses(index)}`}
            >
              <div className="text-xs font-semibold">
                {isCompleted ? '✓' : index + 1}
              </div>
              <div className="text-xs">
                {block.duration}m
              </div>
              <div className="text-[9px]">
                {block.exercise.substring(0, 6)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Pause mode overlay
function PauseOverlay({ totalTime, pauseTime, onResume, onEnd }) {
  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-[1000]">
      <span className="text-5xl mb-6">⏸️</span>
      <span className="text-[28px] font-bold text-white mb-2">
        PAUSE
      </span>
      <span className="text-[15px] text-ak-text-secondary mb-6">
        Økten er pauset
      </span>

      <div className="text-center mb-8">
        <div className="text-sm text-ak-text-secondary">
          Total tid: {formatTime(totalTime)}
        </div>
        <div className="text-sm text-ak-text-secondary">
          Pause: {formatTime(pauseTime)}
        </div>
      </div>

      <Button
        variant="primary"
        onClick={onResume}
        className="w-[200px] py-4 mb-4 text-xl font-semibold"
      >
        ▶️ Fortsett økt
      </Button>

      <Button
        variant="secondary"
        onClick={onEnd}
        className="w-[200px] py-4 text-ak-status-error border-ak-status-error"
      >
        Avslutt økt
      </Button>
    </div>
  );
}

// Main ActiveSessionView component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ActiveSessionView({ session, onEndSession, onPause: _onPause, onBlockComplete, navigateToEvaluation = true }) {
  const navigate = useNavigate();
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [completedBlocks, setCompletedBlocks] = useState([]);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [blockSeconds, setBlockSeconds] = useState(0);
  const [reps, setReps] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseSeconds, setPauseSeconds] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [blockNote, setBlockNote] = useState('');

  // Handle ending session and navigating to evaluation
  const handleEndSessionAndEvaluate = useCallback((totalTime, completed) => {
    if (onEndSession) {
      onEndSession(totalTime, completed);
    }
    if (navigateToEvaluation && session?.id) {
      navigate(`/session/${session.id}/evaluate`);
    }
  }, [onEndSession, navigateToEvaluation, session?.id, navigate]);

  const currentBlock = session?.blocks[currentBlockIndex];
  const blockTimeRemaining = currentBlock ? (currentBlock.duration * 60) - blockSeconds : 0;

  // Timer effect
  useEffect(() => {
    if (isPaused) {
      const pauseInterval = setInterval(() => {
        setPauseSeconds(prev => prev + 1);
      }, 1000);
      return () => clearInterval(pauseInterval);
    }

    const interval = setInterval(() => {
      setTotalSeconds(prev => prev + 1);
      setBlockSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleIncrement = useCallback((amount = 1) => {
    setReps(prev => prev + amount);
  }, []);

  const handleDecrement = useCallback(() => {
    setReps(prev => Math.max(0, prev - 1));
  }, []);

  const handleNextBlock = () => {
    setShowRatingModal(true);
  };

  const handleBlockRatingComplete = (rating) => {
    // Save block data
    const blockData = {
      blockIndex: currentBlockIndex,
      actualDuration: blockSeconds,
      actualReps: reps,
      qualityRating: rating.quality,
      focusRating: rating.focus,
      intensityRating: rating.intensity,
      note: blockNote,
      completedAt: new Date().toISOString(),
    };

    // Save to API if callback provided
    if (onBlockComplete) {
      onBlockComplete(blockData);
    }

    // Mark as completed
    setCompletedBlocks(prev => [...prev, currentBlockIndex]);

    // Move to next block or end session
    if (currentBlockIndex < session.blocks.length - 1) {
      setCurrentBlockIndex(prev => prev + 1);
      setBlockSeconds(0);
      setReps(0);
      setBlockNote('');
    } else {
      handleEndSessionAndEvaluate(totalSeconds, completedBlocks);
    }

    setShowRatingModal(false);
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  if (!session || !currentBlock) {
    return (
      <div className="p-6 text-center">
        <span className="text-[15px] text-ak-text-secondary">
          Ingen økt aktiv
        </span>
      </div>
    );
  }

  return (
    <div className="bg-ak-surface-base min-h-screen font-sans">
      {/* Pause overlay */}
      {isPaused && (
        <PauseOverlay
          totalTime={totalSeconds}
          pauseTime={pauseSeconds}
          onResume={togglePause}
          onEnd={() => handleEndSessionAndEvaluate(totalSeconds, completedBlocks)}
        />
      )}

      {/* Rating modal */}
      {showRatingModal && (
        <BlockRatingModal
          block={currentBlock}
          duration={blockSeconds}
          reps={reps}
          onComplete={handleBlockRatingComplete}
          onSkip={() => {
            setCompletedBlocks(prev => [...prev, currentBlockIndex]);
            if (currentBlockIndex < session.blocks.length - 1) {
              setCurrentBlockIndex(prev => prev + 1);
              setBlockSeconds(0);
              setReps(0);
            } else {
              handleEndSessionAndEvaluate(totalSeconds, completedBlocks);
            }
            setShowRatingModal(false);
          }}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-ak-surface-base border-b border-ak-border-default">
        <Button variant="secondary" size="sm" onClick={togglePause}>
          ← Pause
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleEndSessionAndEvaluate(totalSeconds, completedBlocks)}
          className="bg-ak-status-error hover:bg-ak-status-error/90"
        >
          Avslutt økt
        </Button>
      </div>

      {/* Total timer */}
      <div className="text-center p-6 bg-ak-brand-primary">
        <div className="text-5xl font-bold text-white">
          {formatTime(totalSeconds)}
        </div>
        <span className="text-sm text-white/70">
          Total økttid
        </span>

        <div className="mt-4">
          <span className="text-sm text-white/70">
            Blokk {currentBlockIndex + 1} av {session.blocks.length}
          </span>
          <ProgressBar
            current={currentBlockIndex + 1}
            total={session.blocks.length}
            color="#f59e0b"
          />
        </div>
      </div>

      {/* Block timer */}
      <div className="text-center p-6 bg-ak-surface-base">
        <div className="text-[40px] font-bold text-ak-text-primary">
          {formatTime(Math.max(0, blockTimeRemaining))}
        </div>
        <span className="text-xs text-ak-text-secondary">
          Gjenstående tid
        </span>
      </div>

      {/* Current block info */}
      <div className="p-4">
        <div className="bg-ak-surface-base rounded-xl p-4 mb-4">
          <span className="text-xl font-semibold text-ak-text-primary">
            BLOKK {currentBlockIndex + 1}: {currentBlock.exercise}
          </span>

          <div className="bg-ak-surface-subtle rounded-lg p-4 mt-4">
            <div className="flex items-center gap-2">
              <span>🎯</span>
              <span className="text-xs font-medium text-ak-brand-primary">
                {currentBlock.focus}
              </span>
            </div>
            {currentBlock.instructions && (
              <div className="text-sm text-ak-text-primary mt-2">
                {currentBlock.instructions}
              </div>
            )}
          </div>

          <div className="mt-4">
            <span className="text-xs text-ak-text-secondary">
              Treningsområde
            </span>
            <div className="text-[15px] text-ak-text-primary">
              {currentBlock.trainingArea}
            </div>
          </div>
        </div>

        {/* Rep counter */}
        <RepCounter
          current={reps}
          target={currentBlock.reps}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
        />
      </div>

      {/* Block navigation */}
      <BlockNavigationChips
        blocks={session.blocks}
        currentIndex={currentBlockIndex}
        completedIndices={completedBlocks}
        onSelectBlock={setCurrentBlockIndex}
      />

      {/* Next block / Note */}
      <div className="p-4">
        <Button
          variant="primary"
          onClick={handleNextBlock}
          className="w-full py-4 mb-4 text-xl font-semibold"
        >
          {currentBlockIndex < session.blocks.length - 1 ? 'Neste blokk →' : 'Fullfør økt'}
        </Button>

        <div className="bg-ak-surface-base rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span>📝</span>
            <span className="text-xs font-medium text-ak-text-primary">
              Legg til notat...
            </span>
          </div>
          <textarea
            value={blockNote}
            onChange={(e) => setBlockNote(e.target.value)}
            placeholder="Notater for denne blokken..."
            className="w-full min-h-[60px] p-2 bg-ak-surface-subtle border-none rounded-lg resize-none text-sm text-ak-text-primary outline-none focus:ring-1 focus:ring-ak-brand-primary"
          />
        </div>
      </div>
    </div>
  );
}
