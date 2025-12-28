/**
 * AK Golf Academy - 404 Not Found Page
 * Design System v3.0 - UI Canon Compliant
 *
 * Purpose:
 * - Display friendly 404 error for non-existent routes
 * - Provide navigation back to known routes
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Button from '../../ui/primitives/Button';
import Card from '../../ui/primitives/Card';
import StateCard from '../../ui/composites/StateCard';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <Card variant="default" padding="lg" style={{ maxWidth: '480px', width: '100%' }}>
        <StateCard
          variant="empty"
          icon={Search}
          title="Fant ikke siden"
          description="Siden du leter etter kan ha blitt flyttet, slettet, eller finnes ikke."
          action={
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<ArrowLeft size={18} />}
                onClick={() => navigate(-1)}
              >
                Tilbake
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Home size={18} />}
                onClick={() => navigate('/dashboard')}
              >
                Til Dashboard
              </Button>
            </div>
          }
        />

        <div
          style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-default)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', margin: 0 }}>
            Feilkode: 404
          </p>
        </div>
      </Card>
    </div>
  );
};

export default NotFoundPage;
