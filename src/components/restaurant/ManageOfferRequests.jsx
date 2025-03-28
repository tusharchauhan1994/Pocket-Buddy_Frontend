import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      fetchRequests(); // Refresh list
    } catch (error) {
      console.error(`🔴 Error updating request to ${status}:`, error);
      setMessage("Failed to update request. Try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
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
            <div key={request._id} className="bg-white p-4 shadow-md rounded-lg">
              <h3 className="text-lg font-semibold">
                {request.offer_id?.title || "No Offer Title"}
              </h3>
              <p className="text-gray-600">{request.offer_id?.description || "No Description"}</p>
              <p className="text-sm text-gray-500">
                Requested by:{" "}
                <span className="font-medium">
                  {request.user_id?.firstName} {request.user_id?.lastName}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Requested At:{" "}
                {request.createdAt
                  ? new Date(request.createdAt).toLocaleString()
                  : "N/A"}
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
  );
};

export default ManageOfferRequests;
