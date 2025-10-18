# lms-pro - Learning Management System

## Overview

lms-pro is a modern Learning Management System (LMS) built with React 18 and Supabase. The application enables role-based interactions between students and teachers, supporting course management, assignment distribution, submission tracking, and grade management. The system provides a complete educational workflow from course enrollment through assignment submission and grading.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Core Framework**: React 18 with Vite as the build tool and development server
- Utilizes concurrent rendering features for improved performance
- Fast HMR (Hot Module Replacement) during development via Vite
- Port configured to run on 5000 with strict port enforcement

**State Management**: Redux Toolkit
- Centralized application state management
- Simplified Redux setup with best practices built-in
- Handles user authentication state, course data, and enrollment information

**Routing**: React Router v6
- Declarative, component-based routing
- Dynamic route parameters for course and assignment detail pages
- Hash link support for in-page navigation via react-router-hash-link

**Styling System**: TailwindCSS with extensive customization
- Utility-first CSS approach with custom design tokens
- Custom color palette defined via CSS variables for consistent theming
- Enhanced with multiple Tailwind plugins:
  - Forms styling (@tailwindcss/forms)
  - Typography (@tailwindcss/typography)
  - Container queries support
  - Aspect ratio utilities
  - Fluid type scaling
  - Elevation/shadow system
  - Animation utilities (tailwindcss-animate)
- Class merging via clsx and tailwind-merge for dynamic styling

**UI Component Strategy**:
- Radix UI primitives for accessible, unstyled components (@radix-ui/react-slot)
- Class Variance Authority (CVA) for variant-based component styling
- Lucide React for consistent iconography
- Component tagging system via @dhiwise/component-tagger

**Form Handling**: React Hook Form
- Performant form validation and state management
- Reduces re-renders through uncontrolled components
- Used for assignment submissions, course creation, and user profile updates

**Animations**: Framer Motion
- Declarative animation API for smooth UI transitions
- Page transitions and interactive element animations

**Data Visualization**: D3.js and Recharts
- D3 for custom, low-level data visualizations
- Recharts for pre-built chart components
- Used for displaying student performance metrics and course analytics

**User Feedback**: React Hot Toast
- Non-intrusive notification system
- Success/error feedback for async operations

**Date Handling**: date-fns
- Lightweight date manipulation and formatting
- Used for assignment due dates and submission timestamps

**Testing**: Jest and React Testing Library
- Component testing with emphasis on user behavior
- Accessibility-focused testing utilities

### Backend Architecture

**Backend-as-a-Service**: Supabase
- Provides authentication, real-time database, and file storage
- PostgreSQL database with Row Level Security (RLS) policies
- Real-time subscriptions for live updates

**Authentication System**:
- Email/password authentication via Supabase Auth
- Auto-refresh tokens for persistent sessions
- Session detection in URLs for auth flows
- Role-based access control (student/teacher roles)
- User metadata stored in auth.users and extended in user_profiles table

**API Communication**: Axios
- HTTP client for external API calls
- Interceptor support for auth token injection
- Error handling and retry logic

**Service Layer Pattern**:
Services encapsulate all Supabase interactions:
- `authService.js`: Authentication operations (sign up, sign in, sign out)
- `courseService.js`: Course CRUD operations with instructor and enrollment data
- `assignmentService.js`: Assignment management by course
- `submissionService.js`: Student assignment submissions and grading
- `enrollmentService.js`: Course enrollment status and management
- `userProfileService.js`: User profile retrieval and updates

All services return standardized response objects:
```javascript
{ success: boolean, error: string|null, data: any }
```

### Data Storage

**Primary Database**: Supabase (PostgreSQL)

**Database Schema**:

**user_profiles** table:
- Extends Supabase auth.users with additional profile data
- Fields: id (UUID, references auth.users), full_name, email, role (student/teacher), avatar_url, bio, created_at, updated_at

**courses** table:
- Core course information
- Fields: id, title, description, instructor_id (foreign key to user_profiles), status (draft/published), duration, created_at, updated_at
- Relationships: One-to-many with instructor, many-to-many with students via enrollments

**enrollments** table:
- Junction table for student-course relationships
- Fields: id, course_id (foreign key), student_id (foreign key), status (active/completed), enrolled_at
- Composite unique constraint on (course_id, student_id)

**assignments** table:
- Assignment definitions per course
- Fields: id, course_id (foreign key), title, description, due_date, created_at
- Relationship: Many-to-one with courses

**submissions** table:
- Student assignment submissions with grading
- Fields: id, assignment_id (foreign key), student_id (foreign key), file_url, submitted_at, grade, feedback, graded_at
- Unique constraint on (assignment_id, student_id)

**File Storage**: Supabase Storage
- Stores assignment submission files
- Organized by buckets with access policies
- Public URLs for file retrieval

**Query Patterns**:
- Nested Supabase select queries for relational data (instructor details within courses)
- Filtering with .eq() for role-based queries
- Ordering by created_at/submitted_at for chronological displays
- Aggregation for enrollment counts and grade calculations

### Authentication & Authorization

**Authentication Flow**:
1. User signs up with email/password and role selection
2. Supabase creates auth.users entry and sends verification email
3. User metadata (full_name, role) stored in auth.users.user_metadata
4. Corresponding user_profiles record created via database trigger
5. Login returns session token stored in localStorage
6. Token auto-refreshes via Supabase client configuration

**Authorization Model**:
- Role stored in user_profiles.role field
- Frontend route protection based on role
- Backend Row Level Security policies restrict data access by role
- Teachers can only modify their own courses/assignments
- Students can only view enrolled courses and submit to active assignments

**Session Management**:
- Persistent sessions via localStorage
- Auto-refresh token mechanism prevents session expiration
- Session validation on protected routes

## External Dependencies

### Third-Party Services

**Supabase** (Primary Backend):
- Authentication service with JWT tokens
- PostgreSQL database with REST API
- Real-time subscriptions via WebSockets
- File storage with CDN delivery
- Row Level Security for data authorization
- Configuration via environment variables:
  - `VITE_SUPABASE_URL`: Supabase project URL
  - `VITE_SUPABASE_ANON_KEY`: Anonymous/public API key

**Rocket** (Development/Deployment Platform):
- Integrated via script tags in index.html
- Provides rocket-web.js for web components
- Includes rocket-shot.js for additional functionality
- Backend endpoint at application.rocket.new
- Configuration endpoint at lmspro2090back.builtwithrocket.new

### External Libraries

**UI & Styling**:
- TailwindCSS (v3.4.6): Core styling framework
- Radix UI: Accessible component primitives
- Lucide React: Icon library
- Framer Motion: Animation library

**State & Data Management**:
- Redux Toolkit (v2.6.1): State management
- React Hook Form (v7.55.0): Form handling
- Axios (v1.8.4): HTTP client

**Utilities**:
- date-fns (v4.1.0): Date manipulation
- clsx & tailwind-merge: Class name management
- dotenv (v16.0.1): Environment variable loading

**Visualization**:
- D3.js (v7.9.0): Data visualization
- Recharts (v2.15.2): Chart components

**Development Tools**:
- Vite (v5.0.0): Build tool
- @vitejs/plugin-react: React plugin for Vite
- PostCSS & Autoprefixer: CSS processing

### Environment Configuration

Required environment variables (.env file):
```
VITE_SUPABASE_URL=<your-supabase-project-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

Application throws error if environment variables are missing, ensuring proper configuration before runtime.