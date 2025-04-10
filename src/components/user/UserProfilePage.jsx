import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);

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

      } catch (err) {
        console.error("Error loading profile data:", err);
      }
    };

    fetchData();
  }, []);

  if (!user) return <div>Loading user info...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">User Info</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.roleId?.name}</p>

      {subscription ? (
        <div style={{ marginTop: '1rem' }}>
          <h3 className="text-lg font-semibold mb-1">Subscription Info</h3>
          <p><strong>Plan:</strong> {subscription.planName}</p>
          <p><strong>Amount:</strong> ₹{subscription.amount}</p>
          <p><strong>Status:</strong> {subscription.status}</p>
          <p><strong>Start Date:</strong> {new Date(subscription.startDate).toLocaleDateString()}</p>
        </div>
      ) : (
        <p style={{ marginTop: '1rem' }}><em>No active subscription</em></p>
      )}
    </div>
  );
};

export default UserProfilePage;
