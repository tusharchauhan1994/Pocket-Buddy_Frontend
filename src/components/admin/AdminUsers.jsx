import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { columns } from "./UserColumns.jsx"; // ✅ Import UserColumns.js

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/user/all");

      console.log("🔥 API Response:", res.data);

      if (res.data.data && Array.isArray(res.data.data)) {
        const formattedUsers = res.data.data.map((user) => ({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role.toLowerCase(),
          status: user.status === "Active", // ✅ Convert "Active" → true, "Inactive" → false
        }));

        setUsers([...formattedUsers]);
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

  useEffect(() => {
    console.log("🔄 Users State Updated:", users);
  }, [users]);

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <Box
        p={3}
        flexGrow={1}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Typography variant="h5" fontWeight="bold">
          Manage Users
        </Typography>

        {loading && <CircularProgress size={30} sx={{ alignSelf: "center" }} />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && users.length > 0 && (
          <DataGrid
            rows={users}
            columns={columns(getAllUsers, setUsers)} // ✅ Pass setUsers
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            checkboxSelection
            sx={{
              minHeight: 400,
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: 1,
            }}
            getRowId={(row) =>
              row._id || Math.random().toString(36).substr(2, 9)
            }
          />
        )}

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
