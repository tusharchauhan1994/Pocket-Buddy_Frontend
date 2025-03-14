import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const [lastPage, setLastPage] = useState("/");

  useEffect(() => {
    // Retrieve the last visited page from sessionStorage
    const previousPage = sessionStorage.getItem("lastPage");
    if (previousPage) {
      setLastPage(previousPage);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-xl mt-4">Oops! The page you're looking for does not exist.</p>
      <button
        onClick={() => navigate(lastPage)}
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg"
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFound;
