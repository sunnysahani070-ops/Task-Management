import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend form validation
    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setLoading(true);
    try {
      await authService.register(formData);
      setLoading(false);
      showToast('Registration successful! Please check your email to verify your account.', 'success');
      // Redirect to login page upon successful registration
      navigate('/login');
    } catch (err) {
      setLoading(false);
      // Extract error message from API response or use default fallback
      const message =
        err.response?.data?.message || err.message || 'Registration failed';
      showToast(message, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 dark:bg-slate-900 transition-colors duration-300">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold dark:text-white">Create an account</CardTitle>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Start managing your tasks efficiently today.
          </p>
        </CardHeader>
        
        <CardContent>
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-4">
              <Input
                label="Full Name"
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={onChange}
                placeholder="John Doe"
              />
              <Input
                label="Email Address"
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={onChange}
                placeholder="you@example.com"
              />
              <div>
                <Input
                  label="Password"
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={onChange}
                  placeholder="••••••••"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Minimum 6 characters</p>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              className={loading ? 'opacity-70 cursor-not-allowed' : ''}
            >
              {loading ? 'Registering...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="text-center mt-6">
            <Link to="/login" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
              Already have an account? Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
