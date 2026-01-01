import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { tokens } from '../../../design-tokens';
import { SectionTitle } from '../../../components/typography';
import Button from '../../../ui/primitives/Button';
import { testDefinitions, TestDefinition } from '../config/testDefinitions';
import TestOverviewPage from '../templates/TestOverviewPage';

// ============================================================================
// TEST DETAIL PAGE
// ============================================================================

/**
 * Dynamic test detail page that renders the appropriate test
 * based on the testId URL parameter.
 *
 * Route: /testing/:testId
 * Example: /testing/driver-clubhead-speed
 */
const TestDetailPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();

  // Find the test definition
  const test = testDefinitions.find(t => t.id === testId);

  // Handle test not found
  if (!test) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '24px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          backgroundColor: `${tokens.colors.error}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
        }}>
          <AlertCircle size={40} color={tokens.colors.error} />
        </div>
        <SectionTitle style={{ margin: '0 0 8px 0' }}>
          Test ikke funnet
        </SectionTitle>
        <p style={{
          margin: '0 0 24px 0',
          fontSize: '15px',
          color: tokens.colors.steel,
          maxWidth: '400px',
        }}>
          Vi kunne ikke finne testen "{testId}". Sjekk at du har riktig URL eller velg en test fra listen.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate('/testprotokoll')}
          leftIcon={<ArrowLeft size={18} />}
        >
          Tilbake til testprotokoll
        </Button>
      </div>
    );
  }

  // Handle form submission
  const handleSubmit = async (data: any) => {
    console.log('Test result submitted:', data);
    // TODO: Send to API
    // await api.submitTestResult(data);

    // Show success message or navigate
    navigate('/testprotokoll', {
      state: { message: `${test.name} resultat lagret!` }
    });
  };

  // Handle close/back
  const handleClose = () => {
    navigate('/testprotokoll');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: tokens.colors.snow,
      padding: '24px',
    }}>
      <TestOverviewPage
        test={test}
        onSubmit={handleSubmit}
        onClose={handleClose}
      />
    </div>
  );
};

export default TestDetailPage;
