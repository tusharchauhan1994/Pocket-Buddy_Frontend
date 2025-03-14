import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AddRestaurant = () => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);

  const getAllStates = async () => {
    const res = await axios.get("/state/getallstates");
    setStates(res.data.data);
  };

  const getCityByStateId = async (id) => {
    const res = await axios.get("/city/getcitybystate/" + id);
    setCities(res.data.data);
  };

  const getAreaByCityId = async (id) => {
    const res = await axios.get("/area/getareabycity/" + id);
    setAreas(res.data.data);
  };

  const getAllFoodTypes = async () => {
    const res = await axios.get("/foodtype/getAllFoodType");
    console.log(res.data);
    setFoodTypes(res.data.data);
  };

  useEffect(() => {
    getAllStates();
    getAllFoodTypes();
  }, []);

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    const userId = localStorage.getItem("id");
    console.log(data);
    console.log(data.image[0]); //array -->0th index access..

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("timings", data.timings);
    formData.append("contactNumber", data.contactNumber);
    formData.append("address", data.address);
    formData.append("stateId", data.stateId);
    formData.append("cityId", data.cityId);
    formData.append("areaId", data.areaId);
    formData.append("foodTypeId", data.foodTypeId);
    formData.append("latitude", data.latitude);
    formData.append("longitude", data.longitude);
    formData.append("image", data.image[0]); // Get the first selected file
    formData.append("userId", userId);

    // data.userId = userId;
    // constimageURL res = await axios.post("/location/add", data);
    //console.log(res.data);

    const res = await axios.post("/location/addWithFile", formData);
    console.log(res);
    console.log(res.data);

    navigate("/myRestaurant");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Add Restaurant</h1>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="space-y-4"
          encType="multipart/form-data"
        >
          {/* Restaurant Name */}
          <div className="flex flex-col">
            <label className="font-medium">Restaurant Name</label>
            <input
              type="text"
              {...register("title")}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="font-medium">Category</label>
            <input
              type="text"
              {...register("category")}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="font-medium">Description</label>
            <textarea
              {...register("description")}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Timings */}
          <div className="flex flex-col">
            <label className="font-medium">Timings</label>
            <input
              type="text"
              {...register("timings")}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Contact Number */}
          <div className="flex flex-col">
            <label className="font-medium">Contact Number</label>
            <input
              type="text"
              {...register("contactNumber")}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <label className="font-medium">Address</label>
            <textarea
              {...register("address")}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* State */}
          <div className="flex flex-col">
            <label className="font-medium">Select State</label>
            <select
              {...register("stateId")}
              onChange={(e) => getCityByStateId(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">SELECT STATE</option>
              {states.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className="flex flex-col">
            <label className="font-medium">Select City</label>
            <select
              {...register("cityId")}
              onChange={(e) => getAreaByCityId(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">SELECT CITY</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Area */}
          <div className="flex flex-col">
            <label className="font-medium">Select Area</label>
            <select
              {...register("areaId")}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">SELECT AREA</option>
              {areas.map((area) => (
                <option key={area._id} value={area._id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>

          {/* Food Type */}
          <div className="flex flex-col">
            <label className="font-medium">Food Type</label>
            <select
              {...register("foodTypeId")}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">SELECT FOOD TYPE</option>
              {foodTypes?.map((food) => (
                <option key={food._id} value={food._id}>
                  {food.foodTypeName}
                </option>
              ))}
            </select>
          </div>

          {/* Latitude */}
          <div className="flex flex-col">
            <label className="font-medium">Latitude</label>
            <input
              type="text"
              {...register("latitude")}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Longitude */}
          <div className="flex flex-col">
            <label className="font-medium">Longitude</label>
            <input
              type="text"
              {...register("longitude")}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Image */}
          <div className="flex flex-col">
            <label className="font-medium">Add Image</label>
            <input
              type="file"
              {...register("image")}
              //className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <input
              type="submit"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
            ></input>
          </div>
        </form>
      </div>
    </div>
  );
};
