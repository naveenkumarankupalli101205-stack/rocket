import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const NotificationPanel = ({ userRole }) => {
  const [notifications, setNotifications] = useState(() => {
    if (userRole === 'teacher') {
      return [
        {
          id: 1,
          type: 'submission',
          title: 'New Assignment Submission',
          message: '5 students submitted their React projects',
          time: '10 minutes ago',
          isRead: false,
          priority: 'high'
        },
        {
          id: 2,
          type: 'question',
          title: 'Student Question',
          message: 'Emma asked about state management in the discussion forum',
          time: '1 hour ago',
          isRead: false,
          priority: 'medium'
        },
        {
          id: 3,
          type: 'enrollment',
          title: 'New Enrollment',
          message: '3 new students enrolled in Advanced JavaScript course',
          time: '2 hours ago',
          isRead: true,
          priority: 'low'
        },
        {
          id: 4,
          type: 'system',
          title: 'System Update',
          message: 'Gradebook features have been updated with new analytics',
          time: '1 day ago',
          isRead: true,
          priority: 'low'
        }
      ];
    } else {
      return [
        {
          id: 1,
          type: 'grade',
          title: 'Assignment Graded',
          message: 'Your React Components assignment has been graded: 92/100',
          time: '30 minutes ago',
          isRead: false,
          priority: 'high'
        },
        {
          id: 2,
          type: 'assignment',
          title: 'New Assignment',
          message: 'JavaScript Async Programming project has been posted',
          time: '2 hours ago',
          isRead: false,
          priority: 'high'
        },
        {
          id: 3,
          type: 'reminder',
          title: 'Assignment Due Soon',
          message: 'CSS Grid Layout assignment due tomorrow at 11:59 PM',
          time: '4 hours ago',
          isRead: true,
          priority: 'medium'
        },
        {
          id: 4,
          type: 'announcement',
          title: 'Course Announcement',
          message: 'Office hours moved to Wednesdays 2-4 PM this week',
          time: '1 day ago',
          isRead: true,
          priority: 'low'
        }
      ];
    }
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'submission':
        return 'FileCheck';
      case 'question':
        return 'MessageCircle';
      case 'enrollment':
        return 'UserPlus';
      case 'grade':
        return 'Award';
      case 'assignment':
        return 'FileText';
      case 'reminder':
        return 'Clock';
      case 'announcement':
        return 'Megaphone';
      case 'system':
        return 'Settings';
      default:
        return 'Bell';
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-red-500';
    if (priority === 'medium') return 'text-orange-500';
    return 'text-blue-500';
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev?.map(notification => 
        notification?.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev?.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const unreadCount = notifications?.filter(n => !n?.isRead)?.length;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
          <Button variant="ghost" size="sm" iconName="Settings">
            Settings
          </Button>
        </div>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications?.map((notification) => (
          <div 
            key={notification?.id}
            className={`p-3 rounded-lg border transition-colors duration-200 cursor-pointer ${
              notification?.isRead 
                ? 'border-border bg-background hover:bg-muted/50' :'border-primary/20 bg-primary/5 hover:bg-primary/10'
            }`}
            onClick={() => markAsRead(notification?.id)}
          >
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                notification?.isRead ? 'bg-muted' : 'bg-primary/10'
              }`}>
                <Icon 
                  name={getNotificationIcon(notification?.type)} 
                  size={16} 
                  className={getNotificationColor(notification?.type, notification?.priority)}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`text-sm font-medium truncate ${
                    notification?.isRead ? 'text-muted-foreground' : 'text-foreground'
                  }`}>
                    {notification?.title}
                  </h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {notification?.time}
                  </span>
                </div>
                <p className={`text-sm ${
                  notification?.isRead ? 'text-muted-foreground' : 'text-foreground'
                }`}>
                  {notification?.message}
                </p>
                {!notification?.isRead && (
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <Button variant="outline" fullWidth iconName="Bell">
          View All Notifications
        </Button>
      </div>
    </div>
  );
};

export default NotificationPanel;