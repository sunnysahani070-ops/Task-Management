import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import userService from '../services/userService';
import { useToast } from '../context/ToastContext';
import { Card, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ThemeToggle from '../components/ui/ThemeToggle';
import { FaArrowLeft, FaCamera, FaUser, FaEnvelope, FaCalendarAlt, FaSave, FaLock, FaKey } from 'react-icons/fa';
import ProfileSkeleton from '../components/ProfileSkeleton';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userService.getUserProfile();
      setName(data.name);
      setEmail(data.email);
      setProfileImage(data.profileImage || '');
      
      // If we had createdAt in the profile response we'd use it, 
      // but let's just format a generic join date if it's missing or use the user context if available
      // Actually, we didn't add createdAt to the response. Let's just say "Active Member" 
      // or we can just use the user object from context if it has it.
      setJoinDate('Active Member');
      
      setIsLoading(false);
    } catch (err) {
      showToast('Failed to load profile', 'error');
      setIsLoading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast('Image size should be less than 5MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name is required', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const updatedData = await userService.updateUserProfile({
        name,
        profileImage,
      });
      
      // Update global auth context
      updateUser({ ...user, name: updatedData.name, profileImage: updatedData.profileImage });
      
      showToast('Profile updated successfully', 'success');
      setIsSaving(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    
    try {
      setIsChangingPassword(true);
      await userService.changePassword({
        currentPassword,
        newPassword
      });
      showToast('Password changed successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors duration-300">
      {/* Navbar */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 dark:text-gray-300"
            >
              <FaArrowLeft className="mr-2" /> Back to Dashboard
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your personal information and preferences.</p>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* Header Banner */}
            <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 w-full"></div>
            
            <form onSubmit={handleSubmit} className="px-6 sm:px-10 pb-10">
              {/* Avatar Section */}
              <div className="relative flex justify-center -mt-16 mb-8">
                <div className="relative group">
                  <div 
                    className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 bg-gray-100 dark:bg-slate-700 overflow-hidden flex items-center justify-center cursor-pointer shadow-lg"
                    onClick={handleImageClick}
                  >
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-bold text-indigo-300 dark:text-indigo-500">
                        {name.charAt(0).toUpperCase()}
                      </span>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <FaCamera className="text-white text-2xl" />
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <FaUser className="inline mr-2 text-gray-400" />
                    Full Name
                  </label>
                  <Input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <FaEnvelope className="inline mr-2 text-gray-400" />
                    Email Address
                  </label>
                  <Input 
                    type="email" 
                    value={email} 
                    disabled
                    className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email address cannot be changed.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <FaCalendarAlt className="inline mr-2 text-gray-400" />
                    Account Status
                  </label>
                  <div className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white sm:text-sm">
                    {joinDate}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-slate-700 flex justify-end">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    icon={FaSave}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card className="mt-8 overflow-hidden border-t-4 border-t-amber-500">
          <CardContent className="p-6 sm:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-500">
                <FaLock />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Update your password to keep your account secure.</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FaKey className="inline mr-2 text-gray-400" />
                  Current Password
                </label>
                <Input 
                  type="password" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <Input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <Input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-slate-700 flex justify-end">
                <Button 
                  type="submit" 
                  variant="primary" 
                  icon={FaSave}
                  disabled={isChangingPassword}
                  className="bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
                >
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
