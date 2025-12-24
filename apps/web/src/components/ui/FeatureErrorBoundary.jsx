import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { tokens, typographyStyle } from '../../design-tokens';

/**
 * Feature-level Error Boundary
 * Provides graceful error handling for individual features without crashing the entire app
 */
class FeatureErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const { onError, featureName } = this.props;

    // Log error details
    console.error(`[${featureName || 'Feature'}] Error caught:`, error, errorInfo);

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // TODO: Send to error tracking service
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, {
    //     contexts: {
    //       react: { componentStack: errorInfo.componentStack },
    //       feature: { name: featureName }
    //     }
    //   });
    // }
  }

  handleReset = () => {
    const { onReset } = this.props;

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    if (onReset) {
      onReset();
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    const { hasError, error, errorInfo, errorCount } = this.state;
    const {
      children,
      featureName = 'Denne funksjonen',
      fallback,
      showHomeButton = false,
      minimal = false,
    } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback({ error, errorInfo, onReset: this.handleReset });
      }

      // Minimal error UI for compact spaces
      if (minimal) {
        return (
          <div
            style={{
              padding: tokens.spacing.lg,
              textAlign: 'center',
              backgroundColor: `${tokens.colors.error}10`,
              borderRadius: tokens.radius.md,
              border: `1px solid ${tokens.colors.error}30`,
            }}
            role="alert"
            aria-live="assertive"
          >
            <AlertTriangle size={24} color={tokens.colors.error} style={{ margin: '0 auto 12px' }} />
            <p
              style={{
                ...typographyStyle('subheadline'),
                color: tokens.colors.charcoal,
                margin: '0 0 12px',
              }}
            >
              {featureName} kunne ikke lastes
            </p>
            <button
              onClick={this.handleReset}
              style={{
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                backgroundColor: tokens.colors.primary,
                color: tokens.colors.white,
                border: 'none',
                borderRadius: tokens.radius.sm,
                cursor: 'pointer',
                ...typographyStyle('subheadline'),
                fontWeight: 600,
              }}
            >
              Prøv igjen
            </button>
          </div>
        );
      }

      // Full error UI
      return (
        <div
          style={{
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: tokens.spacing.xl,
            fontFamily: tokens.typography.fontFamily,
          }}
          role="alert"
          aria-live="assertive"
        >
          <div
            style={{
              maxWidth: '600px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 24px',
                borderRadius: '50%',
                backgroundColor: `${tokens.colors.error}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={40} color={tokens.colors.error} />
            </div>

            <h2
              style={{
                ...typographyStyle('title2'),
                color: tokens.colors.charcoal,
                marginBottom: tokens.spacing.sm,
              }}
            >
              Noe gikk galt
            </h2>

            <p
              style={{
                ...typographyStyle('subheadline'),
                color: tokens.colors.steel,
                marginBottom: tokens.spacing.lg,
                lineHeight: '24px',
              }}
            >
              {featureName} støtte på et problem. Prøv å laste siden på nytt,
              eller kontakt support hvis problemet vedvarer.
            </p>

            {/* Show warning if error keeps happening */}
            {errorCount > 2 && (
              <div
                style={{
                  padding: tokens.spacing.md,
                  backgroundColor: `${tokens.colors.warning}15`,
                  border: `1px solid ${tokens.colors.warning}30`,
                  borderRadius: tokens.radius.md,
                  marginBottom: tokens.spacing.lg,
                }}
              >
                <p
                  style={{
                    ...typographyStyle('footnote'),
                    color: tokens.colors.charcoal,
                    margin: 0,
                  }}
                >
                  <strong>Vedvarende problem:</strong> Denne feilen har oppstått {errorCount} ganger.
                  Vennligst kontakt support for assistanse.
                </p>
              </div>
            )}

            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && error && (
              <details
                style={{
                  marginBottom: tokens.spacing.lg,
                  textAlign: 'left',
                  padding: tokens.spacing.md,
                  backgroundColor: tokens.colors.snow,
                  borderRadius: tokens.radius.md,
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              >
                <summary
                  style={{
                    cursor: 'pointer',
                    marginBottom: '12px',
                    fontWeight: 600,
                    ...typographyStyle('subheadline'),
                    fontFamily: tokens.typography.fontFamily,
                  }}
                >
                  Feildetaljer (kun i utvikling)
                </summary>
                <p style={{ color: tokens.colors.error, marginBottom: '8px' }}>
                  {error.toString()}
                </p>
                {errorInfo && (
                  <pre
                    style={{
                      whiteSpace: 'pre-wrap',
                      color: tokens.colors.steel,
                      fontSize: '12px',
                      margin: 0,
                    }}
                  >
                    {errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}

            {/* Action buttons */}
            <div
              style={{
                display: 'flex',
                gap: tokens.spacing.md,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={this.handleReset}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: tokens.spacing.sm,
                  padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
                  backgroundColor: tokens.colors.primary,
                  color: tokens.colors.white,
                  border: 'none',
                  borderRadius: tokens.radius.md,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  ...typographyStyle('headline'),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = tokens.colors.primaryLight;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = tokens.colors.primary;
                }}
              >
                <RefreshCw size={18} />
                Prøv igjen
              </button>

              {showHomeButton && (
                <button
                  onClick={this.handleGoHome}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: tokens.spacing.sm,
                    padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
                    backgroundColor: tokens.colors.snow,
                    color: tokens.colors.charcoal,
                    border: `1px solid ${tokens.colors.mist}`,
                    borderRadius: tokens.radius.md,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    ...typographyStyle('headline'),
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = tokens.colors.cloud;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = tokens.colors.snow;
                  }}
                >
                  <Home size={18} />
                  Gå til forsiden
                </button>
              )}
            </div>

            {/* Support link */}
            <div
              style={{
                marginTop: tokens.spacing.xl,
                paddingTop: tokens.spacing.lg,
                borderTop: `1px solid ${tokens.colors.mist}`,
              }}
            >
              <p
                style={{
                  ...typographyStyle('footnote'),
                  color: tokens.colors.steel,
                  margin: 0,
                }}
              >
                Trenger du hjelp? Kontakt{' '}
                <a
                  href="mailto:support@akgolf.no"
                  style={{
                    color: tokens.colors.primary,
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
    }

    return children;
  }
}

export default FeatureErrorBoundary;

/**
 * Hook for functional components to report errors to parent boundary
 */
export function useErrorHandler() {
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return setError;
}

/**
 * HOC to wrap components with error boundary
 */
export function withErrorBoundary(Component, errorBoundaryProps = {}) {
  const WrappedComponent = (props) => (
    <FeatureErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </FeatureErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}
