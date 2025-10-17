import React from 'react';
import Icon from 'components/AppIcon';

const RegistrationBenefits = () => {
  const benefits = [
    {
      icon: 'BookOpen',
      title: 'Access Quality Courses',
      description: 'Browse and enroll in hundreds of courses across various subjects and skill levels.'
    },
    {
      icon: 'Users',
      title: 'Connect with Educators',
      description: 'Learn from experienced teachers and connect with fellow students worldwide.'
    },
    {
      icon: 'Award',
      title: 'Track Your Progress',
      description: 'Monitor your learning journey with detailed progress tracking and achievements.'
    },
    {
      icon: 'Clock',
      title: 'Learn at Your Pace',
      description: 'Flexible learning schedule that adapts to your lifestyle and commitments.'
    }
  ];

  return (
    <div className="hidden lg:flex lg:flex-col lg:justify-center lg:px-8">
      <div className="max-w-md">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Why Choose LMS Pro?
        </h2>
        
        <div className="space-y-6">
          {benefits?.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={benefit?.icon} size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  {benefit?.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit?.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Shield" size={16} className="text-success" />
            <span className="text-sm font-medium text-foreground">Secure & Private</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Your data is protected with enterprise-grade security and we never share your information with third parties.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationBenefits;