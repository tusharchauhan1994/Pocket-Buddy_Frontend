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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch the logged-in user's restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!userId) {
        console.error("User ID is missing!");
        toast.error("User authentication error. Please log in again.");
        return;
      }
  
      try {
        const res = await axios.get("http://localhost:3000/admin/restaurants");
        console.log("API Full Response:", res.data); // Log full API response
  
        if (!res.data || !res.data.data || !Array.isArray(res.data.data)) {
          console.error("Invalid API response:", res.data);
          toast.error("Failed to load restaurants. Invalid response from server.");
          return;
        }
  
        // Extract all restaurants from API response
        const allRestaurants = res.data.data.flatMap((owner) => owner.restaurants);
        console.log("All Extracted Restaurants:", allRestaurants);
  
        // Filter restaurants owned by the current user
        const userRestaurants = allRestaurants.filter((restaurant) => restaurant.userId === userId);
        console.log("Filtered User Restaurants:", userRestaurants);
  
        if (userRestaurants.length === 0) {
          console.warn("No restaurants found for the current user.");
          toast.warn("No restaurants found. Please add a restaurant first.");
        }
  
        setRestaurants(userRestaurants);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        toast.error("Error fetching restaurants. Please check your internet connection.");
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

  // Handle restaurant selection
  const handleRestaurantChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setOfferData({ ...offerData, restaurant_ids: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (offerData.restaurant_ids.length === 0) {
      toast.error("Please select at least one restaurant");
      setIsLoading(false);
      return;
    }
  
    const formData = new FormData();
    Object.keys(offerData).forEach((key) => {
      if (key === "restaurant_ids") {
        offerData.restaurant_ids.forEach((id) =>
          formData.append("restaurant_ids[]", id)
        );
      } else if (key === "image") {
        if (offerData.image) {
          formData.append("image", offerData.image);
        }
      } else {
        formData.append(key, offerData[key]);
      }
    });
  
    try {
      const res = await axios.post(
        "http://localhost:3000/offer/add",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  
      if (res.data.success) {
        toast.success("Offer added successfully!");
        navigate("/restaurant/myOffers");
      }
    } catch (error) {
      toast.error("Failed to add offer");
      console.error("Error adding offer:", error);
    } finally {
      setIsLoading(false); // Ensures loader is stopped in all cases
    }
  };
  

  return (
    <div className="flex min-h-screen">
      <div className="w-64 flex-shrink-0">
        <RestaurantSidebar />
      </div>
      {/* ✅ Full-Screen Loader Overlay */}
            {(isLoading || isSubmitting) && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-lg z-50">
                <Loader />
              </div>
            )}
      <div className="flex-grow p-6">
        <h2 className="text-2xl font-bold mb-6">Add New Offer</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              placeholder="Offer Title"
              value={offerData.title}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={offerData.description}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
            {/* Restaurant Selection */}
            {restaurants.length > 0 ? (
              <select
                multiple
                name="restaurant_ids"
                onChange={handleRestaurantChange}
                required
                className="p-2 border rounded"
              >
                {restaurants.map((restaurant) => (
                  <option key={restaurant._id} value={restaurant._id}>
                  {restaurant.title} {/* ✅ Use title instead of name */}
                </option>                
                ))}
              </select>
            ) : (
              <p>No restaurants available</p>
            )}

            {/* Debugging */}
            <select
              name="offer_type"
              value={offerData.offer_type}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option value="Flat Discount">Flat Discount</option>
              <option value="BOGO">Buy One Get One</option>
              <option value="Limited-Time">Limited-Time Deal</option>
            </select>
            <input
              type="number"
              name="discount_value"
              placeholder="Discount %"
              value={offerData.discount_value}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="date"
              name="valid_from"
              value={offerData.valid_from}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="date"
              name="valid_to"
              value={offerData.valid_to}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="number"
              name="min_order_value"
              placeholder="Min Order Value"
              value={offerData.min_order_value}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              type="number"
              name="max_redemptions"
              placeholder="Max Redemptions"
              value={offerData.max_redemptions}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="p-2 border rounded"
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                name="requires_approval"
                checked={offerData.requires_approval}
                onChange={(e) =>
                  setOfferData({
                    ...offerData,
                    requires_approval: e.target.checked,
                  })
                }
                className="mr-2"
              />
              <label>Requires Approval</label>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddOffer;





//old code
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { offerValidation } from "../validation/formValidation";
// import RestaurantSidebar from "./RestaurantSidebar";

// const AddOffer = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const [selectedFile, setSelectedFile] = useState(null);

//   const onSubmit = (data) => {
//     console.log("Offer Added:", data);
//     if (selectedFile) {
//       console.log("Selected Image:", selectedFile);
//     }
//   };

//   return (
//     <div className="flex">
//       {/* Sidebar */}
//       <RestaurantSidebar />
//       {/* Main Content */}
//       <div className="flex-1 flex justify-center items-center min-h-screen bg-gray-100 p-6">
//         <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
//           <h1 className="text-2xl font-bold text-center mb-4">Add Offer</h1>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             {/* Offer Title */}
//             <div className="flex flex-col">
//               <label className="font-medium">Offer Title</label>
//               <input
//                 type="text"
//                 {...register("title", offerValidation.title)}
//                 className="border p-2 rounded-md"
//                 placeholder="Enter offer title"
//                 required
//               />
//               {errors.title && <span className="text-red-500">{errors.title.message}</span>}
//             </div>

//             {/* Description */}
//             <div className="flex flex-col">
//               <label className="font-medium">Description</label>
//               <textarea
//                 {...register("description", offerValidation.description)}
//                 className="border p-2 rounded-md"
//                 placeholder="Enter offer details"
//                 required
//               />
//               {errors.description && <span className="text-red-500">{errors.description.message}</span>}
//             </div>

//             {/* Offer Type */}
//             <div className="flex flex-col">
//               <label className="font-medium">Offer Type</label>
//               <select {...register("offerType", offerValidation.offerType)} className="border p-2 rounded-md" required>
//                 <option value="">Select Offer Type</option>
//                 <option value="percentage">Percentage Discount</option>
//                 <option value="fixed">Fixed Amount Discount</option>
//                 <option value="bogo">Buy X Get Y Free</option>
//                 <option value="free-delivery">Free Delivery</option>
//               </select>
//               {errors.offerType && <span className="text-red-500">{errors.offerType.message}</span>}
//             </div>

//             {/* Start Date & End Date */}
//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex flex-col">
//                 <label className="font-medium">Start Date</label>
//                 <input
//                   type="date"
//                   {...register("startDate", offerValidation.startDate)}
//                   className="border p-2 rounded-md"
//                   required
//                 />
//                 {errors.startDate && <span className="text-red-500">{errors.startDate.message}</span>}
//               </div>

//               <div className="flex flex-col">
//                 <label className="font-medium">End Date</label>
//                 <input
//                   type="date"
//                   {...register("endDate", offerValidation.endDate)}
//                   className="border p-2 rounded-md"
//                   required
//                 />
//                 {errors.endDate && <span className="text-red-500">{errors.endDate.message}</span>}
//               </div>
//             </div>

//             {/* Minimum Order Amount */}
//             <div className="flex flex-col">
//               <label className="font-medium">Minimum Order Amount</label>
//               <input
//                 type="number"
//                 {...register("minOrderAmount", offerValidation.minOrderAmount)}
//                 className="border p-2 rounded-md"
//                 placeholder="Enter minimum order amount"
//                 required
//               />
//               {errors.minOrderAmount && <span className="text-red-500">{errors.minOrderAmount.message}</span>}
//             </div>

//             {/* Upload Image */}
//             <div className="flex flex-col">
//               <label className="font-medium">Upload Offer Image</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setSelectedFile(e.target.files[0])}
//                 className="border p-2 rounded-md"
//                 required
//               />
//               {errors.image && <span className="text-red-500">{errors.image.message}</span>}
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-center">
//               <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">
//                 Add Offer
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddOffer;
