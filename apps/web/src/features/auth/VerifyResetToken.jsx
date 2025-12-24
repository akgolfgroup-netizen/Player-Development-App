import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Loader, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { tokens } from '../../design-tokens';
import { AKLogo } from '../../components/branding/AKLogo';

const VerifyResetToken = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'valid' | 'invalid' | 'expired'
  const [error, setError] = useState(null);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !email) {
        setStatus('invalid');
        setError('Ugyldig eller manglende token');
        return;
      }

      try {
        // TODO: Replace with actual API call
        // const response = await authService.verifyResetToken(token, email);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate token validation
        // In a real app, this would check token expiry, validity, etc.
        const isValid = Math.random() > 0.3; // 70% success rate for demo

        if (isValid) {
          setStatus('valid');
          // Redirect to reset password page after brief delay
          setTimeout(() => {
            navigate(`/reset-password?token=${token}&email=${email}`);
          }, 1500);
        } else {
          setStatus('expired');
          setError('Denne lenken har utløpt eller er allerede brukt');
        }
      } catch (err) {
        setStatus('invalid');
        setError(err.message || 'Kunne ikke verifisere token');
      }
    };

    verifyToken();
  }, [token, email, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 24px',
                borderRadius: '50%',
                backgroundColor: `${tokens.colors.primary}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Loader
                size={40}
                color={tokens.colors.primary}
                style={{
                  animation: 'spin 1s linear infinite',
                }}
              />
            </div>

            <h2 style={{
              ...tokens.typography.title2,
              color: tokens.colors.charcoal,
              marginBottom: '12px',
            }}>
              Verifiserer lenke...
            </h2>

            <p style={{
              ...tokens.typography.subheadline,
              color: tokens.colors.steel,
            }}>
              Vennligst vent mens vi sjekker din tilbakestillingslenke
            </p>

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

      case 'valid':
        return (
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
              Lenke bekreftet!
            </h2>

            <p style={{
              ...tokens.typography.subheadline,
              color: tokens.colors.steel,
            }}>
              Videresender deg til tilbakestilling av passord...
            </p>
          </div>
        );

      case 'expired':
        return (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 24px',
                borderRadius: '50%',
                backgroundColor: `${tokens.colors.warning}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertCircle size={40} color={tokens.colors.warning} />
            </div>

            <h2 style={{
              ...tokens.typography.title2,
              color: tokens.colors.charcoal,
              marginBottom: '12px',
            }}>
              Lenken har utløpt
            </h2>

            <p style={{
              ...tokens.typography.subheadline,
              color: tokens.colors.steel,
              marginBottom: '24px',
            }}>
              {error || 'Denne tilbakestillingslenken er ikke lenger gyldig. Tilbakestillingslenker utløper etter 1 time av sikkerhetsgrunner.'}
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
                Du kan be om en ny lenke fra innloggingssiden
              </p>
            </div>

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
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tokens.colors.primaryLight}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tokens.colors.primary}
            >
              Be om ny lenke
            </Link>
          </div>
        );

      case 'invalid':
        return (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 24px',
                borderRadius: '50%',
                backgroundColor: `${tokens.colors.error}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <XCircle size={40} color={tokens.colors.error} />
            </div>

            <h2 style={{
              ...tokens.typography.title2,
              color: tokens.colors.charcoal,
              marginBottom: '12px',
            }}>
              Ugyldig lenke
            </h2>

            <p style={{
              ...tokens.typography.subheadline,
              color: tokens.colors.steel,
              marginBottom: '24px',
            }}>
              {error || 'Denne lenken er ugyldig eller har blitt brukt. Vennligst be om en ny lenke.'}
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
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
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tokens.colors.primaryLight}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tokens.colors.primary}
              >
                Be om ny lenke
              </Link>

              <Link
                to="/login"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  backgroundColor: tokens.colors.snow,
                  color: tokens.colors.primary,
                  textDecoration: 'none',
                  borderRadius: tokens.radius.md,
                  ...tokens.typography.headline,
                  border: `1px solid ${tokens.colors.mist}`,
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tokens.colors.cloud}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tokens.colors.snow}
              >
                Tilbake til innlogging
              </Link>
            </div>
          </div>
        );

      default:
        return null;
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
      <div style={{ width: '100%', maxWidth: '500px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <AKLogo size={60} color={tokens.colors.primary} />
        </div>

        {/* Main Card */}
        <div
          style={{
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.radius.lg,
            padding: '48px 32px',
            boxShadow: tokens.shadows.elevated,
          }}
        >
          {renderContent()}
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

export default VerifyResetToken;
