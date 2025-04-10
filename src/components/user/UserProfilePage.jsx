import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [approvedCount, setApprovedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [declinedCount, setDeclinedCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('id');
        if (!userId) {
          console.error("User ID is missing from localStorage");
          return;
        }

        // Get user data
        const userRes = await axios.get(`/user/user/${userId}`);
        const userData = userRes.data.data;
        setUser(userData);
        console.log("User data from API:", userData);

        // Get subscription info
        const subRes = await axios.get(`/subscription/user/${userId}`);
        setSubscription(subRes.data);
        console.log("Subscription data from API:", subRes.data);

        // Get request counts
        const res = await axios.get(`http://localhost:3000/redeem/user/${userId}`);
        const requests = res.data;
        console.log("Redemption Requests:", requests);

        const approved = requests.filter((r) => r.status === "Approved").length;
        const pending = requests.filter((r) => r.status === "Pending").length;
        const declined = requests.filter((r) => r.status === "Rejected").length;
        

        setApprovedCount(approved);
        setPendingCount(pending);
        setDeclinedCount(declined);

      } catch (err) {
        console.error("Error loading profile data:", err);
      }
    };

    fetchData();
  }, []);

  if (!user) return <div>Loading user info...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-xl font-semibold mb-2">User Info</h3>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.roleId?.name}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
  <h3 className="text-xl font-semibold mb-2">Subscription Info</h3>
  {subscription ? (
    <>
      <p><strong>Plan:</strong> {subscription.planName}</p>
      <p><strong>Amount:</strong> ₹{subscription.amount}</p>
      <p><strong>Status:</strong> {subscription.status}</p>
      <p><strong>Start Date:</strong> {new Date(subscription.startDate).toLocaleDateString('en-GB')}</p>
<p><strong>End Date:</strong> {new Date(subscription.endDate).toLocaleDateString('en-GB')}</p>

    </>
  ) : (
    <p><em>No active subscription</em></p>
  )}
</div>


      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Your Offer Requests</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-100 p-4 rounded-lg text-center shadow">
            <p className="text-sm text-green-800">Approved</p>
            <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg text-center shadow">
            <p className="text-sm text-yellow-800">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg text-center shadow">
            <p className="text-sm text-red-800">Rejected</p>
            <p className="text-2xl font-bold text-red-600">{declinedCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
