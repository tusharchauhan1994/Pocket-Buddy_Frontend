import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserNavbar } from "./UserNavbar";
import { UserFooter } from "./UserFooter";
import { Card, CardContent, Typography, CircularProgress, Alert, Chip } from "@mui/material";
import { MdOutlineCategory, MdPhone, MdAccessTime, MdLocationOn } from "react-icons/md";

export const UserRestaurant = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRestaurantOwners();
  }, []);

  const fetchRestaurantOwners = async () => {
    try {
      const res = await axios.get("http://localhost:3000/admin/restaurants");
      console.log("Fetched Restaurants:", res.data);
      if (res.data.data && Array.isArray(res.data.data)) {
        setOwners(res.data.data);
      } else {
        setError("Invalid response from server.");
      }
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen mt-16">
      <UserNavbar />
      <div className="px-5 lg:px-32 py-10">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          All Restaurant Owners & Their Restaurants
        </Typography>

        {loading && <CircularProgress size={30} sx={{ alignSelf: "center" }} />}
        {error && <Alert severity="error">{error}</Alert>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {owners.map((owner) => (
            <Card key={owner._id} className="shadow-md rounded-lg overflow-hidden">
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Owner: {owner.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Email: {owner.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Contact: {owner.contactNumber || "N/A"}
                </Typography>
                <div className="mt-4">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Restaurants:
                  </Typography>
                  {owner.restaurants && owner.restaurants.length > 0 ? (
                    owner.restaurants.map((restaurant) => (
                      <div key={restaurant._id} className="p-3 mt-2 border rounded-md">
                        {/* 🖼️ Image Section */}
                        <img
                          src={restaurant.imageURL || "https://placehold.co/150"}
                          alt={restaurant.title || "No Title"}
                          className="w-full h-40 object-cover rounded-md"
                        />
                        
                        <Typography variant="h6" className="mt-2">{restaurant.title}</Typography>
                        <Typography variant="body2" className="flex items-center gap-1">
                          <MdOutlineCategory /> {restaurant.category || "No Category"}
                        </Typography>
                        <Typography variant="body2" className="flex items-center gap-1">
                          <MdPhone /> {restaurant.contactNumber || "No Contact"}
                        </Typography>
                        <Typography variant="body2" className="flex items-center gap-1">
                          <MdAccessTime /> {restaurant.timings || "No timings provided"}
                        </Typography>
                        <Typography variant="body2" className="flex items-center gap-1">
                          <MdLocationOn /> {restaurant.address || "No address provided"}
                        </Typography>
                        <Chip
                          label={restaurant.active ? "Active" : "Inactive"}
                          color={restaurant.active ? "success" : "error"}
                          className="mt-2"
                        />
                      </div>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No restaurants found.
                    </Typography>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <UserFooter />
    </div>
  );
};

export default UserRestaurant;
