import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from 'components/AppIcon';

const NavigationBreadcrumb = ({ customBreadcrumbs = null }) => {
  const location = useLocation();
  
  const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
  
  const breadcrumbMap = {
    'role-based-dashboard': { label: 'Dashboard', icon: 'LayoutDashboard' },
    'courses': { label: 'Courses', icon: 'BookOpen' },
    'assignments': { label: 'Assignments', icon: 'FileText' },
    'grades': { label: 'Grades', icon: 'BarChart3' },
    'profile': { label: 'Profile', icon: 'User' },
    'notifications': { label: 'Notifications', icon: 'Bell' },
    'settings': { label: 'Settings', icon: 'Settings' },
    'help': { label: 'Help & Support', icon: 'HelpCircle' },
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const breadcrumbs = [
      { label: 'Dashboard', path: '/role-based-dashboard', icon: 'Home' }
    ];

    let currentPath = '';
    pathSegments?.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      if (segment !== 'role-based-dashboard') {
        const breadcrumbInfo = breadcrumbMap?.[segment];
        if (breadcrumbInfo) {
          breadcrumbs?.push({
            label: breadcrumbInfo?.label,
            path: currentPath,
            icon: breadcrumbInfo?.icon,
            isLast: index === pathSegments?.length - 1
          });
        } else {
          breadcrumbs?.push({
            label: segment?.charAt(0)?.toUpperCase() + segment?.slice(1)?.replace(/-/g, ' '),
            path: currentPath,
            icon: 'ChevronRight',
            isLast: index === pathSegments?.length - 1
          });
        }
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {breadcrumbs?.map((breadcrumb, index) => (
          <li key={breadcrumb?.path || index} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={14} 
                className="mx-2 text-muted-foreground/60" 
              />
            )}
            
            {breadcrumb?.isLast ? (
              <span className="flex items-center space-x-1 text-foreground font-medium">
                {breadcrumb?.icon && (
                  <Icon name={breadcrumb?.icon} size={14} />
                )}
                <span>{breadcrumb?.label}</span>
              </span>
            ) : (
              <Link
                to={breadcrumb?.path}
                className="flex items-center space-x-1 hover:text-foreground transition-colors duration-200"
              >
                {breadcrumb?.icon && (
                  <Icon name={breadcrumb?.icon} size={14} />
                )}
                <span>{breadcrumb?.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default NavigationBreadcrumb;