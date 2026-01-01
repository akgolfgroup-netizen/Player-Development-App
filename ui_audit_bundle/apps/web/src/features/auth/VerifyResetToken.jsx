import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Loader, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
// UiCanon: Using CSS variables
import { AKLogo } from '../../components/branding/AKLogo';
import { authAPI } from '../../services/api';
import { SectionTitle } from '../../components/typography';

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
        const response = await authAPI.verifyResetToken(token);
        const { valid } = response.data;

        if (valid) {
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
        const errorMessage = err.response?.data?.message || err.message;
        if (errorMessage?.includes('expired') || errorMessage?.includes('utløpt')) {
          setStatus('expired');
          setError('Denne lenken har utløpt eller er allerede brukt');
        } else {
          setStatus('invalid');
          setError(errorMessage || 'Kunne ikke verifisere token');
        }
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
                backgroundColor: 'rgba(var(--accent-rgb), 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Loader
                size={40}
                color={'var(--accent)'}
                style={{
                  animation: 'spin 1s linear infinite',
                }}
              />
            </div>

            <SectionTitle style={{
              fontSize: '22px', lineHeight: '28px', fontWeight: 700,
              marginBottom: '12px',
            }}>
              Verifiserer lenke...
            </SectionTitle>

            <p style={{
              fontSize: '15px', lineHeight: '20px',
              color: 'var(--text-secondary)',
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
              Lenke bekreftet!
            </SectionTitle>

            <p style={{
              fontSize: '15px', lineHeight: '20px',
              color: 'var(--text-secondary)',
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
                backgroundColor: `${'var(--warning)'}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertCircle size={40} color={'var(--warning)'} />
            </div>

            <SectionTitle style={{
              fontSize: '22px', lineHeight: '28px', fontWeight: 700,
              marginBottom: '12px',
            }}>
              Lenken har utløpt
            </SectionTitle>

            <p style={{
              fontSize: '15px', lineHeight: '20px',
              color: 'var(--text-secondary)',
              marginBottom: '24px',
            }}>
              {error || 'Denne tilbakestillingslenken er ikke lenger gyldig. Tilbakestillingslenker utløper etter 1 time av sikkerhetsgrunner.'}
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
                Du kan be om en ny lenke fra innloggingssiden
              </p>
            </div>

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
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(var(--accent-rgb), 0.8)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
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
                backgroundColor: `${'var(--error)'}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <XCircle size={40} color={'var(--error)'} />
            </div>

            <SectionTitle style={{
              fontSize: '22px', lineHeight: '28px', fontWeight: 700,
              marginBottom: '12px',
            }}>
              Ugyldig lenke
            </SectionTitle>

            <p style={{
              fontSize: '15px', lineHeight: '20px',
              color: 'var(--text-secondary)',
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
                Be om ny lenke
              </Link>

              <Link
                to="/login"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '17px', lineHeight: '22px', fontWeight: 600,
                  border: '1px solid var(--border-default)',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
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
        backgroundColor: 'var(--bg-secondary)',
        fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '500px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <AKLogo size={60} color={'var(--accent)'} />
        </div>

        {/* Main Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '48px 32px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {renderContent()}
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

export default VerifyResetToken;
