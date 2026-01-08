/**
 * AK Golf Academy - Verify Reset Token Page
 *
 * Archetype: D - System/Auth Page
 * Purpose: Verify password reset token before redirecting to reset form
 *
 * MIGRATED TO AUTH PAGE ARCHITECTURE - Zero inline styles
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Loader, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { AKLogo } from '../../components/branding/AKLogo';
import { AuthPage } from '../../ui/components';
import { Text } from '../../ui/primitives';
import { authAPI } from '../../services/api';

// ============================================================================
// TYPES
// ============================================================================

type VerifyStatus = 'verifying' | 'valid' | 'invalid' | 'expired';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const VerifyResetToken: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<VerifyStatus>('verifying');
  const [error, setError] = useState<string | null>(null);

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
          setTimeout(() => {
            navigate(`/reset-password?token=${token}&email=${email}`);
          }, 1500);
        } else {
          setStatus('expired');
          setError('Denne lenken har utløpt eller er allerede brukt');
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } }; message?: string };
        const errorMessage = error.response?.data?.message || error.message;
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
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-ak-primary/15 flex items-center justify-center">
              <Loader size={40} className="text-ak-primary animate-spin" />
            </div>

            <Text variant="title2" color="primary" className="mb-3">
              Verifiserer lenke...
            </Text>

            <Text variant="body" color="secondary">
              Vennligst vent mens vi sjekker din tilbakestillingslenke
            </Text>
          </div>
        );

      case 'valid':
        return (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-ak-status-success-light flex items-center justify-center">
              <CheckCircle size={40} className="text-ak-status-success" />
            </div>

            <Text variant="title2" color="primary" className="mb-3">
              Lenke bekreftet!
            </Text>

            <Text variant="body" color="secondary">
              Videresender deg til tilbakestilling av passord...
            </Text>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-ak-status-warning-light flex items-center justify-center">
              <AlertCircle size={40} className="text-ak-status-warning" />
            </div>

            <Text variant="title2" color="primary" className="mb-3">
              Lenken har utløpt
            </Text>

            <Text variant="body" color="secondary" className="mb-6">
              {error || 'Denne tilbakestillingslenken er ikke lenger gyldig. Tilbakestillingslenker utløper etter 1 time av sikkerhetsgrunner.'}
            </Text>

            <div className="p-4 bg-ak-surface-subtle rounded-lg mb-6">
              <Text variant="caption1" color="secondary">
                Du kan be om en ny lenke fra innloggingssiden
              </Text>
            </div>

            <Link
              to="/forgot-password"
              className="inline-block px-6 py-3 bg-ak-primary text-white rounded-lg font-semibold no-underline hover:bg-ak-brand-hover transition-colors"
            >
              Be om ny lenke
            </Link>
          </div>
        );

      case 'invalid':
        return (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-ak-status-error-light flex items-center justify-center">
              <XCircle size={40} className="text-ak-status-error" />
            </div>

            <Text variant="title2" color="primary" className="mb-3">
              Ugyldig lenke
            </Text>

            <Text variant="body" color="secondary" className="mb-6">
              {error || 'Denne lenken er ugyldig eller har blitt brukt. Vennligst be om en ny lenke.'}
            </Text>

            <div className="flex gap-3 justify-center">
              <Link
                to="/forgot-password"
                className="inline-block px-6 py-3 bg-ak-primary text-white rounded-lg font-semibold no-underline hover:bg-ak-brand-hover transition-colors"
              >
                Be om ny lenke
              </Link>

              <Link
                to="/login"
                className="inline-block px-6 py-3 bg-ak-surface-subtle text-ak-primary rounded-lg font-semibold no-underline border border-ak-border-default hover:bg-ak-surface-subtle/80 transition-colors"
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
    <AuthPage
      state={status === 'verifying' ? 'loading' : status === 'valid' ? 'success' : 'error'}
      maxWidth="md"
    >
      <AuthPage.Logo>
        <AKLogo size={60} className="text-ak-primary" />
      </AuthPage.Logo>

      <AuthPage.Card>{renderContent()}</AuthPage.Card>

      <AuthPage.Footer>
        Trenger du hjelp? Kontakt{' '}
        <a href="mailto:support@akgolf.no" className="text-ak-primary no-underline">
          support@akgolf.no
        </a>
      </AuthPage.Footer>
    </AuthPage>
  );
};

export default VerifyResetToken;
