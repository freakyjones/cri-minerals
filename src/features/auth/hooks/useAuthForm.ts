import { useState } from 'react';
import { supabase } from '../../../lib/supabase';

export function useAuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const toggleSignUpMode = () => {
    setIsSignUp(!isSignUp);
    setMessage(null);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage({
          type: 'success',
          text: 'Account created! If you have email verification enabled, check your inbox.',
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Navigation is handled automatically by GuestRoute when the session state updates
      }
    } catch (error: unknown) {
      const err = error as Error;
      setMessage({
        type: 'error',
        text: err.message || 'Authentication failed.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'github' | 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      const err = error as Error;
      setMessage({
        type: 'error',
        text: err.message || `Failed to authenticate with ${provider}.`,
      });
    }
  };

  const handleGuestAuth = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      // Navigation is handled automatically by GuestRoute when the session state updates
    } catch (error: unknown) {
      const err = error as Error;
      setMessage({
        type: 'error',
        text: err.message || 'Failed to authenticate as guest.',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isSignUp,
    toggleSignUpMode,
    loading,
    message,
    handleEmailAuth,
    handleOAuth,
    handleGuestAuth
  };
}
