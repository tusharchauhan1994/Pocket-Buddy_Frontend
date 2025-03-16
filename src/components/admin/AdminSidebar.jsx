import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
} from "@mui/material";
import {
  Dashboard,
  Group,
  Store,
  LocalOffer,
  Settings,
  ExitToApp,
  Menu,
  Notifications,
  Assessment,
} from "@mui/icons-material";

export const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("id");
      localStorage.removeItem("role");
      console.log("Admin logged out");
      alert("You are logged out");
      navigate("/login");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Drawer
      variant="permanent"
      open={isOpen}
      sx={{
        width: isOpen ? 240 : 60,
        "& .MuiDrawer-paper": { backgroundColor: "#f4f4f4", color: "#333" },
      }}
    >
      <div className="p-4 flex justify-between items-center">
        {isOpen && <h1 className="text-lg font-bold">Admin Panel</h1>}
        <Button onClick={() => setIsOpen(!isOpen)} size="small">
          <Menu />
        </Button>
      </div>
      <Divider />
      <List>
        {[
          { path: "/admin/dashboard", label: "Dashboard", icon: <Dashboard /> },
          { path: "/admin/users", label: "Manage Users", icon: <Group /> },
          { path: "/admin/restaurants", label: "Manage Restaurants", icon: <Store /> },
          { path: "/admin/offers", label: "Manage Offers", icon: <LocalOffer /> },
          { path: "/admin/reports", label: "Reports", icon: <Assessment /> },
          { path: "/admin/notifications", label: "Notifications", icon: <Notifications /> },
          { path: "/admin/settings", label: "Settings", icon: <Settings /> },
        ].map((item) => (
          <ListItem
            component={Link} // ✅ Use `component={Link}` instead of `button`
            to={item.path}
            selected={isActive(item.path)}
            sx={{
              backgroundColor: isActive(item.path) ? "#1976d2" : "inherit",
              color: isActive(item.path) ? "#ffffff" : "#333",
              "&:hover": { backgroundColor: "#bbdefb" },
            }}
            key={item.path}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? "#ffffff" : "#333" }}>
              {item.icon}
            </ListItemIcon>
            {isOpen && <ListItemText primary={item.label} />}
          </ListItem>
        ))}

        <Divider />

        <ListItem
          onClick={handleLogout} // ✅ Removed `button` prop
          sx={{ "&:hover": { backgroundColor: "#f8d7da" } }}
        >
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          {isOpen && <ListItemText primary="Logout" />}
        </ListItem>
      </List>
    </Drawer>
  );
};

export default AdminSidebar;
