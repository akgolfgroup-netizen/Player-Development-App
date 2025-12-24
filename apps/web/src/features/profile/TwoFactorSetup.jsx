import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { tokens } from '../../design-tokens';
import { authAPI } from '../../services/api';

const TwoFactorSetup = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1); // 1: Intro, 2: QR Code, 3: Verify
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (step === 2) {
      generateQRCode();
    }
  }, [step]);

  const generateQRCode = async () => {
    setLoading(true);
    try {
      const response = await authAPI.generate2FASecret();
      const { secret, qrCodeUrl } = response.data.data;

      setSecretKey(secret);
      setQrCodeUrl(qrCodeUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Kunne ikke generere 2FA-kode. Prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setError('Koden må være 6 sifre');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.verify2FACode(verificationCode);
      const { backupCodes } = response.data.data;

      setBackupCodes(backupCodes);
      setStep(4); // Show backup codes
    } catch (err) {
      setError(err.response?.data?.message || 'Ugyldig kode. Prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete({ enabled: true, backupCodes });
    }
  };

  const renderStep1 = () => (
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
        <Shield size={40} color={tokens.colors.primary} />
      </div>

      <h2 style={{
        ...tokens.typography.title2,
        color: tokens.colors.charcoal,
        marginBottom: '12px',
        textAlign: 'center',
      }}>
        Aktiver tofaktorautentisering
      </h2>

      <p style={{
        ...tokens.typography.subheadline,
        color: tokens.colors.steel,
        marginBottom: '24px',
        textAlign: 'center',
        lineHeight: '24px',
      }}>
        Legg til et ekstra sikkerhetslag på kontoen din. Du trenger en autentiseringsapp som Google Authenticator eller Authy.
      </p>

      <div style={{
        padding: '20px',
        backgroundColor: tokens.colors.snow,
        borderRadius: tokens.radius.md,
        marginBottom: '24px',
      }}>
        <h3 style={{
          ...tokens.typography.headline,
          color: tokens.colors.charcoal,
          marginBottom: '16px',
        }}>
          Slik fungerer det:
        </h3>
        <ol style={{
          margin: 0,
          paddingLeft: '20px',
          ...tokens.typography.subheadline,
          color: tokens.colors.steel,
        }}>
          <li style={{ marginBottom: '12px' }}>Skann QR-koden med autentiseringsappen din</li>
          <li style={{ marginBottom: '12px' }}>Skriv inn 6-sifret kode fra appen</li>
          <li style={{ marginBottom: '12px' }}>Lagre backup-kodene dine på et sikkert sted</li>
          <li>Du er nå beskyttet med 2FA</li>
        </ol>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setStep(2)}
          style={{
            flex: 1,
            padding: '14px',
            ...tokens.typography.headline,
            color: tokens.colors.white,
            backgroundColor: tokens.colors.primary,
            border: 'none',
            borderRadius: tokens.radius.md,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tokens.colors.primaryLight}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tokens.colors.primary}
        >
          Kom i gang
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '14px',
              ...tokens.typography.headline,
              color: tokens.colors.steel,
              backgroundColor: tokens.colors.snow,
              border: `1px solid ${tokens.colors.mist}`,
              borderRadius: tokens.radius.md,
              cursor: 'pointer',
            }}
          >
            Avbryt
          </button>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h2 style={{
        ...tokens.typography.title2,
        color: tokens.colors.charcoal,
        marginBottom: '12px',
        textAlign: 'center',
      }}>
        Skann QR-koden
      </h2>

      <p style={{
        ...tokens.typography.subheadline,
        color: tokens.colors.steel,
        marginBottom: '24px',
        textAlign: 'center',
      }}>
        Åpne autentiseringsappen din og skann denne koden
      </p>

      {loading ? (
        <div style={{
          padding: '60px',
          textAlign: 'center',
          backgroundColor: tokens.colors.snow,
          borderRadius: tokens.radius.md,
          marginBottom: '24px',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            margin: '0 auto',
            border: `3px solid ${tokens.colors.primary}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <p style={{
            ...tokens.typography.subheadline,
            color: tokens.colors.steel,
            marginTop: '16px',
          }}>
            Genererer QR-kode...
          </p>
          <style>
            {`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
          </style>
        </div>
      ) : (
        <>
          <div style={{
            padding: '24px',
            backgroundColor: tokens.colors.white,
            border: `2px solid ${tokens.colors.mist}`,
            borderRadius: tokens.radius.md,
            textAlign: 'center',
            marginBottom: '20px',
          }}>
            <img
              src={qrCodeUrl}
              alt="2FA QR Code"
              style={{
                width: '200px',
                height: '200px',
                margin: '0 auto',
                display: 'block',
              }}
            />
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
              marginBottom: '8px',
            }}>
              Kan ikke skanne? Skriv inn denne koden manuelt:
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <code style={{
                flex: 1,
                padding: '12px',
                backgroundColor: tokens.colors.white,
                border: `1px solid ${tokens.colors.mist}`,
                borderRadius: tokens.radius.sm,
                ...tokens.typography.subheadline,
                fontFamily: 'monospace',
                color: tokens.colors.charcoal,
              }}>
                {secretKey}
              </code>
              <button
                onClick={handleCopySecret}
                aria-label="Kopier nøkkel"
                style={{
                  padding: '12px',
                  backgroundColor: copied ? tokens.colors.success : tokens.colors.white,
                  border: `1px solid ${copied ? tokens.colors.success : tokens.colors.mist}`,
                  borderRadius: tokens.radius.sm,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {copied ? <CheckCircle size={20} color={tokens.colors.white} /> : <Copy size={20} color={tokens.colors.steel} />}
              </button>
            </div>
          </div>
        </>
      )}

      <button
        onClick={() => setStep(3)}
        disabled={loading}
        style={{
          width: '100%',
          padding: '14px',
          ...tokens.typography.headline,
          color: tokens.colors.white,
          backgroundColor: loading ? tokens.colors.steel : tokens.colors.primary,
          border: 'none',
          borderRadius: tokens.radius.md,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          if (!loading) e.currentTarget.style.backgroundColor = tokens.colors.primaryLight;
        }}
        onMouseLeave={(e) => {
          if (!loading) e.currentTarget.style.backgroundColor = tokens.colors.primary;
        }}
      >
        Neste: Verifiser
      </button>
    </div>
  );

  const renderStep3 = () => (
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
        <Smartphone size={40} color={tokens.colors.primary} />
      </div>

      <h2 style={{
        ...tokens.typography.title2,
        color: tokens.colors.charcoal,
        marginBottom: '12px',
        textAlign: 'center',
      }}>
        Verifiser koden
      </h2>

      <p style={{
        ...tokens.typography.subheadline,
        color: tokens.colors.steel,
        marginBottom: '24px',
        textAlign: 'center',
      }}>
        Skriv inn 6-sifret kode fra autentiseringsappen din
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
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            setVerificationCode(value);
            setError(null);
          }}
          placeholder="000000"
          maxLength={6}
          disabled={loading}
          aria-label="Verifiseringskode"
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '32px',
            fontFamily: 'monospace',
            textAlign: 'center',
            letterSpacing: '8px',
            border: `2px solid ${error ? tokens.colors.error : tokens.colors.mist}`,
            borderRadius: tokens.radius.md,
            outline: 'none',
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

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setStep(2)}
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
          onClick={handleVerify}
          disabled={loading || verificationCode.length !== 6}
          style={{
            flex: 1,
            padding: '14px',
            ...tokens.typography.headline,
            color: tokens.colors.white,
            backgroundColor: loading || verificationCode.length !== 6 ? tokens.colors.steel : tokens.colors.primary,
            border: 'none',
            borderRadius: tokens.radius.md,
            cursor: loading || verificationCode.length !== 6 ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!loading && verificationCode.length === 6) {
              e.currentTarget.style.backgroundColor = tokens.colors.primaryLight;
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && verificationCode.length === 6) {
              e.currentTarget.style.backgroundColor = tokens.colors.primary;
            }
          }}
        >
          {loading ? 'Verifiserer...' : 'Verifiser'}
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div>
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
        textAlign: 'center',
      }}>
        2FA aktivert!
      </h2>

      <p style={{
        ...tokens.typography.subheadline,
        color: tokens.colors.steel,
        marginBottom: '24px',
        textAlign: 'center',
      }}>
        Lagre disse backup-kodene på et sikkert sted. Du kan bruke dem til å logge inn hvis du mister tilgang til autentiseringsappen.
      </p>

      <div style={{
        padding: '20px',
        backgroundColor: tokens.colors.snow,
        borderRadius: tokens.radius.md,
        marginBottom: '24px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
        }}>
          {backupCodes.map((code, index) => (
            <div
              key={index}
              style={{
                padding: '12px',
                backgroundColor: tokens.colors.white,
                border: `1px solid ${tokens.colors.mist}`,
                borderRadius: tokens.radius.sm,
                textAlign: 'center',
                fontFamily: 'monospace',
                ...tokens.typography.subheadline,
                color: tokens.colors.charcoal,
              }}
            >
              {code}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        padding: '16px',
        backgroundColor: `${tokens.colors.warning}15`,
        border: `1px solid ${tokens.colors.warning}30`,
        borderRadius: tokens.radius.md,
        marginBottom: '24px',
      }}>
        <p style={{
          ...tokens.typography.footnote,
          color: tokens.colors.charcoal,
          margin: 0,
        }}>
          <strong>Viktig:</strong> Hver backup-kode kan kun brukes én gang. Last ned eller skriv ut kodene og lagre dem sikkert.
        </p>
      </div>

      <button
        onClick={handleComplete}
        style={{
          width: '100%',
          padding: '14px',
          ...tokens.typography.headline,
          color: tokens.colors.white,
          backgroundColor: tokens.colors.primary,
          border: 'none',
          borderRadius: tokens.radius.md,
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tokens.colors.primaryLight}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tokens.colors.primary}
      >
        Fullfør
      </button>
    </div>
  );

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '32px',
      backgroundColor: tokens.colors.white,
      borderRadius: tokens.radius.lg,
      boxShadow: tokens.shadows.elevated,
      fontFamily: tokens.typography.fontFamily,
    }}>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
    </div>
  );
};

export default TwoFactorSetup;
