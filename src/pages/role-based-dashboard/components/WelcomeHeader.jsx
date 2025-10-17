import React from 'react';
import Icon from 'components/AppIcon';

const WelcomeHeader = ({ userRole, userName }) => {
  const currentHour = new Date()?.getHours();
  const getGreeting = () => {
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleSpecificMessage = () => {
    if (userRole === 'teacher') {
      return 'Ready to inspire and educate today?';
    }
    return 'Ready to learn something new today?';
  };

  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {getGreeting()}, {userName}!
          </h1>
          <p className="text-white/90 text-lg">
            {getRoleSpecificMessage()}
          </p>
        </div>
        <div className="hidden md:flex items-center justify-center w-16 h-16 bg-white/20 rounded-full">
          <Icon 
            name={userRole === 'teacher' ? 'GraduationCap' : 'BookOpen'} 
            size={32} 
            color="white" 
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;