import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import AuthenticatedHeader from 'components/ui/AuthenticatedHeader';
import NavigationBreadcrumb from 'components/ui/NavigationBreadcrumb';
import Icon from 'components/AppIcon';
import { submissionService } from '../../services/submissionService';
import { format } from 'date-fns';

const StudentGrades = () => {
  const navigate = useNavigate();
  const { userProfile, isStudent, signOut } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState('all');

  useEffect(() => {
    if (!isStudent) {
      toast.error('Only students can view this page');
      navigate('/role-based-dashboard');
      return;
    }
    loadGrades();
  }, [userProfile, isStudent]);

  const loadGrades = async () => {
    if (!userProfile?.id) return;

    setLoading(true);
    try {
      const result = await submissionService.getStudentGrades(userProfile.id);
      
      if (result.success) {
        setGrades(result.data || []);
      } else {
        toast.error(result.error || 'Failed to load grades');
      }
    } catch (error) {
      toast.error('Failed to load grades');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const result = await signOut();
    if (result.error) {
      toast.error('Failed to logout');
    } else {
      toast.success('Logged out successfully');
      navigate('/user-login');
    }
  };

  const uniqueCourses = Array.from(
    new Set(grades.map(g => g.assignment?.course?.id))
  ).filter(Boolean);

  const filteredGrades = filterCourse === 'all'
    ? grades
    : grades.filter(g => g.assignment?.course?.id === filterCourse);

  const calculateStats = () => {
    if (filteredGrades.length === 0) {
      return { average: 0, totalPoints: 0, earnedPoints: 0 };
    }

    const totalPoints = filteredGrades.reduce(
      (sum, g) => sum + (g.assignment?.max_points || 0),
      0
    );
    const earnedPoints = filteredGrades.reduce(
      (sum, g) => sum + (g.points_earned || 0),
      0
    );
    const average = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

    return { average, totalPoints, earnedPoints };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <AuthenticatedHeader 
        userRole={userProfile?.role}
        userName={userProfile?.full_name}
        userAvatar={userProfile?.avatar_url}
        onLogout={handleLogout}
      />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NavigationBreadcrumb />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Grades</h1>
            <p className="text-muted-foreground">
              View your grades and feedback across all courses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="TrendingUp" size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overall Average</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.average.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon name="Award" size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.earnedPoints} / {stats.totalPoints}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon name="FileText" size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Graded Assignments</p>
                  <p className="text-2xl font-bold text-foreground">
                    {grades.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">Grade History</h2>
              
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
              >
                <option value="all">All Courses</option>
                {uniqueCourses.map((courseId) => {
                  const course = grades.find(g => g.assignment?.course?.id === courseId)?.assignment?.course;
                  return (
                    <option key={courseId} value={courseId}>
                      {course?.title || 'Unknown Course'}
                    </option>
                  );
                })}
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredGrades.length === 0 ? (
              <div className="text-center py-20">
                <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No graded assignments yet</h3>
                <p className="text-muted-foreground">
                  Your grades will appear here once your assignments are graded
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                        Course
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                        Assignment
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">
                        Grade
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">
                        Percentage
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                        Graded On
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                        Feedback
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGrades.map((grade) => {
                      const percentage = grade.assignment?.max_points > 0
                        ? (grade.points_earned / grade.assignment.max_points) * 100
                        : 0;

                      return (
                        <tr
                          key={grade.id}
                          className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => navigate(`/assignments/${grade.assignment?.id}`)}
                        >
                          <td className="py-4 px-4">
                            <span className="text-sm font-medium text-foreground">
                              {grade.assignment?.course?.title || 'N/A'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-foreground">
                              {grade.assignment?.title || 'N/A'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-sm font-semibold text-foreground">
                              {grade.points_earned} / {grade.assignment?.max_points}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              percentage >= 90 
                                ? 'bg-green-100 text-green-800'
                                : percentage >= 80
                                ? 'bg-blue-100 text-blue-800'
                                : percentage >= 70
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {percentage.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(grade.graded_at), 'MMM dd, yyyy')}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-muted-foreground line-clamp-2">
                              {grade.feedback || 'No feedback provided'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {filteredGrades.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Grade Distribution</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['A (90-100%)', 'B (80-89%)', 'C (70-79%)', 'D/F (0-69%)'].map((range, idx) => {
                  const [min, max] = idx === 0 
                    ? [90, 100] 
                    : idx === 1 
                    ? [80, 89] 
                    : idx === 2 
                    ? [70, 79] 
                    : [0, 69];
                  
                  const count = filteredGrades.filter(g => {
                    const pct = (g.points_earned / g.assignment?.max_points) * 100;
                    return pct >= min && pct <= max;
                  }).length;

                  return (
                    <div key={range} className="text-center p-4 border border-border rounded-lg">
                      <p className="text-2xl font-bold text-foreground mb-1">{count}</p>
                      <p className="text-sm text-muted-foreground">{range}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentGrades;
