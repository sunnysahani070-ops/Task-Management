import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const navigate = useNavigate();
  const { login: contextLogin } = useContext(AuthContext);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(formData);
      // Pass user data and token to AuthContext
      contextLogin({
        _id: response._id,
        name: response.name,
        email: response.email,
      }, response.token);
      
      setLoading(false);
      // Redirect to Dashboard on success
      showToast('Login successful! Welcome back.', 'success');
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      const message =
        err.response?.data?.message || err.message || 'Login failed';
      showToast(message, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 dark:bg-slate-900 transition-colors duration-300">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold dark:text-white">Sign in to your account</CardTitle>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Welcome back! Please enter your details.
          </p>
        </CardHeader>
        
        <CardContent>
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-4">
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
            </div>

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              className={loading ? 'opacity-70 cursor-not-allowed' : ''}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="text-center mt-6 flex flex-col space-y-2">
            <Link to="/forgot-password" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Forgot your password?
            </Link>
            <Link to="/register" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
              Don't have an account? Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
