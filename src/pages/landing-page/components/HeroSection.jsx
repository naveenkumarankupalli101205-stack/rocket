import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl shadow-lg">
                <Icon name="GraduationCap" size={24} color="white" />
              </div>
              <span className="text-2xl font-bold text-foreground">LMS Pro</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Transform Your
              <span className="block text-primary">Digital Learning</span>
              Experience
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              Empower educators and students with our comprehensive learning management system. Create courses, manage assignments, and track progress all in one powerful platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                variant="default"
                size="lg"
                asChild
                iconName="ArrowRight"
                iconPosition="right"
                className="text-lg px-8 py-4">

                <Link to="/user-registration">Get Started Free</Link>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                asChild
                iconName="LogIn"
                iconPosition="left"
                className="text-lg px-8 py-4">

                <Link to="/user-login">Sign In</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center lg:justify-start space-x-6 mt-8 pt-8 border-t border-border">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Shield" size={16} className="text-success" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Users" size={16} className="text-primary" />
                <span>10,000+ Students</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Award" size={16} className="text-accent" />
                <span>Certified Platform</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative bg-card rounded-2xl shadow-2xl overflow-hidden border border-border">
              <Image
                src="https://images.unsplash.com/photo-1592303637753-ce1e6b8a0ffb"
                alt="Diverse group of students collaborating on laptops in modern classroom with natural lighting"
                className="w-full h-80 lg:h-96 object-cover" />

              
              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-card border border-border rounded-lg shadow-lg p-4 max-w-48">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="BookOpen" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">Course Progress</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-3/4"></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Mathematics - 75% Complete</p>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-card border border-border rounded-lg shadow-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Trophy" size={16} className="text-accent" />
                  <span className="text-sm font-medium text-foreground">Achievement</span>
                </div>
                <p className="text-xs text-muted-foreground">Assignment submitted!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default HeroSection;