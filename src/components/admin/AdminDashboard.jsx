import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminProtectedRoute from "./AdminProtectedRoute";

const AdminDashboard = () => {
  return (
    <AdminProtectedRoute>
      <div style={{ display: "flex" }}>
        <AdminSidebar />
        <div style={{ marginLeft: "240px", padding: "20px", width: "100%" }}>
          <h1>Admin Dashboard...</h1>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ width: "200px", padding: "20px", background: "#f0f0f0", textAlign: "center" }}>
              <h3>Total Users</h3>
              <h2>120</h2>
            </div>
            <div style={{ width: "200px", padding: "20px", background: "#f0f0f0", textAlign: "center" }}>
              <h3>Total Restaurants</h3>
              <h2>35</h2>
            </div>
            <div style={{ width: "200px", padding: "20px", background: "#f0f0f0", textAlign: "center" }}>
              <h3>Active Offers</h3>
              <h2>50</h2>
            </div>
            <div style={{ width: "200px", padding: "20px", background: "#f0f0f0", textAlign: "center" }}>
              <h3>Settings Updated</h3>
              <h2>10</h2>
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  );
};

export default AdminDashboard;
