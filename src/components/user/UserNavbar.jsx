import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiRestaurant, BiChevronDown } from "react-icons/bi";
import { AiOutlineMenuUnfold, AiOutlineClose } from "react-icons/ai";

export const UserNavbar = () => {
  const [menu, setMenu] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const navigate = useNavigate();

  let dishesTimeout, profileTimeout;

  const handleChange = () => setMenu(!menu);
  const closeMenu = () => setMenu(false);

  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    console.log("User logged out");
    alert("you are logged out");
    navigate("/login");
  };

  return (
    <header className="fixed w-full bg-white shadow-md z-50">
      <div className="flex justify-between items-center p-5 md:px-32 px-5">
        {/* Logo */}
        <Link to="/user/dashboard" className="flex items-center gap-2 cursor-pointer">
          <BiRestaurant size={32} />
          <h1 className="text-xl font-semibold">Pocket-Buddy</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-lg font-medium">
          <Link to="/user/dashboard" className="hover:text-red-500 transition-all">
            Home
          </Link>

          {/* Dropdown Menu for Dishes */}
          <div
            className="relative"
            onMouseEnter={() => {
              clearTimeout(dishesTimeout); // Clear timeout if user hovers again
              setDropdown(true);
            }}
            onMouseLeave={() => {
              dishesTimeout = setTimeout(() => setDropdown(false), 500); // 0.5s delay
            }}
          >
            <div className="flex items-center gap-1 cursor-pointer">
              <Link to="/user/dishes" className="hover:text-red-500 transition-all">
                Dishes
              </Link>
              <BiChevronDown size={20} />
            </div>
            {dropdown && (
              <ul className="absolute left-0 bg-white border border-gray-300 rounded-lg p-3 shadow-md mt-2 w-32">
                <li><Link to="/dishes/spicy" className="block px-3 py-1 hover:text-red-500">Spicy</Link></li>
                <li><Link to="/dishes/tasty" className="block px-3 py-1 hover:text-red-500">Tasty</Link></li>
                <li><Link to="/dishes/delicious" className="block px-3 py-1 hover:text-red-500">Delicious</Link></li>
                <li><Link to="/dishes/crispy" className="block px-3 py-1 hover:text-red-500">Crispy</Link></li>
              </ul>
            )}
          </div>

          <Link to="/user/about" className="hover:text-red-500 transition-all">About</Link>
          <Link to="/user/menu" className="hover:text-red-500 transition-all">Menu</Link>
          <Link to="/user/review" className="hover:text-red-500 transition-all">Reviews</Link>

          {/* Profile Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => {
              clearTimeout(profileTimeout); // Clear timeout if user hovers again
              setProfileDropdown(true);
            }}
            onMouseLeave={() => {
              profileTimeout = setTimeout(() => setProfileDropdown(false), 500); // 0.5s delay
            }}
          >
            <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
              U {/* Replace with user image */}
            </button>
            {profileDropdown && (
              <ul className="absolute right-0 bg-white border border-gray-300 rounded-lg p-3 shadow-md mt-2 w-32">
                <li><Link to="/user/profile" className="block px-3 py-1 hover:text-red-500">Profile</Link></li>
                <li>
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-1 hover:text-red-500">
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-xl focus:outline-none" onClick={handleChange} aria-label="Toggle Menu">
          {menu ? <AiOutlineClose size={25} /> : <AiOutlineMenuUnfold size={25} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menu && (
        <div className="fixed top-[60px] left-0 w-full bg-black text-white flex flex-col items-center gap-4 py-6 text-center">
          <Link to="/user/dashboard" onClick={closeMenu} className="hover:text-gray-400">Home</Link>
          <Link to="/user/dishes" onClick={closeMenu} className="hover:text-gray-400">Dishes</Link>
          <Link to="/user/about" onClick={closeMenu} className="hover:text-gray-400">About</Link>
          <Link to="/user/menu" onClick={closeMenu} className="hover:text-gray-400">Menu</Link>
          <Link to="/user/review" onClick={closeMenu} className="hover:text-gray-400">Reviews</Link>

          {/* Profile & Logout in Mobile Menu */}
          <Link to="/user/profile" onClick={closeMenu} className="hover:text-gray-400">Profile</Link>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded w-1/2">Logout</button>
        </div>
      )}
    </header>
  );
};

export default UserNavbar;
