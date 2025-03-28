import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserNavbar } from "./UserNavbar";
import { UserFooter } from "./UserFooter";
import { toast } from "react-toastify";
import axios from "axios";

export const UserOfferDetail = () => {
  const { id } = useParams(); // Offer ID from URL
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [hoveredRestaurant, setHoveredRestaurant] = useState(null);

  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/offer/${id}`);
        console.log("Offer Data:", res.data.data);
        setOffer(res.data.data);
      } catch (error) {
        console.error("Error fetching offer details:", error);
      }
    };
    fetchOfferDetails();
  }, [id]);

  const handleRedeemOffer = async () => {
    const userId = localStorage.getItem("id");

    if (!userId) {
      setMessage("You must be logged in to redeem an offer ❌");
      return;
    }

    if (!offer || !offer.restaurant_ids || offer.restaurant_ids.length === 0) {
      setMessage("No restaurant available for this offer.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:3000/redeem", {
        user_id: userId,
        offer_id: offer._id,
      });

      setMessage(response.data.message || "Request sent successfully! ✅");
    } catch (error) {
      console.error("🔴 Error redeeming offer:", error.response?.data || error.message);
      setMessage(
        error.response?.data?.message || "Error sending request. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!offer) {
    return <div className="text-center py-10 text-xl">Loading offer details...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen mt-16">
      <UserNavbar />

      <div className="px-5 lg:px-32 py-10 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2 flex justify-center">
          <img
            src={offer.imageURL || "https://via.placeholder.com/600"}
            alt={offer.title}
            className="w-full max-w-md h-auto rounded-lg shadow-lg object-contain"
          />
        </div>

        <div className="lg:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold">{offer.title}</h1>
          <p className="text-gray-600 text-lg">{offer.description}</p>
          <p className="text-red-500 font-bold text-xl">
            {offer.offer_type === "Flat Discount"
              ? `₹${offer.discount_value} OFF`
              : offer.offer_type === "Percentage"
              ? `${offer.discount_value}% OFF`
              : offer.offer_type}
          </p>
          <p className="text-gray-500">Valid From: {new Date(offer.valid_from).toLocaleDateString()}</p>
          <p className="text-gray-500">Valid Until: {new Date(offer.valid_to).toLocaleDateString()}</p>
          <p className="text-gray-600">Min Order Value: ₹{offer.min_order_value || 0}</p>
          <p className="text-gray-600">Max Redemptions: {offer.max_redemptions || "Unlimited"}</p>
        </div>
      </div>

      <div className="px-5 lg:px-32 mt-6">
        <h2 className="text-2xl font-semibold mb-3">Available At:</h2>
        <div className="flex flex-wrap gap-4 relative">
          {offer.restaurant_ids && offer.restaurant_ids.length > 0 ? (
            offer.restaurant_ids.map((restaurant) => (
              <div
                key={restaurant._id}
                className="relative"
                onMouseEnter={() => setHoveredRestaurant(restaurant)}
                onMouseLeave={() => setHoveredRestaurant(null)}
              >
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
                  {restaurant.title}
                </button>
                {hoveredRestaurant?._id === restaurant._id && (
                 <div className="absolute left-0 mt-2 w-64 bg-white text-black p-3 shadow-lg rounded-lg">
                 <p className="font-bold">{restaurant.title}</p>
                 <p>{restaurant.address}</p>
                 <p>Phone: {restaurant.contactNumber || "N/A"}</p>
                 <p>Opening Hours: {restaurant.timings || "N/A"}</p>
               </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No locations available.</p>
          )}
        </div>
      </div>

      <div className="px-5 lg:px-32 mt-6">
        <h2 className="text-2xl font-semibold mb-3">Terms & Conditions</h2>
        <ul className="list-disc list-inside text-gray-600">
          <li>Offer valid only for the mentioned period.</li>
          <li>Cannot be combined with other discounts or promotions.</li>
          <li>Requires a minimum order value of ₹{offer.min_order_value || 0}.</li>
          <li>Only {offer.max_redemptions || "unlimited"} redemptions allowed.</li>
        </ul>
      </div>

      <div className="px-5 lg:px-32 mt-6 text-center">
        <button
          onClick={handleRedeemOffer}
          disabled={loading}
          className={`w-full max-w-md py-3 text-lg font-semibold rounded-lg shadow-md transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {loading ? "Sending Request..." : "Redeem Offer"}
        </button>
        {message && <p className="mt-3 text-lg font-medium text-gray-700">{message}</p>}
      </div>

      <UserFooter />
    </div>
  );
};

export default UserOfferDetail;
