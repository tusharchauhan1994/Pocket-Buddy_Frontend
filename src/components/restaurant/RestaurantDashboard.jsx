import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RestaurantNavbar from "./RestaurantNavbar";
import RestaurantFooter from "./RestaurantFooter";
import { RestaurantSidebar } from "./RestaurantSidebar";

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
  }, [navigate]); // ✅ Added navigate as a dependency

  return (
    <div className="flex">
      {/* Sidebar */}
      <RestaurantSidebar />

      {/* Main Content */}
      <div className="ml-64 w-full p-10">
        <h1 className="text-2xl font-bold">Restaurant Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
          <div className="bg-blue-500 text-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg">Active Offers</h2>
            <p className="text-3xl font-bold">12</p>
          </div>
          <div className="bg-yellow-500 text-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg">Total Reviews</h2>
            <p className="text-3xl font-bold">45</p>
          </div>
          <div className="bg-red-500 text-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg">Expired Offers</h2>
            <p className="text-3xl font-bold">3</p>
          </div>
        </div>
        
        {/* Offer Management Section */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-5">Manage Offers</h2>
          <button className="bg-green-500 text-white px-5 py-2 rounded">+ Add New Offer</button>

          {/* Offers Table */}
          <table className="w-full mt-5 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3">Offer Name</th>
                <th className="border p-3">Discount</th>
                <th className="border p-3">Status</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="border p-3">Weekend Special</td>
                <td className="border p-3">20% Off</td>
                <td className="border p-3 text-green-500">Active</td>
                <td className="border p-3">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded ml-2">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};