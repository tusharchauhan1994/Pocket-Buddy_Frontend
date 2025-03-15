import React from "react";
import AdminProtectedRoute from "./AdminProtectedRoute"; // Import the wrapper

export const AdminDashboard = () => {
  return (
    <AdminProtectedRoute>
      <div>
        <h1>Admin Dashboard</h1>
      </div>
    </AdminProtectedRoute>
  );
};
