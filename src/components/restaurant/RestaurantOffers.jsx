import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import RestaurantSidebar from "./RestaurantSidebar";
import { toast } from "react-toastify";


export const RestaurantOffers = () => {
  const [offers, setOffers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(
    localStorage.getItem("restaurantId") || ""
  );
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
   

  const handleEdit = (offer) => {
    setEditingId(offer._id);
    setEditData({ ...offer });
  };

  const handleChange = (e, field) => {
    setEditData({ ...editData, [field]: e.target.value });
  };

  const handleSave = async (id) => {
    if (!window.confirm("Are you sure you want to save these changes?")) return;
  
    try {
      const res = await axios.put(`http://localhost:3000/offer/update/${id}`, editData); // Ensure URL is correct
  
      if (res.data.success) {
        setOffers((prev) =>
          prev.map((offer) => (offer._id === id ? { ...offer, ...editData } : offer))
        );
        setEditingId(null);
        toast.success("Offer updated successfully!");
      } else {
        toast.error("Failed to update offer.");
      }
    } catch (error) {
      console.error("Error updating offer:", error);
      toast.error("Failed to update offer.");
    }
  };
  

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
  
    try {
      const res = await axios.delete(`http://localhost:3000/offer/delete/${id}`); // Add full URL if needed
  
      if (res.data.success) {
        setOffers((prev) => prev.filter((offer) => offer._id !== id));
        toast.success("Offer deleted successfully!");
      } else {
        toast.error("Failed to delete offer.");
      }
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast.error("Failed to delete offer.");
    }
  };
  

  const userId = localStorage.getItem("id");
  // ✅ Fetch the logged-in user's restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get("http://localhost:3000/admin/restaurants");
        if (res.data.data && Array.isArray(res.data.data)) {
          // Extract restaurants belonging to the logged-in user
          const userRestaurants = res.data.data
            .flatMap((owner) => owner.restaurants)
            .filter((restaurant) => restaurant.userId === userId);

          setRestaurants(userRestaurants);
          console.log("✅ User's Restaurants:", userRestaurants);

          // Automatically select the first restaurant if none is selected
          if (!selectedRestaurantId && userRestaurants.length > 0) {
            setSelectedRestaurantId(userRestaurants[0]._id);
            localStorage.setItem("restaurantId", userRestaurants[0]._id);
          }
        } else {
          toast.error("Failed to load restaurants");
        }
      } catch (error) {
        console.error("❌ Error fetching restaurants:", error);
        toast.error("Error fetching restaurants.");
      }
    };

    fetchRestaurants();
  }, [userId]);

  // ✅ Fetch offers for the selected restaurant
  useEffect(() => {
    if (!selectedRestaurantId) {
      console.warn("❌ No restaurant selected.");
      return;
    }

    const fetchOffers = async () => {
      try {
        console.log("Fetching offers for Restaurant ID:", selectedRestaurantId);
        const res = await axios.get(
          `/offer/by-restaurant/${selectedRestaurantId}`
        );

        if (res.data && res.data.success) {
          setOffers(res.data.offers);
          console.log("✅ Fetched Offers:", res.data.offers);
        } else {
          console.error("❌ Invalid API response:", res.data);
          toast.error("Failed to load offers.");
        }
      } catch (error) {
        console.error("❌ Error fetching offers:", error);
        toast.error("Error fetching offers.");
      }
    };

    fetchOffers();
  }, [selectedRestaurantId]);

  // ✅ Handle restaurant selection change
  const handleRestaurantChange = (e) => {
    const newRestaurantId = e.target.value;
    setSelectedRestaurantId(newRestaurantId);
    localStorage.setItem("restaurantId", newRestaurantId);
    console.log("✅ Restaurant ID Updated:", newRestaurantId);
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 flex-shrink-0">
        <RestaurantSidebar />
      </div>

      
      <div className="flex-grow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Offers</h2>
          <Link to="/restaurant/addOffer">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Add New Offer
            </button>
          </Link>
        </div>

        {/* ✅ Restaurant selection dropdown */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">
            Select Restaurant:
          </label>
          <select
            value={selectedRestaurantId}
            onChange={handleRestaurantChange}
            className="mt-1 p-2 border rounded w-full"
          >
            {restaurants.length > 0 ? (
              restaurants.map((restaurant) => (
                <option key={restaurant._id} value={restaurant._id}>
                  {restaurant.title}
                </option>
              ))
            ) : (
              <option disabled>No restaurants available</option>
            )}
          </select>
        </div>

        {/* ✅ Offers Table with Edit & Delete */}
        <div className="overflow-x-auto">
          <table className="w-full border bg-white shadow-md rounded-lg">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Discount</th>
                <th className="p-3 text-left">Valid Until</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.length > 0 ? (
                offers.map((offer, index) => (
                  <tr key={offer._id} className="border-b hover:bg-gray-100">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">
                      <img
                        src={offer.imageURL}
                        alt={offer.title}
                        className="h-16 w-16 object-cover rounded"
                      />
                    </td>
                    <td className="p-3">
                      {editingId === offer._id ? (
                        <input
                          type="text"
                          value={editData.title}
                          onChange={(e) => handleChange(e, "title")}
                          className="border p-1"
                        />
                      ) : (
                        offer.title
                      )}
                    </td>
                    <td className="p-3">
                      {editingId === offer._id ? (
                        <input
                          type="number"
                          value={editData.discount_value}
                          onChange={(e) => handleChange(e, "discount_value")}
                          className="border p-1 w-16"
                        />
                      ) : (
                        `${offer.discount_value}%`
                      )}
                    </td>
                    <td className="p-3">
                      {editingId === offer._id ? (
                        <input
                          type="date"
                          value={editData.valid_to}
                          onChange={(e) => handleChange(e, "valid_to")}
                          className="border p-1"
                        />
                      ) : (
                        new Date(offer.valid_to).toLocaleDateString()
                      )}
                    </td>
                    <td className="p-3">
                      {editingId === offer._id ? (
                        <select
                          value={editData.status}
                          onChange={(e) => handleChange(e, "status")}
                          className="border p-1"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-1 rounded text-white ${
                            offer.status === "Active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {offer.status}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col space-y-2">
                        {editingId === offer._id ? (
                          <button
                            onClick={() => handleSave(offer._id)}
                            className="px-4 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEdit(offer)}
                            className="px-4 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(offer._id)}
                          className="px-4 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    No offers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RestaurantOffers;
