import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import UserLogin from './pages/user-login';
import LandingPage from './pages/landing-page';
import RoleBasedDashboard from './pages/role-based-dashboard';
import UserRegistration from './pages/user-registration';
import CourseCatalog from './pages/course-catalog';
import CourseDetails from './pages/course-details';
import AssignmentDetails from './pages/assignment-details';
import StudentGrades from './pages/student-grades';
import UserProfile from './pages/user-profile';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/role-based-dashboard" element={<RoleBasedDashboard />} />
        <Route path="/user-registration" element={<UserRegistration />} />
        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/assignments/:id" element={<AssignmentDetails />} />
        <Route path="/grades" element={<StudentGrades />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
