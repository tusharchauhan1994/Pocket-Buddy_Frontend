import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { Loader } from "../common/Loader";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  // const { token } = useParams();
  console.log("Token from URL:", token);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post(`/auth/reset-password/${token}`, data);
      if (res.status === 200) {
        toast.success("Password reset successfully");
        navigate("/login");
      } else {
        toast.error("Failed to reset password");
      }
    } catch (error) {
      console.error("Reset Password Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen bg-gray-100">
      {isSubmitting && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <Loader />
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] sm:w-[400px] relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-2 left-2 text-gray-700 text-2xl hover:text-gray-500"
        >
          <FaArrowLeft />
        </button>
        <h2 className="text-2xl font-bold text-center mb-2">Reset Password</h2>
        <p className="text-center text-sm text-gray-600 mb-4">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* New Password */}
          <label className="block font-medium text-sm">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full border p-2 rounded bg-gray-100 text-sm pr-10"
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

          {/* Confirm Password */}
          <label className="block font-medium text-sm mt-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              className="w-full border p-2 rounded bg-gray-100 text-sm pr-10"
            />
            <span
              className="absolute top-3 right-3 cursor-pointer text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}

          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-all text-sm"
            disabled={isSubmitting}
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
