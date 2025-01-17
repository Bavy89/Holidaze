import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { apiPost } from "../utils/apiKey";
import { useNavigate } from "react-router-dom";

const CreateVenueSchema = Yup.object().shape({
  name: Yup.string().required("Venue name is required"),
  address: Yup.string().required("Address is required"),
  description: Yup.string().required("Description is required"),
  maxGuests: Yup.number()
    .required("Max Guests is required")
    .min(1, "At least 1 guest"),
  price: Yup.number()
    .required("Price per night is required")
    .min(1, "Price must be positive"),
  imageUrl: Yup.string().url("Invalid URL"),
});

const CreateVenuePage = () => {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm({
    resolver: yupResolver(CreateVenueSchema),
  });

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      description: data.description,
      media: images.map((url) => ({ url, alt: "Venue Image" })),
      price: data.price,
      maxGuests: data.maxGuests,
      meta: {
        wifi: true,
        parking: true,
        breakfast: false,
        pets: false,
      },
      location: {
        address: data.address,
      },
    };

    try {
      const response = await apiPost("/holidaze/venues", payload);
      const createdVenueId = response.data.id;
      navigate(`/venue/${createdVenueId}`);
    } catch (error) {
      console.error("Error creating venue:", error);
    }
  };

  const addImage = (url) => {
    if (url && !images.includes(url)) {
      const trimmedUrl = url.trim();
      if (
        !trimmedUrl.startsWith("http://") &&
        !trimmedUrl.startsWith("https://")
      ) {
        return;
      }
      setImages((prevImages) => [...prevImages, trimmedUrl]);
      resetField("imageUrl");
    }
  };

  const removeImage = (url) => {
    setImages((prevImages) => prevImages.filter((image) => image !== url));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
          Create New Venue
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Venue Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 
                focus:ring-2 focus:ring-cyan-100 focus:border-cyan-600 
                transition-all duration-200"
              placeholder="Norwegian Cabin"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              {...register("address")}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 
                focus:ring-2 focus:ring-cyan-100 focus:border-cyan-600 
                transition-all duration-200"
              placeholder="Street address"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              rows="4"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 
                focus:ring-2 focus:ring-cyan-100 focus:border-cyan-600 
                transition-all duration-200"
              placeholder="Describe your venue..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Guests
              </label>
              <input
                type="number"
                {...register("maxGuests")}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 
                  focus:ring-2 focus:ring-cyan-100 focus:border-cyan-600 
                  transition-all duration-200"
                min="1"
              />
              {errors.maxGuests && (
                <p className="mt-1 text-sm text-red-500">{errors.maxGuests.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Night
              </label>
              <input
                type="number"
                {...register("price")}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 
                  focus:ring-2 focus:ring-cyan-100 focus:border-cyan-600 
                  transition-all duration-200"
                min="1"
                placeholder="0"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Images
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                {...register("imageUrl")}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 
                  focus:ring-2 focus:ring-cyan-100 focus:border-cyan-600 
                  transition-all duration-200"
                placeholder="https://example.com/image.jpg"
              />
              <button
                type="button"
                onClick={() => addImage(document.querySelector("input[name='imageUrl']").value)}
                className="px-6 py-2.5 bg-cyan-600 text-white rounded-lg 
                  hover:bg-cyan-700 transition-colors duration-200"
              >
                Add
              </button>
            </div>
            {errors.imageUrl && (
              <p className="mt-1 text-sm text-red-500">{errors.imageUrl.message}</p>
            )}
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Venue ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-2 right-2 bg-white/90 text-red-500 
                      rounded-full w-6 h-6 flex items-center justify-center 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 
              text-white py-3 rounded-lg font-medium
              hover:from-cyan-700 hover:to-cyan-600 
              transition-all duration-200 mt-8"
          >
            Create Venue
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateVenuePage;