import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { signUpValidation } from "../validation/formValidation";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import signupBg from "../../assets/img/signup_bg.jpg";
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

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/roles");
        setRoles(response.data.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
      setIsLoading(false);
    };
    fetchRoles();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post("/user", data);
      if (res.status === 201) {
        toast.success("User created successfully");
        navigate("/login");
      } else {
        toast.error("User not created");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error("Signup failed");
    } finally {
      setIsLoading(false); // Ensures loading state is reset in all cases
    }
  };

  return (
    <div
      className="relative flex justify-center items-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${signupBg})` }}
    >
      {/* ✅ Full-Screen Loader Overlay */}
      {(isLoading || isSubmitting) && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-lg z-50">
          <Loader />
        </div>
      )}

      {/* ✅ Smaller, Centered Form Container */}
      <div className="bg-white/30 backdrop-blur-md p-6 rounded-lg shadow-lg w-[350px] sm:w-[400px] relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-2 left-2 text-white text-2xl hover:text-gray-300 transition-all"
        >
          <FaArrowLeft />
        </button>
        <h2 className="text-2xl font-bold text-center text-white mb-1">
          🔥 Pocket-Buddy 🔥
        </h2>
        <h3 className="text-lg font-semibold text-center text-white mb-3">
          Create Your Account
        </h3>

        {/* ✅ Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ✅ First Name & Last Name Side by Side */}
          <div className="grid grid-cols-2 gap-2">
            {/* First Name */}
            <div>
              <label className="block font-medium text-white text-sm">
                First Name
              </label>
              <input
                type="text"
                {...register("firstName", signUpValidation.name)}
                className="w-full border p-2 rounded bg-white/80 text-sm"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block font-medium text-white text-sm">
                Last Name
              </label>
              <input
                type="text"
                {...register("lastName", signUpValidation.name)}
                className="w-full border p-2 rounded bg-white/80 text-sm"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <label className="block font-medium text-white text-sm mt-2">
            Email
          </label>
          <input
            type="email"
            {...register("email", signUpValidation.email)}
            className="w-full border p-2 rounded bg-white/80 text-sm"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}

          {/* Role Selection */}
          <label className="block font-medium text-white text-sm mt-2">
            Role
          </label>
          <select
            {...register("roleId", { required: "Role is required" })}
            className="w-full border p-2 rounded bg-white/80 text-sm"
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.name}
              </option>
            ))}
          </select>
          {errors.roleId && (
            <p className="text-red-500 text-xs">{errors.roleId.message}</p>
          )}

          {/* Password */}
          <label className="block font-medium text-white text-sm mt-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", signUpValidation.password)}
              className="w-full border p-2 rounded bg-white/80 pr-10 text-sm"
            />
            <span
              className="absolute top-3 right-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-all text-sm"
            disabled={isSubmitting}
          >
            Sign Up
          </button>
        </form>

        {/* ✅ Login Redirect */}
        <p className="mt-3 text-center text-xs text-black">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-300 hover:underline">
            Login
          </Link>
        </p>

        {/* ✅ Social Signup Section */}
        <div className="mt-4">
          <p className="text-center text-white text-xs mb-2">Or sign up with</p>
          <div className="flex justify-center space-x-3">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-200 transition">
              <FaGoogle className="text-red-500 text-lg" />
            </button>
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-200 transition">
              <FaFacebook className="text-blue-600 text-lg" />
            </button>
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-200 transition">
              <FaTwitter className="text-blue-400 text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
