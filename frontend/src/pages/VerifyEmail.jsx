import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import authService from '../services/authService';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Email successfully verified!');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link may be expired or invalid.');
      }
    };

    if (token) {
      verify();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 dark:bg-slate-900 transition-colors duration-300">
      <Card className="w-full max-w-md text-center py-8">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            {status === 'loading' && (
              <FaSpinner className="w-16 h-16 text-indigo-500 animate-spin" />
            )}
            {status === 'success' && (
              <FaCheckCircle className="w-16 h-16 text-emerald-500" />
            )}
            {status === 'error' && (
              <FaExclamationCircle className="w-16 h-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold dark:text-white">
            {status === 'loading' ? 'Verifying...' : 
             status === 'success' ? 'Verified!' : 'Verification Failed'}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {message}
          </p>
          
          {status !== 'loading' && (
            <Link 
              to="/login" 
              className="inline-flex justify-center items-center w-full px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors dark:focus:ring-offset-slate-900"
            >
              Continue to Login
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
