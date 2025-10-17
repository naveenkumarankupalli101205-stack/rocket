-- Location: supabase/migrations/20241217144631_lms_pro_with_auth.sql
-- Schema Analysis: Existing emergency alert schema unrelated to LMS
-- Integration Type: NEW_MODULE - Complete LMS system with authentication
-- Module: LMS Pro Authentication & Core System

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE public.course_status AS ENUM ('draft', 'published', 'archived', 'completed');
CREATE TYPE public.enrollment_status AS ENUM ('active', 'completed', 'dropped', 'suspended');
CREATE TYPE public.assignment_status AS ENUM ('draft', 'published', 'closed');
CREATE TYPE public.submission_status AS ENUM ('draft', 'submitted', 'graded', 'returned');

-- 2. Core Tables
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'student'::public.user_role,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    instructor_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    status public.course_status DEFAULT 'draft'::public.course_status,
    thumbnail_url TEXT,
    duration_hours INTEGER DEFAULT 0,
    max_students INTEGER,
    price DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    status public.enrollment_status DEFAULT 'active'::public.enrollment_status,
    enrolled_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    progress_percentage INTEGER DEFAULT 0,
    UNIQUE(student_id, course_id)
);

CREATE TABLE public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    video_url TEXT,
    duration_minutes INTEGER DEFAULT 0,
    order_index INTEGER NOT NULL,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status public.assignment_status DEFAULT 'draft'::public.assignment_status,
    due_date TIMESTAMPTZ,
    max_points INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT,
    file_url TEXT,
    status public.submission_status DEFAULT 'draft'::public.submission_status,
    points_earned INTEGER,
    feedback TEXT,
    submitted_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assignment_id, student_id)
);

-- 3. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX idx_courses_status ON public.courses(status);
CREATE INDEX idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX idx_lessons_course ON public.lessons(course_id);
CREATE INDEX idx_lessons_order ON public.lessons(course_id, order_index);
CREATE INDEX idx_assignments_course ON public.assignments(course_id);
CREATE INDEX idx_submissions_assignment ON public.submissions(assignment_id);
CREATE INDEX idx_submissions_student ON public.submissions(student_id);

-- 4. Updated timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 5. Apply triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON public.submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'student'::public.user_role)
  );
  RETURN NEW;
END;
$$;

-- 7. Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. RLS Setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- 9. Admin function (safe for any table including user_profiles)
CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' = 'admin' 
         OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

-- 10. RLS Policies using safe patterns

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Admin access to all profiles
CREATE POLICY "admin_full_access_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Pattern 2: Simple user ownership for courses
CREATE POLICY "instructors_manage_own_courses"
ON public.courses
FOR ALL
TO authenticated
USING (instructor_id = auth.uid())
WITH CHECK (instructor_id = auth.uid());

-- Public read access for published courses
CREATE POLICY "public_can_read_published_courses"
ON public.courses
FOR SELECT
TO authenticated
USING (status = 'published'::public.course_status);

-- Admin access to all courses
CREATE POLICY "admin_full_access_courses"
ON public.courses
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Pattern 2: Simple user ownership for enrollments
CREATE POLICY "students_manage_own_enrollments"
ON public.enrollments
FOR ALL
TO authenticated
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

-- Instructors can view enrollments for their courses
CREATE POLICY "instructors_view_course_enrollments"
ON public.enrollments
FOR SELECT
TO authenticated
USING (
    course_id IN (
        SELECT id FROM public.courses WHERE instructor_id = auth.uid()
    )
);

-- Admin access to all enrollments
CREATE POLICY "admin_full_access_enrollments"
ON public.enrollments
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Lessons access: Instructors manage their course lessons, enrolled students can read
CREATE POLICY "instructors_manage_course_lessons"
ON public.lessons
FOR ALL
TO authenticated
USING (
    course_id IN (
        SELECT id FROM public.courses WHERE instructor_id = auth.uid()
    )
)
WITH CHECK (
    course_id IN (
        SELECT id FROM public.courses WHERE instructor_id = auth.uid()
    )
);

CREATE POLICY "enrolled_students_read_lessons"
ON public.lessons
FOR SELECT
TO authenticated
USING (
    is_published = true
    AND course_id IN (
        SELECT course_id FROM public.enrollments 
        WHERE student_id = auth.uid() AND status = 'active'::public.enrollment_status
    )
);

