/**
 * AK Golf Academy - Forgot Password Page
 *
 * Archetype: D - System/Auth Page
 * Purpose: Request password reset link
 *
 * MIGRATED TO AUTH PAGE ARCHITECTURE - Zero inline styles
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { AKLogo } from '../../components/branding/AKLogo';
import { AuthPage } from '../../ui/components';
import { Button, Text, Input } from '../../ui/primitives';
import { authAPI } from '../../services/api';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authAPI.requestPasswordReset(email);
      setSubmitted(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Kunne ikke sende tilbakestillingslenke. Prøv igjen senere.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPage state={loading ? 'loading' : submitted ? 'success' : 'idle'} maxWidth="md">
      <AuthPage.Logo title="Tilbakestill passord" subtitle="Vi sender deg en sikker lenke for å tilbakestille passordet ditt">
        <AKLogo size={60} className="text-ak-brand-primary" />
      </AuthPage.Logo>

      <AuthPage.Card>
        {submitted ? (
          // Success State
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-ak-status-success-light flex items-center justify-center">
              <CheckCircle size={32} className="text-ak-status-success" />
            </div>

            <Text variant="title2" color="primary" className="mb-3">
              Sjekk e-posten din
            </Text>

            <Text variant="body" color="secondary" className="mb-6">
              Vi har sendt en lenke for å tilbakestille passordet til <strong>{email}</strong>.
              Lenken er gyldig i 1 time.
            </Text>

            <div className="p-4 bg-ak-surface-subtle rounded-lg mb-6">
              <Text variant="caption1" color="secondary">
                Fikk du ikke e-posten? Sjekk spam-mappen din, eller{' '}
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setEmail('');
                  }}
                  className="text-ak-brand-primary underline bg-transparent border-none cursor-pointer font-inherit"
                >
                  prøv igjen
                </button>
              </Text>
            </div>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-ak-brand-primary text-white rounded-lg font-semibold hover:bg-ak-brand-hover transition-colors no-underline"
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
                className="flex items-start gap-3 p-4 mb-6 rounded-lg bg-ak-status-error-light border border-ak-status-error/30 text-ak-status-error text-sm"
              >
                <Mail size={20} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="email" className="block text-base font-semibold text-ak-text-primary mb-2">
                E-postadresse
              </label>
              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ak-text-secondary pointer-events-none"
                />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="din.epost@eksempel.no"
                  disabled={loading}
                  className="pl-12"
                />
              </div>
              <Text variant="caption1" color="secondary" className="mt-2">
                Skriv inn e-postadressen knyttet til kontoen din
              </Text>
            </div>

            <Button
              type="submit"
              variant="primary"
              leftIcon={<Mail size={20} />}
              disabled={loading || !email}
              loading={loading}
              className="w-full justify-center"
            >
              {loading ? 'Sender...' : 'Send tilbakestillingslenke'}
            </Button>

            <div className="mt-6 pt-6 border-t border-ak-border-default text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-ak-brand-primary no-underline text-sm"
              >
                <ArrowLeft size={18} />
                Tilbake til innlogging
              </Link>
            </div>
          </form>
        )}
      </AuthPage.Card>

      <AuthPage.Footer>
        Trenger du hjelp? Kontakt{' '}
        <a href="mailto:support@akgolf.no" className="text-ak-brand-primary no-underline">
          support@akgolf.no
        </a>
      </AuthPage.Footer>
    </AuthPage>
  );
};

export default ForgotPassword;
