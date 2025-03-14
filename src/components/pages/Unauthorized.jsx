import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1); // ✅ Only go back if history exists
    } else {
      navigate("/"); // ✅ Go to home if no history
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-red-500">Access Denied!</h1>
      <p className="text-lg">You do not have permission to view this page.</p>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleGoBack}
      >
        Go Back
      </button>
    </div>
  );
};

export default Unauthorized;
