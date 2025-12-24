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

// ===== AK GOLF DESIGN TOKENS v3.0 (Blue Palette 01) =====
const tokens = {
  colors: {
    // Brand Colors - Blue Palette 01
    primary: '#10456A',
    primaryLight: '#2C5F7F',
    snow: '#EDF0F2',
    surface: '#EBE5DA',
    gold: '#C9A227',
    // Semantic Colors
    success: '#4A7C59',
    warning: '#D4A84B',
    error: '#C45B4E',
    // Neutrals
    charcoal: '#1C1C1E',
    steel: '#8E8E93',
    mist: '#E5E5EA',
    cloud: '#F2F2F7',
    white: '#FFFFFF',
  },
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px' },
  borderRadius: { sm: '4px', md: '8px', lg: '12px', full: '9999px' },
  typography: { fontFamily: 'Inter, -apple-system, system-ui, sans-serif' },
};

// Typography style helper
const typographyStyle = (variant) => {
  const styles = {
    display: { fontSize: '48px', fontWeight: 700, lineHeight: 1.1 },
    title1: { fontSize: '24px', fontWeight: 700, lineHeight: 1.2 },
    title3: { fontSize: '17px', fontWeight: 600, lineHeight: 1.3 },
    body: { fontSize: '15px', fontWeight: 400, lineHeight: 1.5 },
    callout: { fontSize: '14px', fontWeight: 400, lineHeight: 1.4 },
    caption: { fontSize: '12px', fontWeight: 500, lineHeight: 1.3 },
    label: { fontSize: '13px', fontWeight: 600, lineHeight: 1.3 },
  };
  return styles[variant] || styles.body;
};

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
        backgroundColor: tokens.colors.mist,
        borderRadius: tokens.borderRadius.full,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: color || tokens.colors.primary,
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
        backgroundColor: tokens.colors.white,
        borderRadius: tokens.borderRadius.lg,
        padding: tokens.spacing.lg,
        textAlign: 'center',
      }}
    >
      <span style={{ ...typographyStyle('caption'), color: tokens.colors.steel }}>
        Repetisjonsteller
      </span>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: tokens.spacing.xl,
          marginTop: tokens.spacing.md,
        }}
      >
        <button
          onClick={onDecrement}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: tokens.borderRadius.md,
            backgroundColor: tokens.colors.snow,
            border: 'none',
            fontSize: '24px',
            color: tokens.colors.primary,
            cursor: 'pointer',
          }}
        >
          −
        </button>

        <span style={{ ...typographyStyle('display'), color: tokens.colors.charcoal, fontSize: '48px' }}>
          {current}
        </span>

        <button
          onClick={onIncrement}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: tokens.borderRadius.md,
            backgroundColor: tokens.colors.primary,
            border: 'none',
            fontSize: '24px',
            color: tokens.colors.white,
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
          gap: tokens.spacing.sm,
          marginTop: tokens.spacing.md,
        }}
      >
        <button
          onClick={() => onIncrement(10)}
          style={{
            padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
            borderRadius: tokens.borderRadius.md,
            backgroundColor: tokens.colors.snow,
            border: 'none',
            color: tokens.colors.primary,
            cursor: 'pointer',
            ...typographyStyle('label'),
          }}
        >
          + 10
        </button>
        <button
          onClick={() => onIncrement(25)}
          style={{
            padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
            borderRadius: tokens.borderRadius.md,
            backgroundColor: tokens.colors.snow,
            border: 'none',
            color: tokens.colors.primary,
            cursor: 'pointer',
            ...typographyStyle('label'),
          }}
        >
          + 25
        </button>
      </div>

      {/* Progress */}
      <div style={{ marginTop: tokens.spacing.md }}>
        <ProgressBar current={current} total={target} />
        <span style={{ ...typographyStyle('caption'), color: tokens.colors.steel }}>
          {current} / {target} repetisjoner ({Math.round((current / target) * 100)}%)
        </span>
      </div>
    </div>
  );
}

