import { supabase } from '../lib/supabase';

export const userProfileService = {
  // Get user profile by ID
  async getProfile(userId) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to load user profile', 
        data: null 
      };
    }
  },

  // Update user profile
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', userId)?.select()?.single();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to update profile', 
        data: null 
      };
    }
  },

  // Get all teachers
  async getTeachers() {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('role', 'teacher')?.order('full_name', { ascending: true });

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to load teachers', 
        data: [] 
      };
    }
  },

  // Get all students
  async getStudents() {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('role', 'student')?.order('full_name', { ascending: true });

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to load students', 
        data: [] 
      };
    }
  },

  // Search users by name or email
  async searchUsers(query, role = null) {
    try {
      let queryBuilder = supabase?.from('user_profiles')?.select('*');

      if (role) {
        queryBuilder = queryBuilder?.eq('role', role);
      }

      const { data, error } = await queryBuilder?.or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)?.order('full_name', { ascending: true });

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to search users', 
        data: [] 
      };
    }
  },

  // Get user statistics
  async getUserStats(userId) {
    try {
      const [enrollmentsResult, coursesResult, submissionsResult] = await Promise.all([
        // Get student enrollments count
        supabase?.from('enrollments')?.select('id', { count: 'exact' })?.eq('student_id', userId),
        
        // Get teacher courses count
        supabase?.from('courses')?.select('id', { count: 'exact' })?.eq('instructor_id', userId),
        
        // Get student submissions count
        supabase?.from('submissions')?.select('id', { count: 'exact' })?.eq('student_id', userId)
      ]);

      const stats = {
        enrollments: enrollmentsResult?.count || 0,
        courses: coursesResult?.count || 0,
        submissions: submissionsResult?.count || 0
      };

      return { success: true, error: null, data: stats };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to load user statistics', 
        data: { enrollments: 0, courses: 0, submissions: 0 } 
      };
    }
  },

  // Upload avatar
  async uploadAvatar(userId, file) {
    try {
      const fileExt = file?.name?.split('.')?.pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { data, error } = await supabase?.storage?.from('profiles')?.upload(filePath, file, {
        upsert: true
      });

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      const { data: { publicUrl } } = supabase?.storage?.from('profiles')?.getPublicUrl(filePath);

      return { success: true, error: null, data: { path: filePath, url: publicUrl } };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to upload avatar', 
        data: null 
      };
    }
  }
};