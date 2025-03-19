import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Box, Typography, CircularProgress, Alert, Chip, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { TextField } from "@mui/material";
import { FaSortAlphaDown, FaSortAlphaUp, FaThLarge, FaList, FaEdit, FaTrash } from "react-icons/fa";
import { MdOutlineCategory, MdPerson, MdPhone, MdAccessTime, MdLocationOn, MdLocalOffer, MdStar } from "react-icons/md";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure styles are included

export default function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("name-asc");
  const [expanded, setExpanded] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [editingId, setEditingId] = useState(null);
  const [editField, setEditField] = useState({});

  useEffect(() => {
    fetchRestaurants();
  }, []);
  
  const fetchRestaurants = async () => {
    try {
      const res = await axios.get("http://localhost:3000/admin/restaurants");
      if (res.data.data && Array.isArray(res.data.data)) {
        const allRestaurants = res.data.data.flatMap(owner =>
          owner.restaurants.map(restaurant => ({ ...restaurant, ownerName: owner.name }))
        );
        setRestaurants(allRestaurants);
      } else {
        setError("Invalid response from server.");
      }
    } catch (error) {
      setError("Failed to fetch restaurants. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this restaurant?")) {
    return;
  }

  try {
    await axios.delete(`http://localhost:3000/location/deleteRestaurant/${id}`);

    toast.success("✅ Restaurant deleted successfully!", { position: "top-right", autoClose: 2000 });

    if (typeof fetchRestaurants === "function") {
      await fetchRestaurants(); // ✅ Ensure the function is available
    } else {
      console.error("❌ fetchRestaurants is not available.");
    }
  } catch (error) {
    toast.error("❌ Failed to delete restaurant!", { position: "top-right", autoClose: 2000 });
    console.error("❌ Error deleting restaurant:", error);
  }
};


  const handleEdit = (id, field, value) => {
    setEditingId(id);
    setEditField({ field, value });
  };

  const handleUpdate = async (id) => {
    if (!window.confirm("Are you sure you want to update this restaurant?")) {
      return;
    }
    
    try {
      await axios.put(`http://localhost:3000/location/updateRestaurant/${id}`, { [editField.field]: editField.value });
  
      toast.success("✅ Updated successfully!", { position: "top-right", autoClose: 2000 });
  
      setEditingId(null);
      
      fetchRestaurants(); // ✅ Now fetchRestaurants is accessible
  
    } catch (error) {
      toast.error("❌ Update failed!", { position: "top-right", autoClose: 2000 });
      console.error("❌ Error updating:", error);
    }
  };
  

  const filteredRestaurants = restaurants.filter((res) => 
    res.title.toLowerCase().includes(search.toLowerCase())
  );
  
  // Now apply sorting after filtering
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (sortType) {
      case "name-asc": return a.title.localeCompare(b.title);
      case "name-desc": return b.title.localeCompare(a.title);
      case "category": return a.category.localeCompare(b.category);
      case "active": return b.active - a.active;
      default: return 0;
    }
  });
  
  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <Box p={3} flexGrow={1}>
        <Typography variant="h6" fontWeight="bold">Manage Restaurants</Typography>
        <div className="flex gap-4 mb-4">
          <TextField placeholder="Search Restaurant..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-1/2" size="small" />
          <Select value={sortType} onChange={(e) => setSortType(e.target.value)} size="small">
            <MenuItem value="name-asc">Sort by Name (A-Z)</MenuItem>
            <MenuItem value="name-desc">Sort by Name (Z-A)</MenuItem>
            <MenuItem value="category">Sort by Category</MenuItem>
            <MenuItem value="active">Sort by Status (Active First)</MenuItem>
          </Select>
          <Button onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? <FaList /> : <FaThLarge />} {viewMode === "grid" ? "List View" : "Grid View"}
          </Button>
        </div>

        {loading && <CircularProgress size={30} sx={{ alignSelf: "center" }} />}
        {error && <Alert severity="error">{error}</Alert>}

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {filteredRestaurants.map((res) => (
              <motion.div key={res._id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card className="relative shadow-md rounded-lg overflow-hidden transition-transform p-2 h-full flex flex-col">
                  <div className="w-full h-40 overflow-hidden relative">
                    <img src={res.imageURL || "https://placehold.co/150"} alt={res.title || "No Title"} className="w-full h-full object-cover rounded-t-md" />
                    <Chip label={res.active ? "Active" : "Inactive"} color={res.active ? "success" : "error"} className="absolute top-2 right-2" />
                  </div>
                  <CardContent className="p-3 flex flex-col flex-grow">
                    <Typography variant="h6" fontWeight="bold" className="mb-1">{res.title || "No Title"}</Typography>
                    <Typography variant="body2" color="textSecondary" className="mb-2 flex items-center gap-2"><MdOutlineCategory /> {res.category || "No Category"}</Typography>
                    <Typography variant="body2" color="textSecondary" className="flex items-center gap-2"><MdPerson /> {res.ownerName || "Unknown"}</Typography>
                    <Button variant="outlined" size="small" className="mt-3" onClick={() => setExpanded(expanded === res._id ? null : res._id)}>
                      {expanded === res._id ? "Hide Details" : "Show More"}
                    </Button>
                    {expanded === res._id && (
                      <div className="mt-3 border-t pt-2">
                        <Typography variant="body2" color="textSecondary" className="flex items-center gap-2"><MdPhone /> {res.contactNumber || "N/A"}</Typography>
                        <Typography variant="body2" color="textSecondary" className="flex items-center gap-2"><MdAccessTime /> {res.timings || "No timings provided"}</Typography>
                        <Typography variant="body2" color="textSecondary" className="flex items-center gap-2"><MdLocationOn /> {res.address || "No address provided"}</Typography>
                        <Typography variant="body2" color="textSecondary" className="flex items-center gap-2"><MdLocalOffer /> {res.offers?.length ? res.offers.join(", ") : "No Offers"}</Typography>
                        <Typography variant="body2" color="textSecondary" className="flex items-center gap-2"><MdStar /> {res.reviews?.length ? res.reviews.map(r => `${r.user}: ${r.comment} (⭐${r.rating})`).join(" | ") : "No Reviews"}</Typography>
                      </div>
                    )}
                    <div className="flex justify-between mt-3">
                      <Button variant="contained" color="primary" size="small"><FaEdit /> Edit</Button>
                      <Button variant="contained" color="error" size="small" onClick={() => handleDelete(res._id)}><FaTrash /> Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Restaurant Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRestaurants.map((res) => (
                <TableRow key={res._id}>
                  <TableCell onClick={() => handleEdit(res._id, "title", res.title)}>
                    {editingId === res._id && editField.field === "title" ? (
                      <TextField value={editField.value} onChange={(e) => setEditField({ ...editField, value: e.target.value })} onBlur={() => handleUpdate(res._id)} autoFocus size="small" />
                    ) : (
                      res.title
                    )}
                  </TableCell>
                  <TableCell onClick={() => handleEdit(res._id, "category", res.category)}>
                    {editingId === res._id && editField.field === "category" ? (
                      <TextField value={editField.value} onChange={(e) => setEditField({ ...editField, value: e.target.value })} onBlur={() => handleUpdate(res._id)} autoFocus size="small" />
                    ) : (
                      res.category
                    )}
                  </TableCell>
                  <TableCell>{res.ownerName}</TableCell>
                  <TableCell onClick={() => handleEdit(res._id, "contactNumber", res.contactNumber)}>
                    {editingId === res._id && editField.field === "contactNumber" ? (
                      <TextField value={editField.value} onChange={(e) => setEditField({ ...editField, value: e.target.value })} onBlur={() => handleUpdate(res._id)} autoFocus size="small" />
                    ) : (
                      res.contactNumber
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="error" size="small" onClick={() => handleDelete(res._id)}><FaTrash /> Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        )}
      </Box>
    </div>
  );
}