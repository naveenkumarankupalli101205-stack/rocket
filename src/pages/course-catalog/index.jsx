import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import AuthenticatedHeader from 'components/ui/AuthenticatedHeader';
import NavigationBreadcrumb from 'components/ui/NavigationBreadcrumb';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Icon from 'components/AppIcon';
import { courseService } from '../../services/courseService';
import { enrollmentService } from '../../services/enrollmentService';

const CourseCatalog = () => {
  const navigate = useNavigate();
  const { user, userProfile, isTeacher, isStudent, signOut } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollments, setEnrollments] = useState(new Set());

  useEffect(() => {
    loadCourses();
  }, [userProfile]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      let result;
      
      if (isTeacher && userProfile?.id) {
        result = await courseService.getCoursesByInstructor(userProfile.id);
      } else {
        result = await courseService.getPublishedCourses();
      }

      if (result.success) {
        setCourses(result.data || []);
        setFilteredCourses(result.data || []);
        
        if (isStudent && userProfile?.id) {
          const enrollmentResult = await enrollmentService.getStudentEnrollments(userProfile.id);
          if (enrollmentResult.success) {
            const enrolledCourseIds = new Set(
              enrollmentResult.data.map(e => e.course_id)
            );
            setEnrollments(enrolledCourseIds);
          }
        }
      } else {
        toast.error(result.error || 'Failed to load courses');
      }
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = courses.filter(course =>
        course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  }, [searchQuery, courses]);

  const handleEnroll = async (courseId) => {
    if (!userProfile?.id) {
      toast.error('Please log in to enroll');
      return;
    }

    const result = await enrollmentService.enrollInCourse(courseId, userProfile.id);
    if (result.success) {
      toast.success('Successfully enrolled in course!');
      setEnrollments(new Set([...enrollments, courseId]));
    } else {
      toast.error(result.error || 'Failed to enroll in course');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    const result = await courseService.deleteCourse(courseId);
    if (result.success) {
      toast.success('Course deleted successfully');
      loadCourses();
    } else {
      toast.error(result.error || 'Failed to delete course');
    }
  };

  const handleLogout = async () => {
    const result = await signOut();
    if (result.error) {
      toast.error('Failed to logout');
    } else {
      toast.success('Logged out successfully');
      navigate('/user-login');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <AuthenticatedHeader 
        userRole={userProfile?.role}
        userName={userProfile?.full_name}
        userAvatar={userProfile?.avatar_url}
        onLogout={handleLogout}
      />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NavigationBreadcrumb />
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {isTeacher ? 'My Courses' : 'Course Catalog'}
                </h1>
                <p className="text-muted-foreground">
                  {isTeacher 
                    ? 'Manage your courses and content' 
                    : 'Browse and enroll in available courses'}
                </p>
              </div>
              
              {isTeacher && (
                <Button
                  onClick={() => navigate('/create-course')}
                  className="flex items-center gap-2"
                >
                  <Icon name="Plus" size={20} />
                  Create Course
                </Button>
              )}
            </div>

            <div className="relative">
              <Icon 
                name="Search" 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <Icon name="BookOpen" size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No courses found</h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? 'Try adjusting your search query' 
                  : isTeacher 
                    ? 'Create your first course to get started' 
                    : 'No courses are currently available'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                    {course.thumbnail_url && (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-medium text-gray-900">
                        {course.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Icon name="Clock" size={16} />
                        <span>{course.duration_hours}h</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="Users" size={16} />
                        <span>{course.enrollment_count || 0} students</span>
                      </div>
                    </div>

                    {course.instructor && (
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                          {course.instructor.full_name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {course.instructor.full_name}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {isStudent && (
                        <>
                          {enrollments.has(course.id) ? (
                            <Button
                              onClick={() => navigate(`/course/${course.id}`)}
                              className="flex-1"
                              variant="outline"
                            >
                              View Course
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleEnroll(course.id)}
                              className="flex-1"
                            >
                              Enroll Now
                            </Button>
                          )}
                        </>
                      )}
                      
                      {isTeacher && (
                        <>
                          <Button
                            onClick={() => navigate(`/course/${course.id}`)}
                            className="flex-1"
                            variant="outline"
                          >
                            <Icon name="Eye" size={16} />
                          </Button>
                          <Button
                            onClick={() => navigate(`/edit-course/${course.id}`)}
                            className="flex-1"
                            variant="outline"
                          >
                            <Icon name="Edit" size={16} />
                          </Button>
                          <Button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="flex-1"
                            variant="outline"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseCatalog;