-- Admin access to all lessons
CREATE POLICY "admin_full_access_lessons"
ON public.lessons
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Assignments access: Instructors manage, enrolled students can read published ones
CREATE POLICY "instructors_manage_course_assignments"
ON public.assignments
FOR ALL
TO authenticated
USING (
    course_id IN (
        SELECT id FROM public.courses WHERE instructor_id = auth.uid()
    )
)
WITH CHECK (
    course_id IN (
        SELECT id FROM public.courses WHERE instructor_id = auth.uid()
    )
);

CREATE POLICY "enrolled_students_read_assignments"
ON public.assignments
FOR SELECT
TO authenticated
USING (
    status = 'published'::public.assignment_status
    AND course_id IN (
        SELECT course_id FROM public.enrollments 
        WHERE student_id = auth.uid() AND status = 'active'::public.enrollment_status
    )
);

-- Admin access to all assignments
CREATE POLICY "admin_full_access_assignments"
ON public.assignments
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Pattern 2: Simple user ownership for submissions
CREATE POLICY "students_manage_own_submissions"
ON public.submissions
FOR ALL
TO authenticated
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

-- Instructors can view/grade submissions for their course assignments
CREATE POLICY "instructors_access_assignment_submissions"
ON public.submissions
FOR ALL
TO authenticated
USING (
    assignment_id IN (
        SELECT a.id FROM public.assignments a
        JOIN public.courses c ON a.course_id = c.id
        WHERE c.instructor_id = auth.uid()
    )
)
WITH CHECK (
    assignment_id IN (
        SELECT a.id FROM public.assignments a
        JOIN public.courses c ON a.course_id = c.id
        WHERE c.instructor_id = auth.uid()
    )
);

-- Admin access to all submissions
CREATE POLICY "admin_full_access_submissions"
ON public.submissions
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- 11. Mock Data for LMS System
DO $$
DECLARE
    teacher_uuid UUID := gen_random_uuid();
    student_uuid UUID := gen_random_uuid();
    admin_uuid UUID := gen_random_uuid();
    course_uuid UUID := gen_random_uuid();
    lesson1_uuid UUID := gen_random_uuid();
    lesson2_uuid UUID := gen_random_uuid();
    assignment_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with all required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (teacher_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'teacher@lmspro.com', crypt('teacher123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Dr. Sarah Johnson", "role": "teacher"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'student@lmspro.com', crypt('student123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Alex Chen", "role": "student"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@lmspro.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create sample course
    INSERT INTO public.courses (id, title, description, instructor_id, status, duration_hours, max_students, price)
    VALUES (
        course_uuid, 
        'Introduction to Web Development', 
        'Learn the fundamentals of HTML, CSS, and JavaScript to build modern web applications.',
        teacher_uuid,
        'published'::public.course_status,
        40,
        50,
        99.99
    );

    -- Create sample lessons
    INSERT INTO public.lessons (id, course_id, title, content, duration_minutes, order_index, is_published)
    VALUES 
        (lesson1_uuid, course_uuid, 'Getting Started with HTML', 'Learn the basic structure of HTML documents and common tags.', 45, 1, true),
        (lesson2_uuid, course_uuid, 'Styling with CSS', 'Introduction to CSS selectors, properties, and layouts.', 60, 2, true);

    -- Create sample assignment
    INSERT INTO public.assignments (id, course_id, title, description, status, due_date, max_points)
    VALUES (
        assignment_uuid,
        course_uuid,
        'Build Your First Webpage',
        'Create a simple HTML page with CSS styling showcasing what you have learned.',
        'published'::public.assignment_status,
        CURRENT_TIMESTAMP + INTERVAL '7 days',
        100
    );

    -- Create sample enrollment
    INSERT INTO public.enrollments (student_id, course_id, status, progress_percentage)
    VALUES (student_uuid, course_uuid, 'active'::public.enrollment_status, 25);

    -- Create sample submission
    INSERT INTO public.submissions (assignment_id, student_id, content, status, submitted_at)
    VALUES (
        assignment_uuid,
        student_uuid,
        'Here is my webpage submission with HTML and CSS as requested.',
        'submitted'::public.submission_status,
        CURRENT_TIMESTAMP - INTERVAL '1 day'
    );

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;