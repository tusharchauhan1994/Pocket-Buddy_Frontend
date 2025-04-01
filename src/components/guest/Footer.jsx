import React from "react";
import { BsFacebook } from "react-icons/bs";
import { RiTwitterXFill } from "react-icons/ri";
import { BsInstagram } from "react-icons/bs";

const Footer = () => {
  return (
    <div className="bg-black text-white rounded-t-3xl">
      <div className="flex flex-col md:flex-row justify-between p-8 md:px-32 px-5">
        {/* Brand Section */}
        <div className="w-full md:w-1/4">
          <h1 className="font-semibold text-xl pb-4">Pocket Buddy</h1>
          <p className="text-sm">
            Discover exclusive restaurant deals and manage your favorite places, all in one app!
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h1 className="font-medium text-xl pb-4 pt-5 md:pt-0">Quick Links</h1>
          <nav className="flex flex-col gap-2">
            <a className="hover:text-brightColor transition-all cursor-pointer" href="/">Home</a>
            <a className="hover:text-brightColor transition-all cursor-pointer" href="/about">About Us</a>
            <a className="hover:text-brightColor transition-all cursor-pointer" href="/offers">Offers</a>
            <a className="hover:text-brightColor transition-all cursor-pointer" href="/restaurants">Restaurants</a>
          </nav>
        </div>

        {/* Features */}
        <div>
          <h1 className="font-medium text-xl pb-4 pt-5 md:pt-0">Features</h1>
          <nav className="flex flex-col gap-2">
            <a className="hover:text-brightColor transition-all cursor-pointer" href="/dashboard">User Dashboard</a>
            <a className="hover:text-brightColor transition-all cursor-pointer" href="/restaurant-dashboard">Restaurant Panel</a>
          </nav>
        </div>

        {/* Contact Section */}
        <div>
          <h1 className="font-medium text-xl pb-4 pt-5 md:pt-0">Contact Us</h1>
          <nav className="flex flex-col gap-2">
            <a className="hover:text-brightColor transition-all cursor-pointer" href="mailto:support@pocketbuddy.com">
              support@pocketbuddy.com
            </a>
            <a className="hover:text-brightColor transition-all cursor-pointer" href="tel:+919876543210">
              +91 98765 43210
            </a>
            <a className="hover:text-brightColor transition-all cursor-pointer" href="/social-media">
              Follow us on Social Media
            </a>
          </nav>
        </div>
      </div>

      {/* Footer Bottom */}
      <div>
        <p className="text-center py-4">
          © {new Date().getFullYear()} Developed by
          <span className="text-brightColor"> Pocket Buddy Team</span> | All rights reserved
        </p>
      </div>
    </div>
  );
};

const App = () => {
  return (<>
    {/*  <div className="flex flex-col min-h-screen"> */}
      {/* Main content */}
      {/* <div className="flex-grow"> */}
        {/* Your content goes here */}
      {/* </div> */}

      {/* Footer at the bottom */}
      
    {/* </div> */}
    <Footer />
    </>
  );
};

export default App;
