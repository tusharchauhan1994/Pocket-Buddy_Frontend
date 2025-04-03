import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  BiRestaurant, 
  BiSolidOffer, 
  BiUser,
  BiHomeAlt,
  BiFoodMenu,
  BiListPlus,
  BiStar,
  BiCog
} from "react-icons/bi";
import { 
  AiOutlineLogout, 
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlinePlus,
  AiOutlineShop
} from "react-icons/ai";
import { MdOutlineRateReview, MdOutlineRequestQuote } from "react-icons/md";

export const RestaurantSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen h-full">
      <aside
        className={`bg-gray-900 text-white transition-all fixed top-0 left-0 duration-300 overflow-y-auto ${
          isOpen ? "w-64" : "w-20"
        } min-h-screen overflow-y-auto relative z-50`}
      >
        {/* Sidebar Header */}
        <div className="p-5 text-xl font-bold border-b border-gray-700 flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center gap-2">
              <BiRestaurant size={24} className="text-red-400" />
              <span>Pocket Buddy</span>
            </div>
          )}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-white hover:text-red-400 transition-colors"
          >
            {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="mt-5 flex flex-col gap-1 p-4">
          <Link
            to="/restaurant/dashboard"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isActive("/restaurant/dashboard")
                ? "bg-red-500 text-white"
                : "hover:bg-gray-700 text-gray-300"
            }`}
          >
            <BiHomeAlt size={20} className="flex-shrink-0" />
            {isOpen && <span>Dashboard</span>}
          </Link>

          <Link
            to="/restaurant/ManageOfferRequests"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isActive("/restaurant/ManageOfferRequests")
                ? "bg-red-500 text-white"
                : "hover:bg-gray-700 text-gray-300"
            }`}
          >
            <MdOutlineRequestQuote size={20} className="flex-shrink-0" />
            {isOpen && <span>Offer Requests</span>}
          </Link>

          <Link
            to="/restaurant/addRestaurant"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isActive("/restaurant/addRestaurant")
                ? "bg-red-500 text-white"
                : "hover:bg-gray-700 text-gray-300"
            }`}
          >
            <AiOutlinePlus size={20} className="flex-shrink-0" />
            {isOpen && <span>Add Restaurant</span>}
          </Link>

          <Link
            to="/restaurant/myRestaurant"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isActive("/restaurant/myRestaurant")
                ? "bg-red-500 text-white"
                : "hover:bg-gray-700 text-gray-300"
            }`}
          >
            <AiOutlineShop size={20} className="flex-shrink-0" />
            {isOpen && <span>My Restaurants</span>}
          </Link>

          <Link
            to="/restaurant/myOffers"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isActive("/restaurant/myOffers")
                ? "bg-red-500 text-white"
                : "hover:bg-gray-700 text-gray-300"
            }`}
          >
            <BiFoodMenu size={20} className="flex-shrink-0" />
            {isOpen && <span>My Offers</span>}
          </Link>

          <Link
            to="/restaurant/addOffer"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isActive("/restaurant/addOffer")
                ? "bg-red-500 text-white"
                : "hover:bg-gray-700 text-gray-300"
            }`}
          >
            <BiListPlus size={20} className="flex-shrink-0" />
            {isOpen && <span>Add Offer</span>}
          </Link>

          <Link
            to="/restaurant/reviews"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isActive("/restaurant/reviews")
                ? "bg-red-500 text-white"
                : "hover:bg-gray-700 text-gray-300"
            }`}
          >
            <MdOutlineRateReview size={20} className="flex-shrink-0" />
            {isOpen && <span>Reviews</span>}
          </Link>

          <Link
            to="/restaurant/profile"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isActive("/restaurant/profile")
                ? "bg-red-500 text-white"
                : "hover:bg-gray-700 text-gray-300"
            }`}
          >
            <BiUser size={20} className="flex-shrink-0" />
            {isOpen && <span>Profile</span>}
          </Link>

          <Link
            to="/restaurant/settings"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isActive("/restaurant/settings")
                ? "bg-red-500 text-white"
                : "hover:bg-gray-700 text-gray-300"
            }`}
          >
            <BiCog size={20} className="flex-shrink-0" />
            {isOpen && <span>Settings</span>}
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-gray-700 mt-4 transition-colors"
          >
            <AiOutlineLogout size={20} className="flex-shrink-0" />
            {isOpen && <span>Logout</span>}
          </button>
        </nav>
      </aside>
    </div>
  );
};

export default RestaurantSidebar;