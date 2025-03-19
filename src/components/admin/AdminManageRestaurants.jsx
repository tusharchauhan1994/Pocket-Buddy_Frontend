import { Box, Typography, CircularProgress, Alert, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import AdminSidebar from "./AdminSidebar";

export const ManageRestaurants = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});

  const getAllRestaurantOwners = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/admin/restaurants");

      console.log("🔥 API Response:", res.data);

      if (res.data.data && Array.isArray(res.data.data)) {
        setOwners(res.data.data);
      } else {
        setError("Invalid response from server.");
      }
    } catch (error) {
      console.error("❌ Error fetching restaurant owners:", error);
      setError("Failed to fetch restaurant owners. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllRestaurantOwners();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <Box p={3} flexGrow={1} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Manage Restaurants
        </Typography>

        {loading && <CircularProgress size={30} sx={{ alignSelf: "center" }} />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && owners.length > 0 && (
          <DataGrid
            rows={owners}
            columns={[
              { field: "firstName", headerName: "Owner First Name", flex: 1 },
              { field: "lastName", headerName: "Owner Last Name", flex: 1 },
              { field: "email", headerName: "Email", flex: 1 },
              {
                field: "actions",
                headerName: "Actions",
                renderCell: (params) => (
                  <IconButton
                    onClick={() =>
                      setExpandedRows((prev) => ({
                        ...prev,
                        [params.row._id]: !prev[params.row._id],
                      }))
                    }
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                ),
              },
            ]}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            sx={{
              minHeight: 400,
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: 1,
            }}
            getRowId={(row) => row._id}
          />
        )}

        {!loading && !error && owners.length === 0 && (
          <Typography variant="h6" mt={3} color="gray" textAlign="center">
            No restaurant owners found.
          </Typography>
        )}

        {/* Expandable Restaurant List */}
        {owners.map((owner) => (
          <Collapse in={expandedRows[owner._id] || false} key={owner._id} sx={{ mt: 2 }}>
            <Box p={2} bgcolor="#f5f5f5" borderRadius={2}>
              <Typography variant="h6" fontWeight="bold">
                Restaurants of {owner.firstName} {owner.lastName}
              </Typography>

              {/* ✅ Check if restaurants exist before rendering DataGrid */}
              {owner.restaurants && owner.restaurants.length > 0 ? (
                <DataGrid
                  rows={owner.restaurants} // ✅ Ensure restaurants are passed here
                  columns={[
                    { field: "title", headerName: "Restaurant Name", flex: 1 },
                    { field: "category", headerName: "Category", flex: 1 }, // ✅ Added category
                    { field: "description", headerName: "Description", flex: 2 }, // ✅ Added description
                    { field: "timings", headerName: "Timings", flex: 1 }, // ✅ Added opening hours
                    { field: "contactNumber", headerName: "Contact", flex: 1 }, // ✅ Added contact number
                    { field: "address", headerName: "Address", flex: 1 },
                    { field: "status", headerName: "Status", flex: 1 },
                    {
                      field: "imageURL",
                      headerName: "Image",
                      flex: 1,
                      renderCell: (params) => (
                        params.value ? (
                          <img
                            src={params.value}
                            alt="Restaurant"
                            style={{ width: 50, height: 50, borderRadius: 8 }}
                          />
                        ) : (
                          "No Image"
                        )
                      ),
                    },
                    {
                      field: "contactNumber",
                      headerName: "Contact Number",
                      flex: 1,
                    },
                    
                    
                  ]}
                  pageSize={3}
                  rowsPerPageOptions={[3, 5]}
                  sx={{ mt: 2, backgroundColor: "#fff", borderRadius: 2 }}
                  getRowId={(row) => row._id}
                />
              ) : (
                <Typography color="gray" textAlign="center" mt={1}>
                  No restaurants found.
                </Typography>
              )}
            </Box>
          </Collapse>
        ))}
      </Box>
    </div>
  );
};

export default ManageRestaurants;
