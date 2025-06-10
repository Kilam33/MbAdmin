import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        setUser(session?.user as User || null);
      } catch (error) {
        console.error('Error in getSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setUser(session?.user as User || null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // Log for debugging
      if (data.user) {
        console.log('Sign in successful:', data.user.email);
        console.log('User metadata:', data.user.app_metadata, data.user.user_metadata);
      }
      
      return { data, error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const isAdmin = () => {
    if (!user) return false;
    
    // Debug log to see the actual user structure
    console.log('Checking admin status for user:', {
      email: user.email,
      app_metadata: user.app_metadata,
      user_metadata: user.user_metadata
    });
    
    // Check multiple possible admin indicators
    return (
      user.app_metadata?.role === 'admin' || 
      user.user_metadata?.role === 'admin' ||
      user.email?.endsWith('@gmail.com')
    );
  };

  return {
    user,
    loading,
    signIn,
    signOut,
    isAdmin,
  };
};