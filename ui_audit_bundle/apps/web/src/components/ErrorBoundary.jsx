import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from '../ui/primitives/Button';
import StateCard from '../ui/composites/StateCard';
import { captureException } from '../utils/errorReporter';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Send to error tracking service (Sentry)
    captureException(error, {
      source: 'ErrorBoundary',
      action: 'component_error',
      extra: {
        componentStack: errorInfo?.componentStack,
        boundaryName: this.props.name || 'unnamed',
      },
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          backgroundColor: 'var(--bg-primary)',
        }}>
          <div style={{ maxWidth: '500px' }}>
            <StateCard
              variant="error"
              icon={AlertTriangle}
              title="Noe gikk galt"
              description={this.props.message || 'Det oppstod en uventet feil. Vi jobber med å fikse problemet.'}
              action={
                <Button
                  variant="primary"
                  leftIcon={<RefreshCw size={18} />}
                  onClick={this.handleReset}
                >
                  Prøv igjen
                </Button>
              }
            />

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                marginTop: '24px',
                textAlign: 'left',
                padding: '16px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontFamily: 'monospace',
                maxHeight: '200px',
                overflowY: 'auto',
              }}>
                <summary style={{ cursor: 'pointer', marginBottom: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Feildetaljer (kun i utvikling)
                </summary>
                <p style={{ color: 'var(--error)', marginBottom: '8px' }}>
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                  }}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
