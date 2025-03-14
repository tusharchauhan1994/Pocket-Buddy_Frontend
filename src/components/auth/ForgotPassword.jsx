import React from "react";
import { useForm } from "react-hook-form";
import { forgotPasswordValidation } from "../validation/formValidation";
import { useNavigate, Link } from "react-router-dom";
import loginBg from "../../assets/img/login_bg.jpg";
import { FaArrowLeft } from "react-icons/fa";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => console.log("Reset Password Request:", data);

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="bg-white/30 backdrop-blur-md p-8 rounded-lg shadow-lg w-96 relative">
        {/* Back Arrow Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-2 left-2 text-white text-2xl hover:text-gray-300 transition-all"
        >
          <FaArrowLeft />
        </button>

        <h3 className="text-2xl font-bold mb-4 text-center text-white">
          Forgot Password
        </h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="block font-medium text-white">Email</label>
          <input
            type="email"
            {...register("email", forgotPasswordValidation.email)}
            className="w-full border p-2 rounded mt-1 mb-2 bg-white/80"
            placeholder="Enter your registered email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-all"
          >
            Reset Password
          </button>

          <p className="mt-3 text-center text-sm text-white">
            Remember your password?{" "}
            <Link to="/login" className="text-blue-300 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
