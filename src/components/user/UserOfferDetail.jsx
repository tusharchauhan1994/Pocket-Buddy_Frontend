import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserNavbar } from "./UserNavbar";
import { UserFooter } from "./UserFooter";
import axios from "axios";

export const UserOfferDetail = () => {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/offer/${id}`);
        setOffer(res.data.data);
      } catch (error) {
        console.error("Error fetching offer details:", error);
      }
    };
    fetchOfferDetails();
  }, [id]);

  if (!offer) {
    return <div className="text-center py-10 text-xl">Loading offer details...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen mt-16">
      <UserNavbar />

      {/* Offer Details Section */}
      <div className="px-5 lg:px-32 py-10 flex flex-col lg:flex-row gap-6">
        {/* Left Side: Image */}
        <div className="lg:w-1/2 flex justify-center">
          <img
            src={offer.imageURL || "https://via.placeholder.com/600"}
            alt={offer.title}
            className="w-full max-w-md h-auto rounded-lg shadow-lg object-contain"
          />
        </div>

        {/* Right Side: Offer Details */}
        <div className="lg:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold">{offer.title}</h1>
          <p className="text-gray-600 text-lg">{offer.description}</p>

          {/* ✅ Discount Display Logic */}
          <p className="text-red-500 font-bold text-xl">
            {offer.offer_type === "Flat Discount"
              ? `₹${offer.discount_value} OFF`
              : offer.offer_type === "Percentage"
              ? `${offer.discount_value}% OFF`
              : offer.offer_type}
          </p>

          <p className="text-gray-500">
            Valid From: {offer.valid_from ? new Date(offer.valid_from).toLocaleDateString() : "N/A"}
          </p>
          <p className="text-gray-500">
            Valid Until: {offer.valid_to ? new Date(offer.valid_to).toLocaleDateString() : "N/A"}
          </p>

          <p className="text-gray-600">Min Order Value: ₹{offer.min_order_value || 0}</p>
          <p className="text-gray-600">Max Redemptions: {offer.max_redemptions || "Unlimited"}</p>
        </div>
      </div>

      {/* ✅ Show Restaurants Offering This Deal (Below Image & Details) */}
      <div className="px-5 lg:px-32 mt-6">
        <h2 className="text-2xl font-semibold mb-3">Available At:</h2>
        <div className="flex flex-wrap gap-4">
          {offer.restaurant_ids && offer.restaurant_ids.length > 0 ? (
            offer.restaurant_ids.map((restaurant) => (
              <div key={restaurant._id} className="relative group">
                {/* Restaurant Name as Button */}
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
                  {restaurant.title}
                </button>
                
                {/* Hidden Full Details (Shown on Hover) */}
                <div className="absolute left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-3 text-gray-700 hidden group-hover:block">
                  <p className="font-semibold">{restaurant.title}</p>
                  <p className="text-sm">{restaurant.address}, {restaurant.areaId?.name}, {restaurant.cityId?.name}, {restaurant.stateId?.name}</p>
                  <p className="text-sm">Contact: {restaurant.contactNumber}</p>
                  <p className="text-sm">Timings: {restaurant.timings}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No locations available.</p>
          )}
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="px-5 lg:px-32 mt-6">
        <h2 className="text-2xl font-semibold mb-3">Terms & Conditions</h2>
        <ul className="list-disc list-inside text-gray-600">
          <li>Offer valid only for the mentioned period.</li>
          <li>Cannot be combined with other discounts or promotions.</li>
          <li>Requires a minimum order value of ₹{offer.min_order_value || 0}.</li>
          <li>Only {offer.max_redemptions || "unlimited"} redemptions allowed.</li>
          <li>{offer.requires_approval ? "Approval required before usage." : "No approval required."}</li>
        </ul>
      </div>

      {/* Request Offer Button */}
      <div className="px-5 lg:px-32 mt-6 text-center">
        <button className="w-full max-w-md bg-blue-500 text-white py-3 text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition">
          Request Offer from Restaurant
        </button>
      </div>

      <UserFooter />
    </div>
  );
};

export default UserOfferDetail;
