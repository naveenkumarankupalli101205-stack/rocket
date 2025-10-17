import React from 'react';
import PublicHeader from 'components/ui/PublicHeader';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import LoginFeatures from './components/LoginFeatures';

const UserLogin = () => {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
            {/* Left Column - Features (Desktop Only) */}
            <div className="order-2 lg:order-1">
              <LoginFeatures />
            </div>

            {/* Right Column - Login Form */}
            <div className="order-1 lg:order-2">
              <div className="lg:sticky lg:top-24">
                <LoginHeader />
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {new Date()?.getFullYear()} LMS Pro. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLogin;