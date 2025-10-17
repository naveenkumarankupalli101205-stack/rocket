import React from 'react';
import Icon from 'components/AppIcon';

const LoginFeatures = () => {
  const features = [
    {
      icon: 'BookOpen',
      title: 'Course Management',
      description: 'Access your enrolled courses and track progress'
    },
    {
      icon: 'FileText',
      title: 'Assignment Hub',
      description: 'Submit assignments and receive feedback'
    },
    {
      icon: 'BarChart3',
      title: 'Grade Tracking',
      description: 'Monitor your academic performance'
    },
    {
      icon: 'Users',
      title: 'Collaboration',
      description: 'Connect with classmates and instructors'
    }
  ];

  return (
    <div className="hidden lg:block">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          Your Learning Platform
        </h2>
        <p className="text-muted-foreground mb-6">
          Experience comprehensive learning management with tools designed for modern education.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {features?.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3 p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg flex-shrink-0">
              <Icon name={feature?.icon} size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">{feature?.title}</h3>
              <p className="text-sm text-muted-foreground">{feature?.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-accent/10 border border-accent/20 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Shield" size={16} className="text-accent" />
          <span className="text-sm font-medium text-foreground">Secure & Reliable</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Your data is protected with enterprise-grade security and encrypted connections.
        </p>
      </div>
    </div>
  );
};

export default LoginFeatures;