import React from 'react';
import Icon from 'components/AppIcon';

const QuickStatsCards = ({ userRole }) => {
  const teacherStats = [
    {
      id: 1,
      title: 'Total Courses',
      value: '8',
      change: '+2 this month',
      icon: 'BookOpen',
      color: 'bg-blue-500',
      changeType: 'positive'
    },
    {
      id: 2,
      title: 'Total Students',
      value: '156',
      change: '+12 this week',
      icon: 'Users',
      color: 'bg-green-500',
      changeType: 'positive'
    },
    {
      id: 3,
      title: 'Pending Reviews',
      value: '23',
      change: '5 due today',
      icon: 'FileText',
      color: 'bg-orange-500',
      changeType: 'neutral'
    },
    {
      id: 4,
      title: 'Average Rating',
      value: '4.8',
      change: '+0.2 this month',
      icon: 'Star',
      color: 'bg-purple-500',
      changeType: 'positive'
    }
  ];

  const studentStats = [
    {
      id: 1,
      title: 'Enrolled Courses',
      value: '6',
      change: '+1 this month',
      icon: 'BookOpen',
      color: 'bg-blue-500',
      changeType: 'positive'
    },
    {
      id: 2,
      title: 'Completed Assignments',
      value: '24',
      change: '3 this week',
      icon: 'CheckCircle',
      color: 'bg-green-500',
      changeType: 'positive'
    },
    {
      id: 3,
      title: 'Pending Assignments',
      value: '4',
      change: '2 due tomorrow',
      icon: 'Clock',
      color: 'bg-orange-500',
      changeType: 'neutral'
    },
    {
      id: 4,
      title: 'Overall GPA',
      value: '3.7',
      change: '+0.1 this semester',
      icon: 'TrendingUp',
      color: 'bg-purple-500',
      changeType: 'positive'
    }
  ];

  const stats = userRole === 'teacher' ? teacherStats : studentStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats?.map((stat) => (
        <div key={stat?.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${stat?.color} rounded-lg flex items-center justify-center`}>
              <Icon name={stat?.icon} size={24} color="white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{stat?.value}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">{stat?.title}</h3>
            <p className={`text-xs ${
              stat?.changeType === 'positive' ? 'text-success' : 
              stat?.changeType === 'negative'? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {stat?.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStatsCards;