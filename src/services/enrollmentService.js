import { supabase } from '../lib/supabase';

export const enrollmentService = {
  async enrollInCourse(courseId, studentId) {
    try {
      const { data, error } = await supabase?.from('enrollments')?.insert([{
          course_id: courseId,
          student_id: studentId,
          status: 'active'
        }])?.select()?.single();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to enroll in course', 
        data: null 
      };
    }
  },

  async getEnrollmentStatus(courseId, studentId) {
    try {
      const { data, error } = await supabase?.from('enrollments')?.select('*')?.eq('course_id', courseId)?.eq('student_id', studentId)?.maybeSingle();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to check enrollment status', 
        data: null 
      };
    }
  },

  async getStudentEnrollments(studentId) {
    try {
      const { data, error } = await supabase?.from('enrollments')?.select(`
          *,
          course:course_id (
            id,
            title,
            description,
            thumbnail_url,
            duration_hours,
            instructor:instructor_id (
              id,
              full_name,
              avatar_url
            )
          )
        `)?.eq('student_id', studentId)?.order('enrolled_at', { ascending: false });

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to load enrollments', 
        data: [] 
      };
    }
  },

  async unenrollFromCourse(enrollmentId) {
    try {
      const { error } = await supabase?.from('enrollments')?.delete()?.eq('id', enrollmentId);

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, error: null };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to unenroll from course' 
      };
    }
  }
};
