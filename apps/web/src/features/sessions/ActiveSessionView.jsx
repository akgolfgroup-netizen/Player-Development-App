/**
 * ActiveSessionView - Aktiv Økt Under Trening
 *
 * Fokusert treningsvisning med timer og blokknavigasjon.
 * Basert på: APP_FUNCTIONALITY.md Section 7
 * Design: Blue Palette 01 (v3.0)
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BlockRatingModal from './BlockRatingModal';
import { tokens } from '../../design-tokens';

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
    <div
      style={{
        width: '100%',
        height: '8px',
        backgroundColor: 'var(--border-default)',
        borderRadius: '9999px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: color || 'var(--accent)',
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  );
}

// Rep counter component
function RepCounter({ current, target, onIncrement, onDecrement }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
        Repetisjonsteller
      </span>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
          marginTop: '16px',
        }}
      >
        <button
          onClick={onDecrement}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-secondary)',
            border: 'none',
            fontSize: '24px',
            color: 'var(--accent)',
            cursor: 'pointer',
          }}
        >
          −
        </button>

        <span style={{ fontSize: '48px', fontWeight: 700, color: 'var(--text-primary)', fontSize: '48px' }}>
          {current}
        </span>

        <button
          onClick={onIncrement}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent)',
            border: 'none',
            fontSize: '24px',
            color: 'var(--bg-primary)',
            cursor: 'pointer',
          }}
        >
          +
        </button>
      </div>

      {/* Quick add buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '16px',
        }}
      >
        <button
          onClick={() => onIncrement(10)}
          style={{
            padding: `${'8px'} ${'16px'}`,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-secondary)',
            border: 'none',
            color: 'var(--accent)',
            cursor: 'pointer',
            fontSize: '12px', lineHeight: '16px', fontWeight: 500,
          }}
        >
          + 10
        </button>
        <button
          onClick={() => onIncrement(25)}
          style={{
            padding: `${'8px'} ${'16px'}`,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-secondary)',
            border: 'none',
            color: 'var(--accent)',
            cursor: 'pointer',
            fontSize: '12px', lineHeight: '16px', fontWeight: 500,
          }}
        >
          + 25
        </button>
      </div>

      {/* Progress */}
      <div style={{ marginTop: '16px' }}>
        <ProgressBar current={current} total={target} />
        <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
          {current} / {target} repetisjoner ({Math.round((current / target) * 100)}%)
        </span>
      </div>
    </div>
  );
}

