import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const AboutSection = () => {
  const stats = [
  { icon: 'Users', value: '10,000+', label: 'Active Students' },
  { icon: 'BookOpen', value: '500+', label: 'Courses Available' },
  { icon: 'GraduationCap', value: '1,200+', label: 'Certified Teachers' },
  { icon: 'Award', value: '95%', label: 'Success Rate' }];


  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1653565685072-adcf967db6b7"
                alt="Modern classroom with students using tablets and laptops for digital learning with teacher facilitating"
                className="w-full h-80 lg:h-96 object-cover rounded-2xl shadow-xl" />

              
              {/* Overlay Stats Card */}
              <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-xl shadow-xl p-6 max-w-64">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <Icon name="TrendingUp" size={20} className="text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Learning Growth</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-success mb-1">+127%</div>
                <p className="text-xs text-muted-foreground">Compared to last month</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                About LMS Pro
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Revolutionizing Education Through
              <span className="block text-primary">Digital Innovation</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              LMS Pro is designed to bridge the gap between traditional education and modern digital learning needs. Our platform empowers educators to create engaging courses while providing students with intuitive tools to track their academic journey and achieve their learning goals.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="Check" size={14} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Interactive Course Creation</h4>
                  <p className="text-muted-foreground">Build engaging courses with multimedia content, quizzes, and assignments that keep students motivated.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="Check" size={14} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Real-time Progress Tracking</h4>
                  <p className="text-muted-foreground">Monitor student performance with detailed analytics and provide personalized feedback for better outcomes.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="Check" size={14} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Collaborative Learning Environment</h4>
                  <p className="text-muted-foreground">Foster community learning through discussion forums, group projects, and peer-to-peer interactions.</p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats?.map((stat, index) =>
              <div key={index} className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                    <Icon name={stat?.icon} size={20} className="text-primary" />
                    <span className="text-2xl font-bold text-foreground">{stat?.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat?.label}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default AboutSection;