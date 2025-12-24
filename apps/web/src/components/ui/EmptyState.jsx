import React from 'react';
import { FileQuestion } from 'lucide-react';
import { tokens, typographyStyle } from '../../design-tokens';

export default function EmptyState({ title = 'Ingen data', message, actionLabel, onAction, icon: Icon = FileQuestion }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: tokens.spacing.xxl,
      textAlign: 'center',
      minHeight: '300px',
    }}>
      <Icon size={48} color={tokens.colors.steel} strokeWidth={1.5} />
      <h3 style={{
        ...typographyStyle('title2'),
        color: tokens.colors.charcoal,
        margin: `${tokens.spacing.md} 0 ${tokens.spacing.sm}`,
      }}>{title}</h3>
      {message && (
        <p style={{
          ...typographyStyle('body'),
          color: tokens.colors.steel,
          maxWidth: '400px',
          margin: 0,
        }}>{message}</p>
      )}
      {actionLabel && onAction && (
        <button onClick={onAction} style={{
          ...typographyStyle('label'),
          marginTop: tokens.spacing.lg,
          padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
          backgroundColor: tokens.colors.primary,
          color: tokens.colors.white,
          border: 'none',
          borderRadius: tokens.borderRadius.sm,
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tokens.colors.primaryLight}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tokens.colors.primary}
        >{actionLabel}</button>
      )}
    </div>
  );
}
