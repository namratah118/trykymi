import { ReactNode, Component, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorCount = this.state.errorCount + 1;
    this.setState({ errorCount });
    console.error('[ErrorBoundary]', error);
    console.error('[ErrorBoundary] Component Stack:', errorInfo.componentStack);

    if (errorCount >= 3) {
      console.error('[ErrorBoundary] Multiple errors detected. Page may be unstable.');
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center" style={{ background: '#0A3323' }}>
          <div className="text-center px-4">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(211,150,140,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <span style={{ fontSize: '24px' }}>⚠️</span>
            </div>
            <h2 style={{ color: '#F7F4D5', fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
              Oops, something went wrong
            </h2>
            <p style={{ color: 'rgba(247,244,213,0.60)', fontSize: '14px', marginBottom: '24px', maxWidth: '300px', margin: '0 auto 24px' }}>
              We encountered an unexpected error. Try refreshing the page or contact support if the problem persists.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReset}
                style={{
                  background: '#D3968C',
                  color: '#0A3323',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Refresh page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  background: 'transparent',
                  color: '#F7F4D5',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid rgba(247,244,213,0.25)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(247,244,213,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(247,244,213,0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(247,244,213,0.25)';
                }}
              >
                Go home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
