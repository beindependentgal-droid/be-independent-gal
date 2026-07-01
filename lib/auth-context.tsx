'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { type AuthChangeEvent, type Session, type User } from '@supabase/supabase-js';
import { createClient } from './supabase-client';
import { AuthUser } from './auth-types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithProvider: (provider: 'google', redirectTo?: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSupabaseUser(user: User | null | undefined): AuthUser | null {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email || '',
    user_metadata: user.user_metadata,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (isMounted) {
          setUser(mapSupabaseUser(data.session?.user));
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    const { data: subscription } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (!isMounted) return;

      setUser(mapSupabaseUser(session?.user));
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription?.subscription?.unsubscribe();
    };
  }, [supabase]);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.session?.user) {
      setUser(mapSupabaseUser(data.session.user));
      setLoading(false);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session?.user) {
      setUser(mapSupabaseUser(sessionData.session.user));
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider: 'google', redirectTo?: string) => {
    if (provider !== 'google') throw new Error('Only Google provider is supported');

    const safeRedirect = redirectTo?.startsWith('/') ? redirectTo : '/community';
    const baseCallbackUrl =
      process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL ||
      `${window.location.origin}/auth/callback`;
    const callbackUrl = `${baseCallbackUrl}?next=${encodeURIComponent(safeRedirect)}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
        flowType: 'pkce',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;
  };

  const sendPasswordReset = async (email: string) => {
    try {
      const resetPasswordForEmail = (supabase.auth as typeof supabase.auth & {
        resetPasswordForEmail?: (email: string) => Promise<{ error: { message: string } | null }>
      }).resetPasswordForEmail

      if (resetPasswordForEmail) {
        const { error } = await resetPasswordForEmail(email)
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } })
        if (error) throw error
      }
    } catch (err) {
      throw err
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        signUp,
        signIn,
        signInWithProvider,
        sendPasswordReset,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
