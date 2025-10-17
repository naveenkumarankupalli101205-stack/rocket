import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const FooterSection = () => {
  const currentYear = new Date()?.getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Security', href: '#security' },
      { label: 'Integrations', href: '#integrations' }
    ],
    company: [
      { label: 'About Us', href: '#about' },
      { label: 'Careers', href: '#careers' },
      { label: 'Blog', href: '#blog' },
      { label: 'Press Kit', href: '#press' }
    ],
    support: [
      { label: 'Help Center', href: '#help' },
      { label: 'Documentation', href: '#docs' },
      { label: 'API Reference', href: '#api' },
      { label: 'Contact Us', href: '#contact' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
      { label: 'Cookie Policy', href: '#cookies' },
      { label: 'GDPR', href: '#gdpr' }
    ]
  };

  const socialLinks = [
    { icon: 'Facebook', href: '#facebook', label: 'Facebook' },
    { icon: 'Twitter', href: '#twitter', label: 'Twitter' },
    { icon: 'Linkedin', href: '#linkedin', label: 'LinkedIn' },
    { icon: 'Instagram', href: '#instagram', label: 'Instagram' },
    { icon: 'Youtube', href: '#youtube', label: 'YouTube' }
  ];

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link to="/landing-page" className="flex items-center space-x-2 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
                  <Icon name="GraduationCap" size={24} color="white" />
                </div>
                <span className="text-2xl font-bold text-foreground">LMS Pro</span>
              </Link>
              
              <p className="text-muted-foreground mb-6 max-w-md">
                Empowering educators and students with comprehensive digital learning tools. Transform your educational experience with our modern learning management system.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks?.map((social, index) => (
                  <a
                    key={index}
                    href={social?.href}
                    aria-label={social?.label}
                    className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all duration-300"
                  >
                    <Icon name={social?.icon} size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Product */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Product</h3>
                <ul className="space-y-3">
                  {footerLinks?.product?.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link?.href}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        {link?.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Company</h3>
                <ul className="space-y-3">
                  {footerLinks?.company?.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link?.href}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        {link?.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Support</h3>
                <ul className="space-y-3">
                  {footerLinks?.support?.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link?.href}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        {link?.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Legal</h3>
                <ul className="space-y-3">
                  {footerLinks?.legal?.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link?.href}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        {link?.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-border">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Stay Updated</h3>
              <p className="text-muted-foreground">
                Get the latest updates on new features, educational insights, and platform improvements.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                />
              </div>
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center space-x-2">
                <span>Subscribe</span>
                <Icon name="Send" size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span>&copy; {currentYear} LMS Pro. All rights reserved.</span>
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={14} className="text-success" />
                <span>SSL Secured</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={14} />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Mail" size={14} />
                <span>hello@lmspro.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;