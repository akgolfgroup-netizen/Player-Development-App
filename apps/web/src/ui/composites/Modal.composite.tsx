import React from 'react';

/**
 * Modal Composite
 * Modal dialog with overlay, animation, and mobile-optimized bottom sheet
 */

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalProps {
  /** Modal open state */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal content */
  children: React.ReactNode;
  /** Footer content (typically buttons) */
  footer?: React.ReactNode;
  /** Size variant */
  size?: ModalSize;
  /** Show close button */
  showCloseButton?: boolean;
  /** Close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Close on escape key */
  closeOnEsc?: boolean;
  /** Use bottom sheet on mobile */
  mobileBottomSheet?: boolean;
  /** Prevent body scroll when open */
  blockScroll?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  mobileBottomSheet = true,
  blockScroll = true,
}) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  // Handle escape key
  React.useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEsc, onClose]);

  // Handle body scroll
  React.useEffect(() => {
    if (!blockScroll) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, blockScroll]);

  // Focus trap
  React.useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const modalStyle: React.CSSProperties = {
    ...styles.modal,
    ...styles.sizes[size],
    ...(mobileBottomSheet && styles.mobileBottomSheet),
  };

  return (
    <div style={styles.portal}>
      {/* Overlay */}
      <div
        style={{
          ...styles.overlay,
          ...(isOpen && styles.overlayVisible),
        }}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        style={{
          ...modalStyle,
          ...(isOpen && styles.modalVisible),
        }}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div style={styles.header}>
            {title && (
              <h2 id="modal-title" style={styles.title}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                style={styles.closeButton}
                aria-label="Close modal"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div style={styles.content}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={styles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties | Record<string, React.CSSProperties>> = {
  portal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-4)',
  } as React.CSSProperties,
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    opacity: 0,
    transition: 'opacity 0.2s ease',
  } as React.CSSProperties,
  overlayVisible: {
    opacity: 1,
  } as React.CSSProperties,
  modal: {
    position: 'relative',
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 'calc(100vh - var(--spacing-8))',
    width: '100%',
    opacity: 0,
    transform: 'scale(0.95) translateY(-20px)',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
  } as React.CSSProperties,
  modalVisible: {
    opacity: 1,
    transform: 'scale(1) translateY(0)',
  } as React.CSSProperties,
  mobileBottomSheet: {
    '@media (max-width: 767px)': {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
      maxHeight: '90vh',
      transform: 'translateY(100%)',
    },
  } as React.CSSProperties,
  sizes: {
    sm: { maxWidth: '400px' },
    md: { maxWidth: '600px' },
    lg: { maxWidth: '800px' },
    xl: { maxWidth: '1000px' },
    full: { maxWidth: '100%', height: '100%', borderRadius: 0 },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-4) var(--spacing-5)',
    borderBottom: '1px solid var(--border-subtle)',
    flexShrink: 0,
  } as React.CSSProperties,
  title: {
    fontSize: 'var(--font-size-title3)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
  } as React.CSSProperties,
  closeButton: {
    background: 'none',
    border: 'none',
    padding: 'var(--spacing-2)',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.15s ease',
  } as React.CSSProperties,
  content: {
    padding: 'var(--spacing-5)',
    overflowY: 'auto',
    flex: 1,
  } as React.CSSProperties,
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-4) var(--spacing-5)',
    borderTop: '1px solid var(--border-subtle)',
    flexShrink: 0,
  } as React.CSSProperties,
};

export default Modal;
