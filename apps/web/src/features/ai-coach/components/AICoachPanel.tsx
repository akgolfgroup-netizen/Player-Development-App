/**
 * AI Coach Panel
 *
 * Chat interface panel for AI Coach interactions.
 * Features:
 * - Message list with user/assistant differentiation
 * - Input field with send button
 * - Quick action suggestions for empty state
 * - Loading indicator
 * - Minimize/maximize/close controls
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  X,
  Send,
  Loader2,
  Trash2,
  Minimize2,
  Maximize2,
  Bot,
  User,
} from 'lucide-react';
import { useAICoach } from '../context/AICoachContext';
import { DEFAULT_QUICK_ACTIONS } from '../types';

// =============================================================================
// Component
// =============================================================================

export function AICoachPanel() {
  const {
    isOpen,
    isMinimized,
    messages,
    isLoading,
    isStreaming,
    streamingContent,
    error,
    isAvailable,
    closePanel,
    minimizePanel,
    maximizePanel,
    sendMessage,
    clearMessages,
    markAsRead,
  } = useAICoach();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive or streaming updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Focus input when opening/maximizing
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
      markAsRead();
    }
  }, [isOpen, isMinimized, markAsRead]);

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || isLoading || isStreaming) return;

    setInputValue('');
    await sendMessage(text);
  };

  // Combined loading state for UI
  const isBusy = isLoading || isStreaming;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (message: string) => {
    handleSendMessage(message);
  };

  return (
    <div
      style={{
        ...styles.container,
        height: isMinimized ? 'auto' : '500px',
      }}
      role="dialog"
      aria-label="AI Coach chat"
    >
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerInfo}>
          <Bot size={20} style={{ color: 'var(--accent)' }} />
          <div>
            <div style={styles.headerTitle}>AI Golf Coach</div>
            <div style={styles.headerStatus}>
              {isAvailable ? 'Klar til å hjelpe' : 'Utilgjengelig'}
            </div>
          </div>
        </div>
        <div style={styles.headerActions}>
          <button
            onClick={isMinimized ? maximizePanel : minimizePanel}
            style={styles.headerButton}
            aria-label={isMinimized ? 'Maksimer' : 'Minimer'}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            onClick={closePanel}
            style={styles.headerButton}
            aria-label="Lukk chat"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div style={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div style={styles.welcomeContainer}>
                <Bot size={48} style={{ color: 'var(--accent)', opacity: 0.5 }} />
                <h3 style={styles.welcomeTitle}>Hei! Jeg er din AI Golf Coach</h3>
                <p style={styles.welcomeText}>
                  Spør meg om trening, teknikk, mentale strategier eller målsetting.
                </p>
                <div style={styles.quickActions}>
                  {DEFAULT_QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.message)}
                      style={styles.quickActionButton}
                      disabled={isBusy}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      ...styles.message,
                      ...(message.role === 'user' ? styles.userMessage : styles.assistantMessage),
                    }}
                  >
                    <div
                      style={{
                        ...styles.messageIcon,
                        ...(message.role === 'user' ? styles.userIcon : styles.assistantIcon),
                      }}
                    >
                      {message.role === 'user' ? (
                        <User size={16} />
                      ) : (
                        <Bot size={16} />
                      )}
                    </div>
                    <div
                      style={{
                        ...styles.messageContent,
                        ...(message.role === 'user' ? styles.userContent : styles.assistantContent),
                      }}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {/* Streaming response in progress */}
                {isStreaming && streamingContent && (
                  <div style={{ ...styles.message, ...styles.assistantMessage }}>
                    <div style={{ ...styles.messageIcon, ...styles.assistantIcon }}>
                      <Bot size={16} />
                    </div>
                    <div style={{ ...styles.messageContent, ...styles.assistantContent }}>
                      {streamingContent}
                      <span style={styles.streamingCursor}>▌</span>
                    </div>
                  </div>
                )}
                {/* Loading indicator (non-streaming fallback) */}
                {isLoading && !isStreaming && (
                  <div style={{ ...styles.message, ...styles.assistantMessage }}>
                    <div style={{ ...styles.messageIcon, ...styles.assistantIcon }}>
                      <Bot size={16} />
                    </div>
                    <div style={styles.loadingIndicator}>
                      <Loader2 size={16} className="ai-coach-spin" />
                      <span>Tenker...</span>
                    </div>
                  </div>
                )}
                {/* Streaming initial state - waiting for first token */}
                {isStreaming && !streamingContent && (
                  <div style={{ ...styles.message, ...styles.assistantMessage }}>
                    <div style={{ ...styles.messageIcon, ...styles.assistantIcon }}>
                      <Bot size={16} />
                    </div>
                    <div style={styles.loadingIndicator}>
                      <Loader2 size={16} className="ai-coach-spin" />
                      <span>Skriver...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Error */}
          {error && (
            <div style={styles.errorBanner}>
              {error}
            </div>
          )}

          {/* Input */}
          <div style={styles.inputContainer}>
            <button
              onClick={clearMessages}
              style={styles.clearButton}
              aria-label="Tøm chat"
              title="Tøm samtalen"
            >
              <Trash2 size={16} />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Skriv en melding..."
              style={styles.input}
              disabled={isBusy || !isAvailable}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isBusy}
              style={{
                ...styles.sendButton,
                opacity: inputValue.trim() && !isBusy ? 1 : 0.5,
              }}
              aria-label="Send melding"
            >
              <Send size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// =============================================================================
