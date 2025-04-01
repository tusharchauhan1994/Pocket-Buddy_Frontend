import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiRestaurant, BiChevronDown } from "react-icons/bi";
import { AiOutlineMenuUnfold, AiOutlineClose } from "react-icons/ai";

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const [dropdown, setDropdown] = useState(false); // Track dropdown state
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = () => setMenu(!menu);
  const closeMenu = () => setMenu(false);

  return (
    <header className="fixed w-full bg-white shadow-md z-50 top-0 ">
      <div className="flex justify-between items-center p-5 md:px-32 px-5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <BiRestaurant size={32} />
          <h1 className="text-xl font-semibold">Pocket-Buddy</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-lg font-medium">
          <Link to="/" className="hover:text-red-500 transition-all">
            Home
          </Link>

          {/* Dropdown Menu
          <div
            className="relative"
            onMouseEnter={() => setDropdown(true)}
            onMouseLeave={() => setDropdown(false)}
          >
            <div className="flex items-center gap-1 cursor-pointer">
              <Link to="/dishes" className="hover:text-red-500 transition-all">
                Dishes
              </Link>
              <BiChevronDown size={20} />
            </div>
            {dropdown && (
              <ul className="absolute left-0 bg-white border border-gray-300 rounded-lg p-3 shadow-md mt-2 w-32">
                <li>
                  <Link
                    to="/dishes/spicy"
                    className="block px-3 py-1 hover:text-red-500"
                  >
                    Spicy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dishes/tasty"
                    className="block px-3 py-1 hover:text-red-500"
                  >
                    Tasty
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dishes/delicious"
                    className="block px-3 py-1 hover:text-red-500"
                  >
                    Delicious
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dishes/crispy"
                    className="block px-3 py-1 hover:text-red-500"
                  >
                    Crispy
                  </Link>
                </li>
              </ul>
            )}
          </div> */}

          <Link to="/offers" className="hover:text-red-500 transition-all">
          offers
          </Link>
          <Link to="/restaurants" className="hover:text-red-500 transition-all">
          restaurants
          </Link>
          <Link to="/review" className="hover:text-red-500 transition-all">
            Reviews
          </Link>

          {/* Login & Sign Up Buttons */}
          <div className="flex gap-3">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
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
          <Link to="/" onClick={closeMenu} className="hover:text-gray-400">
            Home
          </Link>
          <Link
            to="/dishes"
            onClick={closeMenu}
            className="hover:text-gray-400"
          >
            Dishes
          </Link>
          <Link to="/about" onClick={closeMenu} className="hover:text-gray-400">
            About
          </Link>
          <Link to="/menu" onClick={closeMenu} className="hover:text-gray-400">
            Menu
          </Link>
          <Link
            to="/review"
            onClick={closeMenu}
            className="hover:text-gray-400"
          >
            Reviews
          </Link>

          {/* Mobile Login & Sign Up Buttons */}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded w-1/2"
            onClick={() => {
              navigate("/login");
              closeMenu();
            }}
          >
            Login
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded w-1/2"
            onClick={() => {
              navigate("/signup");
              closeMenu();
            }}
          >
            Sign Up
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
