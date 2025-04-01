import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BiRestaurant, BiSolidOffer, BiUser } from "react-icons/bi";
import { AiOutlineLogout, AiOutlineMenu } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";

export const RestaurantSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    console.log("User logged out");
    alert("You are logged out");
    navigate("/login");
  };

  // Function to check active link
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen ">
      {/* Sidebar Component */}
      <aside
        className={`bg-gray-900 text-white transition-all fixed top-0 left-0 duration-300 overflow-y-auto ${
          isOpen ? "w-64" : "w-20"
        } min-h-screen overflow-y-auto relative`}
      >
        {/* Sidebar Header */}
        <div className="p-5 text-xl font-bold border-b border-gray-700 flex items-center justify-between">
          {isOpen && <span>Pocket Buddy</span>}
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <IoMdClose size={24} /> : <AiOutlineMenu size={24} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="mt-5 flex flex-col gap-4 p-5">
          {/* Dashboard Link */}
          <Link
            to="/restaurant/dashboard"
            className={`flex items-center gap-3 p-2 rounded border-l-4 ${
              isActive("/restaurant/dashboard")
                ? "border-red-400 bg-gray-700"
                : "border-transparent hover:bg-gray-700"
            }`}
          >
            <BiRestaurant size={20} /> {isOpen && "Dashboard"}
          </Link>

          {/* Manage Offer Requests */}
          <Link
            to="/restaurant/ManageOfferRequests"
            className={`flex items-center gap-3 p-2 rounded border-l-4 ${
              isActive("/restaurant/ManageOfferRequests")
                ? "border-red-400 bg-gray-700"
                : "border-transparent hover:bg-gray-700"
            }`}
          >
            <BiRestaurant size={20} /> {isOpen && "Offer Requests"}
          </Link>

          {/* Add Restaurant Link */}
          <Link
            to="/restaurant/addRestaurant"
            className={`flex items-center gap-3 p-2 rounded border-l-4 ${
              isActive("/restaurant/addRestaurant")
                ? "border-red-400 bg-gray-700"
                : "border-transparent hover:bg-gray-700"
            }`}
          >
            <BiRestaurant size={20} /> {isOpen && "Add Restaurant"}
          </Link>

          {/* My Restaurant Link */}
          <Link
            to="/restaurant/myRestaurant"
            className={`flex items-center gap-3 p-2 rounded border-l-4 ${
              isActive("/restaurant/myRestaurant")
                ? "border-red-400 bg-gray-700"
                : "border-transparent hover:bg-gray-700"
            }`}
          >
            <BiRestaurant size={20} /> {isOpen && "My Restaurant"}
          </Link>

          {/* My Offers Link */}
          <Link
            to="/restaurant/myOffers"
            className={`flex items-center gap-3 p-2 rounded border-l-4 ${
              isActive("/restaurant/myOffers")
                ? "border-red-400 bg-gray-700"
                : "border-transparent hover:bg-gray-700"
            }`}
          >
            <BiSolidOffer size={20} /> {isOpen && "My Offers"}
          </Link>

          {/* Add Offer Link */}
          <Link
            to="/restaurant/addOffer"
            className={`flex items-center gap-3 p-2 rounded border-l-4 ${
              isActive("/restaurant/addOffer")
                ? "border-red-400 bg-gray-700"
                : "border-transparent hover:bg-gray-700"
            }`}
          >
            <BiSolidOffer size={20} /> {isOpen && "Add Offer"}
          </Link>

          {/* Reviews Link */}
          <Link
            to="/restaurant/reviews"
            className={`flex items-center gap-3 p-2 rounded border-l-4 ${
              isActive("/restaurant/reviews")
                ? "border-red-400 bg-gray-700"
                : "border-transparent hover:bg-gray-700"
            }`}
          >
            <BiUser size={20} /> {isOpen && "Reviews"}
          </Link>

          {/* Profile Link */}
          <Link
            to="/restaurant/profile"
            className={`flex items-center gap-3 p-2 rounded border-l-4 ${
              isActive("/restaurant/profile")
                ? "border-red-400 bg-gray-700"
                : "border-transparent hover:bg-gray-700"
            }`}
          >
            <BiUser size={20} /> {isOpen && "Profile"}
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-2 text-red-400 hover:bg-gray-700 rounded border-l-4 border-transparent"
          >
            <AiOutlineLogout size={20} /> {isOpen && "Logout"}
          </button>
        </nav>
      </aside>
    </div>
  );
};

export default RestaurantSidebar;
