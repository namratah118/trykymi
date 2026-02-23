import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../components/ui/Logo';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError('Incorrect email or password. Please try again.');
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0A3323' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="text-center mb-10">
            <div className="inline-flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(247,244,213,0.08)', border: '2px solid rgba(247,244,213,0.15)' }}>
                <div className="w-3 h-3 rounded-full" style={{ background: '#D3968C' }} />
              </div>
              <h1 className="font-heading text-3xl font-semibold mb-2" style={{ letterSpacing: '-0.03em', color: '#F7F4D5' }}>TryKymi</h1>
              <p className="text-sm font-body" style={{ color: 'rgba(247,244,213,0.60)' }}>Your AI Lifestyle Manager</p>
            </div>
          </div>

          <div
            className="rounded-2xl p-8"
            style={{
              background: 'rgba(247,244,213,0.05)',
              border: '1px solid rgba(247,244,213,0.10)',
            }}
          >
            <h1 className="font-heading text-2xl font-semibold mb-6" style={{ letterSpacing: '-0.025em', color: '#F7F4D5' }}>Sign in</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="px-4 py-3 rounded-xl text-sm font-body" style={{ background: 'rgba(211,150,140,0.15)', color: '#D3968C', border: '1px solid rgba(211,150,140,0.25)' }}>
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-body font-semibold mb-1.5" style={{ color: 'rgba(247,244,213,0.75)' }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-body text-sm transition-all duration-200 focus:outline-none"
                  style={{ background: '#105666', border: '1px solid #839958', color: '#F7F4D5' }}
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-body font-semibold mb-1.5" style={{ color: 'rgba(247,244,213,0.75)' }}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-11 rounded-lg font-body text-sm transition-all duration-200 focus:outline-none"
                    style={{ background: '#105666', border: '1px solid #839958', color: '#F7F4D5' }}
                    placeholder="Your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'rgba(247,244,213,0.45)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = 'rgba(247,244,213,0.75)'}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'rgba(247,244,213,0.45)'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-body font-semibold text-base transition-all hover:opacity-90 active:scale-95 mt-2 disabled:opacity-50"
                style={{ background: '#D3968C', color: '#0A3323' }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(10,51,35,0.3)', borderTopColor: '#0A3323' }} />
                    Signing in...
                  </span>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm font-body mt-6" style={{ color: 'rgba(247,244,213,0.50)' }}>
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold transition-opacity hover:opacity-80" style={{ color: '#D3968C' }}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
