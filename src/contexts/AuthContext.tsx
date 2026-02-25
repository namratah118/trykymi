import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout | null = null;

    const forceLoadingComplete = () => {
      if (mounted && timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (mounted) {
        setLoading(false);
      }
    };

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('[Auth] Failed to get session:', error);
        }
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          forceLoadingComplete();
        }
      } catch (error) {
        console.error('[Auth] Session initialization error:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          forceLoadingComplete();
        }
      }
    };

    initializeAuth();

    timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn('[Auth] Loading timeout - forcing completion after 2 seconds');
        setLoading(false);
      }
    }, 2000);

    let subscription;
    try {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          forceLoadingComplete();
        }
      });
      subscription = data.subscription;
    } catch (error) {
      console.error('[Auth] Failed to setup auth listener:', error);
      forceLoadingComplete();
    }

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) {
        console.error('[Auth] Signup error:', error);
        return { error };
      }

      if (data.user) {
        try {
          await supabase.from('users').upsert({
            id: data.user.id,
            full_name: fullName,
            email,
          });
        } catch (dbError) {
          console.error('[Auth] Users table sync error:', dbError);
        }
      }

      return { error: null };
    } catch (error) {
      console.error('[Auth] Signup exception:', error);
      return { error: error instanceof Error ? error : new Error('Signup failed') };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('[Auth] Signin error:', error);
      }
      return { error };
    } catch (error) {
      console.error('[Auth] Signin exception:', error);
      return { error: error instanceof Error ? error : new Error('Signin failed') };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
