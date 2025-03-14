import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const RestaurantDashboard = () => {
  const navigate = useNavigate();

  // ✅ Store last valid page
  useEffect(() => {
    sessionStorage.setItem("lastValidPage", window.location.pathname);
  }, []);

  // ✅ Check role & redirect if unauthorized
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "Restaurant") {
      alert("Access Denied! Only Restaurants can access this page.");
      navigate("/unauthorized");
    }
  }, [navigate]); // ✅ Added `navigate` as a dependency

  return (
    <div>
      <h1>Restaurant Dashboard</h1>
    </div>
  );
};
