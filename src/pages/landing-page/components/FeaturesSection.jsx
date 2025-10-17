import React from 'react';
import Icon from 'components/AppIcon';

const FeaturesSection = () => {
  const features = [
    {
      icon: 'BookOpen',
      title: 'Course Management',
      description: 'Create, organize, and manage comprehensive courses with multimedia content, structured lessons, and learning objectives.',
      color: 'primary'
    },
    {
      icon: 'FileText',
      title: 'Assignment System',
      description: 'Design and distribute assignments with automated grading, deadline tracking, and detailed submission management.',
      color: 'accent'
    },
    {
      icon: 'BarChart3',
      title: 'Progress Analytics',
      description: 'Track student performance with detailed analytics, grade reports, and personalized learning insights.',
      color: 'success'
    },
    {
      icon: 'Users',
      title: 'Student Enrollment',
      description: 'Streamlined enrollment process with course catalogs, prerequisites management, and capacity controls.',
      color: 'warning'
    },
    {
      icon: 'MessageSquare',
      title: 'Discussion Forums',
      description: 'Foster collaborative learning through course-specific forums, Q&A sessions, and peer interactions.',
      color: 'secondary'
    },
    {
      icon: 'Upload',
      title: 'File Management',
      description: 'Secure file upload and sharing system supporting multiple formats including PDFs, images, and documents.',
      color: 'primary'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      primary: 'bg-primary/10 text-primary border-primary/20',
      accent: 'bg-accent/10 text-accent border-accent/20',
      success: 'bg-success/10 text-success border-success/20',
      warning: 'bg-warning/10 text-warning border-warning/20',
      secondary: 'bg-secondary/10 text-secondary border-secondary/20'
    };
    return colorMap?.[color] || colorMap?.primary;
  };

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
            Platform Features
          </span>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need for
            <span className="block text-primary">Modern Education</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive suite of tools empowers educators and students to create, manage, and excel in digital learning environments with ease and efficiency.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features?.map((feature, index) => (
            <div
              key={index}
              className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="mb-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border ${getColorClasses(feature?.color)} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon name={feature?.icon} size={24} />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                {feature?.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature?.description}
              </p>
              
              <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Learn more</span>
                <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl p-8 lg:p-12 border border-border">
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Ready to Transform Your Learning Experience?
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of educators and students who are already using LMS Pro to achieve their educational goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={16} className="text-success" />
                <span>Setup in 5 minutes</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Icon name="CreditCard" size={16} className="text-success" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Headphones" size={16} className="text-success" />
                <span>24/7 support included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;