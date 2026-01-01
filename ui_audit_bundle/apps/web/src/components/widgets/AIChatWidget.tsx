/**
 * AK Golf Academy - AI Chat Widget
 *
 * Floating chat widget for AI Coach interactions.
 * Provides conversational interface to the AI coach.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Trash2,
  Minimize2,
  Maximize2,
  Bot,
  User,
  Sparkles,
} from 'lucide-react';
import {
  aiService,
  ChatMessage,
  ChatRequest,
} from '../../services/aiService';

// =============================================================================
// Types
// =============================================================================

interface AIChatWidgetProps {
  defaultOpen?: boolean;
  position?: 'bottom-right' | 'bottom-left';
  playerContext?: {
    handicap?: number;
    category?: string;
    currentScreen?: string;
  };
}

// =============================================================================
// Quick Action Suggestions
// =============================================================================

const QUICK_ACTIONS = [
  { label: 'Treningsforslag', message: 'Hva bør jeg fokusere på i treningen min?' },
  { label: 'Teknikk-tips', message: 'Gi meg tips for å forbedre teknikken min' },
  { label: 'Mental styrke', message: 'Hvordan kan jeg bli sterkere mentalt på banen?' },
  { label: 'Mål-setting', message: 'Hjelp meg sette realistiske mål' },
];

// =============================================================================
// Component
// =============================================================================

const AIChatWidget: React.FC<AIChatWidgetProps> = ({
  defaultOpen = false,
  position = 'bottom-right',
  playerContext,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load conversation history on mount
  useEffect(() => {
    const history = aiService.getConversationHistory();
    if (history.length > 0) {
      setMessages(history);
    }
  }, []);

  // Check AI availability
  useEffect(() => {
    aiService.checkStatus().then((status) => {
      setIsAvailable(status.available);
    });
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = useCallback(async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || isLoading) return;

    setError(null);
    setInputValue('');

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    aiService.addToConversation(userMessage);

    setIsLoading(true);

    try {
      const request: ChatRequest = {
        message: text,
        conversationHistory: messages.slice(-10).map((m) => ({
          role: m.role,
          content: m.content,
        })),
        context: {
          currentScreen: playerContext?.currentScreen,
        },
      };

      const response = await aiService.chat(request);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      aiService.addToConversation(assistantMessage);
    } catch (err) {
      console.error('[AIChatWidget] Chat error:', err);
      setError('Kunne ikke få svar fra AI-treneren. Prøv igjen.');
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, messages, playerContext]);

  const handleClearChat = () => {
    setMessages([]);
    aiService.clearConversation();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const positionStyles: React.CSSProperties = position === 'bottom-right'
    ? { right: 'var(--spacing-4)', bottom: 'var(--spacing-4)' }
    : { left: 'var(--spacing-4)', bottom: 'var(--spacing-4)' };

  // Floating button when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{ ...styles.floatingButton, ...positionStyles }}
        aria-label="Åpne AI Coach chat"
      >
        <Sparkles size={24} />
        <span style={styles.buttonLabel}>AI Coach</span>
      </button>
    );
  }

  return (
    <div
      style={{
        ...styles.container,
        ...positionStyles,
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
            onClick={() => setIsMinimized(!isMinimized)}
            style={styles.headerButton}
            aria-label={isMinimized ? 'Maksimer' : 'Minimer'}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
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
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleSendMessage(action.message)}
                      style={styles.quickActionButton}
                      disabled={isLoading}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.message,
                      ...(message.role === 'user' ? styles.userMessage : styles.assistantMessage),
                    }}
                  >
                    <div style={styles.messageIcon}>
                      {message.role === 'user' ? (
                        <User size={16} />
                      ) : (
                        <Bot size={16} />
                      )}
                    </div>
                    <div style={styles.messageContent}>
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div style={{ ...styles.message, ...styles.assistantMessage }}>
                    <div style={styles.messageIcon}>
                      <Bot size={16} />
                    </div>
                    <div style={styles.loadingIndicator}>
                      <Loader2 size={16} style={styles.spinning} />
                      <span>Tenker...</span>
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
              onClick={handleClearChat}
              style={styles.clearButton}
              aria-label="Tøm chat"
              title="Tøm chat"
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
              disabled={isLoading || !isAvailable}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              style={{
                ...styles.sendButton,
                opacity: inputValue.trim() && !isLoading ? 1 : 0.5,
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
};

// =============================================================================
// Styles
// =============================================================================

const styles: Record<string, React.CSSProperties> = {
  floatingButton: {
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-3) var(--spacing-4)',
    backgroundColor: 'var(--accent)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 1000,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  buttonLabel: {
    fontWeight: 600,
    fontSize: 'var(--font-size-body)',
  },
  container: {
    position: 'fixed',
    width: '380px',
    maxWidth: 'calc(100vw - 32px)',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-xl)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
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
    backgroundColor: 'var(--background-elevated)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-tertiary)',
    flexShrink: 0,
  },
  messageContent: {
    padding: 'var(--spacing-3)',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--background-elevated)',
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-primary)',
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
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
  spinning: {
    animation: 'spin 1s linear infinite',
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

// Add keyframes
if (typeof document !== 'undefined' && !document.getElementById('ai-chat-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'ai-chat-styles';
  styleSheet.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default AIChatWidget;
