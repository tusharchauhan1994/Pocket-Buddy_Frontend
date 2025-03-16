import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    { field: "_id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 180 },  // ✅ Remove valueGetter
    { field: "email", headerName: "Email", width: 220 },
    { field: "role", headerName: "Role", width: 150 },  // ✅ Remove valueGetter
    { field: "status", headerName: "Status", width: 130 },  // ✅ Remove valueGetter
  ];
  

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/user/all");

      console.log("🔥 API Response:", res.data);

      if (res.data.data && Array.isArray(res.data.data)) {
        const formattedUsers = res.data.data.map(user => ({
          _id: user._id || Math.random().toString(36).substr(2, 9), // Ensure unique row ID
          name: user.name && user.name !== "Unknown User" ? user.name : "No Name",
          email: user.email || "No Email",
          role: user.role || "No Role",
          status: user.status || "Unknown",
        }));

        console.log("✅ Processed Users for Table:", formattedUsers);
        setUsers([...formattedUsers]); // ✅ Force React to detect state change
      } else {
        console.error("❌ Unexpected API Response:", res.data);
        setError("Invalid response from server.");
      }
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Debugging: Log whenever users state updates
  useEffect(() => {
    console.log("🔄 Users State Updated:", users);
  }, [users]);

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <Box p={3} flexGrow={1} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Manage Users
        </Typography>

        {/* ✅ Show loading spinner while fetching data */}
        {loading && <CircularProgress size={30} sx={{ alignSelf: "center" }} />}
        
        {/* ✅ Show error message if API fails */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* ✅ Show DataGrid only when users are available */}
        {!loading && !error && users.length > 0 && (
          <DataGrid
            rows={users}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            checkboxSelection
            sx={{ minHeight: 400, backgroundColor: "#fff", borderRadius: 2, boxShadow: 1 }}
            getRowId={(row) => row._id || Math.random().toString(36).substr(2, 9)}
          />
        )}

        {/* ✅ Show message if no users found */}
        {!loading && !error && users.length === 0 && (
          <Typography variant="h6" mt={3} color="gray" textAlign="center">
            No users found.
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default AdminUsers;
