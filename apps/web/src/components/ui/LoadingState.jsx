import React from 'react';
import { tokens, typographyStyle } from '../../design-tokens';

export default function LoadingState({ message = 'Laster...' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: tokens.spacing.xxl,
        minHeight: '200px',
      }}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div style={{
        width: '40px',
        height: '40px',
        border: `3px solid ${tokens.colors.mist}`,
        borderTopColor: tokens.colors.primary,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{
        ...typographyStyle('callout'),
        color: tokens.colors.steel,
        marginTop: tokens.spacing.md,
      }}>{message}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
