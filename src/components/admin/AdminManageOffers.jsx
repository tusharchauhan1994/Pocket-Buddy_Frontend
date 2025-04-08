import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  IconButton, 
  Tooltip,
  Paper,
  Chip,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  Avatar
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  LocalOffer as OfferIcon,
  CalendarToday as CalendarIcon,
  Percent as PercentIcon,
  Description as DescriptionIcon,
  Title as TitleIcon
} from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminManageOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get("http://localhost:3000/offer");
      
      if (Array.isArray(data.offers)) {
        setOffers(data.offers.map(offer => ({
          ...offer,
          id: offer._id
        })));
      } else {
        console.error("Unexpected API response format:", data);
        setOffers([]);
        setError("Invalid data format received from server");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.response?.data?.message || "Failed to fetch offers. Please try again.");
      toast.error("Failed to fetch offers", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (offerId) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    
    try {
      await axios.delete(`http://localhost:3000/offer/${offerId}`);
      setOffers(prev => prev.filter(offer => offer.id !== offerId));
      toast.success("Offer deleted successfully", { position: "top-right" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete offer", { position: "top-right" });
    }
  };

  const handleEditClick = (offer) => {
    setCurrentOffer(offer);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleAddClick = () => {
    setCurrentOffer({
      title: "",
      description: "",
      discount_value: "",
      valid_from: "",
      valid_to: "",
      status: "active"
    });
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentOffer(null);
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await axios.put(`http://localhost:3000/offer/${currentOffer.id}`, currentOffer);
        toast.success("Offer updated successfully", { position: "top-right" });
      } else {
        await axios.post("http://localhost:3000/offer", currentOffer);
        toast.success("Offer created successfully", { position: "top-right" });
      }
      fetchOffers();
      handleDialogClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed", { position: "top-right" });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return "Invalid date";
    }
  };

  const filteredOffers = offers.filter(offer => 
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      field: "title", 
      headerName: "Title", 
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 32, height: 32 }}>
            <TitleIcon fontSize="small" />
          </Avatar>
          {params.value}
        </Box>
      )
    },
    { 
      field: "description", 
      headerName: "Description", 
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DescriptionIcon color="action" sx={{ mr: 1 }} />
          {params.value || "No description"}
        </Box>
      )
    },
    { 
      field: "discount_value", 
      headerName: "Discount", 
      flex: 1,
      renderCell: (params) => (
        <Chip
          icon={<PercentIcon />}
          label={`${params.value}%`}
          color="success"
          variant="outlined"
        />
      )
    },
    {
      field: "valid_from",
      headerName: "Start Date",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarIcon color="action" sx={{ mr: 1 }} />
          {formatDate(params.row.valid_from)}
        </Box>
      )
    },
    {
      field: "valid_to",
      headerName: "End Date",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarIcon color="action" sx={{ mr: 1 }} />
          {formatDate(params.row.valid_to)}
        </Box>
      )
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "active" ? "success" : "error"}
          size="small"
        />
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton 
              color="primary" 
              onClick={() => handleEditClick(params.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton 
              color="error" 
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h5" fontWeight="bold">
              <OfferIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Manage Offers
            </Typography>
            <Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddClick}
                sx={{ mr: 2 }}
              >
                Add Offer
              </Button>
              <IconButton onClick={fetchOffers}>
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>

          <TextField
            fullWidth
            placeholder="Search offers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <OfferIcon color="action" sx={{ mr: 1 }} />
              )
            }}
          />

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={50} />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {!loading && !error && (
            <Box sx={{ height: 600 }}>
              <DataGrid
                rows={filteredOffers}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 25]}
                disableSelectionOnClick
                sx={{
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f5f5f5',
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #f0f0f0',
                  },
                }}
              />
            </Box>
          )}

          {!loading && !error && offers.length === 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: 300,
              flexDirection: 'column',
              color: 'text.secondary'
            }}>
              <OfferIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No offers found
              </Typography>
              <Typography variant="body2">
                Try adding a new offer or check your connection
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? "Edit Offer" : "Add New Offer"}
        </DialogTitle>
        <DialogContent dividers>
          {currentOffer && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                label="Title"
                fullWidth
                value={currentOffer.title}
                onChange={(e) => setCurrentOffer({...currentOffer, title: e.target.value})}
                margin="normal"
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={currentOffer.description}
                onChange={(e) => setCurrentOffer({...currentOffer, description: e.target.value})}
                margin="normal"
              />
              <TextField
                label="Discount Value (%)"
                type="number"
                fullWidth
                value={currentOffer.discount_value}
                onChange={(e) => setCurrentOffer({...currentOffer, discount_value: e.target.value})}
                margin="normal"
              />
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={currentOffer.valid_from}
                onChange={(e) => setCurrentOffer({...currentOffer, valid_from: e.target.value})}
                margin="normal"
              />
              <TextField
                label="End Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={currentOffer.valid_to}
                onChange={(e) => setCurrentOffer({...currentOffer, valid_to: e.target.value})}
                margin="normal"
              />
              <Select
                label="Status"
                fullWidth
                value={currentOffer.status}
                onChange={(e) => setCurrentOffer({...currentOffer, status: e.target.value})}
                margin="dense"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminManageOffers;