import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Select from 'components/ui/Select';
import { Checkbox } from 'components/ui/Checkbox';
import Icon from 'components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const roleOptions = [
    { 
      value: 'student', 
      label: 'Student', 
      description: 'Access courses, submit assignments, and track progress' 
    },
    { 
      value: 'teacher', 
      label: 'Teacher', 
      description: 'Create courses, manage assignments, and grade submissions' 
    }
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const validatePassword = (password) => {
    const minLength = password?.length >= 8;
    const hasUpperCase = /[A-Z]/?.test(password);
    const hasLowerCase = /[a-z]/?.test(password);
    const hasNumbers = /\d/?.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/?.test(password);
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Full name validation
    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData?.fullName?.trim()?.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    if (!formData?.email?.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData?.password);
      if (!passwordValidation?.isValid) {
        newErrors.password = 'Password does not meet requirements';
      }
    }

    // Confirm password validation
    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Role validation
    if (!formData?.role) {
      newErrors.role = 'Please select your role';
    }

    // Terms validation
    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await signUp(
        formData?.email, 
        formData?.password, 
        {
          fullName: formData?.fullName,
          role: formData?.role
        }
      );

      if (error) {
        setErrors({ submit: error?.message || 'Registration failed. Please try again.' });
        return;
      }

      if (data?.user) {
        // Navigate to login with success message
        navigate('/user-login', { 
          state: { 
            message: 'Registration successful! Please check your email to verify your account before logging in.',
            email: formData?.email 
          }
        });
      }
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValidation = validatePassword(formData?.password);
  const isFormValid = formData?.fullName?.trim() && 
                     validateEmail(formData?.email) && 
                     passwordValidation?.isValid && 
                     formData?.password === formData?.confirmPassword && 
                     formData?.role && 
                     formData?.agreeToTerms;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
        <p className="text-muted-foreground">Join LMS Pro and start your learning journey</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={formData?.fullName}
          onChange={(e) => handleInputChange('fullName', e?.target?.value)}
          error={errors?.fullName}
          required
        />

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          value={formData?.email}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={errors?.email}
          required
        />

        {/* Password */}
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={formData?.password}
            onChange={(e) => handleInputChange('password', e?.target?.value)}
            error={errors?.password}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
          >
            <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
          </button>
        </div>

        {/* Password Requirements */}
        {formData?.password && (
          <div className="bg-muted p-3 rounded-lg space-y-2">
            <p className="text-sm font-medium text-foreground">Password Requirements:</p>
            <div className="grid grid-cols-1 gap-1 text-xs">
              <div className={`flex items-center space-x-2 ${passwordValidation?.minLength ? 'text-success' : 'text-muted-foreground'}`}>
                <Icon name={passwordValidation?.minLength ? "Check" : "X"} size={12} />
                <span>At least 8 characters</span>
              </div>
              <div className={`flex items-center space-x-2 ${passwordValidation?.hasUpperCase ? 'text-success' : 'text-muted-foreground'}`}>
                <Icon name={passwordValidation?.hasUpperCase ? "Check" : "X"} size={12} />
                <span>One uppercase letter</span>
              </div>
              <div className={`flex items-center space-x-2 ${passwordValidation?.hasLowerCase ? 'text-success' : 'text-muted-foreground'}`}>
                <Icon name={passwordValidation?.hasLowerCase ? "Check" : "X"} size={12} />
                <span>One lowercase letter</span>
              </div>
              <div className={`flex items-center space-x-2 ${passwordValidation?.hasNumbers ? 'text-success' : 'text-muted-foreground'}`}>
                <Icon name={passwordValidation?.hasNumbers ? "Check" : "X"} size={12} />
                <span>One number</span>
              </div>
              <div className={`flex items-center space-x-2 ${passwordValidation?.hasSpecialChar ? 'text-success' : 'text-muted-foreground'}`}>
                <Icon name={passwordValidation?.hasSpecialChar ? "Check" : "X"} size={12} />
                <span>One special character</span>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Password */}
        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData?.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
            error={errors?.confirmPassword}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
          >
            <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={16} />
          </button>
        </div>

        {/* Role Selection */}
        <Select
          label="Select Your Role"
          placeholder="Choose your role"
          options={roleOptions}
          value={formData?.role}
          onChange={(value) => handleInputChange('role', value)}
          error={errors?.role}
          required
        />

        {/* Terms and Conditions */}
        <Checkbox
          label="I agree to the Terms of Service and Privacy Policy"
          checked={formData?.agreeToTerms}
          onChange={(e) => handleInputChange('agreeToTerms', e?.target?.checked)}
          error={errors?.agreeToTerms}
          required
        />

        {/* Submit Error */}
        {errors?.submit && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-destructive">
              <Icon name="AlertCircle" size={16} />
              <span className="text-sm">{errors?.submit}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          fullWidth
          loading={isLoading}
          disabled={!isFormValid || isLoading}
          iconName="UserPlus"
          iconPosition="left"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link 
              to="/user-login" 
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;