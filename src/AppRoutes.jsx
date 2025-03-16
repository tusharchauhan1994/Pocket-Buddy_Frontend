import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoutes from "./hook/PrivateRoutes";
import NotFound from "./components/common/NotFound";

// Guest Pages
import Home from "./components/guest/Home";
import About from "./components/guest/About";
import Menu from "./components/guest/Menu";
import Dishes from "./components/guest/Dishes";
import Review from "./components/guest/Review";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";

// User Pages
import { UserDashboard } from "./components/user/UserDashboard";
import { AddRestaurant } from "./components/restaurant/AddRestaurant";
import UserDishes from "./components/user/UserDishes";
import UserAbout from "./components/user/UserAbout";
import UserMenu from "./components/user/UserMenu";
import UserReview from "./components/user/UserReview";

// Restaurant Pages
import { ViewMyRestaurant } from "./components/restaurant/ViewMyRestaurant";
import { UpdateMyRestaurant } from "./components/restaurant/UpdateMyRestaurant";
import AddOffer from "./components/restaurant/AddOffer";
import { RestaurantDashboard } from "./components/restaurant/RestaurantDashboard";
import Unauthorized from "./components/pages/Unauthorized";
import  AdminDashboard  from "./components/admin/AdminDashboard";
import AdminUsers from "./components/admin/AdminUsers";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/dishes" element={<Dishes />} />
      <Route path="/about" element={<About />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/review" element={<Review />} />
      <Route path="*" element={<NotFound />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoutes />}>
        {/* User Routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/dishes" element={<UserDishes />} />
        <Route path="/user/about" element={<UserAbout />} />
        <Route path="/user/menu" element={<UserMenu />} />
        <Route path="/user/review" element={<UserReview />} />

        {/* Restaurant Routes */}
        <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
        <Route path="/restaurant/addOffer" element={<AddOffer />} />
        <Route path="/restaurant/addRestaurant" element={<AddRestaurant />} />
        <Route path="/restaurant/myRestaurant" element={<ViewMyRestaurant />} />
        <Route
          path="/restaurant/updateRestaurant/:id"
          element={<UpdateMyRestaurant />}
        />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users/" element={<AdminUsers />} />


        {/* Unauthorized Route */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
