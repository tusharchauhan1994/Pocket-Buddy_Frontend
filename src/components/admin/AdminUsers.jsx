import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";

export const AdminUsers = () => {
  const columns = [
    { field: "_id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },  // ✅ Now correctly mapped
    { field: "email", headerName: "Email", width: 200 },
    { field: "role", headerName: "Role", width: 150 },  // ✅ Role is now fetched properly
    { field: "status", headerName: "Status", width: 130 },  // ✅ Status will now show Active/Inactive
  ];
  

  const [users, setUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/user/all");
      setUsers(res.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <Box p={3} flexGrow={1}>
        <Typography variant="h5" mb={2} fontWeight="bold">
          Manage Users
        </Typography>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          checkboxSelection
          getRowId={(row) => row._id}
        />
      </Box>
    </div>
  );
};

export default AdminUsers;
