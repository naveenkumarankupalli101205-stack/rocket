import { supabase } from '../lib/supabase';

export const authService = {
  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.fullName || '',
            role: userData?.role || 'student'
          }
        }
      });

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'An unexpected error occurred during registration', 
        data: null 
      };
    }
  },

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, error: null, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return {
          success: false,
          error: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.',
          data: null
        };
      }
      
      return { 
        success: false, 
        error: 'An unexpected error occurred during login', 
        data: null 
      };
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase?.auth?.signOut();
      
      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, error: null };
    } catch (error) {
      return { 
        success: false, 
        error: 'An unexpected error occurred during logout' 
      };
    }
  },

  // Get current session
  async getSession() {
    try {
      const { data: { session }, error } = await supabase?.auth?.getSession();
      
      if (error) {
        return { success: false, error: error?.message, session: null };
      }

      return { success: true, error: null, session };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to get current session', 
        session: null 
      };
    }
  },

  // Get current user
  async getUser() {
    try {
      const { data: { user }, error } = await supabase?.auth?.getUser();
      
      if (error) {
        return { success: false, error: error?.message, user: null };
      }

      return { success: true, error: null, user };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to get current user', 
        user: null 
      };
    }
  },

  // Reset password
  async resetPassword(email) {
    try {
      const { data, error } = await supabase?.auth?.resetPasswordForEmail(email, {
        redirectTo: `${window.location?.origin}/reset-password`
      });

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to send password reset email', 
        data: null 
      };
    }
  },

  // Update password
  async updatePassword(newPassword) {
    try {
      const { data, error } = await supabase?.auth?.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to update password', 
        data: null 
      };
    }
  },

  // Social login
  async signInWithProvider(provider) {
    try {
      const { data, error } = await supabase?.auth?.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location?.origin}/role-based-dashboard`
        }
      });

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to sign in with ${provider}`, 
        data: null 
      };
    }
  }
};