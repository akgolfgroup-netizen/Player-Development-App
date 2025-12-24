import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { tokens } from '../../design-tokens';
import { AKLogo } from '../../components/branding/AKLogo';
import { authAPI } from '../../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Password validation
  const passwordValidation = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const canSubmit = isPasswordValid && passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canSubmit) return;

    setError(null);
    setLoading(true);

    try {
      await authAPI.resetPassword(token, email, password);
      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Kunne ikke tilbakestille passord. Prøv igjen senere.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
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
        <div style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>
          <AKLogo size={60} color={tokens.colors.primary} />
          <div
            style={{
              marginTop: '32px',
              padding: '32px',
              backgroundColor: tokens.colors.white,
              borderRadius: tokens.radius.lg,
              boxShadow: tokens.shadows.elevated,
            }}
          >
            <AlertCircle size={48} color={tokens.colors.error} style={{ margin: '0 auto 16px' }} />
            <h2 style={{ ...tokens.typography.title2, color: tokens.colors.charcoal, marginBottom: '12px' }}>
              Ugyldig forespørsel
            </h2>
            <p style={{ ...tokens.typography.subheadline, color: tokens.colors.steel, marginBottom: '24px' }}>
              Tilbakestillingslenken er ugyldig eller mangler informasjon.
            </p>
            <Link
              to="/forgot-password"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: tokens.colors.primary,
                color: tokens.colors.white,
                textDecoration: 'none',
                borderRadius: tokens.radius.md,
                ...tokens.typography.headline,
              }}
            >
              Be om ny lenke
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
      <div style={{ width: '100%', maxWidth: '480px' }}>
        {/* Logo and Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <AKLogo size={60} color={tokens.colors.primary} />
          <h1 style={{
            ...tokens.typography.title2,
            color: tokens.colors.charcoal,
            marginTop: '16px',
            marginBottom: '4px',
          }}>
            Opprett nytt passord
          </h1>
          <p style={{
            ...tokens.typography.subheadline,
            color: tokens.colors.steel,
          }}>
            Velg et sterkt passord for {email}
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
          {success ? (
            // Success State
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 24px',
                  borderRadius: '50%',
                  backgroundColor: `${tokens.colors.success}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle size={40} color={tokens.colors.success} />
              </div>

              <h2 style={{
                ...tokens.typography.title2,
                color: tokens.colors.charcoal,
                marginBottom: '12px',
              }}>
                Passord oppdatert!
              </h2>

              <p style={{
                ...tokens.typography.subheadline,
                color: tokens.colors.steel,
                marginBottom: '24px',
              }}>
                Ditt passord har blitt tilbakestilt. Du blir nå sendt til innloggingssiden...
              </p>

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
                    border: `2px solid ${tokens.colors.primary}`,
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                <span style={{ ...tokens.typography.subheadline }}>Videresender...</span>
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
          ) : (
            // Password Form
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
                  <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{error}</span>
                </div>
              )}

              {/* New Password */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="password"
                  style={{
                    display: 'block',
                    ...tokens.typography.headline,
                    color: tokens.colors.charcoal,
                    marginBottom: '8px',
                  }}
                >
                  Nytt passord
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
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Skriv inn nytt passord"
                    disabled={loading}
                    aria-label="Nytt passord"
                    style={{
                      width: '100%',
                      padding: '14px 48px 14px 48px',
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
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Skjul passord' : 'Vis passord'}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      color: tokens.colors.steel,
                    }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              {password && (
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: tokens.colors.snow,
                    borderRadius: tokens.radius.md,
                    marginBottom: '20px',
                  }}
                >
                  <p style={{
                    ...tokens.typography.footnote,
                    fontWeight: 600,
                    color: tokens.colors.charcoal,
                    marginBottom: '12px',
                  }}>
                    Passordkrav:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { key: 'minLength', label: 'Minst 8 tegn' },
                      { key: 'hasUpperCase', label: 'En stor bokstav' },
                      { key: 'hasLowerCase', label: 'En liten bokstav' },
                      { key: 'hasNumber', label: 'Ett tall' },
                      { key: 'hasSpecialChar', label: 'Ett spesialtegn (!@#$...)' },
                    ].map(({ key, label }) => (
                      <div
                        key={key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          ...tokens.typography.footnote,
                          color: passwordValidation[key] ? tokens.colors.success : tokens.colors.steel,
                        }}
                      >
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: passwordValidation[key] ? tokens.colors.success : tokens.colors.mist,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {passwordValidation[key] && (
                            <CheckCircle size={12} color={tokens.colors.white} />
                          )}
                        </div>
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  htmlFor="confirmPassword"
                  style={{
                    display: 'block',
                    ...tokens.typography.headline,
                    color: tokens.colors.charcoal,
                    marginBottom: '8px',
                  }}
                >
                  Bekreft passord
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
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Skriv inn passord igjen"
                    disabled={loading}
                    aria-label="Bekreft passord"
                    style={{
                      width: '100%',
                      padding: '14px 48px 14px 48px',
                      ...tokens.typography.body,
                      border: `1px solid ${confirmPassword && !passwordsMatch ? tokens.colors.error : tokens.colors.mist}`,
                      borderRadius: tokens.radius.md,
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      backgroundColor: loading ? tokens.colors.cloud : tokens.colors.white,
                    }}
                    onFocus={(e) => e.target.style.borderColor = tokens.colors.primary}
                    onBlur={(e) => {
                      e.target.style.borderColor = confirmPassword && !passwordsMatch ? tokens.colors.error : tokens.colors.mist;
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Skjul passord' : 'Vis passord'}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      color: tokens.colors.steel,
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p style={{
                    ...tokens.typography.footnote,
                    color: tokens.colors.error,
                    marginTop: '8px',
                  }}>
                    Passordene matcher ikke
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !canSubmit}
                style={{
                  width: '100%',
                  padding: '14px',
                  ...tokens.typography.headline,
                  color: tokens.colors.white,
                  backgroundColor: loading || !canSubmit ? tokens.colors.steel : tokens.colors.primary,
                  border: 'none',
                  borderRadius: tokens.radius.md,
                  cursor: loading || !canSubmit ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!loading && canSubmit) {
                    e.currentTarget.style.backgroundColor = tokens.colors.primaryLight;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && canSubmit) {
                    e.currentTarget.style.backgroundColor = tokens.colors.primary;
                  }
                }}
              >
                {loading ? 'Tilbakestiller...' : 'Tilbakestill passord'}
              </button>
            </form>
          )}
        </div>

        {/* Help Text */}
        {!success && (
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
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
