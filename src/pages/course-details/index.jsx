import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import AuthenticatedHeader from 'components/ui/AuthenticatedHeader';
import NavigationBreadcrumb from 'components/ui/NavigationBreadcrumb';
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';
import { courseService } from '../../services/courseService';
import { assignmentService } from '../../services/assignmentService';
import { enrollmentService } from '../../services/enrollmentService';
import { format } from 'date-fns';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile, isTeacher, isStudent, signOut } = useAuth();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourseDetails();
  }, [id, userProfile]);

  const loadCourseDetails = async () => {
    setLoading(true);
    try {
      const result = await courseService.getCourseById(id);
      
      if (result.success && result.data) {
        setCourse(result.data);
        
        const assignmentsResult = await assignmentService.getAssignmentsByCourse(id);
        if (assignmentsResult.success) {
          setAssignments(assignmentsResult.data || []);
        }

        if (isStudent && userProfile?.id) {
          const enrollmentResult = await enrollmentService.getEnrollmentStatus(id, userProfile.id);
          setIsEnrolled(!!enrollmentResult.data);
        }
      } else {
        toast.error(result.error || 'Failed to load course');
        navigate('/courses');
      }
    } catch (error) {
      toast.error('Failed to load course details');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!userProfile?.id) {
      toast.error('Please log in to enroll');
      return;
    }

    const result = await enrollmentService.enrollInCourse(id, userProfile.id);
    if (result.success) {
      toast.success('Successfully enrolled!');
      setIsEnrolled(true);
    } else {
      toast.error(result.error || 'Failed to enroll');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedHeader 
          userRole={userProfile?.role}
          userName={userProfile?.full_name}
          userAvatar={userProfile?.avatar_url}
          onLogout={handleLogout}
        />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  const isOwner = isTeacher && course.instructor_id === userProfile?.id;

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
          
          <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
            <div className="h-64 bg-gradient-to-br from-blue-500 to-purple-600 relative">
              {course.thumbnail_url && (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-end">
                <div className="p-8 text-white">
                  <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
                  <div className="flex items-center gap-4">
                    {course.instructor && (
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">
                          {course.instructor.full_name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span>{course.instructor.full_name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Icon name="Clock" size={18} />
                      <span>{course.duration_hours} hours</span>
                    </div>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      {course.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-4">About this course</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {course.description || 'No description available.'}
                  </p>
                </div>
                
                <div className="ml-8">
                  {isStudent && !isEnrolled && (
                    <Button onClick={handleEnroll} size="lg">
                      Enroll Now
                    </Button>
                  )}
                  {isStudent && isEnrolled && (
                    <Button variant="outline" disabled>
                      <Icon name="Check" size={18} className="mr-2" />
                      Enrolled
                    </Button>
                  )}
                </div>
              </div>

              {course.instructor?.bio && (
                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">About the Instructor</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-semibold">
                      {course.instructor.full_name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{course.instructor.full_name}</p>
                      <p className="text-sm text-muted-foreground">{course.instructor.email}</p>
                      <p className="text-sm text-muted-foreground mt-2">{course.instructor.bio}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Assignments</h2>
                  {isOwner && (
                    <Button
                      onClick={() => navigate(`/create-assignment/${id}`)}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Icon name="Plus" size={16} />
                      Create Assignment
                    </Button>
                  )}
                </div>

                {assignments.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No assignments yet</p>
                    {isOwner && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Create your first assignment to get started
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/assignments/${assignment.id}`)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">
                              {assignment.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {assignment.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {assignment.due_date && (
                                <div className="flex items-center gap-1">
                                  <Icon name="Calendar" size={14} />
                                  <span>Due: {format(new Date(assignment.due_date), 'MMM dd, yyyy')}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Icon name="Award" size={14} />
                                <span>{assignment.max_points} points</span>
                              </div>
                              <span className="px-2 py-0.5 bg-muted rounded text-xs">
                                {assignment.status}
                              </span>
                            </div>
                          </div>
                          <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-foreground mb-4">Course Info</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Icon name="BookOpen" size={20} className="text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Lessons</p>
                      <p className="text-sm text-muted-foreground">
                        {course.lessons?.length || 0} lessons
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Icon name="FileText" size={20} className="text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Assignments</p>
                      <p className="text-sm text-muted-foreground">
                        {assignments.length} assignments
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Icon name="Clock" size={20} className="text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Duration</p>
                      <p className="text-sm text-muted-foreground">
                        {course.duration_hours} hours
                      </p>
                    </div>
                  </div>

                  {course.max_students && (
                    <div className="flex items-start gap-3">
                      <Icon name="Users" size={20} className="text-orange-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Max Students</p>
                        <p className="text-sm text-muted-foreground">
                          {course.max_students} students
                        </p>
                      </div>
                    </div>
                  )}

                  {course.price > 0 && (
                    <div className="flex items-start gap-3">
                      <Icon name="DollarSign" size={20} className="text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Price</p>
                        <p className="text-sm text-muted-foreground">
                          ${course.price}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {isStudent && isEnrolled && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <Button
                      onClick={() => toast.success('Viewing course materials...')}
                      className="w-full"
                      variant="outline"
                    >
                      <Icon name="Play" size={18} className="mr-2" />
                      View Materials
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetails;
