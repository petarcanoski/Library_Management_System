import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  TextField,
  Button,
  Avatar,
  Chip,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import CakeIcon from '@mui/icons-material/Cake';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Layout from '../components/layout/Layout';

/**
 * ProfilePage Component
 * User profile view and edit functionality
 */
const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Form state
  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: user?.phone || '+1 (555) 123-4567',
    dateOfBirth: user?.dateOfBirth || '1990-01-15',
    address: user?.address || '123 Library St, Reading City, RC 12345',
    bio: user?.bio || 'Book lover and avid reader. Always looking for the next great story!',
  });

  // Mock user stats
  const userStats = {
    memberSince: '2023-01-15',
    totalBooksRead: 47,
    currentStreak: 12,
    favoriteGenre: 'Science Fiction',
    membershipTier: 'Gold',
    points: 2450,
  };

  const achievements = [
    { id: 1, title: 'Bookworm', description: 'Read 50 books', earned: true },
    { id: 2, title: 'Speed Reader', description: 'Read 10 books in a month', earned: true },
    { id: 3, title: 'Diverse Reader', description: 'Read 5 different genres', earned: true },
    { id: 4, title: 'Early Bird', description: 'Return 10 books early', earned: false },
    { id: 5, title: 'Marathon Reader', description: 'Read for 30 days straight', earned: false },
    { id: 6, title: 'Century Club', description: 'Read 100 books', earned: false },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Implement API call to update profile
    setIsEditing(false);
    showSnackbar('Profile updated successfully!', 'success');
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      fullName: user?.fullName || 'John Doe',
      email: user?.email || 'john.doe@example.com',
      phone: user?.phone || '+1 (555) 123-4567',
      dateOfBirth: user?.dateOfBirth || '1990-01-15',
      address: user?.address || '123 Library St, Reading City, RC 12345',
      bio: user?.bio || 'Book lover and avid reader. Always looking for the next great story!',
    });
    setIsEditing(false);
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // TODO: Implement avatar upload
      showSnackbar('Avatar updated successfully!', 'success');
      setAvatarDialogOpen(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getMembershipColor = (tier) => {
    switch (tier) {
      case 'Gold':
        return '#F59E0B';
      case 'Silver':
        return '#9CA3AF';
      case 'Bronze':
        return '#CD7F32';
      default:
        return '#4F46E5';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Profile
              </span>
            </h1>
            <p className="text-lg text-gray-600">Manage your account information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Avatar and Stats */}
            <div className="lg:col-span-1 space-y-6">
              {/* Avatar Card */}
              <Card className="animate-fade-in-up">
                <CardContent className="text-center p-8">
                  <div className="relative inline-block mb-4">
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        bgcolor: getMembershipColor(userStats.membershipTier),
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        margin: '0 auto',
                      }}
                    >
                      {formData.fullName.charAt(0).toUpperCase()}
                    </Avatar>
                    {/*<IconButton*/}
                    {/*  onClick={() => setAvatarDialogOpen(true)}*/}
                    {/*  sx={{*/}
                    {/*    position: 'absolute',*/}
                    {/*    bottom: 0,*/}
                    {/*    right: 0,*/}
                    {/*    bgcolor: '#4F46E5',*/}
                    {/*    color: 'white',*/}
                    {/*    '&:hover': { bgcolor: '#4338CA' },*/}
                    {/*  }}*/}
                    {/*  size="small"*/}
                    {/*>*/}
                    {/*  <PhotoCameraIcon fontSize="small" />*/}
                    {/*</IconButton>*/}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {formData.fullName}
                  </h3>
                  <p className="text-gray-600 mb-4">{formData.email}</p>

                  <Chip
                    icon={<VerifiedIcon />}
                    label={`${userStats.membershipTier} Member`}
                    sx={{
                      bgcolor: `${getMembershipColor(userStats.membershipTier)}20`,
                      color: getMembershipColor(userStats.membershipTier),
                      fontWeight: 600,
                      mb: 2,
                    }}
                  />

                  <div className="flex items-center justify-center space-x-1 text-yellow-500 mt-2">
                    <AutoAwesomeIcon />
                    <span className="font-bold text-gray-900">{userStats.points}</span>
                    <span className="text-gray-600 text-sm">points</span>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="animate-fade-in-up animation-delay-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Reading Stats
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <LocalLibraryIcon sx={{ color: '#4F46E5' }} />
                        <span className="text-gray-700">Books Read</span>
                      </div>
                      <span className="font-bold text-indigo-600">
                        {userStats.totalBooksRead}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <EmojiEventsIcon sx={{ color: '#F59E0B' }} />
                        <span className="text-gray-700">Current Streak</span>
                      </div>
                      <span className="font-bold text-orange-600">
                        {userStats.currentStreak} days
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BadgeIcon sx={{ color: '#10B981' }} />
                        <span className="text-gray-700">Member Since</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {new Date(userStats.memberSince).getFullYear()}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Favorite Genre</p>
                      <Chip
                        label={userStats.favoriteGenre}
                        size="small"
                        sx={{ bgcolor: '#EEF2FF', color: '#4F46E5', fontWeight: 600 }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Content - Profile Form and Achievements */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Information Card */}
              <Card className="animate-fade-in-up animation-delay-400">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Profile Information
                    </h3>
                    {!isEditing ? (
                      <Button
                        startIcon={<EditIcon />}
                        onClick={() => setIsEditing(true)}
                        sx={{ color: '#4F46E5', fontWeight: 600 }}
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button onClick={handleCancel} variant="outlined">
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          variant="contained"
                          sx={{ bgcolor: '#4F46E5' }}
                        >
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
                        <BadgeIcon sx={{ fontSize: 20 }} />
                        <span>Full Name</span>
                      </label>
                      <TextField
                        fullWidth
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#4F46E5',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#4F46E5',
                            },
                          },
                        }}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
                        <EmailIcon sx={{ fontSize: 20 }} />
                        <span>Email Address</span>
                      </label>
                      <TextField
                        fullWidth
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#4F46E5',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#4F46E5',
                            },
                          },
                        }}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
                        <PhoneIcon sx={{ fontSize: 20 }} />
                        <span>Phone Number</span>
                      </label>
                      <TextField
                        fullWidth
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#4F46E5',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#4F46E5',
                            },
                          },
                        }}
                      />
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
                        <CakeIcon sx={{ fontSize: 20 }} />
                        <span>Date of Birth</span>
                      </label>
                      <TextField
                        fullWidth
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        disabled={!isEditing}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#4F46E5',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#4F46E5',
                            },
                          },
                        }}
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
                        <LocationOnIcon sx={{ fontSize: 20 }} />
                        <span>Address</span>
                      </label>
                      <TextField
                        fullWidth
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        multiline
                        rows={2}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#4F46E5',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#4F46E5',
                            },
                          },
                        }}
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="text-gray-700 font-medium mb-2 block">
                        Bio
                      </label>
                      <TextField
                        fullWidth
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                        multiline
                        rows={3}
                        placeholder="Tell us about yourself..."
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#4F46E5',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#4F46E5',
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements Card */}
              <Card className="animate-fade-in-up animation-delay-600">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Achievements
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          achievement.earned
                            ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400'
                            : 'bg-gray-50 border-gray-200 opacity-50'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`p-2 rounded-lg ${
                              achievement.earned ? 'bg-yellow-400' : 'bg-gray-300'
                            }`}
                          >
                            <EmojiEventsIcon
                              sx={{ color: achievement.earned ? '#FFF' : '#6B7280' }}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-1">
                              {achievement.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {achievement.description}
                            </p>
                            {achievement.earned && (
                              <Chip
                                label="Earned"
                                size="small"
                                color="success"
                                icon={<VerifiedIcon />}
                                sx={{ mt: 1 }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Upload Dialog */}
      <Dialog
        open={avatarDialogOpen}
        onClose={() => setAvatarDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>Update Profile Picture</DialogTitle>
        <DialogContent>
          <div className="text-center py-4">
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="avatar-upload"
              type="file"
              onChange={handleAvatarUpload}
            />
            <label htmlFor="avatar-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<PhotoCameraIcon />}
                sx={{ bgcolor: '#4F46E5' }}
              >
                Choose Photo
              </Button>
            </label>
            <p className="text-sm text-gray-600 mt-4">
              Recommended: Square image, at least 400x400px
            </p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAvatarDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default ProfilePage;
