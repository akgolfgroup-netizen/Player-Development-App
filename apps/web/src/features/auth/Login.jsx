import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';
import { tokens } from '../../design-tokens';
import { AKLogo } from '../../components/branding/AKLogo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePasswordReset = (e) => {
    e.preventDefault();
    // Simulate password reset (in real app, this would call an API)
    setResetSuccess(true);
    setTimeout(() => {
      setShowForgotPassword(false);
      setResetSuccess(false);
      setResetEmail('');
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleDemoLogin = async (role) => {
    const credentials = {
      admin: { email: 'admin@demo.com', password: 'admin123' },
      coach: { email: 'coach@demo.com', password: 'coach123' },
      player: { email: 'player@demo.com', password: 'player123' },
    };

    setEmail(credentials[role].email);
    setPassword(credentials[role].password);

    setLoading(true);
    const result = await login(credentials[role].email, credentials[role].password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: tokens.colors.snow,
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '24px',
      }}>
        {/* Logo and Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <AKLogo size={60} color={tokens.colors.primary} />
          <h1 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: tokens.colors.charcoal,
            marginTop: '16px',
            marginBottom: '4px',
          }}>
            AK Golf Academy
          </h1>
          <div style={{
            fontSize: '14px',
            color: tokens.colors.steel,
          }}>
            Individual Development Plan
          </div>
        </div>

        {/* Login Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        }}>
          <h2 style={{
            fontSize: '22px',
            fontWeight: '700',
            color: tokens.colors.charcoal,
            marginBottom: '24px',
            textAlign: 'center',
          }}>
            Logg Inn
          </h2>

          {error && (
            <div
              role="alert"
              data-testid="login-error"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                backgroundColor: `${tokens.colors.error}10`,
                border: `1px solid ${tokens.colors.error}30`,
                borderRadius: '8px',
                color: tokens.colors.error,
                marginBottom: '24px',
                fontSize: '14px',
              }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '15px',
                fontWeight: '500',
                color: tokens.colors.charcoal,
                marginBottom: '8px',
              }}>
                E-post
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Din e-post"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: `1px solid ${tokens.colors.mist}`,
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--ak-primary)'}
                onBlur={(e) => e.target.style.borderColor = tokens.colors.mist}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '15px',
                fontWeight: '500',
                color: tokens.colors.charcoal,
                marginBottom: '8px',
              }}>
                Passord
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Ditt passord"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: `1px solid ${tokens.colors.mist}`,
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--ak-primary)'}
                onBlur={(e) => e.target.style.borderColor = tokens.colors.mist}
              />
            </div>

            <div style={{ marginBottom: '24px', textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: tokens.colors.primary,
                  fontSize: '14px',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Glemt passord?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '17px',
                fontWeight: '600',
                color: tokens.colors.white,
                backgroundColor: loading ? tokens.colors.steel : tokens.colors.primary,
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = tokens.colors.primaryLight;
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = tokens.colors.primary;
              }}
            >
              <LogIn size={20} />
              {loading ? 'Logger inn...' : 'Logg Inn'}
            </button>
          </form>

          {/* Demo Login Buttons */}
          <div style={{
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: `1px solid ${tokens.colors.mist}`,
          }}>
            <div style={{
              fontSize: '13px',
              color: tokens.colors.steel,
              textAlign: 'center',
              marginBottom: '12px',
            }}>
              Demo innlogginger
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => handleDemoLogin('player')}
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  color: 'var(--ak-primary)',
                  backgroundColor: tokens.colors.snow,
                  border: `1px solid ${tokens.colors.mist}`,
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                Spiller (player@demo.com)
              </button>
              <button
                onClick={() => handleDemoLogin('coach')}
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  color: 'var(--ak-primary)',
                  backgroundColor: tokens.colors.snow,
                  border: `1px solid ${tokens.colors.mist}`,
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                Trener (coach@demo.com)
              </button>
              <button
                onClick={() => handleDemoLogin('admin')}
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  color: 'var(--ak-primary)',
                  backgroundColor: tokens.colors.snow,
                  border: `1px solid ${tokens.colors.mist}`,
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                Admin (admin@demo.com)
              </button>
            </div>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
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
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '400px',
              width: '90%',
              position: 'relative'
            }}>
              <button
                onClick={() => setShowForgotPassword(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: tokens.colors.steel
                }}
              >
                ×
              </button>

              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: tokens.colors.charcoal,
                marginBottom: '16px'
              }}>
                Tilbakestill passord
              </h2>

              {resetSuccess ? (
                <div style={{
                  padding: '20px',
                  backgroundColor: `${tokens.colors.success}15`,
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>✓</div>
                  <p style={{ color: tokens.colors.success, fontSize: '15px' }}>
                    En e-post med instruksjoner for å tilbakestille passord er sendt til {resetEmail}
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePasswordReset}>
                  <p style={{
                    fontSize: '14px',
                    color: tokens.colors.steel,
                    marginBottom: '20px'
                  }}>
                    Skriv inn e-postadressen din, så sender vi deg en lenke for å tilbakestille passordet.
                  </p>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: tokens.colors.charcoal,
                      marginBottom: '8px'
                    }}>
                      E-post
                    </label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      placeholder="din@epost.no"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        fontSize: '15px',
                        border: `1px solid ${tokens.colors.mist}`,
                        borderRadius: '8px',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = tokens.colors.primary}
                      onBlur={(e) => e.target.style.borderColor = tokens.colors.mist}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: 'white',
                      backgroundColor: tokens.colors.primary,
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Send tilbakestillingslenke
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
