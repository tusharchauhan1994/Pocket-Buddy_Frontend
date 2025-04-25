import { Box, Typography, CircularProgress, Paper, Grid, Card, CardContent, Alert, IconButton } from "@mui/material";
import {
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  LocalOffer as OfferIcon,
  Receipt as OrderIcon,
  Refresh as RefreshIcon,
  TrendingUp as GrowthIcon,
  Money as RevenueIcon
} from '@mui/icons-material';
import AdminSidebar from "./AdminSidebar";
import AdminProtectedRoute from "./AdminProtectedRoute";
import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    restaurants: 0,
    offers: 0,
    activeOffers: 0,
    revenue: 0,
    userGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [offerPerformance, setOfferPerformance] = useState([]);
  const [offerTypeDistribution, setOfferTypeDistribution] = useState([]);

  // Fetch all necessary data for dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch data from existing endpoints
      const [usersRes, restaurantsRes, offersRes] = await Promise.all([
        axios.get("http://localhost:3000/user/all"),
        axios.get("http://localhost:3000/admin/restaurants"),
        axios.get("http://localhost:3000/offer")
      ]);

      // Process stats
      const totalUsers = usersRes.data.data?.length || 0;
      const totalRestaurants = restaurantsRes.data.data?.length || 0;
      const totalOffers = offersRes.data.offers?.length || 0;
      const activeOffers = offersRes.data.offers?.filter(offer => 
        offer.status === 'active'
      ).length || 0;

      // Calculate revenue (mock data based on offers)
      const revenue = activeOffers * 1000; // Example calculation

      // Calculate user growth (last 30 days)
      const userGrowth = usersRes.data.data?.filter(user => {
        const userDate = new Date(user.createdAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return userDate > thirtyDaysAgo;
      }).length || 0;

      setStats({
        users: totalUsers,
        restaurants: totalRestaurants,
        offers: totalOffers,
        activeOffers,
        revenue,
        userGrowth
      });

      // Generate offer performance data (using offers instead of deals)
      const performanceData = offersRes.data.offers?.slice(0, 5).map(offer => ({
        name: offer.title,
        views: Math.floor(Math.random() * 1000), // Mock data
        redemptions: Math.floor(Math.random() * 500), // Mock data
        revenue: Math.floor(Math.random() * 5000) // Mock data
      })) || [];

      setOfferPerformance(performanceData);

      // Generate offer type distribution
      if (offersRes.data.offers) {
        const typeCounts = offersRes.data.offers.reduce((acc, offer) => {
          acc[offer.offer_type] = (acc[offer.offer_type] || 0) + 1;
          return acc;
        }, {});

        setOfferTypeDistribution(
          Object.entries(typeCounts).map(([type, count]) => ({
            name: type,
            value: count
          }))
        );
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error.response?.data?.message || "Failed to fetch dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [refreshCount]);

  const handleRefresh = () => {
    setRefreshCount(prev => prev + 1);
  };

  const StatCard = ({ icon, title, value, color, unit }) => (
    <Card sx={{ minWidth: 200, backgroundColor: color, color: 'white' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4">
              {value}{unit && <small style={{ fontSize: '0.6em', marginLeft: '4px' }}>{unit}</small>}
            </Typography>
          </Box>
          {icon}
        </Box>
      </CardContent>
    </Card>
  );

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <AdminProtectedRoute>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <AdminSidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: '#f9f9f9',
            minHeight: '100%'
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              backgroundColor: 'white',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3
            }}>
              <Typography variant="h4" fontWeight="600">
                Food Deals Dashboard
              </Typography>
              <IconButton 
                onClick={handleRefresh}
                color="primary"
                disabled={loading}
              >
                <RefreshIcon />
              </IconButton>
            </Box>

            {loading && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: 300 
              }}>
                <CircularProgress size={50} />
              </Box>
            )}

            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3 }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            {!loading && !error && (
              <>
                {/* Statistics Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                      icon={<PeopleIcon sx={{ fontSize: 40 }} />}
                      title="Total Users"
                      value={stats.users}
                      color="#3f51b5"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                      icon={<RestaurantIcon sx={{ fontSize: 40 }} />}
                      title="Restaurants"
                      value={stats.restaurants}
                      color="#4caf50"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                      icon={<OfferIcon sx={{ fontSize: 40 }} />}
                      title="Active Offers"
                      value={stats.activeOffers}
                      color="#ff9800"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                      icon={<RevenueIcon sx={{ fontSize: 40 }} />}
                      title="Estimated Revenue"
                      value={formatCurrency(stats.revenue)}
                      color="#e91e63"
                    />
                  </Grid>
                </Grid>

                {/* Charts Section */}
                <Grid container spacing={3}>
                  {/* Offer Performance Chart */}
                  <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, height: '400px' }}>
                      <Typography variant="h6" gutterBottom>
                        Top Performing Offers
                      </Typography>
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart
                          data={offerPerformance}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="redemptions" fill="#8884d8" name="Redemptions" />
                          <Bar dataKey="views" fill="#82ca9d" name="Views" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>

                  {/* Offer Type Distribution */}
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, height: '400px' }}>
                      <Typography variant="h6" gutterBottom>
                        Offer Types
                      </Typography>
                      <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                          <Pie
                            data={offerTypeDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {offerTypeDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>

                  {/* User Growth */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '400px' }}>
                      <Typography variant="h6" gutterBottom>
                        User Growth (Last 30 Days)
                      </Typography>
                      <ResponsiveContainer width="100%" height="90%">
                        <LineChart
                          data={[
                            { name: 'Week 1', users: Math.floor(stats.userGrowth * 0.2) },
                            { name: 'Week 2', users: Math.floor(stats.userGrowth * 0.4) },
                            { name: 'Week 3', users: Math.floor(stats.userGrowth * 0.7) },
                            { name: 'Week 4', users: stats.userGrowth },
                          ]}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="users" stroke="#ff9800" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>

                  {/* Revenue Trend */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '400px' }}>
                      <Typography variant="h6" gutterBottom>
                        Revenue Trend
                      </Typography>
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart
                          data={[
                            { name: 'Jan', revenue: stats.revenue * 0.7 },
                            { name: 'Feb', revenue: stats.revenue * 0.8 },
                            { name: 'Mar', revenue: stats.revenue * 0.9 },
                            { name: 'Apr', revenue: stats.revenue },
                          ]}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
                          <Legend />
                          <Bar dataKey="revenue" fill="#4caf50" name="Revenue" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                </Grid>
              </>
            )}
          </Paper>
        </Box>
      </Box>
    </AdminProtectedRoute>
  );
};

export default AdminDashboard;