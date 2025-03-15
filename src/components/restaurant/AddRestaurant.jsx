import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RestaurantSidebar from "./RestaurantSidebar";

export const AddRestaurant = () => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);

  useEffect(() => {
    axios.get("/state/getallstates").then((res) => setStates(res.data.data));
    axios
      .get("/foodtype/getAllFoodType")
      .then((res) => setFoodTypes(res.data.data));
  }, []);

  const getCityByStateId = async (id) => {
    const res = await axios.get("/city/getcitybystate/" + id);
    setCities(res.data.data);
  };

  const getAreaByCityId = async (id) => {
    const res = await axios.get("/area/getareabycity/" + id);
    setAreas(res.data.data);
  };

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    const userId = localStorage.getItem("id");
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    formData.append("image", data.image[0]);
    formData.append("userId", userId);

    await axios.post("/location/addWithFile", formData);
    navigate("/restaurant/myRestaurant");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Visible on large screens */}
      <div className="hidden lg:block w-1/4">
        <RestaurantSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-center mb-6">
            Add Restaurant
          </h1>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="space-y-5"
            encType="multipart/form-data"
          >
            {/* Input Fields */}
            {[
              { label: "Restaurant Name", name: "title" },
              { label: "Category", name: "category" },
              { label: "Description", name: "description", type: "textarea" },
              { label: "Timings", name: "timings" },
              { label: "Contact Number", name: "contactNumber" },
              { label: "Address", name: "address", type: "textarea" },
              { label: "Latitude", name: "latitude" },
              { label: "Longitude", name: "longitude" },
            ].map(({ label, name, type }) => (
              <div key={name} className="flex flex-col">
                <label className="font-medium">{label}</label>
                {type === "textarea" ? (
                  <textarea
                    {...register(name)}
                    className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ) : (
                  <input
                    type="text"
                    {...register(name)}
                    className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                )}
              </div>
            ))}

            {/* Dropdowns */}
            {[
              {
                label: "State",
                name: "stateId",
                options: states,
                onChange: getCityByStateId,
              },
              {
                label: "City",
                name: "cityId",
                options: cities,
                onChange: getAreaByCityId,
              },
              { label: "Area", name: "areaId", options: areas },
              { label: "Food Type", name: "foodTypeId", options: foodTypes },
            ].map(({ label, name, options, onChange }) => (
              <div key={name} className="flex flex-col">
                <label className="font-medium">{label}</label>
                <select
                  {...register(name)}
                  className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500"
                  required
                  onChange={(e) => onChange && onChange(e.target.value)}
                >
                  <option value="">SELECT {label.toUpperCase()}</option>
                  {options.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name || option.foodTypeName}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {/* Image Upload */}
            <div className="flex flex-col">
              <label className="font-medium">Add Image</label>
              <input
                type="file"
                {...register("image")}
                className="border border-gray-300 rounded-md p-3"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
