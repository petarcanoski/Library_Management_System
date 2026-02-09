import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
 
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

import Layout from '../components/layout/Layout';

/**
 * SettingsPage Component
 * Comprehensive settings management for user preferences, notifications, security, and privacy
 */
const SettingsPage = () => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
  
  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    bookReminders: true,
    dueDateAlerts: true,
    newArrivals: false,
    recommendations: true,
    marketingEmails: false,
  });



  

  const handleNotificationChange = (setting) => {
    setNotifications((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
    showSnackbar('Notification settings updated', 'success');
  };

 



  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    showSnackbar('Account deletion request submitted', 'warning');
    setDeleteAccountDialog(false);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Settings
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Manage your account preferences and settings
            </p>
          </div>

          <div className="space-y-6">
            {/* Notification Settings */}
            <Card className="animate-fade-in-up">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <NotificationsIcon sx={{ fontSize: 28, color: '#4F46E5' }} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                    <p className="text-gray-600">Manage how you receive updates</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.emailNotifications}
                        onChange={() => handleNotificationChange('emailNotifications')}
                        sx={{
                          '& .Mui-checked': { color: '#4F46E5' },
                          '& .Mui-checked + .MuiSwitch-track': { bgcolor: '#4F46E5' },
                        }}
                      />
                    }
                    label={
                      <div>
                        <p className="font-medium text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                    }
                  />

                  <Divider />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.pushNotifications}
                        onChange={() => handleNotificationChange('pushNotifications')}
                        sx={{
                          '& .Mui-checked': { color: '#4F46E5' },
                          '& .Mui-checked + .MuiSwitch-track': { bgcolor: '#4F46E5' },
                        }}
                      />
                    }
                    label={
                      <div>
                        <p className="font-medium text-gray-900">Push Notifications</p>
                        <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                      </div>
                    }
                  />

                  <Divider />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.bookReminders}
                        onChange={() => handleNotificationChange('bookReminders')}
                        sx={{
                          '& .Mui-checked': { color: '#4F46E5' },
                          '& .Mui-checked + .MuiSwitch-track': { bgcolor: '#4F46E5' },
                        }}
                      />
                    }
                    label={
                      <div>
                        <p className="font-medium text-gray-900">Book Reminders</p>
                        <p className="text-sm text-gray-600">Reminders about borrowed books</p>
                      </div>
                    }
                  />

                  <Divider />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.dueDateAlerts}
                        onChange={() => handleNotificationChange('dueDateAlerts')}
                        sx={{
                          '& .Mui-checked': { color: '#4F46E5' },
                          '& .Mui-checked + .MuiSwitch-track': { bgcolor: '#4F46E5' },
                        }}
                      />
                    }
                    label={
                      <div>
                        <p className="font-medium text-gray-900">Due Date Alerts</p>
                        <p className="text-sm text-gray-600">Alerts when books are due soon</p>
                      </div>
                    }
                  />

                  <Divider />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.newArrivals}
                        onChange={() => handleNotificationChange('newArrivals')}
                        sx={{
                          '& .Mui-checked': { color: '#4F46E5' },
                          '& .Mui-checked + .MuiSwitch-track': { bgcolor: '#4F46E5' },
                        }}
                      />
                    }
                    label={
                      <div>
                        <p className="font-medium text-gray-900">New Arrivals</p>
                        <p className="text-sm text-gray-600">Notifications about new books</p>
                      </div>
                    }
                  />

                  <Divider />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.recommendations}
                        onChange={() => handleNotificationChange('recommendations')}
                        sx={{
                          '& .Mui-checked': { color: '#4F46E5' },
                          '& .Mui-checked + .MuiSwitch-track': { bgcolor: '#4F46E5' },
                        }}
                      />
                    }
                    label={
                      <div>
                        <p className="font-medium text-gray-900">Recommendations</p>
                        <p className="text-sm text-gray-600">Personalized book recommendations</p>
                      </div>
                    }
                  />

                  <Divider />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.marketingEmails}
                        onChange={() => handleNotificationChange('marketingEmails')}
                        sx={{
                          '& .Mui-checked': { color: '#4F46E5' },
                          '& .Mui-checked + .MuiSwitch-track': { bgcolor: '#4F46E5' },
                        }}
                      />
                    }
                    label={
                      <div>
                        <p className="font-medium text-gray-900">Marketing Emails</p>
                        <p className="text-sm text-gray-600">Promotional offers and updates</p>
                      </div>
                    }
                  />
                </div>
              </CardContent>
            </Card>
           
          </div>
        </div>
      </div>


      {/* Delete Account Dialog */}
      <Dialog
        open={deleteAccountDialog}
        onClose={() => setDeleteAccountDialog(false)}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ color: '#DC2626' }}>Delete Account?</DialogTitle>
        <DialogContent>
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete your account? This action cannot be undone.
          </p>
          <Alert severity="warning">
            All your data, including reading history, wishlist, and preferences will be permanently deleted.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAccountDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Delete Account
          </Button>
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

export default SettingsPage;
