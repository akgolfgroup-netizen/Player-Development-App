import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { tokens, typographyStyle } from '../../design-tokens';

const errorMessages = {
  validation_error: 'Ugyldig input. Vennligst sjekk feltene.',
  authentication_error: 'Du må logge inn på nytt.',
  authorization_error: 'Du har ikke tilgang til denne ressursen.',
  domain_violation: 'Forespørselen kunne ikke behandles.',
  system_failure: 'Noe gikk galt. Vennligst prøv igjen.',
};

export default function ErrorState({ errorType = 'system_failure', message, onRetry }) {
  const defaultMessage = errorMessages[errorType] || errorMessages.system_failure;
  const displayMessage = message || defaultMessage;

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
      <AlertCircle size={48} color={tokens.colors.error} strokeWidth={1.5} />
      <h3 style={{
        ...typographyStyle('title2'),
        color: tokens.colors.charcoal,
        margin: `${tokens.spacing.md} 0 ${tokens.spacing.sm}`,
      }}>Feil oppstod</h3>
      <p style={{
        ...typographyStyle('body'),
        color: tokens.colors.steel,
        maxWidth: '400px',
        margin: 0,
      }}>{displayMessage}</p>
      {onRetry && (
        <button onClick={onRetry} style={{
          ...typographyStyle('label'),
          marginTop: tokens.spacing.lg,
          padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
          backgroundColor: tokens.colors.forest,
          color: tokens.colors.ivory,
          border: 'none',
          borderRadius: tokens.borderRadius.sm,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing.sm,
        }}>
          <RefreshCw size={16} />
          Prøv igjen
        </button>
      )}
    </div>
  );
}
