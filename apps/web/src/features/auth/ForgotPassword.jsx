import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
// UiCanon: Using CSS variables
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
        backgroundColor: 'var(--bg-secondary)',
        fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Logo and Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <AKLogo size={60} color={'var(--accent)'} />
          <h1 style={{
            fontSize: '22px', lineHeight: '28px', fontWeight: 700,
            color: 'var(--text-primary)',
            marginTop: '16px',
            marginBottom: '4px',
          }}>
            Tilbakestill passord
          </h1>
          <p style={{
            fontSize: '15px', lineHeight: '20px',
            color: 'var(--text-secondary)',
          }}>
            Vi sender deg en sikker lenke for å tilbakestille passordet ditt
          </p>
        </div>

        {/* Main Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            boxShadow: 'var(--shadow-card)',
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
                  backgroundColor: `${'var(--success)'}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle size={32} color={'var(--success)'} />
              </div>

              <h2 style={{
                fontSize: '20px', lineHeight: '25px', fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '12px',
              }}>
                Sjekk e-posten din
              </h2>

              <p style={{
                fontSize: '15px', lineHeight: '20px',
                color: 'var(--text-secondary)',
                marginBottom: '24px',
                lineHeight: '24px',
              }}>
                Vi har sendt en lenke for å tilbakestille passordet til <strong>{email}</strong>.
                Lenken er gyldig i 1 time.
              </p>

              <div
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '24px',
                }}
              >
                <p style={{
                  fontSize: '13px', lineHeight: '18px',
                  color: 'var(--text-secondary)',
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
                      color: 'var(--accent)',
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
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-primary)',
                  textDecoration: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '17px', lineHeight: '22px', fontWeight: 600,
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(var(--accent-rgb), 0.8)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
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
                    backgroundColor: 'rgba(var(--error-rgb), 0.1)',
                    border: `1px solid ${'var(--error)'}30`,
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--error)',
                    marginBottom: '24px',
                    fontSize: '15px', lineHeight: '20px',
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
                    fontSize: '17px', lineHeight: '22px', fontWeight: 600,
                    color: 'var(--text-primary)',
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
                      color: 'var(--text-secondary)',
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
                      fontSize: '15px', lineHeight: '20px',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-md)',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      backgroundColor: loading ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'}
                  />
                </div>
                <p style={{
                  fontSize: '13px', lineHeight: '18px',
                  color: 'var(--text-secondary)',
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
                  fontSize: '17px', lineHeight: '22px', fontWeight: 600,
                  color: 'var(--bg-primary)',
                  backgroundColor: loading || !email ? 'var(--text-secondary)' : 'var(--accent)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: loading || !email ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  if (!loading && email) {
                    e.currentTarget.style.backgroundColor = 'rgba(var(--accent-rgb), 0.8)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && email) {
                    e.currentTarget.style.backgroundColor = 'var(--accent)';
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
                  borderTop: '1px solid var(--border-default)',
                  textAlign: 'center',
                }}
              >
                <Link
                  to="/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    fontSize: '15px', lineHeight: '20px',
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
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
          }}
        >
          <p style={{
            fontSize: '13px', lineHeight: '18px',
            color: 'var(--text-secondary)',
            margin: 0,
          }}>
            Trenger du hjelp? Kontakt{' '}
            <a
              href="mailto:support@akgolf.no"
              style={{
                color: 'var(--accent)',
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
