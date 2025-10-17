import React, { useState, useEffect } from 'react';
import AuthenticatedHeader from 'components/ui/AuthenticatedHeader';
import NavigationBreadcrumb from 'components/ui/NavigationBreadcrumb';
import WelcomeHeader from './components/WelcomeHeader';
import QuickStatsCards from './components/QuickStatsCards';
import QuickActions from './components/QuickActions';
import RecentActivity from './components/RecentActivity';
import CourseOverview from './components/CourseOverview';
import NotificationPanel from './components/NotificationPanel';
import Icon from '../../components/AppIcon';


const RoleBasedDashboard = () => {
  const [userRole, setUserRole] = useState('student');
  const [userName, setUserName] = useState('John Doe');
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    // Mock user data - in real app, this would come from authentication context
    const mockUserData = {
      role: 'student', // Change to 'teacher' to see teacher dashboard
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    };

    setUserRole(mockUserData?.role);
    setUserName(mockUserData?.name);
    setUserAvatar(mockUserData?.avatar);
  }, []);

  const handleLogout = () => {
    // Handle logout logic here
    console.log('User logged out');
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader 
        userRole={userRole}
        userName={userName}
        userAvatar={userAvatar}
        onLogout={handleLogout}
      />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NavigationBreadcrumb />
          
          <WelcomeHeader userRole={userRole} userName={userName} />
          
          <QuickStatsCards userRole={userRole} />
          
          <QuickActions userRole={userRole} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <CourseOverview userRole={userRole} />
            </div>
            <div className="lg:col-span-1">
              <NotificationPanel userRole={userRole} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity userRole={userRole} />
            
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {userRole === 'teacher' ? 'Teaching Resources' : 'Learning Resources'}
              </h2>
              
              <div className="space-y-4">
                {userRole === 'teacher' ? (
                  <>
                    <div className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon name="BookOpen" size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Course Templates</h3>
                        <p className="text-sm text-muted-foreground">Pre-built course structures</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Icon name="BarChart3" size={20} className="text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Analytics Dashboard</h3>
                        <p className="text-sm text-muted-foreground">Student performance insights</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Icon name="Users" size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Student Management</h3>
                        <p className="text-sm text-muted-foreground">Manage enrollments & progress</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon name="Calendar" size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Study Schedule</h3>
                        <p className="text-sm text-muted-foreground">Plan your learning time</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Icon name="Target" size={20} className="text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Learning Goals</h3>
                        <p className="text-sm text-muted-foreground">Set and track objectives</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Icon name="HelpCircle" size={20} className="text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Study Help</h3>
                        <p className="text-sm text-muted-foreground">Get assistance when needed</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoleBasedDashboard;