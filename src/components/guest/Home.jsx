import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Button from "../../layouts/Button";
import axios from "axios";
import heroImage from "../../assets/img/hero.jpg";

const Home = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resOffers = await axios.get("http://localhost:3000/offer");
        setOffers(resOffers.data.offers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
    <div className="flex flex-col min-h-screen mt-16 mb-0">
      <Navbar />

      {/* Hero Section */}
      <div 
        className="min-h-screen flex flex-row justify-between items-center lg:px-32 px-5 bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="w-full lg:w-2/3 space-y-5">
          <h1 className="text-backgroundColor font-semibold text-6xl">
            Discover Amazing Deals & Offers!
          </h1>
          <p className="text-backgroundColor">
            Get access to exclusive discounts at top restaurants near you.
          </p>
          <div className="lg:pl-44">
            <Button title="Explore Now" />
          </div>
        </div>
      </div>

      {/* Dynamic Offers Section */}
      <section className="px-5 lg:px-32 py-10">
        <h2 className="text-3xl font-semibold mb-5">Exclusive Offers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {offers.length > 0 ? (
            offers.map((offer) => (
              <div key={offer._id} className="border rounded-lg shadow-lg overflow-hidden">
                <Link to={`/offer/${offer._id}`}>
                  <div className="w-full aspect-w-16 aspect-h-9">
                    <img
                      src={offer.imageURL || "https://via.placeholder.com/300"}
                      alt={offer.title}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{offer.title}</h3>
                  <p className="text-gray-600">{offer.description}</p>
                  <p className="text-red-500 font-bold">
                    {offer.offer_type === "Flat Discount"
                      ? `₹${offer.discount_value} OFF`
                      : offer.offer_type === "Percentage"
                      ? `${offer.discount_value}% OFF`
                      : offer.offer_type}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Valid Until: {new Date(offer.valid_to).toLocaleDateString()}
                  </p>
                  <Link to={`/offer/${offer._id}`}>
                    <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                      Sign Up to Claim
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No offers available at the moment.</p>
          )}
        </div>
      </section>

      
    </div>
    <Footer />
    </>
  );
};

export default Home;
