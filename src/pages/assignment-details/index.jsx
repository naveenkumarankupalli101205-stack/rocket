import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import AuthenticatedHeader from 'components/ui/AuthenticatedHeader';
import NavigationBreadcrumb from 'components/ui/NavigationBreadcrumb';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Icon from 'components/AppIcon';
import { assignmentService } from '../../services/assignmentService';
import { submissionService } from '../../services/submissionService';
import { format } from 'date-fns';

const AssignmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile, isTeacher, isStudent, signOut } = useAuth();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [mySubmission, setMySubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [grading, setGrading] = useState({ submissionId: null, points: '', feedback: '' });

  useEffect(() => {
    loadAssignmentDetails();
  }, [id, userProfile]);

  const loadAssignmentDetails = async () => {
    setLoading(true);
    try {
      const result = await assignmentService.getAssignmentById(id);
      
      if (result.success && result.data) {
        setAssignment(result.data);

        if (isTeacher && result.data.course?.instructor_id === userProfile?.id) {
          const submissionsResult = await submissionService.getSubmissionsByAssignment(id);
          if (submissionsResult.success) {
            setSubmissions(submissionsResult.data || []);
          }
        }

        if (isStudent && userProfile?.id) {
          const submissionResult = await submissionService.getSubmissionByStudent(id, userProfile.id);
          if (submissionResult.success && submissionResult.data) {
            setMySubmission(submissionResult.data);
            setContent(submissionResult.data.content || '');
          }
        }
      } else {
        toast.error(result.error || 'Failed to load assignment');
        navigate('/courses');
      }
    } catch (error) {
      toast.error('Failed to load assignment details');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !selectedFile) {
      toast.error('Please provide content or upload a file');
      return;
    }

    setUploading(true);
    try {
      let fileUrl = null;

      if (selectedFile) {
        const uploadResult = await submissionService.uploadFile(
          selectedFile,
          `${userProfile.id}/${id}`
        );
        
        if (!uploadResult.success) {
          toast.error(uploadResult.error || 'Failed to upload file');
          setUploading(false);
          return;
        }
        
        fileUrl = uploadResult.data.url;
      }

      const result = await submissionService.createSubmission({
        assignment_id: id,
        student_id: userProfile.id,
        content: content.trim(),
        file_url: fileUrl
      });

      if (result.success) {
        toast.success('Assignment submitted successfully!');
        loadAssignmentDetails();
        setContent('');
        setSelectedFile(null);
      } else {
        toast.error(result.error || 'Failed to submit assignment');
      }
    } catch (error) {
      toast.error('Failed to submit assignment');
    } finally {
      setUploading(false);
    }
  };

  const handleGrade = async (submissionId) => {
    if (!grading.points || grading.points < 0 || grading.points > assignment.max_points) {
      toast.error(`Points must be between 0 and ${assignment.max_points}`);
      return;
    }

    const result = await submissionService.gradeSubmission(
      submissionId,
      parseInt(grading.points),
      grading.feedback
    );

    if (result.success) {
      toast.success('Submission graded successfully!');
      setGrading({ submissionId: null, points: '', feedback: '' });
      loadAssignmentDetails();
    } else {
      toast.error(result.error || 'Failed to grade submission');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedHeader 
          userRole={userProfile?.role}
          userName={userProfile?.full_name}
          userAvatar={userProfile?.avatar_url}
          onLogout={handleLogout}
        />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return null;
  }

  const isOwner = isTeacher && assignment.course?.instructor_id === userProfile?.id;
  const isPastDue = assignment.due_date && new Date(assignment.due_date) < new Date();

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
          
          <div className="mb-6">
            <Button
              onClick={() => navigate(`/course/${assignment.course?.id}`)}
              variant="outline"
              size="sm"
              className="mb-4"
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Back to Course
            </Button>

            <div className="bg-card border border-border rounded-lg p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {assignment.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {assignment.due_date && (
                      <div className="flex items-center gap-1">
                        <Icon name="Calendar" size={16} />
                        <span>Due: {format(new Date(assignment.due_date), 'MMM dd, yyyy h:mm a')}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Icon name="Award" size={16} />
                      <span>{assignment.max_points} points</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      assignment.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {assignment.status}
                    </span>
                    {isPastDue && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                        Past Due
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="prose prose-sm max-w-none mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-3">Description</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {assignment.description || 'No description provided.'}
                </p>
              </div>

              {isStudent && (
                <div className="border-t border-border pt-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Your Submission</h2>
                  
                  {mySubmission ? (
                    <div className="bg-muted/30 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Icon name="CheckCircle" size={20} className="text-green-600" />
                          <span className="font-medium text-foreground">
                            Submitted on {format(new Date(mySubmission.submitted_at), 'MMM dd, yyyy h:mm a')}
                          </span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          mySubmission.status === 'graded' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {mySubmission.status}
                        </span>
                      </div>

                      {mySubmission.content && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-foreground mb-2">Content:</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {mySubmission.content}
                          </p>
                        </div>
                      )}

                      {mySubmission.file_url && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-foreground mb-2">Attached File:</p>
                          <a
                            href={mySubmission.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Icon name="Paperclip" size={14} />
                            View File
                          </a>
                        </div>
                      )}

                      {mySubmission.status === 'graded' && (
                        <div className="border-t border-border pt-4 mt-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-foreground">Grade:</span>
                            <span className="text-lg font-bold text-green-600">
                              {mySubmission.points_earned} / {assignment.max_points}
                            </span>
                          </div>
                          {mySubmission.feedback && (
                            <div>
                              <p className="text-sm font-medium text-foreground mb-2">Feedback:</p>
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {mySubmission.feedback}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Content
                        </label>
                        <textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          rows={6}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
                          placeholder="Enter your submission content..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Upload File (Optional)
                        </label>
                        <div className="flex items-center gap-3">
                          <Input
                            type="file"
                            onChange={handleFileSelect}
                            className="flex-1"
                          />
                          {selectedFile && (
                            <span className="text-sm text-muted-foreground">
                              {selectedFile.name}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Maximum file size: 10MB
                        </p>
                      </div>

                      <Button
                        onClick={handleSubmit}
                        disabled={uploading || isPastDue}
                        className="w-full"
                      >
                        {uploading ? (
                          <>
                            <Icon name="Loader" size={18} className="mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Icon name="Send" size={18} className="mr-2" />
                            Submit Assignment
                          </>
                        )}
                      </Button>

                      {isPastDue && (
                        <p className="text-sm text-red-600 text-center">
                          This assignment is past due. Submissions may not be accepted.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {isOwner && (
                <div className="border-t border-border pt-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Student Submissions ({submissions.length})
                  </h2>

                  {submissions.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="Inbox" size={48} className="mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No submissions yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {submissions.map((submission) => (
                        <div
                          key={submission.id}
                          className="border border-border rounded-lg p-6"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                                {submission.student?.full_name?.charAt(0)?.toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  {submission.student?.full_name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {submission.student?.email}
                                </p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              submission.status === 'graded' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {submission.status}
                            </span>
                          </div>

                          {submission.content && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-foreground mb-2">Content:</p>
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {submission.content}
                              </p>
                            </div>
                          )}

                          {submission.file_url && (
                            <div className="mb-4">
                              <a
                                href={submission.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                              >
                                <Icon name="Paperclip" size={14} />
                                View Attached File
                              </a>
                            </div>
                          )}

                          <p className="text-xs text-muted-foreground mb-4">
                            Submitted: {format(new Date(submission.submitted_at), 'MMM dd, yyyy h:mm a')}
                          </p>

                          {submission.status === 'graded' ? (
                            <div className="bg-green-50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-green-900">Grade:</span>
                                <span className="text-lg font-bold text-green-600">
                                  {submission.points_earned} / {assignment.max_points}
                                </span>
                              </div>
                              {submission.feedback && (
                                <div>
                                  <p className="text-sm font-medium text-green-900 mb-1">Feedback:</p>
                                  <p className="text-sm text-green-800">{submission.feedback}</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="border-t border-border pt-4">
                              {grading.submissionId === submission.id ? (
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                      Points (max: {assignment.max_points})
                                    </label>
                                    <Input
                                      type="number"
                                      min="0"
                                      max={assignment.max_points}
                                      value={grading.points}
                                      onChange={(e) => setGrading({ ...grading, points: e.target.value })}
                                      placeholder="Enter points"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                      Feedback
                                    </label>
                                    <textarea
                                      value={grading.feedback}
                                      onChange={(e) => setGrading({ ...grading, feedback: e.target.value })}
                                      rows={3}
                                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
                                      placeholder="Enter feedback..."
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => handleGrade(submission.id)}
                                      size="sm"
                                    >
                                      Submit Grade
                                    </Button>
                                    <Button
                                      onClick={() => setGrading({ submissionId: null, points: '', feedback: '' })}
                                      size="sm"
                                      variant="outline"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <Button
                                  onClick={() => setGrading({ submissionId: submission.id, points: '', feedback: '' })}
                                  size="sm"
                                  variant="outline"
                                >
                                  <Icon name="Edit" size={16} className="mr-2" />
                                  Grade Submission
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssignmentDetails;
