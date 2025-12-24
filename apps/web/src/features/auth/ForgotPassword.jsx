import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { tokens } from '../../design-tokens';
import { AKLogo } from '../../components/branding/AKLogo';
import { authAPI } from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authAPI.requestPasswordReset(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Kunne ikke sende tilbakestillingslenke. Prøv igjen senere.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: tokens.colors.snow,
        fontFamily: tokens.typography.fontFamily,
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Logo and Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <AKLogo size={60} color={tokens.colors.primary} />
          <h1 style={{
            ...tokens.typography.title2,
            color: tokens.colors.charcoal,
            marginTop: '16px',
            marginBottom: '4px',
          }}>
            Tilbakestill passord
          </h1>
          <p style={{
            ...tokens.typography.subheadline,
            color: tokens.colors.steel,
          }}>
            Vi sender deg en sikker lenke for å tilbakestille passordet ditt
          </p>
        </div>

        {/* Main Card */}
        <div
          style={{
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.radius.lg,
            padding: '32px',
            boxShadow: tokens.shadows.elevated,
          }}
        >
          {submitted ? (
            // Success State
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto 20px',
                  borderRadius: '50%',
                  backgroundColor: `${tokens.colors.success}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle size={32} color={tokens.colors.success} />
              </div>

              <h2 style={{
                ...tokens.typography.title3,
                color: tokens.colors.charcoal,
                marginBottom: '12px',
              }}>
                Sjekk e-posten din
              </h2>

              <p style={{
                ...tokens.typography.subheadline,
                color: tokens.colors.steel,
                marginBottom: '24px',
                lineHeight: '24px',
              }}>
                Vi har sendt en lenke for å tilbakestille passordet til <strong>{email}</strong>.
                Lenken er gyldig i 1 time.
              </p>

              <div
                style={{
                  padding: '16px',
                  backgroundColor: tokens.colors.snow,
                  borderRadius: tokens.radius.md,
                  marginBottom: '24px',
                }}
              >
                <p style={{
                  ...tokens.typography.footnote,
                  color: tokens.colors.steel,
                  margin: 0,
                }}>
                  Fikk du ikke e-posten? Sjekk spam-mappen din, eller{' '}
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setEmail('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: tokens.colors.primary,
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      padding: 0,
                      font: 'inherit',
                    }}
                  >
                    prøv igjen
                  </button>
                </p>
              </div>

              <Link
                to="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  backgroundColor: tokens.colors.primary,
                  color: tokens.colors.white,
                  textDecoration: 'none',
                  borderRadius: tokens.radius.md,
                  ...tokens.typography.headline,
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tokens.colors.primaryLight}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tokens.colors.primary}
              >
                <ArrowLeft size={18} />
                Tilbake til innlogging
              </Link>
            </div>
          ) : (
            // Email Form
            <form onSubmit={handleSubmit}>
              {error && (
                <div
                  role="alert"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
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
                  <Mail size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{error}</span>
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    ...tokens.typography.headline,
                    color: tokens.colors.charcoal,
                    marginBottom: '8px',
                  }}
                >
                  E-postadresse
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
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
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="din.epost@eksempel.no"
                    disabled={loading}
                    aria-label="E-postadresse"
                    style={{
                      width: '100%',
                      padding: '14px 16px 14px 48px',
                      ...tokens.typography.body,
                      border: `1px solid ${tokens.colors.mist}`,
                      borderRadius: tokens.radius.md,
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      backgroundColor: loading ? tokens.colors.cloud : tokens.colors.white,
                    }}
                    onFocus={(e) => e.target.style.borderColor = tokens.colors.primary}
                    onBlur={(e) => e.target.style.borderColor = tokens.colors.mist}
                  />
                </div>
                <p style={{
                  ...tokens.typography.footnote,
                  color: tokens.colors.steel,
                  marginTop: '8px',
                }}>
                  Skriv inn e-postadressen knyttet til kontoen din
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                style={{
                  width: '100%',
                  padding: '14px',
                  ...tokens.typography.headline,
                  color: tokens.colors.white,
                  backgroundColor: loading || !email ? tokens.colors.steel : tokens.colors.primary,
                  border: 'none',
                  borderRadius: tokens.radius.md,
                  cursor: loading || !email ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  if (!loading && email) {
                    e.currentTarget.style.backgroundColor = tokens.colors.primaryLight;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && email) {
                    e.currentTarget.style.backgroundColor = tokens.colors.primary;
                  }
                }}
              >
                <Mail size={20} />
                {loading ? 'Sender...' : 'Send tilbakestillingslenke'}
              </button>

              <div
                style={{
                  marginTop: '24px',
                  paddingTop: '24px',
                  borderTop: `1px solid ${tokens.colors.mist}`,
                  textAlign: 'center',
                }}
              >
                <Link
                  to="/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: tokens.colors.primary,
                    textDecoration: 'none',
                    ...tokens.typography.subheadline,
                  }}
                >
                  <ArrowLeft size={18} />
                  Tilbake til innlogging
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Help Text */}
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.radius.md,
            textAlign: 'center',
          }}
        >
          <p style={{
            ...tokens.typography.footnote,
            color: tokens.colors.steel,
            margin: 0,
          }}>
            Trenger du hjelp? Kontakt{' '}
            <a
              href="mailto:support@akgolf.no"
              style={{
                color: tokens.colors.primary,
                textDecoration: 'none',
              }}
            >
              support@akgolf.no
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