// Styles
// =============================================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    right: 'var(--spacing-4)',
    bottom: 'var(--spacing-4)',
    width: '380px',
    maxWidth: 'calc(100vw - 32px)',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-xl)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1001,
    overflow: 'hidden',
    border: '1px solid var(--border-subtle)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-3) var(--spacing-4)',
    backgroundColor: 'var(--background-elevated)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  headerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },
  headerTitle: {
    fontWeight: 600,
    fontSize: 'var(--font-size-body)',
    color: 'var(--text-primary)',
  },
  headerStatus: {
    fontSize: 'var(--font-size-caption)',
    color: 'var(--text-tertiary)',
  },
  headerActions: {
    display: 'flex',
    gap: 'var(--spacing-1)',
  },
  headerButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-tertiary)',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: 'var(--spacing-4)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  welcomeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 'var(--spacing-6)',
    gap: 'var(--spacing-3)',
  },
  welcomeTitle: {
    fontSize: 'var(--font-size-subheadline)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  welcomeText: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  quickActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--spacing-2)',
    justifyContent: 'center',
    marginTop: 'var(--spacing-2)',
  },
  quickActionButton: {
    padding: 'var(--spacing-2) var(--spacing-3)',
    backgroundColor: 'var(--background-elevated)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--font-size-caption)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
  },
  message: {
    display: 'flex',
    gap: 'var(--spacing-2)',
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
  },
  messageIcon: {
    width: '28px',
    height: '28px',
    borderRadius: 'var(--radius-full)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  userIcon: {
    backgroundColor: 'var(--accent)',
    color: 'white',
  },
  assistantIcon: {
    backgroundColor: 'var(--background-elevated)',
    color: 'var(--text-tertiary)',
  },
  messageContent: {
    padding: 'var(--spacing-3)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-footnote)',
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
  },
  userContent: {
    backgroundColor: 'var(--accent)',
    color: 'white',
  },
  assistantContent: {
    backgroundColor: 'var(--background-elevated)',
    color: 'var(--text-primary)',
  },
  loadingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-3)',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--background-elevated)',
    color: 'var(--text-tertiary)',
    fontSize: 'var(--font-size-footnote)',
  },
  streamingCursor: {
    display: 'inline-block',
    marginLeft: '2px',
    color: 'var(--accent)',
    animation: 'ai-coach-blink 1s step-end infinite',
  },
  errorBanner: {
    padding: 'var(--spacing-2) var(--spacing-4)',
    backgroundColor: 'var(--status-error-muted)',
    color: 'var(--status-error)',
    fontSize: 'var(--font-size-caption)',
    textAlign: 'center',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-3) var(--spacing-4)',
    borderTop: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--background-default)',
  },
  clearButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-tertiary)',
    cursor: 'pointer',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    padding: 'var(--spacing-2) var(--spacing-3)',
    backgroundColor: 'var(--background-surface)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-primary)',
    outline: 'none',
    fontFamily: 'inherit',
  },
  sendButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    backgroundColor: 'var(--accent)',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    color: 'white',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'opacity 0.15s ease',
  },
};

// Add animations and responsive styles
if (typeof document !== 'undefined' && !document.getElementById('ai-coach-panel-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'ai-coach-panel-styles';
  styleSheet.textContent = `
    @keyframes ai-coach-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .ai-coach-spin {
      animation: ai-coach-spin 1s linear infinite;
    }
    @keyframes ai-coach-blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }

    /* Header button hover */
    [aria-label="Lukk chat"]:hover,
    [aria-label="Minimer"]:hover,
    [aria-label="Maksimer"]:hover {
      background-color: var(--background-surface);
    }

    /* Quick action hover */
    [role="dialog"] button[disabled="false"]:hover {
      background-color: var(--background-surface);
      border-color: var(--accent);
    }

    /* Input focus */
    [role="dialog"] input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px var(--accent-muted);
    }

    /* Mobile responsive */
    @media (max-width: 480px) {
      [role="dialog"][aria-label="AI Coach chat"] {
        right: 0 !important;
        bottom: 0 !important;
        width: 100vw !important;
        max-width: 100vw !important;
        height: 100vh !important;
        max-height: 100vh !important;
        border-radius: 0 !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default AICoachPanel;
