import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
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
      errorInfo
    });

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, { extra: errorInfo });
    // }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
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
          padding: '32px'
        }}>
          <div style={{
            maxWidth: '500px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 24px',
              borderRadius: '50%',
              backgroundColor: 'var(--ak-error)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={32} color="white" />
            </div>

            <h2 style={{
              fontSize: '24px',
              fontWeight: 600,
              color: 'var(--ak-charcoal)',
              marginBottom: '12px'
            }}>
              Noe gikk galt
            </h2>

            <p style={{
              fontSize: '15px',
              color: 'var(--ak-steel)',
              marginBottom: '24px',
              lineHeight: '1.6'
            }}>
              {this.props.message || 'Det oppstod en uventet feil. Vi jobber med å fikse problemet.'}
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                marginBottom: '24px',
                textAlign: 'left',
                padding: '16px',
                backgroundColor: 'var(--ak-snow)',
                borderRadius: '12px',
                fontSize: '13px',
                fontFamily: 'monospace',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                <summary style={{ cursor: 'pointer', marginBottom: '12px', fontWeight: 600 }}>
                  Feildetaljer (kun i utvikling)
                </summary>
                <p style={{ color: 'var(--ak-error)', marginBottom: '8px' }}>
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    color: 'var(--ak-steel)',
                    fontSize: '12px'
                  }}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}

            <button
              onClick={this.handleReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: 'var(--ak-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--ak-primary-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--ak-primary)';
              }}
            >
              <RefreshCw size={18} />
              Prøv igjen
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
