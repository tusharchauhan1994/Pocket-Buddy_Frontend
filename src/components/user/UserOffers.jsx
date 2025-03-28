import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserNavbar } from "./UserNavbar";
import { UserFooter } from "./UserFooter";

export const UserOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Step 1: State for search input

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/offer");
        console.log("API Response:", response.data);
        if (Array.isArray(response.data)) {
          setOffers(response.data);
        } else if (Array.isArray(response.data.offers)) {
          setOffers(response.data.offers);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        setError("Failed to fetch offers");
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  // Step 2: Filter offers based on search query
  const filteredOffers = offers.filter((offer) =>
    offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    offer.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="text-center py-10">Loading offers...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col min-h-screen mt-16">
      <UserNavbar setSearchQuery={setSearchQuery} /> {/* Pass search function */}
      <section className="px-5 lg:px-32 py-10">
        <h2 className="text-3xl font-semibold mb-5">Exclusive Offers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOffers.length > 0 ? (
            filteredOffers.map((offer) => (
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
                      Claim Offer
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-3 text-gray-500">No offers match your search.</p>
          )}
        </div>
      </section>
      <UserFooter />
    </div>
  );
};

export default UserOffers;
