import React from 'react';
import Button from 'components/ui/Button';
import { useNavigate } from 'react-router-dom';

const QuickActions = ({ userRole }) => {
  const navigate = useNavigate();

  const teacherActions = [
    {
      id: 1,
      title: 'Create New Course',
      description: 'Start building your next course',
      icon: 'Plus',
      variant: 'default',
      action: () => navigate('/courses/create')
    },
    {
      id: 2,
      title: 'Grade Assignments',
      description: 'Review pending submissions',
      icon: 'FileCheck',
      variant: 'outline',
      action: () => navigate('/assignments/pending')
    },
    {
      id: 3,
      title: 'View Analytics',
      description: 'Check course performance',
      icon: 'BarChart3',
      variant: 'outline',
      action: () => navigate('/analytics')
    }
  ];

  const studentActions = [
    {
      id: 1,
      title: 'Browse Courses',
      description: 'Discover new learning opportunities',
      icon: 'Search',
      variant: 'default',
      action: () => navigate('/courses')
    },
    {
      id: 2,
      title: 'Submit Assignment',
      description: 'Upload your completed work',
      icon: 'Upload',
      variant: 'outline',
      action: () => navigate('/assignments')
    },
    {
      id: 3,
      title: 'View Grades',
      description: 'Check your academic progress',
      icon: 'Award',
      variant: 'outline',
      action: () => navigate('/grades')
    }
  ];

  const actions = userRole === 'teacher' ? teacherActions : studentActions;

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions?.map((action) => (
          <div key={action?.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200">
            <div className="flex flex-col items-center text-center space-y-3">
              <Button
                variant={action?.variant}
                size="lg"
                iconName={action?.icon}
                iconPosition="left"
                onClick={action?.action}
                className="w-full"
              >
                {action?.title}
              </Button>
              <p className="text-sm text-muted-foreground">{action?.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;