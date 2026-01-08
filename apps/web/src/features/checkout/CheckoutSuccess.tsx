/**
 * TIER Golf - Checkout Success Page
 *
 * Displayed after successful subscription payment
 */

import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { Button, Text } from '../../ui/primitives';

const PLAN_NAMES: Record<string, string> = {
  premium: 'Premium Player',
  elite: 'Elite Player',
  base: 'Base Coach',
  pro: 'Pro Coach',
  team: 'Team Coach',
};

const CheckoutSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const planId = searchParams.get('plan') || '';
  const interval = searchParams.get('interval') || 'monthly';

  const planName = PLAN_NAMES[planId] || 'Subscription';

  useEffect(() => {
    // Update user data to reflect active subscription
    const updateUserSubscription = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;

        // Refresh user data
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          localStorage.setItem('userData', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('Failed to update user data:', error);
      }
    };

    updateUserSubscription();
  }, []);

  const handleContinue = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      navigate(user.role === 'COACH' ? '/coach/dashboard' : '/player/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-tier-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Success Card */}
        <div className="bg-tier-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-tier-success-light rounded-full mb-6">
            <Check size={32} className="text-tier-success" />
          </div>

          {/* Title */}
          <Text variant="title1" color="primary" className="mb-2">
            Velkommen til TIER Golf!
          </Text>

          {/* Subtitle */}
          <Text variant="body" color="secondary" className="mb-8">
            Din {planName} abonnement er nå aktivert
          </Text>

          {/* Plan Details */}
          <div className="bg-tier-background rounded-lg p-6 mb-8 text-left">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Text variant="footnote" color="secondary">
                  Plan:
                </Text>
                <Text variant="footnote" color="primary" className="font-semibold">
                  {planName}
                </Text>
              </div>
              <div className="flex justify-between items-center">
                <Text variant="footnote" color="secondary">
                  Fakturering:
                </Text>
                <Text variant="footnote" color="primary" className="font-semibold">
                  {interval === 'monthly' ? 'Månedlig' : 'Årlig'}
                </Text>
              </div>
              <div className="flex justify-between items-center">
                <Text variant="footnote" color="secondary">
                  Gratis prøveperiode:
                </Text>
                <Text variant="footnote" color="primary" className="font-semibold">
                  14 dager
                </Text>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-tier-accent-light rounded-lg p-6 mb-8 text-left">
            <Text variant="body" color="primary" className="font-semibold mb-3">
              Neste steg:
            </Text>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check size={18} className="text-tier-success flex-shrink-0 mt-0.5" />
                <Text variant="footnote" color="secondary">
                  Fullfør din profil og sett opp dine mål
                </Text>
              </li>
              <li className="flex items-start gap-2">
                <Check size={18} className="text-tier-success flex-shrink-0 mt-0.5" />
                <Text variant="footnote" color="secondary">
                  Begynn å spore din IUP-progresjon
                </Text>
              </li>
              <li className="flex items-start gap-2">
                <Check size={18} className="text-tier-success flex-shrink-0 mt-0.5" />
                <Text variant="footnote" color="secondary">
                  Utforsk treningsplaner og analytics
                </Text>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <Button
            variant="primary"
            onClick={handleContinue}
            fullWidth
            className="mb-4"
          >
            Gå til Dashboard
            <ArrowRight size={18} className="ml-2" />
          </Button>

          {/* Support Link */}
          <Text variant="footnote" color="secondary">
            Trenger du hjelp?{' '}
            <a
              href="/support"
              className="text-tier-navy font-semibold hover:underline"
            >
              Kontakt support
            </a>
          </Text>
        </div>

        {/* Email Confirmation Notice */}
        <div className="mt-6 text-center">
          <Text variant="footnote" color="secondary">
            En bekreftelse er sendt til din e-post med detaljer om abonnementet.
          </Text>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
