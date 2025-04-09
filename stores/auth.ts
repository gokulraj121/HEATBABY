import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type User = Database['public']['Tables']['users']['Row'];

interface AuthState {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        set({ user: userData || null });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  signIn: async (email, password) => {
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (session?.user) {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      set({ user: userData || null });
    }
  },
  signUp: async (email, password, name) => {
    const { data: { session }, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (session?.user) {
      const { error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: session.user.id,
            email,
            name,
            user_type: 'single',
          },
        ]);

      if (userError) throw userError;

      set({ 
        user: {
          id: session.user.id,
          email,
          name,
          user_type: 'single',
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      });
    }
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },
}));
