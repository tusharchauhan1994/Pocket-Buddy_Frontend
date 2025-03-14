import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const alertShown = useRef(false); // ✅ Ref to track if alert is shown

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "Admin") {
      sessionStorage.setItem("lastValidPage", window.location.pathname);

      if (!alertShown.current) { // ✅ Prevent duplicate alerts
        alert("Access Denied! Only Admins can access this page.");
        alertShown.current = true; // ✅ Mark alert as shown
      }

      navigate("/unauthorized", { replace: true }); // ✅ Prevents going back to Admin page
    }
  }, [navigate]);

  return (
    <div>
      <h1>Admin Dashboard- demo for git hub</h1>
    </div>
  );
};
