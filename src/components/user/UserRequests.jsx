import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserNavbar } from "./UserNavbar";
import { UserFooter } from "./UserFooter";

export const UserRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const userId = localStorage.getItem("id");
        if (!userId) {
          console.error("User ID is missing!");
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/redeem/user/${userId}`
        );
        console.log("Fetched requests:", response.data); // ✅ Check API response

        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <UserNavbar />
      <div className="px-5 lg:px-32 py-10">
        <h2 className="text-3xl font-semibold mb-5">My Offer Requests</h2>
        {requests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {requests.map((req) => (
              <div key={req._id} className="border rounded-lg shadow-lg p-4">
                {/* ✅ Show Correct Offer Title */}
                <h3 className="text-xl font-semibold">
                  {req.offer_id?.title || "Offer Unavailable"}
                </h3>

                {/* ✅ Show Request Status */}
                <p className="text-gray-600">
                  Status:{" "}
                  <span
                    className={
                      req.status === "Pending"
                        ? "text-yellow-500"
                        : req.status === "Approved"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {req.status}
                  </span>
                </p>

                {/* ✅ Show Correct Request Time (Formatted) */}
                <p className="text-xs text-gray-500 mt-2">
                  Requested At:{" "}
                  {new Date(req.createdAt).toLocaleString("en-GB", {
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

                {/* ✅ Show Approval/Rejection Time if Status is Updated */}
                {req.status !== "Pending" && (
                  <p className="text-xs text-gray-500">
                    {req.status} At:{" "}
                    {new Date(req.updatedAt).toLocaleString("en-GB", {
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
                )}

                {/* ✅ Show Status-Based Message */}
                {req.status === "Accepted" && (
                  <p className="text-green-600 font-bold">
                    ✅ You can now redeem this offer!
                  </p>
                )}
                {req.status === "Declined" && (
                  <p className="text-red-500">
                    ❌ This offer request was declined.
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You have no requests yet.</p>
        )}
      </div>
      <UserFooter />
    </div>
  );
};
