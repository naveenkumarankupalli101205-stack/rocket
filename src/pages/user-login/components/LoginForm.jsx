import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import { Checkbox } from 'components/ui/Checkbox';
import Icon from 'components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await signIn(formData?.email, formData?.password);

      if (error) {
        setErrors({
          general: error?.message || 'Invalid email or password. Please check your credentials and try again.'
        });
        return;
      }

      if (data?.user) {
        // Store remember me preference
        if (formData?.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        // Redirect to dashboard
        navigate('/role-based-dashboard');
      }

    } catch (error) {
      setErrors({
        general: 'An error occurred during login. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border border-border rounded-lg shadow-sm p-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full mx-auto mb-4">
            <Icon name="GraduationCap" size={24} color="white" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your LMS Pro account</p>
        </div>

        {errors?.general && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-destructive" />
              <p className="text-sm text-destructive">{errors?.general}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData?.email}
            onChange={handleInputChange}
            error={errors?.email}
            required
            disabled={isLoading}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            disabled={isLoading}
          />

          <div className="flex items-center justify-between">
            <Checkbox
              label="Remember me"
              checked={formData?.rememberMe}
              onChange={handleInputChange}
              name="rememberMe"
              disabled={isLoading}
            />
            
            <button
              type="button"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/user-registration')}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>

      {/* Demo Credentials */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h3 className="text-sm font-medium text-foreground mb-2">Demo Credentials:</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p><strong>Teacher:</strong> teacher@lmspro.com / teacher123</p>
          <p><strong>Student:</strong> student@lmspro.com / student123</p>
          <p><strong>Admin:</strong> admin@lmspro.com / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;