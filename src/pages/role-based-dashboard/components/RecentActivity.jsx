import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Button from '../../../components/ui/Button';


const RecentActivity = ({ userRole }) => {
  const teacherActivities = [
  {
    id: 1,
    type: 'submission',
    title: 'New assignment submission',
    description: 'Sarah Johnson submitted "React Fundamentals Project"',
    time: '2 hours ago',
    icon: 'FileText',
    iconColor: 'text-blue-500',
    avatar: "https://images.unsplash.com/photo-1630473147136-fedd85b45f25",
    avatarAlt: 'Professional headshot of young woman with brown hair and friendly smile'
  },
  {
    id: 2,
    type: 'enrollment',
    title: 'New student enrolled',
    description: 'Michael Chen joined "Advanced JavaScript Course"',
    time: '4 hours ago',
    icon: 'UserPlus',
    iconColor: 'text-green-500',
    avatar: "https://images.unsplash.com/photo-1687256457585-3608dfa736c5",
    avatarAlt: 'Professional headshot of Asian man with short black hair in business attire'
  },
  {
    id: 3,
    type: 'question',
    title: 'Student question posted',
    description: 'Emma Wilson asked about "State Management in React"',
    time: '6 hours ago',
    icon: 'MessageCircle',
    iconColor: 'text-orange-500',
    avatar: "https://images.unsplash.com/photo-1544961585-de6f13aa4fa0",
    avatarAlt: 'Professional headshot of blonde woman with blue eyes smiling at camera'
  },
  {
    id: 4,
    type: 'completion',
    title: 'Course completed',
    description: 'David Rodriguez finished "HTML & CSS Basics"',
    time: '1 day ago',
    icon: 'Award',
    iconColor: 'text-purple-500',
    avatar: "https://images.unsplash.com/photo-1633116182067-e7326d3d409a",
    avatarAlt: 'Professional headshot of Hispanic man with beard in casual shirt'
  }];


  const studentActivities = [
  {
    id: 1,
    type: 'grade',
    title: 'Assignment graded',
    description: 'You received 95/100 on "JavaScript Functions Quiz"',
    time: '1 hour ago',
    icon: 'CheckCircle',
    iconColor: 'text-green-500',
    teacher: 'Prof. Anderson'
  },
  {
    id: 2,
    type: 'assignment',
    title: 'New assignment posted',
    description: 'React Components Project due in 3 days',
    time: '3 hours ago',
    icon: 'FileText',
    iconColor: 'text-blue-500',
    teacher: 'Prof. Martinez'
  },
  {
    id: 3,
    type: 'announcement',
    title: 'Course announcement',
    description: 'Midterm exam scheduled for next Friday',
    time: '5 hours ago',
    icon: 'Megaphone',
    iconColor: 'text-orange-500',
    teacher: 'Prof. Johnson'
  },
  {
    id: 4,
    type: 'material',
    title: 'New course material',
    description: 'Advanced CSS Techniques slides uploaded',
    time: '1 day ago',
    icon: 'BookOpen',
    iconColor: 'text-purple-500',
    teacher: 'Prof. Lee'
  }];


  const activities = userRole === 'teacher' ? teacherActivities : studentActivities;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
        <Button variant="ghost" size="sm" iconName="MoreHorizontal">
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {activities?.map((activity) =>
        <div key={activity?.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
            <div className="flex-shrink-0">
              {userRole === 'teacher' && activity?.avatar ?
            <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                src={activity?.avatar}
                alt={activity?.avatarAlt}
                className="w-full h-full object-cover" />

                </div> :

            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <Icon name={activity?.icon} size={20} className={activity?.iconColor} />
                </div>
            }
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity?.title}
                </p>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {activity?.time}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {activity?.description}
              </p>
              {userRole === 'student' && activity?.teacher &&
            <p className="text-xs text-muted-foreground mt-1">
                  by {activity?.teacher}
                </p>
            }
            </div>
          </div>
        )}
      </div>
    </div>);

};

export default RecentActivity;