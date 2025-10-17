import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';

const PublicHeader = () => {
  const location = useLocation();
  const isLoginPage = location?.pathname === '/user-login';
  const isRegisterPage = location?.pathname === '/user-registration';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/landing-page" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
            <Icon name="GraduationCap" size={20} color="white" />
          </div>
          <span className="text-xl font-semibold text-foreground">LMS Pro</span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center space-x-3">
          {!isLoginPage && !isRegisterPage && (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden sm:inline-flex"
              >
                <Link to="/user-login">Sign In</Link>
              </Button>
              <Button
                variant="default"
                size="sm"
                asChild
              >
                <Link to="/user-registration">Get Started</Link>
              </Button>
            </>
          )}
          
          {isLoginPage && (
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link to="/user-registration">Create Account</Link>
            </Button>
          )}
          
          {isRegisterPage && (
            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <Link to="/user-login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;