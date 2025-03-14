import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { signUpValidation } from "../validation/formValidation";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import signupBg from "../../assets/img/signup_bg.jpg";
import { FaGoogle, FaFacebook, FaTwitter, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("/roles");
        setRoles(response.data.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/user", data);
      if (res.status === 201) {
        alert("User created successfully");
        navigate("/login");
      } else {
        alert("User not created");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-cover bg-center" style={{ backgroundImage: `url(${signupBg})` }}>
      <div className="bg-white/30 backdrop-blur-md p-8 rounded-lg shadow-lg w-96 relative">
        <button onClick={() => navigate(-1)} className="absolute top-2 left-2 text-white text-2xl hover:text-gray-300 transition-all">
          <FaArrowLeft />
        </button>
        <h2 className="text-3xl font-bold text-center text-white mb-2">🔥 Pocket-Buddy 🔥</h2>
        <h3 className="text-xl font-semibold text-center text-white mb-4">Create Your Account</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="block font-medium text-white">First Name</label>
          <input type="text" {...register("firstName", signUpValidation.name)} className="w-full border p-2 rounded mt-1 mb-2 bg-white/80" />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}

          <label className="block font-medium text-white">Last Name</label>
          <input type="text" {...register("lastName", signUpValidation.name)} className="w-full border p-2 rounded mt-1 mb-2 bg-white/80" />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}

          <label className="block font-medium text-white">Email</label>
          <input type="email" {...register("email", signUpValidation.email)} className="w-full border p-2 rounded mt-1 mb-2 bg-white/80" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <label className="block font-medium text-white">Role</label>
          <select {...register("roleId", { required: "Role is required" })} className="w-full border p-2 rounded mt-1 mb-2 bg-white/80">
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>{role.name}</option>
            ))}
          </select>
          {errors.roleId && <p className="text-red-500 text-sm">{errors.roleId.message}</p>}

          <label className="block font-medium text-white">Password</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} {...register("password", signUpValidation.password)} className="w-full border p-2 rounded mt-1 mb-2 bg-white/80 pr-10" />
            <span className="absolute top-3 right-3 cursor-pointer text-gray-600" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <button type="submit" className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-all">Sign Up</button>
        </form>
        <div className="mt-6">
          <p className="text-center text-white mb-2">Or sign up with</p>
          <div className="flex justify-center space-x-4">
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
        </div>
      </div>
    </div>
  );
};
export default Register;