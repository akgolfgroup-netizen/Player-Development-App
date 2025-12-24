import React from 'react';
import { CheckCircle } from 'lucide-react';
import { tokens, typographyStyle } from '../../design-tokens';

export default function SuccessState({ message = 'Fullført!', onDismiss }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: tokens.spacing.xxl,
      textAlign: 'center',
    }}>
      <CheckCircle size={48} color={tokens.colors.success} strokeWidth={1.5} />
      <p style={{
        ...typographyStyle('body'),
        color: tokens.colors.charcoal,
        marginTop: tokens.spacing.md,
      }}>{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} style={{
          ...typographyStyle('label'),
          marginTop: tokens.spacing.lg,
          padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
          backgroundColor: tokens.colors.success,
          color: tokens.colors.white,
          border: 'none',
          borderRadius: tokens.borderRadius.sm,
          cursor: 'pointer',
        }}>OK</button>
      )}
    </div>
  );
}
