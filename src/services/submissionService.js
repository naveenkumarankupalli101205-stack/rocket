import { supabase } from '../lib/supabase';

export const submissionService = {
  async getSubmissionsByAssignment(assignmentId) {
    try {
      const { data, error } = await supabase?.from('submissions')?.select(`
          *,
          student:student_id (
            id,
            full_name,
            email,
            avatar_url
          )
        `)?.eq('assignment_id', assignmentId)?.order('submitted_at', { ascending: false });

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to load submissions', 
        data: [] 
      };
    }
  },

  async getSubmissionByStudent(assignmentId, studentId) {
    try {
      const { data, error } = await supabase?.from('submissions')?.select('*')?.eq('assignment_id', assignmentId)?.eq('student_id', studentId)?.maybeSingle();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to load submission', 
        data: null 
      };
    }
  },

  async createSubmission(submissionData) {
    try {
      const { data, error } = await supabase?.from('submissions')?.insert([{
          ...submissionData,
          submitted_at: new Date()?.toISOString(),
          status: 'submitted'
        }])?.select()?.single();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to submit assignment', 
        data: null 
      };
    }
  },

  async updateSubmission(submissionId, updates) {
    try {
      const { data, error } = await supabase?.from('submissions')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', submissionId)?.select()?.single();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to update submission', 
        data: null 
      };
    }
  },

  async gradeSubmission(submissionId, pointsEarned, feedback) {
    try {
      const { data, error } = await supabase?.from('submissions')?.update({
          points_earned: pointsEarned,
          feedback,
          status: 'graded',
          graded_at: new Date()?.toISOString()
        })?.eq('id', submissionId)?.select()?.single();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to grade submission', 
        data: null 
      };
    }
  },

  async getStudentGrades(studentId) {
    try {
      const { data, error } = await supabase?.from('submissions')?.select(`
          *,
          assignment:assignment_id (
            id,
            title,
            max_points,
            course:course_id (
              id,
              title
            )
          )
        `)?.eq('student_id', studentId)?.eq('status', 'graded')?.order('graded_at', { ascending: false });

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to load grades', 
        data: [] 
      };
    }
  },

  async uploadFile(file, path) {
    try {
      const fileExt = file?.name?.split('.')?.pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { data, error } = await supabase?.storage?.from('submissions')?.upload(filePath, file);

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      const { data: { publicUrl } } = supabase?.storage?.from('submissions')?.getPublicUrl(filePath);

      return { success: true, error: null, data: { path: filePath, url: publicUrl } };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to upload file', 
        data: null 
      };
    }
  }
};
