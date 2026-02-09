import { Box, Drawer } from "@mui/material";
import React from "react";
import SidebarDrawer from "./SidebarDrawer";

const drawerWidth = 280;
const UserSidebar = ({
  mobileOpen,
  handleDrawerToggle,
  isMobile,
  setMobileOpen,
  handleProfileMenuClose,
}) => {
  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            border: "none",
          },
        }}
      >
        <SidebarDrawer
          handleProfileMenuClose={handleProfileMenuClose}
          isMobile={isMobile}
          setMobileOpen={setMobileOpen}
        />
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            border: "none",
          },
        }}
        open
      >
        <SidebarDrawer
          isMobile={isMobile}
          setMobileOpen={setMobileOpen}
          handleProfileMenuClose={handleProfileMenuClose}
        />
      </Drawer>
    </Box>
  );
};

export default UserSidebar;
