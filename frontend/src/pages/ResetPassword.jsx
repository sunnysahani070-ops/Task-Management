import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const { password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(id, token, password);
      showToast('Password reset successfully! You can now log in.', 'success');
      setLoading(false);
      navigate('/login');
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Failed to reset password. The link may be expired or invalid.';
      showToast(message, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 dark:bg-slate-900 transition-colors duration-300">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold dark:text-white">Reset Password</CardTitle>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter your new password below.
          </p>
        </CardHeader>
        
        <CardContent>
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-4">
              <Input
                label="New Password"
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={onChange}
                placeholder="••••••••"
              />
              <Input
                label="Confirm New Password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={onChange}
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              className={loading ? 'opacity-70 cursor-not-allowed' : ''}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
          
          <div className="text-center mt-6">
            <Link to="/login" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
              Return to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
