import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import loginBg from "../../assets/img/login_bg.jpg";
import {
  FaGoogle,
  FaFacebook,
  FaTwitter,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
} from "react-icons/fa";
import { Loader } from "../common/Loader";
import { toast } from "react-toastify";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post("/user/login", data);
      if (res.status === 200) {
        toast.success("Login Success");
        const userData = res.data.data;
        localStorage.setItem("id", userData._id);
        localStorage.setItem("role", userData.roleId.name);

        if (userData.roleId.name === "User") {
          navigate("/user/dashboard");
        } else if (userData.roleId.name === "Restaurant") {
          navigate("/restaurant/dashboard");
        } else if (userData.roleId.name === "Admin") {
          navigate("/admin/dashboard");
        }
      } else {
        toast.error("Login Failed");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Invalid Credentials");
    } finally {
      setIsLoading(false); // Ensures loading state is reset in all cases
    }
  };

  return (
    <div
      className="relative flex justify-center items-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {isLoading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-lg z-50">
          <Loader />
        </div>
      )}
      <div className="bg-white/30 backdrop-blur-md p-8 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-2 left-2 text-white text-2xl hover:text-gray-300 transition-all"
        >
          <FaArrowLeft />
        </button>
        <h2 className="text-3xl font-bold text-center text-white mb-4">
          🔥Pocket-Buddy🔥 Sign In
        </h2>
        <div className="flex justify-center space-x-4 mb-4">
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-200 transition">
            <FaGoogle className="text-red-500 text-xl" />
          </button>
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-200 transition">
            <FaFacebook className="text-blue-600 text-xl" />
          </button>
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-200 transition">
            <FaTwitter className="text-blue-400 text-xl" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="block font-medium text-white">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full border p-2 rounded mt-1 mb-2 bg-white/80"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <label className="block font-medium text-white">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required" })}
              className="w-full border p-2 rounded mt-1 mb-2 bg-white/80"
            />
            <button
              type="button"
              className="absolute right-2 top-3 text-gray-600"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          <div className="flex justify-between items-center mt-2 text-sm text-white">
            <div>
              <input type="checkbox" id="rememberMe" className="mr-1" />
              <label htmlFor="rememberMe">Remember Me</label>
            </div>
            <Link
              to="/forgot-password"
              className="text-blue-300 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-all"
          >
            Sign In
          </button>
          <p className="mt-3 text-center text-sm text-black">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-300 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
export default Login;
