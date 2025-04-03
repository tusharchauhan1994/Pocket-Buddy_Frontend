import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { Loader } from "../common/Loader";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [token, setToken] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    
    if (!tokenFromUrl) {
      toast.error("Invalid or missing reset token");
      navigate("/forgot-password");
      return;
    }

    // Basic token validation
    if (tokenFromUrl && tokenFromUrl.length > 30) {
      setToken(tokenFromUrl);
      setIsValidToken(true);
    } else {
      toast.error("Invalid reset token format");
      navigate("/forgot-password");
    }
  }, [searchParams, navigate]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        "http://localhost:3000/user/reset-password", // Full URL to avoid confusion
        {
          token: token,
          password: data.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.response?.data?.message || "Failed to reset password");
      if (error.response?.status === 401) {
        navigate("/forgot-password");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="relative flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] sm:w-[400px] text-center">
          <h2 className="text-2xl font-bold text-center mb-4">Invalid Link</h2>
          <p className="mb-4">The password reset link is invalid or has expired.</p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-all text-sm"
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

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
              autoComplete="new-password"
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
              autoComplete="new-password"
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
            {isSubmitting ? "Processing..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;