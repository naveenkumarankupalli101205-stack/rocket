import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import AuthenticatedHeader from 'components/ui/AuthenticatedHeader';
import NavigationBreadcrumb from 'components/ui/NavigationBreadcrumb';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Icon from 'components/AppIcon';
import { userProfileService } from '../../services/userProfileService';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, userProfile, signOut, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [stats, setStats] = useState({ enrollments: 0, courses: 0, submissions: 0 });
  const [formData, setFormData] = useState({
    full_name: '',
    bio: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/user-login');
      return;
    }
    loadUserStats();
  }, [user, userProfile]);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        bio: userProfile.bio || ''
      });
    }
  }, [userProfile]);

  const loadUserStats = async () => {
    if (!userProfile?.id) return;

    try {
      const result = await userProfileService.getUserStats(userProfile.id);
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.full_name.trim()) {
      toast.error('Name is required');
      return;
    }

    setLoading(true);
    try {
      let avatarUrl = userProfile?.avatar_url;

      if (avatarFile) {
        const uploadResult = await userProfileService.uploadAvatar(userProfile.id, avatarFile);
        
        if (uploadResult.success) {
          avatarUrl = uploadResult.data.url;
        } else {
          toast.error(uploadResult.error || 'Failed to upload avatar');
          setLoading(false);
          return;
        }
      }

      const result = await updateProfile({
        full_name: formData.full_name.trim(),
        bio: formData.bio.trim(),
        ...(avatarUrl && { avatar_url: avatarUrl })
      });

      if (result.error) {
        toast.error(result.error.message || 'Failed to update profile');
      } else {
        toast.success('Profile updated successfully!');
        setEditing(false);
        setAvatarFile(null);
        setAvatarPreview(null);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to logout?')) {
      return;
    }

    const result = await signOut();
    if (result.error) {
      toast.error('Failed to logout');
    } else {
      toast.success('Logged out successfully');
      navigate('/user-login');
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'teacher':
        return 'bg-blue-100 text-blue-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NavigationBreadcrumb />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
                  {!editing && (
                    <Button
                      onClick={() => setEditing(true)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Icon name="Edit" size={16} />
                      Edit Profile
                    </Button>
                  )}
                </div>

                {editing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative mb-4">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-semibold">
                          {avatarPreview || userProfile?.avatar_url ? (
                            <img
                              src={avatarPreview || userProfile?.avatar_url}
                              alt={userProfile?.full_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            userProfile?.full_name?.charAt(0)?.toUpperCase()
                          )}
                        </div>
                        <label
                          htmlFor="avatar-upload"
                          className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
                        >
                          <Icon name="Camera" size={20} className="text-white" />
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Click the camera icon to update your profile picture
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={userProfile?.email || ''}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Email cannot be changed
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1"
                      >
                        {loading ? (
                          <>
                            <Icon name="Loader" size={18} className="mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Icon name="Save" size={18} className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditing(false);
                          setAvatarFile(null);
                          setAvatarPreview(null);
                          setFormData({
                            full_name: userProfile?.full_name || '',
                            bio: userProfile?.bio || ''
                          });
                        }}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-semibold">
                        {userProfile?.avatar_url ? (
                          <img
                            src={userProfile.avatar_url}
                            alt={userProfile?.full_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          userProfile?.full_name?.charAt(0)?.toUpperCase()
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">
                          {userProfile?.full_name}
                        </h3>
                        <p className="text-muted-foreground">{userProfile?.email}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(userProfile?.role)}`}>
                          {userProfile?.role?.charAt(0)?.toUpperCase() + userProfile?.role?.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">Bio</h4>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {userProfile?.bio || 'No bio added yet.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-card border border-border rounded-lg p-8 mt-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Account Actions</h2>
                <div className="space-y-3">
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Icon name="LogOut" size={18} />
                    Logout
                  </Button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-foreground mb-4">Statistics</h2>
                
                <div className="space-y-4">
                  {userProfile?.role === 'student' && (
                    <>
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Icon name="BookOpen" size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                            <p className="text-xl font-bold text-foreground">{stats.enrollments}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Icon name="FileText" size={20} className="text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Submissions</p>
                            <p className="text-xl font-bold text-foreground">{stats.submissions}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {userProfile?.role === 'teacher' && (
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Icon name="GraduationCap" size={20} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">My Courses</p>
                          <p className="text-xl font-bold text-foreground">{stats.courses}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Icon name="Calendar" size={20} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Member Since</p>
                        <p className="text-sm font-semibold text-foreground">
                          {userProfile?.created_at 
                            ? new Date(userProfile.created_at).toLocaleDateString('en-US', { 
                                month: 'short', 
                                year: 'numeric' 
                              })
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Quick Links</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate('/courses')}
                      className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      <Icon name="BookOpen" size={16} className="inline mr-2" />
                      Browse Courses
                    </button>
                    <button
                      onClick={() => navigate('/role-based-dashboard')}
                      className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      <Icon name="LayoutDashboard" size={16} className="inline mr-2" />
                      Dashboard
                    </button>
                    {userProfile?.role === 'student' && (
                      <button
                        onClick={() => navigate('/grades')}
                        className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                      >
                        <Icon name="Award" size={16} className="inline mr-2" />
                        My Grades
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
