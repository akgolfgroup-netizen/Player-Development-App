import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { tokens } from '../../design-tokens';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Bekreft handling',
  message = 'Er du sikker på at du vil fortsette?',
  confirmLabel = 'Bekreft',
  cancelLabel = 'Avbryt',
  variant = 'warning', // 'warning', 'danger', 'info'
}) {
  const dialogRef = useRef(null);
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the confirm button when dialog opens
      confirmButtonRef.current?.focus();
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconColor: tokens.colors.error,
          iconBg: `${tokens.colors.error}15`,
          confirmBg: tokens.colors.error,
          confirmHoverBg: `${tokens.colors.error}DD`,
        };
      case 'info':
        return {
          iconColor: tokens.colors.primary,
          iconBg: `${tokens.colors.primary}15`,
          confirmBg: tokens.colors.primary,
          confirmHoverBg: tokens.colors.primaryLight,
        };
      default: // warning
        return {
          iconColor: tokens.colors.warning,
          iconBg: `${tokens.colors.warning}15`,
          confirmBg: tokens.colors.primary,
          confirmHoverBg: tokens.colors.primaryLight,
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <div
        ref={dialogRef}
        style={{
          backgroundColor: tokens.colors.white,
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          maxWidth: '400px',
          width: '90%',
          padding: '24px',
          animation: 'dialogFadeIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: styles.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={24} color={styles.iconColor} />
          </div>
          <div style={{ flex: 1 }}>
            <h2
              id="dialog-title"
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: tokens.colors.charcoal,
                margin: 0,
                marginBottom: '8px',
              }}
            >
              {title}
            </h2>
            <p
              id="dialog-description"
              style={{
                fontSize: '14px',
                color: tokens.colors.steel,
                margin: 0,
                lineHeight: '1.5',
              }}
            >
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: tokens.colors.steel,
              borderRadius: '8px',
            }}
            aria-label="Lukk dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '24px',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '500',
              color: tokens.colors.charcoal,
              backgroundColor: tokens.colors.snow,
              border: `1px solid ${tokens.colors.mist}`,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = tokens.colors.mist)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = tokens.colors.snow)}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmButtonRef}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              color: tokens.colors.white,
              backgroundColor: styles.confirmBg,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.confirmHoverBg)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.confirmBg)}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes dialogFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
