import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RestaurantSidebar from "./RestaurantSidebar";
import { toast } from "react-toastify";
import { Loader } from "../common/Loader";

const AddOffer = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  const [restaurants, setRestaurants] = useState([]);
  const [offerData, setOfferData] = useState({
    title: "",
    description: "",
    offer_type: "Flat Discount",
    discount_value: "",
    restaurant_ids: [],
    valid_from: "",
    valid_to: "",
    requires_approval: false,
    min_order_value: "",
    max_redemptions: "",
    status: "Active",
    image: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!userId) {
        toast.error("User authentication error. Please log in again.");
        return;
      }
      try {
        const res = await axios.get("http://localhost:3000/admin/restaurants");
        const allRestaurants = res.data.data.flatMap(owner => owner.restaurants);
        const userRestaurants = allRestaurants.filter(restaurant => restaurant.userId === userId);
        setRestaurants(userRestaurants);
      } catch (error) {
        toast.error("Error fetching restaurants. Check your connection.");
      }
    };
    fetchRestaurants();
  }, [userId]);

  const handleChange = (e) => {
    setOfferData({ ...offerData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setOfferData({ ...offerData, image: e.target.files[0] });
  };

  const handleRestaurantChange = (e) => {
    const { value, checked } = e.target;
    setOfferData(prev => ({
      ...prev,
      restaurant_ids: checked
        ? [...prev.restaurant_ids, value]
        : prev.restaurant_ids.filter(id => id !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (offerData.restaurant_ids.length === 0) {
      toast.error("Please select at least one restaurant");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.keys(offerData).forEach(key => {
        if (key === "restaurant_ids") {
          offerData[key].forEach(id => formData.append("restaurant_ids[]", id));
        } else if (key === "image" && offerData.image) {
          formData.append("image", offerData.image);
        } else {
          formData.append(key, offerData[key]);
        }
      });
      const res = await axios.post("http://localhost:3000/offer/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        toast.success("Offer added successfully!");
        navigate("/restaurant/myOffers");
      }
    } catch (error) {
      toast.error("Failed to add offer");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 flex-shrink-0">
        <RestaurantSidebar />
      </div>
      {isLoading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-lg z-50">
          <Loader />
        </div>
      )}
      <div className="flex-grow p-6">
  <h2 className="text-2xl font-bold mb-6">Add New Offer</h2>
  <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label>Offer Title</label>
        <input type="text" name="title" value={offerData.title} onChange={handleChange} required className="p-2 border rounded w-full" />
      </div>
      <div>
        <label>Description</label>
        <input type="text" name="description" value={offerData.description} onChange={handleChange} required className="p-2 border rounded w-full" />
      </div>
      <div className="col-span-2">
        <label>Restaurant Selection</label>
        <div className="border p-2 rounded">
          {restaurants.length > 0 ? (
            restaurants.map(restaurant => (
              <div key={restaurant._id} className="flex items-center">
                <input type="checkbox" value={restaurant._id} onChange={handleRestaurantChange} className="mr-2" />
                <span>{restaurant.title}</span>
              </div>
            ))
          ) : (
            <p>No restaurants available</p>
          )}
        </div>
      </div>
      <div>
        <label>Offer Type</label>
        <select name="offer_type" value={offerData.offer_type} onChange={handleChange} className="p-2 border rounded w-full">
          <option value="Flat Discount">Flat Discount</option>
          <option value="BOGO">Buy One Get One</option>
          <option value="Limited-Time">Limited-Time Deal</option>
        </select>
      </div>
      <div>
        <label>Discount %</label>
        <input type="number" name="discount_value" value={offerData.discount_value} onChange={handleChange} required className="p-2 border rounded w-full" />
      </div>
      <div>
        <label>Valid From</label>
        <input type="date" name="valid_from" value={offerData.valid_from} onChange={handleChange} required className="p-2 border rounded w-full" />
      </div>
      <div>
        <label>Valid To</label>
        <input type="date" name="valid_to" value={offerData.valid_to} onChange={handleChange} required className="p-2 border rounded w-full" />
      </div>
      <div>
        <label>Min Order Value</label>
        <input type="number" name="min_order_value" value={offerData.min_order_value} onChange={handleChange} className="p-2 border rounded w-full" />
      </div>
      <div>
        <label>Max Redemptions</label>
        <input type="number" name="max_redemptions" value={offerData.max_redemptions} onChange={handleChange} className="p-2 border rounded w-full" />
      </div>
      <div>
        <label>Upload Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} required className="p-2 border rounded w-full" />
      </div>
      <div className="flex items-center">
        <input type="checkbox" name="requires_approval" checked={offerData.requires_approval} onChange={(e) => setOfferData({ ...offerData, requires_approval: e.target.checked })} className="mr-2" />
        <label>Requires Approval</label>
      </div>
    </div>
    <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Submit</button>
  </form>
</div>
    </div>
  );
};

export default AddOffer;
