import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Logo from '../components/ui/Logo';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: '#0A3323', color: '#F7F4D5' }}>
      <nav className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Link to="/" className="inline-flex items-center gap-2" style={{ color: 'rgba(247,244,213,0.70)' }}>
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8 sm:mb-10">
            <Logo to="/" />
            <h1 className="text-3xl sm:text-4xl font-heading font-bold mt-6 mb-2" style={{ color: '#F7F4D5' }}>
              Welcome back
            </h1>
            <p style={{ color: 'rgba(247,244,213,0.55)' }}>
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className="p-4 rounded-lg text-sm"
                style={{
                  background: '#D3968C20',
                  color: '#D3968C',
                  border: '1px solid #D3968C40',
                }}
              >
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(247,244,213,0.75)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none transition-all"
                style={{
                  background: 'rgba(247,244,213,0.05)',
                  border: '1px solid rgba(247,244,213,0.10)',
                  color: '#F7F4D5',
                }}
                onFocus={e => {
                  e.currentTarget.style.background = 'rgba(247,244,213,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(247,244,213,0.20)';
                }}
                onBlur={e => {
                  e.currentTarget.style.background = 'rgba(247,244,213,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(247,244,213,0.10)';
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(247,244,213,0.75)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none transition-all"
                style={{
                  background: 'rgba(247,244,213,0.05)',
                  border: '1px solid rgba(247,244,213,0.10)',
                  color: '#F7F4D5',
                }}
                onFocus={e => {
                  e.currentTarget.style.background = 'rgba(247,244,213,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(247,244,213,0.20)';
                }}
                onBlur={e => {
                  e.currentTarget.style.background = 'rgba(247,244,213,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(247,244,213,0.10)';
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-semibold transition-all duration-300"
              style={{ background: '#D3968C', color: '#0A3323' }}
              onMouseEnter={e => {
                if (!loading) (e.currentTarget as HTMLElement).style.opacity = '0.9';
              }}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm" style={{ color: 'rgba(247,244,213,0.55)' }}>
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold transition-colors"
              style={{ color: '#D3968C' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.8'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
