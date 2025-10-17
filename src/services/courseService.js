import { supabase } from '../lib/supabase';

export const courseService = {
  // Get all published courses
  async getPublishedCourses() {
    try {
      const { data, error } = await supabase?.from('courses')?.select(`
          *,
          instructor:instructor_id (
            id,
            full_name,
            email,
            avatar_url
          ),
          enrollments (
            id
          )
        `)?.eq('status', 'published')?.order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      // Add enrollment count to each course
      const coursesWithStats = data?.map(course => ({
        ...course,
        enrollment_count: course?.enrollments?.length || 0
      }));

      return { success: true, error: null, data: coursesWithStats };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to load courses', 
        data: [] 
      };
    }
  },

  // Get course by ID with details
  async getCourseById(courseId) {
    try {
      const { data, error } = await supabase?.from('courses')?.select(`
          *,
          instructor:instructor_id (
            id,
            full_name,
            email,
            avatar_url,
            bio
          ),
          lessons (
            id,
            title,
            duration_minutes,
            order_index,
            is_published
          ),
          assignments (
            id,
            title,
            due_date,
            max_points,
            status
          )
        `)?.eq('id', courseId)?.single();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to load course details', 
        data: null 
      };
    }
  },

  // Get courses by instructor
  async getCoursesByInstructor(instructorId) {
    try {
      const { data, error } = await supabase?.from('courses')?.select(`
          *,
          enrollments (
            id
          )
        `)?.eq('instructor_id', instructorId)?.order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      // Add enrollment count to each course
      const coursesWithStats = data?.map(course => ({
        ...course,
        enrollment_count: course?.enrollments?.length || 0
      }));

      return { success: true, error: null, data: coursesWithStats };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to load instructor courses', 
        data: [] 
      };
    }
  },

  // Create new course
  async createCourse(courseData) {
    try {
      const { data, error } = await supabase?.from('courses')?.insert([courseData])?.select()?.single();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to create course', 
        data: null 
      };
    }
  },

  // Update course
  async updateCourse(courseId, updates) {
    try {
      const { data, error } = await supabase?.from('courses')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', courseId)?.select()?.single();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to update course', 
        data: null 
      };
    }
  },

  // Delete course
  async deleteCourse(courseId) {
    try {
      const { error } = await supabase?.from('courses')?.delete()?.eq('id', courseId);

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, error: null };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to delete course' 
      };
    }
  },

  // Search courses
  async searchCourses(query) {
    try {
      const { data, error } = await supabase?.from('courses')?.select(`
          *,
          instructor:instructor_id (
            id,
            full_name,
            email,
            avatar_url
          )
        `)?.eq('status', 'published')?.or(`title.ilike.%${query}%,description.ilike.%${query}%`)?.order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to search courses', 
        data: [] 
      };
    }
  },

  // Get course enrollment status for a user
  async getEnrollmentStatus(courseId, userId) {
    try {
      const { data, error } = await supabase?.from('enrollments')?.select('*')?.eq('course_id', courseId)?.eq('student_id', userId)?.single();

      if (error && error?.code !== 'PGRST116') {
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
  }
};