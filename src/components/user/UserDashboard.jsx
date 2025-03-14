import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserNavbar } from "./UserNavbar";
import { UserFooter } from "./UserFooter";
import Button from "../../layouts/Button";

export const UserDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem("lastValidPage", window.location.pathname);
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "User") {
      alert("Access Denied! Only Users can access this page.");
      navigate("/unauthorized");
    }
  }, [navigate]);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <UserNavbar />
        {/* Main Content */}
        <div className="min-h-screen flex flex-row justify-between items-center lg:px-32 px-5 bg-[url('./assets/img/hero.jpg')] bg-cover bg-no-repeat">
          <div className="w-full lg:w-2/3 space-y-5">
            <h1 className="text-backgroundColor font-semibold text-6xl">
              Elevate Your Inner Foodie with Every Bite.
            </h1>
            <p className="text-backgroundColor">
              Discover the best restaurants & exclusive deals in your area.
            </p>
            <div className="lg:pl-44">
              <Button title="Order Now" />
            </div>
          </div>
        </div>
        {/* Footer at the Bottom */}
        <UserFooter />
      </div>
    </>
  );
};
