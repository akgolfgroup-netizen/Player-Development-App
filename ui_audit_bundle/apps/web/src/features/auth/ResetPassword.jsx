import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
// UiCanon: Using CSS variables
import { AKLogo } from '../../components/branding/AKLogo';
import Button from '../../ui/primitives/Button';
import { authAPI } from '../../services/api';
import { SectionTitle } from '../../components/typography';

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
          backgroundColor: 'var(--bg-secondary)',
          fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
          padding: '24px',
        }}
      >
        <div style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>
          <AKLogo size={60} color={'var(--accent)'} />
          <div
            style={{
              marginTop: '32px',
              padding: '32px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <AlertCircle size={48} color={'var(--error)'} style={{ margin: '0 auto 16px' }} />
            <SectionTitle style={{ fontSize: '22px', lineHeight: '28px', fontWeight: 700, marginBottom: '12px' }}>
              Ugyldig forespørsel
            </SectionTitle>
            <p style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Tilbakestillingslenken er ugyldig eller mangler informasjon.
            </p>
            <Link
              to="/forgot-password"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: 'var(--accent)',
                color: 'var(--bg-primary)',
                textDecoration: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '17px', lineHeight: '22px', fontWeight: 600,
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
        backgroundColor: 'var(--bg-secondary)',
        fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '480px' }}>
        {/* Logo and Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <AKLogo size={60} color={'var(--accent)'} />
          <SectionTitle style={{
            fontSize: '22px', lineHeight: '28px', fontWeight: 700,
            marginTop: '16px',
            marginBottom: '4px',
          }}>
            Opprett nytt passord
          </SectionTitle>
          <p style={{
            fontSize: '15px', lineHeight: '20px',
            color: 'var(--text-secondary)',
          }}>
            Velg et sterkt passord for {email}
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
          {success ? (
            // Success State
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 24px',
                  borderRadius: '50%',
                  backgroundColor: `${'var(--success)'}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle size={40} color={'var(--success)'} />
              </div>

              <SectionTitle style={{
                fontSize: '22px', lineHeight: '28px', fontWeight: 700,
                marginBottom: '12px',
              }}>
                Passord oppdatert!
              </SectionTitle>

              <p style={{
                fontSize: '15px', lineHeight: '20px',
                color: 'var(--text-secondary)',
                marginBottom: '24px',
              }}>
                Ditt passord har blitt tilbakestilt. Du blir nå sendt til innloggingssiden...
              </p>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-secondary)',
              }}>
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    border: `2px solid ${'var(--accent)'}`,
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                <span style={{ fontSize: '15px', lineHeight: '20px' }}>Videresender...</span>
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
                    backgroundColor: 'rgba(var(--error-rgb), 0.1)',
                    border: `1px solid ${'var(--error)'}30`,
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--error)',
                    marginBottom: '24px',
                    fontSize: '15px', lineHeight: '20px',
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
                    fontSize: '17px', lineHeight: '22px', fontWeight: 600,
                    color: 'var(--text-primary)',
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
                      color: 'var(--text-secondary)',
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
                      color: 'var(--text-secondary)',
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
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '20px',
                  }}
                >
                  <p style={{
                    fontSize: '13px', lineHeight: '18px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
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
                          fontSize: '13px', lineHeight: '18px',
                          color: passwordValidation[key] ? 'var(--success)' : 'var(--text-secondary)',
                        }}
                      >
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: passwordValidation[key] ? 'var(--success)' : 'var(--border-default)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {passwordValidation[key] && (
                            <CheckCircle size={12} color={'var(--bg-primary)'} />
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
                    fontSize: '17px', lineHeight: '22px', fontWeight: 600,
                    color: 'var(--text-primary)',
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
                      color: 'var(--text-secondary)',
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
                      fontSize: '15px', lineHeight: '20px',
                      border: `1px solid ${confirmPassword && !passwordsMatch ? 'var(--error)' : 'var(--border-default)'}`,
                      borderRadius: 'var(--radius-md)',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      backgroundColor: loading ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={(e) => {
                      e.target.style.borderColor = confirmPassword && !passwordsMatch ? 'var(--error)' : 'var(--border-default)';
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
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p style={{
                    fontSize: '13px', lineHeight: '18px',
                    color: 'var(--error)',
                    marginTop: '8px',
                  }}>
                    Passordene matcher ikke
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={loading || !canSubmit}
                loading={loading}
                style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '17px' }}
              >
                {loading ? 'Tilbakestiller...' : 'Tilbakestill passord'}
              </Button>
            </form>
          )}
        </div>

        {/* Help Text */}
        {!success && (
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
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
