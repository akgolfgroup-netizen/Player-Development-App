/**
 * Support Page
 * Create support tickets and view submission history
 */

import React, { useState } from 'react';
import { Headphones, CheckCircle, AlertCircle } from 'lucide-react';
import { useCreateSupportTicket } from '../../hooks/useSupport';
import SupportTicketForm from './components/SupportTicketForm';
import { PageHeader } from '../../components/layout/PageHeader';
import Button from '../../ui/primitives/Button';

const SupportPage: React.FC = () => {
  const { createTicket, loading } = useCreateSupportTicket();
  const [showSuccess, setShowSuccess] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  const handleSubmit = async (ticketData: any) => {
    try {
      const created = await createTicket(ticketData);
      setTicketNumber(created.id || 'N/A');
      setShowSuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to create ticket:', error);
      alert('Kunne ikke opprette supporthenvendelse. Prøv igjen.');
    }
  };

  return (
    <div className="min-h-screen bg-tier-surface-base p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Headphones size={28} className="text-tier-info" />
            <PageHeader title="Support" subtitle="" helpText="" actions={null} className="mb-0" />
          </div>
          <p className="text-tier-text-secondary">
            Trenger du hjelp? Send oss en henvendelse så kommer vi tilbake til deg så snart som mulig.
          </p>
        </div>

        {/* Success message */}
        {showSuccess && (
          <div className="bg-tier-success-light border border-tier-success rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <CheckCircle size={24} className="text-tier-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-tier-navy mb-2">
                  Henvendelse sendt!
                </h3>
                <p className="text-sm text-tier-text-secondary mb-2">
                  Vi har mottatt din henvendelse og vil svare deg så snart som mulig.
                </p>
                <p className="text-sm font-medium text-tier-navy">
                  Saksnummer: <span className="font-mono bg-white px-2 py-1 rounded">{ticketNumber}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <SupportTicketForm onSubmit={handleSubmit} isSubmitting={loading} className="mb-6" />

        {/* FAQ/Help section */}
        <div className="bg-white rounded-xl border border-tier-border-default p-6">
          <h3 className="text-lg font-semibold text-tier-navy mb-4">
            💡 Ofte stilte spørsmål
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-tier-surface-base rounded-lg">
              <h4 className="font-semibold text-tier-navy mb-2">
                Hvor raskt får jeg svar?
              </h4>
              <p className="text-sm text-tier-text-secondary">
                Vi svarer normalt innen 24 timer på hverdager. Kritiske henvendelser prioriteres og behandles raskere.
              </p>
            </div>

            <div className="p-4 bg-tier-surface-base rounded-lg">
              <h4 className="font-semibold text-tier-navy mb-2">
                Hva skjer etter at jeg sender henvendelsen?
              </h4>
              <p className="text-sm text-tier-text-secondary">
                Du får en e-post med saksnummeret ditt. Vi undersøker saken og kommer tilbake med en løsning eller spørsmål for å hjelpe deg videre.
              </p>
            </div>

            <div className="p-4 bg-tier-surface-base rounded-lg">
              <h4 className="font-semibold text-tier-navy mb-2">
                Kan jeg følge statusen på saken min?
              </h4>
              <p className="text-sm text-tier-text-secondary">
                Ja, du vil motta e-postvarsler når statusen på saken din oppdateres. Du kan også bruke saksnummeret til å spørre om status.
              </p>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="mt-6 bg-tier-info-light border border-tier-info rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle size={24} className="text-tier-info flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-tier-navy mb-2">
                Trenger du umiddelbar hjelp?
              </h3>
              <p className="text-sm text-tier-text-secondary mb-3">
                For kritiske problemer kan du også kontakte oss direkte:
              </p>
              <div className="space-y-1 text-sm">
                <p className="text-tier-navy">
                  <span className="font-medium">E-post:</span> support@iupgolf.no
                </p>
                <p className="text-tier-navy">
                  <span className="font-medium">Telefon:</span> +47 123 45 678
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