// Block navigation chips
function BlockNavigationChips({ blocks, currentIndex, completedIndices, onSelectBlock }) {
  return (
    <div style={{ padding: '16px' }}>
      <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
        Alle blokker
      </span>
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
        }}
      >
        {blocks.map((block, index) => {
          const isActive = index === currentIndex;
          const isCompleted = completedIndices.includes(index);

          return (
            <button
              key={index}
              onClick={() => onSelectBlock(index)}
              style={{
                minWidth: '64px',
                padding: '8px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive
                  ? 'var(--accent)'
                  : isCompleted
                    ? 'var(--success)'
                    : 'var(--bg-primary)',
                border: isActive || isCompleted ? 'none' : '1px solid var(--border-default)',
                color: isActive || isCompleted ? 'var(--bg-primary)' : 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 500, fontWeight: 600 }}>
                {isCompleted ? '✓' : index + 1}
              </div>
              <div style={{ fontSize: '12px', lineHeight: '16px' }}>
                {block.duration}m
              </div>
              <div style={{ fontSize: '12px', lineHeight: '16px', fontSize: '9px' }}>
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
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <span style={{ fontSize: '48px', marginBottom: '24px' }}>⏸️</span>
      <span style={{ fontSize: '28px', lineHeight: '34px', fontWeight: 700, color: 'var(--bg-primary)', marginBottom: '8px' }}>
        PAUSE
      </span>
      <span style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Økten er pauset
      </span>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '14px', lineHeight: '19px', color: 'var(--text-secondary)' }}>
          Total tid: {formatTime(totalTime)}
        </div>
        <div style={{ fontSize: '14px', lineHeight: '19px', color: 'var(--text-secondary)' }}>
          Pause: {formatTime(pauseTime)}
        </div>
      </div>

      <button
        onClick={onResume}
        style={{
          width: '200px',
          padding: '16px',
          backgroundColor: 'var(--accent)',
          color: 'var(--bg-primary)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          marginBottom: '16px',
          fontSize: '20px', lineHeight: '25px', fontWeight: 600,
        }}
      >
        ▶️ Fortsett økt
      </button>

      <button
        onClick={onEnd}
        style={{
          width: '200px',
          padding: '16px',
          backgroundColor: 'transparent',
          color: 'var(--error)',
          border: '1px solid var(--error)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          fontSize: '12px', lineHeight: '16px', fontWeight: 500,
        }}
      >
        Avslutt økt
      </button>
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
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <span style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-secondary)' }}>
          Ingen økt aktiv
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-primary)',
        minHeight: '100vh',
        fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
      }}
    >
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          backgroundColor: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <button
          onClick={togglePause}
          style={{
            padding: `${'8px'} ${'16px'}`,
            backgroundColor: 'var(--bg-secondary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: 'var(--accent)',
            cursor: 'pointer',
            fontSize: '12px', lineHeight: '16px', fontWeight: 500,
          }}
        >
          ← Pause
        </button>
        <button
          onClick={() => handleEndSessionAndEvaluate(totalSeconds, completedBlocks)}
          style={{
            padding: `${'8px'} ${'16px'}`,
            backgroundColor: 'var(--error)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: 'var(--bg-primary)',
            cursor: 'pointer',
            fontSize: '12px', lineHeight: '16px', fontWeight: 500,
          }}
        >
          Avslutt økt
        </button>
      </div>

      {/* Total timer */}
      <div
        style={{
          textAlign: 'center',
          padding: '24px',
          backgroundColor: 'var(--accent)',
        }}
      >
        <div style={{ fontSize: '48px', fontWeight: 700, color: 'var(--bg-primary)', fontSize: '48px' }}>
          {formatTime(totalSeconds)}
        </div>
        <span style={{ fontSize: '14px', lineHeight: '19px', color: 'rgba(255,255,255,0.7)' }}>
          Total økttid
        </span>

        <div style={{ marginTop: '16px' }}>
          <span style={{ fontSize: '14px', lineHeight: '19px', color: 'rgba(255,255,255,0.7)' }}>
            Blokk {currentBlockIndex + 1} av {session.blocks.length}
          </span>
          <ProgressBar
            current={currentBlockIndex + 1}
            total={session.blocks.length}
            color={'var(--achievement)'}
          />
        </div>
      </div>

      {/* Block timer */}
      <div
        style={{
          textAlign: 'center',
          padding: '24px',
          backgroundColor: 'var(--bg-primary)',
        }}
      >
        <div style={{ fontSize: '48px', fontWeight: 700, color: 'var(--text-primary)', fontSize: '40px' }}>
          {formatTime(Math.max(0, blockTimeRemaining))}
        </div>
        <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
          Gjenstående tid
        </span>
      </div>

      {/* Current block info */}
      <div style={{ padding: '16px' }}>
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            marginBottom: '16px',
          }}
        >
          <span style={{ fontSize: '20px', lineHeight: '25px', fontWeight: 600, color: 'var(--text-primary)' }}>
            BLOKK {currentBlockIndex + 1}: {currentBlock.exercise}
          </span>

          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginTop: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🎯</span>
              <span style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 500, color: 'var(--accent)' }}>
                {currentBlock.focus}
              </span>
            </div>
            {currentBlock.instructions && (
              <div style={{ fontSize: '14px', lineHeight: '19px', color: 'var(--text-primary)', marginTop: '8px' }}>
                {currentBlock.instructions}
              </div>
            )}
          </div>

          <div style={{ marginTop: '16px' }}>
            <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
              Treningsområde
            </span>
            <div style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-primary)' }}>
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
      <div style={{ padding: '16px' }}>
        <button
          onClick={handleNextBlock}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: 'var(--accent)',
            color: 'var(--bg-primary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            marginBottom: '16px',
            fontSize: '20px', lineHeight: '25px', fontWeight: 600,
          }}
        >
          {currentBlockIndex < session.blocks.length - 1 ? 'Neste blokk →' : 'Fullfør økt'}
        </button>

        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span>📝</span>
            <span style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>
              Legg til notat...
            </span>
          </div>
          <textarea
            value={blockNote}
            onChange={(e) => setBlockNote(e.target.value)}
            placeholder="Notater for denne blokken..."
            style={{
              width: '100%',
              minHeight: '60px',
              padding: '8px',
              backgroundColor: 'var(--bg-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              resize: 'none',
              fontSize: '14px', lineHeight: '19px',
            }}
          />
        </div>
      </div>
    </div>
  );
}
