import { supabase } from '../lib/supabase';

export const assignmentService = {
  async getAssignmentById(assignmentId) {
    try {
      const { data, error } = await supabase?.from('assignments')?.select(`
          *,
          course:course_id (
            id,
            title,
            instructor_id
          )
        `)?.eq('id', assignmentId)?.single();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to load assignment details', 
        data: null 
      };
    }
  },

  async getAssignmentsByCourse(courseId) {
    try {
      const { data, error } = await supabase?.from('assignments')?.select('*')?.eq('course_id', courseId)?.order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to load assignments', 
        data: [] 
      };
    }
  },

  async createAssignment(assignmentData) {
    try {
      const { data, error } = await supabase?.from('assignments')?.insert([assignmentData])?.select()?.single();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to create assignment', 
        data: null 
      };
    }
  },

  async updateAssignment(assignmentId, updates) {
    try {
      const { data, error } = await supabase?.from('assignments')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', assignmentId)?.select()?.single();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to update assignment', 
        data: null 
      };
    }
  },

  async deleteAssignment(assignmentId) {
    try {
      const { error } = await supabase?.from('assignments')?.delete()?.eq('id', assignmentId);

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, error: null };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to delete assignment' 
      };
    }
  }
};
