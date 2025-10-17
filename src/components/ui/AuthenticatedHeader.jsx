import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Icon from '../AppIcon';
import { useAuth } from '../../contexts/AuthContext';

const AuthenticatedHeader = () => {
  const navigate = useNavigate();
  const { user, userProfile, signOut, isAuthenticated } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await signOut();
      if (!error) {
        navigate('/');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInitials = () => {
    if (userProfile?.full_name) {
      return userProfile?.full_name?.split(' ')?.map(name => name?.[0])?.join('')?.toUpperCase()?.slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const getRoleColor = () => {
    switch (userProfile?.role) {
      case 'admin': return 'bg-red-500';
      case 'teacher': return 'bg-blue-500';
      case 'student': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/role-based-dashboard" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Icon name="GraduationCap" size={20} color="white" />
            </div>
            <span className="text-xl font-bold text-foreground">LMS Pro</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/role-based-dashboard" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            {userProfile?.role === 'student' && (
              <>
                <Link 
                  to="/courses" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Courses
                </Link>
                <Link 
                  to="/assignments" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Assignments
                </Link>
              </>
            )}
            {userProfile?.role === 'teacher' && (
              <>
                <Link 
                  to="/my-courses" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  My Courses
                </Link>
                <Link 
                  to="/create-course" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Create Course
                </Link>
              </>
            )}
            {userProfile?.role === 'admin' && (
              <>
                <Link 
                  to="/admin/users" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Users
                </Link>
                <Link 
                  to="/admin/courses" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  All Courses
                </Link>
              </>
            )}
          </nav>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-medium ${getRoleColor()}`}>
                {getUserInitials()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground">
                  {userProfile?.full_name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {userProfile?.role || 'Member'}
                </p>
              </div>
              <Icon 
                name={isProfileMenuOpen ? "ChevronUp" : "ChevronDown"} 
                size={16} 
                className="text-muted-foreground" 
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Icon name="User" size={16} className="mr-3" />
                  Profile Settings
                </Link>
                <Link
                  to="/preferences"
                  className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Icon name="Settings" size={16} className="mr-3" />
                  Preferences
                </Link>
                <hr className="my-1 border-border" />
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <Icon name="LogOut" size={16} className="mr-3" />
                  {isLoading ? 'Signing out...' : 'Sign Out'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t bg-background/95">
        <nav className="container mx-auto px-4 py-2">
          {/* Mobile nav items based on role */}
        </nav>
      </div>
    </header>
  );
};

export default AuthenticatedHeader;