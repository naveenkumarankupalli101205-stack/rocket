import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Button from 'components/ui/Button';
import { useNavigate } from 'react-router-dom';

const CourseOverview = ({ userRole }) => {
  const navigate = useNavigate();

  const teacherCourses = [
  {
    id: 1,
    title: 'React Fundamentals',
    students: 45,
    assignments: 8,
    completionRate: 78,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    imageAlt: 'Modern computer screen displaying React code with blue and white interface',
    status: 'active'
  },
  {
    id: 2,
    title: 'Advanced JavaScript',
    students: 32,
    assignments: 12,
    completionRate: 85,
    image: "https://images.unsplash.com/photo-1587023263472-2ac90f42b060",
    imageAlt: 'JavaScript code displayed on dark computer monitor with yellow syntax highlighting',
    status: 'active'
  },
  {
    id: 3,
    title: 'HTML & CSS Basics',
    students: 67,
    assignments: 6,
    completionRate: 92,
    image: "https://images.unsplash.com/photo-1720980757337-707998aa438b",
    imageAlt: 'Clean HTML and CSS code structure on white background with colorful syntax',
    status: 'completed'
  }];


  const studentCourses = [
  {
    id: 1,
    title: 'React Fundamentals',
    instructor: 'Prof. Anderson',
    progress: 75,
    nextAssignment: 'Component Lifecycle',
    dueDate: '2025-10-20',
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    imageAlt: 'Modern computer screen displaying React code with blue and white interface',
    status: 'in-progress'
  },
  {
    id: 2,
    title: 'Advanced JavaScript',
    instructor: 'Prof. Martinez',
    progress: 60,
    nextAssignment: 'Async Programming',
    dueDate: '2025-10-22',
    image: "https://images.unsplash.com/photo-1587023263472-2ac90f42b060",
    imageAlt: 'JavaScript code displayed on dark computer monitor with yellow syntax highlighting',
    status: 'in-progress'
  },
  {
    id: 3,
    title: 'HTML & CSS Basics',
    instructor: 'Prof. Johnson',
    progress: 100,
    nextAssignment: null,
    dueDate: null,
    image: "https://images.unsplash.com/photo-1720980757337-707998aa438b",
    imageAlt: 'Clean HTML and CSS code structure on white background with colorful syntax',
    status: 'completed'
  }];


  const courses = userRole === 'teacher' ? teacherCourses : studentCourses;

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          {userRole === 'teacher' ? 'My Courses' : 'Enrolled Courses'}
        </h2>
        <Button
          variant="outline"
          size="sm"
          iconName="Plus"
          onClick={() => navigate('/courses')}>

          {userRole === 'teacher' ? 'Create Course' : 'Browse Courses'}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses?.map((course) =>
        <div
          key={course?.id}
          className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
          onClick={() => handleCourseClick(course?.id)}>

            <div className="h-32 overflow-hidden">
              <Image
              src={course?.image}
              alt={course?.imageAlt}
              className="w-full h-full object-cover" />

            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-foreground truncate">{course?.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
              course?.status === 'active' || course?.status === 'in-progress' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`
              }>
                  {course?.status === 'in-progress' ? 'In Progress' :
                course?.status === 'active' ? 'Active' : 'Completed'}
                </span>
              </div>

              {userRole === 'teacher' ?
            <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Icon name="Users" size={14} />
                      <span>{course?.students} students</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="FileText" size={14} />
                      <span>{course?.assignments} assignments</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completion Rate</span>
                    <span className="text-sm font-medium text-foreground">{course?.completionRate}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course?.completionRate}%` }} />

                  </div>
                </div> :

            <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">by {course?.instructor}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium text-foreground">{course?.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course?.progress}%` }} />

                  </div>
                  {course?.nextAssignment &&
              <div className="mt-3 p-2 bg-muted/50 rounded-md">
                      <p className="text-xs font-medium text-foreground">Next: {course?.nextAssignment}</p>
                      <p className="text-xs text-muted-foreground">Due: {new Date(course.dueDate)?.toLocaleDateString()}</p>
                    </div>
              }
                </div>
            }
            </div>
          </div>
        )}
      </div>
    </div>);

};

export default CourseOverview;