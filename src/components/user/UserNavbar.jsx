import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BiRestaurant,
  BiChevronDown,
  BiSearch,
  BiHeart,
  BiUser,
  BiLogOut,
} from "react-icons/bi";
import { AiOutlineMenuUnfold, AiOutlineClose } from "react-icons/ai";

export const UserNavbar = ({ setSearchQuery }) => {
  const [menu, setMenu] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [search, setSearch] = useState("");

  let profileTimeout;

  const handleChange = () => setMenu(!menu);
  const closeMenu = () => setMenu(false);

  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    alert("You are logged out");
    window.location.href = "/login";
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(search); // Update search results dynamically
  };

  return (
    <header className="fixed top-0 w-full bg-white shadow-md z-50 h-18">
      <div className="flex justify-between items-center p-5 md:px-32 px-5">
        {/* Logo */}
        <Link
          to="/user/dashboard"
          className="flex items-center gap-2 cursor-pointer"
        >
          <BiRestaurant size={32} />
          <h1 className="text-xl font-semibold">Pocket-Buddy</h1>
        </Link>

        {/* Search Bar */}
        <form
          className="hidden w-[30%] md:flex items-center border border-gray-300 rounded-lg px-3 py-1"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search offers..."
            className="outline-none bg-transparent flex-grow"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="text-gray-500 ml-2">
            <BiSearch size={20} />
          </button>
        </form>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-lg font-medium">
          <Link
            to="/user/dashboard"
            className="hover:text-red-500 transition-all"
          >
            Home
          </Link>
          <Link to="/user/offers" className="hover:text-red-500 transition-all">
            Offers
          </Link>
          <Link
            to="/user/MyRequests"
            className="hover:text-red-500 transition-all"
          >
            My Requests
          </Link>
          <Link
            to="/user/restaurants"
            className="hover:text-red-500 transition-all"
          >
            Restaurants
          </Link>
          <Link to="/user/review" className="hover:text-red-500 transition-all">
            Reviews
          </Link>

          {/* Profile Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => {
              clearTimeout(profileTimeout);
              setProfileDropdown(true);
            }}
            onMouseLeave={() => {
              profileTimeout = setTimeout(() => setProfileDropdown(false), 500);
            }}
          >
            <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
              <BiUser size={20} />
            </button>
            {profileDropdown && (
              <ul className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
                {/* <li>
                  <Link
                    to="/user/favorites/restaurants"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-red-100 hover:text-red-500 transition-all duration-200"
                  >
                    <BiHeart size={20} className="text-red-500" />
                    Restaurants
                  </Link>
                </li> */}
                <li>
                  <Link
                    to="/user/favorites/offers"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-red-100 hover:text-red-500 transition-all duration-200"
                  >
                    <BiHeart size={18} className="text-red-500" />
                    Offers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/profile"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-red-100 hover:text-red-500 transition-all duration-200"
                  >
                    <BiUser size={18} className="text-blue-500" />
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-red-100 hover:text-red-500 transition-all duration-200"
                  >
                    <BiLogOut size={18} className="text-gray-500" />
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-xl focus:outline-none"
          onClick={handleChange}
          aria-label="Toggle Menu"
        >
          {menu ? (
            <AiOutlineClose size={25} />
          ) : (
            <AiOutlineMenuUnfold size={25} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menu && (
        <div className="fixed top-[60px] left-0 w-full bg-black text-white flex flex-col items-center gap-4 py-6 text-center">
          <Link
            to="/user/dashboard"
            onClick={closeMenu}
            className="hover:text-gray-400"
          >
            Home
          </Link>
          <Link
            to="/user/offers"
            onClick={closeMenu}
            className="hover:text-gray-400"
          >
            Buy Offers
          </Link>
          <Link
            to="/user/restaurants"
            onClick={closeMenu}
            className="hover:text-gray-400"
          >
            Restaurants
          </Link>
          <Link
            to="/user/review"
            onClick={closeMenu}
            className="hover:text-gray-400"
          >
            Reviews
          </Link>
          <Link
            to="/user/profile"
            onClick={closeMenu}
            className="hover:text-gray-400"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded w-1/2"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default UserNavbar;
