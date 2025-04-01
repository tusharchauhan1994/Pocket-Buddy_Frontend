import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert, IconButton, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AdminManageOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("http://localhost:3000/offer");
        console.log("API Response:", JSON.stringify(data, null, 2)); // Debugging
  
        if (Array.isArray(data.offers)) {
          setOffers(data.offers);
        } else {
          console.error("Unexpected API response format:", data);
          setOffers([]);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to fetch offers. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchOffers();
  }, []);
  
  const handleDelete = async (offerId) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;

    try {
      await axios.delete(`http://localhost:3000/offer/${offerId}`);
      setOffers((prev) => prev.filter((offer) => offer._id !== offerId));
    } catch (error) {
      alert("Failed to delete offer. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US");
  };

  const columns = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "discount_value", headerName: "Discount Value", flex: 1 },
    {
      field: "valid_from",
      headerName: "Start Date",
      flex: 1,
      valueGetter: (params) => {
        console.log("Start Date:", params.row?.valid_from);
        return params.row?.valid_from ? formatDate(params.row.valid_from) : "N/A";
      },
    },
    {
      field: "valid_to",
      headerName: "End Date",
      flex: 1,
      valueGetter: (params) => {
        console.log("End Date:", params.row?.valid_to);
        return params.row?.valid_to ? formatDate(params.row.valid_to) : "N/A";
      },
    },
    
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit">
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => handleDelete(params.row._id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];
  

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <AdminSidebar />
      <Box p={3} flexGrow={1} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Manage Offers
        </Typography>
        <Typography variant="subtitle1" color="gray">
          Total Offers: {offers.length}
        </Typography>

        {loading && <CircularProgress size={30} sx={{ alignSelf: "center" }} />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && offers.length > 0 && (
          <Box sx={{ flexGrow: 1, height: "100%", minHeight: 500 }}>
          <DataGrid
            rows={offers}
            columns={columns}
            pageSize={5}
            autoHeight
            rowsPerPageOptions={[5, 10]}
            checkboxSelection
            sx={{ backgroundColor: "#fff", borderRadius: 2, boxShadow: 1 }}
            getRowId={(row) => row._id}
          />
        </Box>
        
        )}

        {!loading && !error && offers.length === 0 && (
          <Typography variant="h6" mt={3} color="gray" textAlign="center">
            No offers found.
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default AdminManageOffers;
