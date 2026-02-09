import { Alert, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import React from "react";

const UserDetailsDialog = ({
  viewDialogOpen,
  setViewDialogOpen,
  selectedUser,
}) => {
  return (
    <Dialog
      open={viewDialogOpen}
      onClose={() => setViewDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            src={selectedUser?.profileImage}
            sx={{ width: 56, height: 56 }}
          >
            {selectedUser?.fullName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {selectedUser?.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedUser?.email}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {selectedUser && (
          <>
            <Alert severity="info" sx={{ mb: 2 }}>
              User Details and Information
            </Alert>
            <List>
              <ListItem>
                <ListItemText primary="User ID" secondary={selectedUser.id} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Phone Number"
                  secondary={selectedUser.phone || "Not provided"}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Role"
                  secondary={
                    <Chip
                      label={selectedUser.role}
                      color={
                        selectedUser.role === "ROLE_ADMIN" ? "error" : "default"
                      }
                      size="small"
                    />
                  }
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Account Status"
                  secondary={
                    <Chip
                      label={selectedUser.verified ? "Verified" : "Unverified"}
                      color={selectedUser.verified ? "success" : "warning"}
                      size="small"
                    />
                  }
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Authentication Provider"
                  secondary={
                    <Chip
                      label={selectedUser.authProvider || "LOCAL"}
                      color={
                        selectedUser.authProvider === "GOOGLE"
                          ? "info"
                          : "default"
                      }
                      size="small"
                    />
                  }
                />
              </ListItem>
              <Divider />
              {selectedUser.googleId && (
                <>
                  <ListItem>
                    <ListItemText
                      primary="Google ID"
                      secondary={selectedUser.googleId}
                    />
                  </ListItem>
                  <Divider />
                </>
              )}
              <ListItem>
                <ListItemText
                  primary="Member Since"
                  secondary={
                    selectedUser.createdAt
                      ? new Date(selectedUser.createdAt).toLocaleDateString()
                      : "-"
                  }
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Last Updated"
                  secondary={
                    selectedUser.updatedAt
                      ? new Date(selectedUser.updatedAt).toLocaleDateString()
                      : "-"
                  }
                />
              </ListItem>
              {selectedUser.lastLogin && (
                <>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Last Login"
                      secondary={new Date(
                        selectedUser.lastLogin
                      ).toLocaleString()}
                    />
                  </ListItem>
                </>
              )}
            </List>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => setViewDialogOpen(false)} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailsDialog;
