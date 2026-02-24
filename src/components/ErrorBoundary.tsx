import { ReactNode, Component, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center" style={{ background: '#0A3323' }}>
          <div className="text-center">
            <p style={{ color: '#F7F4D5', fontSize: '18px', marginBottom: '12px' }}>
              Something unexpected happened
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                background: '#D3968C',
                color: '#0A3323',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
