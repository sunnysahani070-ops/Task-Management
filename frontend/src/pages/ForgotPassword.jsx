import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      showToast('Please enter your email', 'error');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSuccess(true);
      showToast('Password reset link sent to your email', 'success');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Failed to send reset email';
      showToast(message, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 dark:bg-slate-900 transition-colors duration-300">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold dark:text-white">Forgot Password</CardTitle>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {success ? 'Check your email for the reset link' : 'Enter your email to receive a reset link'}
          </p>
        </CardHeader>
        
        <CardContent>
          {!success ? (
            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="space-y-4">
                <Input
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <Button
                type="submit"
                fullWidth
                disabled={loading}
                className={loading ? 'opacity-70 cursor-not-allowed' : ''}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          ) : (
            <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 p-4 rounded-md text-sm text-center mb-4 border border-emerald-100 dark:border-emerald-800/50">
              An email with a password reset link has been sent to <strong>{email}</strong>. The link will expire in 15 minutes.
            </div>
          )}
          
          <div className="text-center mt-6">
            <Link to="/login" className="flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <FaArrowLeft className="mr-2" /> Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
