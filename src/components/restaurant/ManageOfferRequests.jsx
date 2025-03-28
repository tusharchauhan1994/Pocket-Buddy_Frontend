import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RestaurantSidebar from "./RestaurantSidebar";

const ManageOfferRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("Pending");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setMessage("");

    const ownerId = localStorage.getItem("id"); // Ensure ownerId exists
    if (!ownerId) {
      alert("⚠️ Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    console.log("📡 Fetching redemption requests for owner:", ownerId);

    try {
      const response = await axios.get(
        `http://localhost:3000/redeem/owner/${ownerId}`
      );

      console.log("✅ API Response:", response.data);

      if (!response.data.length) {
        setMessage("No redemption requests found.");
      } else {
        setRequests(response.data);
      }
    } catch (error) {
      console.error("🔴 Error fetching requests:", error);
      setMessage("Failed to fetch requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, status) => {
    console.log(`🔄 Updating request ${requestId} to ${status}...`);
    try {
        const response = await axios.put(
            `http://localhost:3000/redeem/update-status/${requestId}`,
            { status }
        );

        console.log(`✅ Request updated: ${response.data.message}`);

        // Show success toast
        toast.success(`Request ${status}!`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        fetchRequests(); // Refresh list
    } catch (error) {
        console.error(`🔴 Error updating request to ${status}:`, error);

        // Show error toast
        toast.error("Failed to update request. Try again.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
};


  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Visible on large screens */}
      <div className="hidden lg:block w-auto">
        <RestaurantSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Manage Offer Requests</h1>

        {message && <p className="text-red-500">{message}</p>}

        {/* Filter Buttons */}
        <div className="mb-6 flex space-x-3">
          {["Pending", "Approved", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md ${
                filter === status ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {loading && <p className="text-gray-600">Loading requests...</p>}

        {/* Requests List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests
            .filter((req) => req.status === filter)
            .map((request) => (
              <div
                key={request._id}
                className="bg-white p-4 shadow-md rounded-lg"
              >
                {/* User Info */}
                <h3 className="text-lg font-semibold">
                  {request.user_id?.firstName} {request.user_id?.lastName}
                </h3>
                <p className="text-sm text-gray-500">
                  {request.user_id?.email || "No Email"}
                </p>

                {/* Claimed Offer */}
                <div className="mt-2 border-t pt-2">
                  <p className="text-md font-semibold">
                    Claimed Offer: {request.offer_id?.title || "No Offer Title"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {request.offer_id?.description || "No Description"}
                  </p>
                </div>

                {/* Request Date */}
                <p className="text-xs text-gray-500 mt-2">
                  Requested At:{" "}
                  {new Date(request.createdAt).toLocaleString("en-GB", {
                    timeZone: "Asia/Kolkata",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </p>

                {/* Action Buttons */}
                {filter === "Pending" && (
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleAction(request._id, "Approved")}
                      className="px-3 py-1 bg-green-600 text-white rounded-md"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(request._id, "Rejected")}
                      className="px-3 py-1 bg-red-600 text-white rounded-md"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ManageOfferRequests;
