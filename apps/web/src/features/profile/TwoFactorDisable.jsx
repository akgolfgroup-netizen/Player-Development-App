import React, { useState } from 'react';
import { ShieldOff, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { tokens } from '../../design-tokens';

const TwoFactorDisable = ({ onConfirm, onCancel }) => {
  const [step, setStep] = useState(1); // 1: Warning, 2: Confirm with password, 3: Success
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDisable = async () => {
    if (!password) {
      setError('Passord er påkrevd');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // await authService.disable2FA(password);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate password validation
      const isValid = Math.random() > 0.2; // 80% success rate for demo

      if (!isValid) {
        throw new Error('Feil passord');
      }

      setStep(3); // Show success

      // Auto-close after 2 seconds
      setTimeout(() => {
        if (onConfirm) {
          onConfirm({ enabled: false });
        }
      }, 2000);
    } catch (err) {
      setError(err.message || 'Kunne ikke deaktivere 2FA. Prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div>
      <div style={{
        width: '80px',
        height: '80px',
        margin: '0 auto 24px',
        borderRadius: '50%',
        backgroundColor: `${tokens.colors.warning}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <AlertTriangle size={40} color={tokens.colors.warning} />
      </div>

      <h2 style={{
        ...tokens.typography.title2,
        color: tokens.colors.charcoal,
        marginBottom: '12px',
        textAlign: 'center',
      }}>
        Deaktiver tofaktorautentisering?
      </h2>

      <p style={{
        ...tokens.typography.subheadline,
        color: tokens.colors.steel,
        marginBottom: '24px',
        textAlign: 'center',
        lineHeight: '24px',
      }}>
        Ved å deaktivere 2FA reduserer du sikkerheten på kontoen din betydelig.
      </p>

      <div style={{
        padding: '20px',
        backgroundColor: `${tokens.colors.error}10`,
        border: `1px solid ${tokens.colors.error}30`,
        borderRadius: tokens.radius.md,
        marginBottom: '24px',
      }}>
        <h3 style={{
          ...tokens.typography.headline,
          color: tokens.colors.charcoal,
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <ShieldOff size={20} color={tokens.colors.error} />
          Sikkerhetsrisiko
        </h3>
        <ul style={{
          margin: 0,
          paddingLeft: '20px',
          ...tokens.typography.subheadline,
          color: tokens.colors.steel,
        }}>
          <li style={{ marginBottom: '8px' }}>Kontoen din vil være mer sårbar for uautorisert tilgang</li>
          <li style={{ marginBottom: '8px' }}>Kun passord vil være nødvendig for å logge inn</li>
          <li style={{ marginBottom: '8px' }}>Du mister et viktig sikkerhetslag</li>
        </ul>
      </div>

      <div style={{
        padding: '16px',
        backgroundColor: tokens.colors.snow,
        borderRadius: tokens.radius.md,
        marginBottom: '24px',
      }}>
        <p style={{
          ...tokens.typography.footnote,
          color: tokens.colors.steel,
          margin: 0,
        }}>
          <strong>Anbefaling:</strong> Vi anbefaler sterkt å holde 2FA aktivert for maksimal kontosikkerhet. Hvis du har problemer med 2FA, vurder å oppdatere autentiseringsappen din i stedet for å deaktivere funksjonen.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        {onCancel && (
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '14px',
              ...tokens.typography.headline,
              color: tokens.colors.charcoal,
              backgroundColor: tokens.colors.snow,
              border: `1px solid ${tokens.colors.mist}`,
              borderRadius: tokens.radius.md,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tokens.colors.cloud}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tokens.colors.snow}
          >
            Avbryt
          </button>
        )}
        <button
          onClick={() => setStep(2)}
          style={{
            flex: 1,
            padding: '14px',
            ...tokens.typography.headline,
            color: tokens.colors.white,
            backgroundColor: tokens.colors.error,
            border: 'none',
            borderRadius: tokens.radius.md,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B04E42'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tokens.colors.error}
        >
          Fortsett allikevel
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <div style={{
        width: '80px',
        height: '80px',
        margin: '0 auto 24px',
        borderRadius: '50%',
        backgroundColor: `${tokens.colors.primary}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Lock size={40} color={tokens.colors.primary} />
      </div>

      <h2 style={{
        ...tokens.typography.title2,
        color: tokens.colors.charcoal,
        marginBottom: '12px',
        textAlign: 'center',
      }}>
        Bekreft med passord
      </h2>

      <p style={{
        ...tokens.typography.subheadline,
        color: tokens.colors.steel,
        marginBottom: '24px',
        textAlign: 'center',
      }}>
        Skriv inn passordet ditt for å bekrefte at du vil deaktivere 2FA
      </p>

      {error && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px',
            backgroundColor: `${tokens.colors.error}10`,
            border: `1px solid ${tokens.colors.error}30`,
            borderRadius: tokens.radius.md,
            color: tokens.colors.error,
            marginBottom: '24px',
            ...tokens.typography.subheadline,
          }}
        >
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleDisable(); }}>
        <div style={{ marginBottom: '24px' }}>
          <label
            htmlFor="password"
            style={{
              display: 'block',
              ...tokens.typography.headline,
              color: tokens.colors.charcoal,
              marginBottom: '8px',
            }}
          >
            Passord
          </label>
          <div style={{ position: 'relative' }}>
            <Lock
              size={20}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: tokens.colors.steel,
                pointerEvents: 'none',
              }}
            />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              required
              placeholder="Skriv inn passordet ditt"
              disabled={loading}
              aria-label="Passord"
              autoFocus
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                ...tokens.typography.body,
                border: `1px solid ${error ? tokens.colors.error : tokens.colors.mist}`,
                borderRadius: tokens.radius.md,
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: loading ? tokens.colors.cloud : tokens.colors.white,
              }}
              onFocus={(e) => {
                if (!error) e.target.style.borderColor = tokens.colors.primary;
              }}
              onBlur={(e) => {
                if (!error) e.target.style.borderColor = tokens.colors.mist;
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={() => setStep(1)}
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px',
              ...tokens.typography.headline,
              color: tokens.colors.steel,
              backgroundColor: tokens.colors.snow,
              border: `1px solid ${tokens.colors.mist}`,
              borderRadius: tokens.radius.md,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            Tilbake
          </button>
          <button
            type="submit"
            disabled={loading || !password}
            style={{
              flex: 1,
              padding: '14px',
              ...tokens.typography.headline,
              color: tokens.colors.white,
              backgroundColor: loading || !password ? tokens.colors.steel : tokens.colors.error,
              border: 'none',
              borderRadius: tokens.radius.md,
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading && password) {
                e.currentTarget.style.backgroundColor = '#B04E42';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && password) {
                e.currentTarget.style.backgroundColor = tokens.colors.error;
              }
            }}
          >
            {loading ? 'Deaktiverer...' : 'Deaktiver 2FA'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderStep3 = () => (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '80px',
        height: '80px',
        margin: '0 auto 24px',
        borderRadius: '50%',
        backgroundColor: `${tokens.colors.success}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <CheckCircle size={40} color={tokens.colors.success} />
      </div>

      <h2 style={{
        ...tokens.typography.title2,
        color: tokens.colors.charcoal,
        marginBottom: '12px',
      }}>
        2FA deaktivert
      </h2>

      <p style={{
        ...tokens.typography.subheadline,
        color: tokens.colors.steel,
        marginBottom: '24px',
      }}>
        Tofaktorautentisering er nå deaktivert for kontoen din.
      </p>

      <div style={{
        padding: '16px',
        backgroundColor: tokens.colors.snow,
        borderRadius: tokens.radius.md,
        marginBottom: '24px',
      }}>
        <p style={{
          ...tokens.typography.footnote,
          color: tokens.colors.steel,
          margin: 0,
        }}>
          Du kan aktivere 2FA igjen når som helst fra sikkerhetsinnstillingene.
        </p>
      </div>

      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        color: tokens.colors.steel,
      }}>
        <div
          style={{
            width: '16px',
            height: '16px',
            border: `2px solid ${tokens.colors.success}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <span style={{ ...tokens.typography.subheadline }}>Lukker...</span>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '24px',
      fontFamily: tokens.typography.fontFamily,
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        padding: '32px',
        backgroundColor: tokens.colors.white,
        borderRadius: tokens.radius.lg,
        boxShadow: tokens.shadows.elevated,
        position: 'relative',
      }}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default TwoFactorDisable;
