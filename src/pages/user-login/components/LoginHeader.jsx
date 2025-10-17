import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      <Link to="/landing-page" className="inline-flex items-center space-x-2 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
          <Icon name="GraduationCap" size={24} color="white" />
        </div>
        <span className="text-2xl font-bold text-foreground">LMS Pro</span>
      </Link>
      
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Access Your Learning Hub
      </h1>
      <p className="text-lg text-muted-foreground max-w-md mx-auto">
        Sign in to continue your educational journey with personalized courses, assignments, and progress tracking.
      </p>
    </div>
  );
};

export default LoginHeader;