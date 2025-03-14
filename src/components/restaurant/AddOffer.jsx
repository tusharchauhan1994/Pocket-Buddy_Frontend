import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { offerValidation } from "../validation/formValidation";

const AddOffer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [selectedFile, setSelectedFile] = useState(null);

  const onSubmit = (data) => {
    console.log("Offer Added:", data);
    if (selectedFile) {
      console.log("Selected Image:", selectedFile);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Add Offer</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Offer Title */}
          <div className="flex flex-col">
            <label className="font-medium">Offer Title</label>
            <input
              type="text"
              {...register("title", offerValidation.title)}
              className="border p-2 rounded-md"
              placeholder="Enter offer title"
              required
            />
            {errors.title && <span className="text-red-500">{errors.title.message}</span>}
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="font-medium">Description</label>
            <textarea
              {...register("description", offerValidation.description)}
              className="border p-2 rounded-md"
              placeholder="Enter offer details"
              required
            />
            {errors.description && <span className="text-red-500">{errors.description.message}</span>}
          </div>

          {/* Offer Type */}
          <div className="flex flex-col">
            <label className="font-medium">Offer Type</label>
            <select {...register("offerType", offerValidation.offerType)} className="border p-2 rounded-md" required>
              <option value="">Select Offer Type</option>
              <option value="percentage">Percentage Discount</option>
              <option value="fixed">Fixed Amount Discount</option>
              <option value="bogo">Buy X Get Y Free</option>
              <option value="free-delivery">Free Delivery</option>
            </select>
            {errors.offerType && <span className="text-red-500">{errors.offerType.message}</span>}
          </div>

          {/* Coupon Code (Optional) */}
          <div className="flex flex-col">
            <label className="font-medium">Coupon Code (Optional)</label>
            <input
              type="text"
              {...register("couponCode", offerValidation.couponCode)}
              className="border p-2 rounded-md"
              placeholder="Enter coupon code"
            />
          </div>

          {/* Start Date & End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-medium">Start Date</label>
              <input
                type="date"
                {...register("startDate", offerValidation.startDate)}
                className="border p-2 rounded-md"
                required
              />
              {errors.startDate && <span className="text-red-500">{errors.startDate.message}</span>}
            </div>

            <div className="flex flex-col">
              <label className="font-medium">End Date</label>
              <input
                type="date"
                {...register("endDate", offerValidation.endDate)}
                className="border p-2 rounded-md"
                required
              />
              {errors.endDate && <span className="text-red-500">{errors.endDate.message}</span>}
            </div>
          </div>

          {/* Minimum Order Amount */}
          <div className="flex flex-col">
            <label className="font-medium">Minimum Order Amount</label>
            <input
              type="number"
              {...register("minOrderAmount", offerValidation.minOrderAmount)}
              className="border p-2 rounded-md"
              placeholder="Enter minimum order amount"
              required
            />
            {errors.minOrderAmount && <span className="text-red-500">{errors.minOrderAmount.message}</span>}
          </div>

          {/* Upload Image */}
          <div className="flex flex-col">
            <label className="font-medium">Upload Offer Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="border p-2 rounded-md"
              required
            />
            {errors.image && <span className="text-red-500">{errors.image.message}</span>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">
              Add Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOffer;