// Block navigation chips
function BlockNavigationChips({ blocks, currentIndex, completedIndices, onSelectBlock }) {
  return (
    <div style={{ padding: tokens.spacing.md }}>
      <span style={{ ...typographyStyle('caption'), color: tokens.colors.steel, marginBottom: tokens.spacing.sm, display: 'block' }}>
        Alle blokker
      </span>
      <div
        style={{
          display: 'flex',
          gap: tokens.spacing.sm,
          overflowX: 'auto',
          paddingBottom: tokens.spacing.sm,
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
                padding: tokens.spacing.sm,
                borderRadius: tokens.borderRadius.md,
                backgroundColor: isActive
                  ? tokens.colors.primary
                  : isCompleted
                    ? tokens.colors.success
                    : tokens.colors.white,
                border: isActive || isCompleted ? 'none' : `1px solid ${tokens.colors.mist}`,
                color: isActive || isCompleted ? tokens.colors.white : tokens.colors.charcoal,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <div style={{ ...typographyStyle('label'), fontWeight: 600 }}>
                {isCompleted ? '✓' : index + 1}
              </div>
              <div style={{ ...typographyStyle('caption') }}>
                {block.duration}m
              </div>
              <div style={{ ...typographyStyle('caption'), fontSize: '9px' }}>
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
      <span style={{ fontSize: '48px', marginBottom: tokens.spacing.lg }}>⏸️</span>
      <span style={{ ...typographyStyle('title1'), color: tokens.colors.white, marginBottom: tokens.spacing.sm }}>
        PAUSE
      </span>
      <span style={{ ...typographyStyle('body'), color: tokens.colors.steel, marginBottom: tokens.spacing.lg }}>
        Økten er pauset
      </span>

      <div style={{ textAlign: 'center', marginBottom: tokens.spacing.xl }}>
        <div style={{ ...typographyStyle('callout'), color: tokens.colors.steel }}>
          Total tid: {formatTime(totalTime)}
        </div>
        <div style={{ ...typographyStyle('callout'), color: tokens.colors.steel }}>
          Pause: {formatTime(pauseTime)}
        </div>
      </div>

      <button
        onClick={onResume}
        style={{
          width: '200px',
          padding: tokens.spacing.md,
          backgroundColor: tokens.colors.primary,
          color: tokens.colors.white,
          border: 'none',
          borderRadius: tokens.borderRadius.md,
          cursor: 'pointer',
          marginBottom: tokens.spacing.md,
          ...typographyStyle('title3'),
        }}
      >
        ▶️ Fortsett økt
      </button>

      <button
        onClick={onEnd}
        style={{
          width: '200px',
          padding: tokens.spacing.md,
          backgroundColor: 'transparent',
          color: tokens.colors.error,
          border: `1px solid ${tokens.colors.error}`,
          borderRadius: tokens.borderRadius.md,
          cursor: 'pointer',
          ...typographyStyle('label'),
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
      <div style={{ padding: tokens.spacing.lg, textAlign: 'center' }}>
        <span style={{ ...typographyStyle('body'), color: tokens.colors.steel }}>
          Ingen økt aktiv
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: tokens.colors.surface,
        minHeight: '100vh',
        fontFamily: tokens.typography.fontFamily,
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
          padding: tokens.spacing.md,
          backgroundColor: tokens.colors.white,
          borderBottom: `1px solid ${tokens.colors.mist}`,
        }}
      >
        <button
          onClick={togglePause}
          style={{
            padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
            backgroundColor: tokens.colors.snow,
            border: 'none',
            borderRadius: tokens.borderRadius.md,
            color: tokens.colors.primary,
            cursor: 'pointer',
            ...typographyStyle('label'),
          }}
        >
          ← Pause
        </button>
        <button
          onClick={() => handleEndSessionAndEvaluate(totalSeconds, completedBlocks)}
          style={{
            padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
            backgroundColor: tokens.colors.error,
            border: 'none',
            borderRadius: tokens.borderRadius.md,
            color: tokens.colors.white,
            cursor: 'pointer',
            ...typographyStyle('label'),
          }}
        >
          Avslutt økt
        </button>
      </div>

      {/* Total timer */}
      <div
        style={{
          textAlign: 'center',
          padding: tokens.spacing.lg,
          backgroundColor: tokens.colors.primary,
        }}
      >
        <div style={{ ...typographyStyle('display'), color: tokens.colors.white, fontSize: '48px' }}>
          {formatTime(totalSeconds)}
        </div>
        <span style={{ ...typographyStyle('callout'), color: 'rgba(255,255,255,0.7)' }}>
          Total økttid
        </span>

        <div style={{ marginTop: tokens.spacing.md }}>
          <span style={{ ...typographyStyle('callout'), color: 'rgba(255,255,255,0.7)' }}>
            Blokk {currentBlockIndex + 1} av {session.blocks.length}
          </span>
          <ProgressBar
            current={currentBlockIndex + 1}
            total={session.blocks.length}
            color={tokens.colors.gold}
          />
        </div>
      </div>

      {/* Block timer */}
      <div
        style={{
          textAlign: 'center',
          padding: tokens.spacing.lg,
          backgroundColor: tokens.colors.white,
        }}
      >
        <div style={{ ...typographyStyle('display'), color: tokens.colors.charcoal, fontSize: '40px' }}>
          {formatTime(Math.max(0, blockTimeRemaining))}
        </div>
        <span style={{ ...typographyStyle('caption'), color: tokens.colors.steel }}>
          Gjenstående tid
        </span>
      </div>

      {/* Current block info */}
      <div style={{ padding: tokens.spacing.md }}>
        <div
          style={{
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.borderRadius.lg,
            padding: tokens.spacing.md,
            marginBottom: tokens.spacing.md,
          }}
        >
          <span style={{ ...typographyStyle('title3'), color: tokens.colors.charcoal }}>
            BLOKK {currentBlockIndex + 1}: {currentBlock.exercise}
          </span>

          <div
            style={{
              backgroundColor: tokens.colors.snow,
              borderRadius: tokens.borderRadius.md,
              padding: tokens.spacing.md,
              marginTop: tokens.spacing.md,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
              <span>🎯</span>
              <span style={{ ...typographyStyle('label'), color: tokens.colors.primary }}>
                {currentBlock.focus}
              </span>
            </div>
            {currentBlock.instructions && (
              <div style={{ ...typographyStyle('callout'), color: tokens.colors.charcoal, marginTop: tokens.spacing.sm }}>
                {currentBlock.instructions}
              </div>
            )}
          </div>

          <div style={{ marginTop: tokens.spacing.md }}>
            <span style={{ ...typographyStyle('caption'), color: tokens.colors.steel }}>
              Treningsområde
            </span>
            <div style={{ ...typographyStyle('body'), color: tokens.colors.charcoal }}>
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
      <div style={{ padding: tokens.spacing.md }}>
        <button
          onClick={handleNextBlock}
          style={{
            width: '100%',
            padding: tokens.spacing.md,
            backgroundColor: tokens.colors.primary,
            color: tokens.colors.white,
            border: 'none',
            borderRadius: tokens.borderRadius.md,
            cursor: 'pointer',
            marginBottom: tokens.spacing.md,
            ...typographyStyle('title3'),
          }}
        >
          {currentBlockIndex < session.blocks.length - 1 ? 'Neste blokk →' : 'Fullfør økt'}
        </button>

        <div
          style={{
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.borderRadius.lg,
            padding: tokens.spacing.md,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, marginBottom: tokens.spacing.sm }}>
            <span>📝</span>
            <span style={{ ...typographyStyle('label'), color: tokens.colors.charcoal }}>
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
              padding: tokens.spacing.sm,
              backgroundColor: tokens.colors.snow,
              border: 'none',
              borderRadius: tokens.borderRadius.md,
              resize: 'none',
              ...typographyStyle('callout'),
            }}
          />
        </div>
      </div>
    </div>
  );
}
