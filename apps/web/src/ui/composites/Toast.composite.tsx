import React from 'react';

/**
 * Toast Composite
 * Toast notification system with queue management
 */

type ToastVariant = 'info' | 'success' | 'warning' | 'error';
type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

interface Toast {
  id: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContainerProps {
  /** Position of toast container */
  position?: ToastPosition;
  /** Maximum number of toasts to show */
  maxToasts?: number;
}

interface ToastItemProps extends Toast {
  onClose: (id: string) => void;
}

// Toast Context
interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Toast Provider
export const ToastProvider: React.FC<{ children: React.ReactNode } & ToastContainerProps> = ({
  children,
  position = 'top-right',
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = {
      id,
      variant: 'info',
      duration: 5000,
      ...toast,
    };

    setToasts((prev) => {
      const updated = [...prev, newToast];
      return updated.slice(-maxToasts);
    });

    // Auto-remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, [maxToasts]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = React.useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer toasts={toasts} position={position} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container Component
const ToastContainer: React.FC<{
  toasts: Toast[];
  position: ToastPosition;
  onClose: (id: string) => void;
}> = ({ toasts, position, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div style={{ ...styles.container, ...styles.positions[position] }}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};

// Individual Toast Item
const ToastItem: React.FC<ToastItemProps> = ({
  id,
  message,
  variant = 'info',
  action,
  onClose,
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="10" cy="10" r="8" />
            <path d="M6 10l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'warning':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 2L2 17h16L10 2z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 8v4M10 14h.01" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'error':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="10" cy="10" r="8" />
            <path d="M12 8l-4 4M8 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="10" cy="10" r="8" />
            <path d="M10 6v4M10 14h.01" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
    }
  };

  return (
    <div
      style={{
        ...styles.toast,
        ...styles.variants[variant],
      }}
      role="alert"
      aria-live="polite"
    >
      <div style={styles.iconContainer}>
        {getIcon()}
      </div>

      <div style={styles.content}>
        <div style={styles.message}>{message}</div>
        {action && (
          <button
            onClick={() => {
              action.onClick();
              onClose(id);
            }}
            style={styles.actionButton}
          >
            {action.label}
          </button>
        )}
      </div>

      <button
        onClick={() => onClose(id)}
        style={styles.closeButton}
        aria-label="Close notification"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 4L4 12M4 4l8 8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties | Record<string, React.CSSProperties>> = {
  container: {
    position: 'fixed',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-4)',
    pointerEvents: 'none',
  } as React.CSSProperties,
  positions: {
    'top-left': { top: 0, left: 0 },
    'top-center': { top: 0, left: '50%', transform: 'translateX(-50%)' },
    'top-right': { top: 0, right: 0 },
    'bottom-left': { bottom: 0, left: 0, flexDirection: 'column-reverse' },
    'bottom-center': { bottom: 0, left: '50%', transform: 'translateX(-50%)', flexDirection: 'column-reverse' },
    'bottom-right': { bottom: 0, right: 0, flexDirection: 'column-reverse' },
  },
  toast: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-4)',
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-md)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    minWidth: '300px',
    maxWidth: '450px',
    pointerEvents: 'auto',
    animation: 'toastSlideIn 0.3s ease',
  } as React.CSSProperties,
  variants: {
    info: { borderLeft: '4px solid var(--ak-primary)' },
    success: { borderLeft: '4px solid var(--ak-success)' },
    warning: { borderLeft: '4px solid var(--ak-warning)' },
    error: { borderLeft: '4px solid var(--ak-error)' },
  },
  iconContainer: {
    flexShrink: 0,
    marginTop: '2px',
  } as React.CSSProperties,
  content: {
    flex: 1,
    minWidth: 0,
  } as React.CSSProperties,
  message: {
    fontSize: 'var(--font-size-body)',
    color: 'var(--text-primary)',
    lineHeight: 1.5,
  } as React.CSSProperties,
  actionButton: {
    marginTop: 'var(--spacing-2)',
    padding: 'var(--spacing-1) var(--spacing-2)',
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
    color: 'var(--ak-primary)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    borderRadius: 'var(--radius-sm)',
    transition: 'background-color 0.15s ease',
  } as React.CSSProperties,
  closeButton: {
    flexShrink: 0,
    padding: 'var(--spacing-1)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.15s ease',
  } as React.CSSProperties,
};

// Add animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes toastSlideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
if (typeof document !== 'undefined' && !document.querySelector('#toast-styles')) {
  styleSheet.id = 'toast-styles';
  document.head.appendChild(styleSheet);
}

export default ToastProvider;
