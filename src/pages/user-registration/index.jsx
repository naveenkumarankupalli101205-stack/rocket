import React from 'react';
import PublicHeader from 'components/ui/PublicHeader';
import RegistrationForm from './components/RegistrationForm';
import RegistrationBenefits from './components/RegistrationBenefits';

const UserRegistration = () => {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      
      <main className="pt-16">
        <div className="min-h-screen flex">
          {/* Left Side - Registration Form */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
            <RegistrationForm />
          </div>

          {/* Right Side - Benefits (Desktop Only) */}
          <div className="hidden lg:block lg:flex-1 bg-muted/30">
            <RegistrationBenefits />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserRegistration;