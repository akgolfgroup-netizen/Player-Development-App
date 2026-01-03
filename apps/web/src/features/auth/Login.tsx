/**
 * AK Golf Academy - Login Page
 *
 * Archetype: D - System/Auth Page
 * Purpose: User authentication
 *
 * MIGRATED TO AUTH PAGE ARCHITECTURE - Zero inline styles
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, AlertCircle, X } from 'lucide-react';
import { AKLogo } from '../../components/branding/AKLogo';
import { AuthPage } from '../../ui/components';
import { Button, Text, Input } from '../../ui/primitives';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSuccess(true);
    setTimeout(() => {
      setShowForgotPassword(false);
      setResetSuccess(false);
      setResetEmail('');
    }, 3000);
  };

  // Get redirect path based on user role
  const getRedirectPath = (role: string) => {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'coach':
        return '/coach';
      default:
        return '/dashboard';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);

    if (result.success && result.user) {
      navigate(getRedirectPath(result.user.role));
    } else {
      setError(result.error ?? 'Innlogging feilet');
    }
    setLoading(false);
  };

  const handleDemoLogin = async (role: 'admin' | 'coach' | 'player') => {
    const credentials = {
      admin: { email: 'admin@demo.com', password: 'admin123' },
      coach: { email: 'coach@demo.com', password: 'coach123' },
      player: { email: 'player@demo.com', password: 'player123' },
    };

    setEmail(credentials[role].email);
    setPassword(credentials[role].password);

    setLoading(true);
    const result = await login(credentials[role].email, credentials[role].password);

    if (result.success && result.user) {
      navigate(getRedirectPath(result.user.role));
    } else {
      setError(result.error ?? 'Innlogging feilet');
    }
    setLoading(false);
  };

  return (
    <AuthPage state={loading ? 'loading' : 'idle'} maxWidth="sm">
      <AuthPage.Logo title="AK Golf Academy" subtitle="Individual Development Plan">
        <AKLogo size={60} className="text-ak-brand-primary" />
      </AuthPage.Logo>

      <AuthPage.Card title="Logg Inn">
        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            data-testid="login-error"
            className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-ak-status-error-light border border-ak-status-error/30 text-ak-status-error text-sm"
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-ak-text-primary mb-2">
              E-post
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Din e-post"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-ak-text-primary mb-2">
              Passord
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Ditt passord"
            />
          </div>

          <div className="mb-6 text-right">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-ak-brand-primary hover:underline bg-transparent border-none cursor-pointer"
            >
              Glemt passord?
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            leftIcon={<LogIn size={20} />}
            disabled={loading}
            loading={loading}
            className="w-full justify-center"
          >
            {loading ? 'Logger inn...' : 'Logg Inn'}
          </Button>
        </form>

        {/* Demo Login Buttons */}
        <div className="mt-6 pt-6 border-t border-ak-border-default">
          <Text variant="footnote" color="secondary" className="text-center mb-3">
            Demo innlogginger
          </Text>
          <div className="flex flex-col gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDemoLogin('player')}
              disabled={loading}
              className="w-full justify-center"
            >
              Spiller (player@demo.com)
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDemoLogin('coach')}
              disabled={loading}
              className="w-full justify-center"
            >
              Trener (coach@demo.com)
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
              className="w-full justify-center"
            >
              Admin (admin@demo.com)
            </Button>
          </div>
        </div>
      </AuthPage.Card>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-ak-surface-card rounded-2xl p-8 max-w-sm w-[90%] relative">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 right-4 p-1 text-ak-text-secondary hover:text-ak-text-primary bg-transparent border-none cursor-pointer"
              aria-label="Lukk"
            >
              <X size={24} />
            </button>

            <Text variant="title2" color="primary" className="mb-4">
              Tilbakestill passord
            </Text>

            {resetSuccess ? (
              <div className="p-5 bg-ak-status-success-light rounded-lg text-center">
                <div className="text-5xl mb-3">✓</div>
                <Text variant="body" color="success">
                  En e-post med instruksjoner for å tilbakestille passord er sendt til {resetEmail}
                </Text>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset}>
                <Text variant="footnote" color="secondary" className="mb-5">
                  Skriv inn e-postadressen din, så sender vi deg en lenke for å tilbakestille passordet.
                </Text>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-ak-text-primary mb-2">
                    E-post
                  </label>
                  <Input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    placeholder="din@epost.no"
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full justify-center">
                  Send tilbakestillingslenke
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </AuthPage>
  );
};

export default Login;
