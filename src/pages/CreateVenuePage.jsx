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
      alert("Venue created successfully.");
    } catch (error) {
      console.error("Error creating venue:", error);
      alert("Failed to create venue.");
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
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6 pt-36">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          Create New Venue
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Venue name
              </label>
              <input
                type="text"
                {...register("name")}
                placeholder="Norwegian Cabin"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 
                  focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 
                  transition-all duration-200"
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
                placeholder="Road Street 148"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 
                  focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 
                  transition-all duration-200"
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
                placeholder="A lovely cabin in the mountains..."
                rows="4"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 
                  focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 
                  transition-all duration-200"
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
                    focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 
                    transition-all duration-200"
                />
                {errors.maxGuests && (
                  <p className="mt-1 text-sm text-red-500">{errors.maxGuests.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per night
                </label>
                <input
                  type="number"
                  {...register("price")}
                  placeholder="$0"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 
                    focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 
                    transition-all duration-200"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add pictures
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  {...register("imageUrl")}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 
                    focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 
                    transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() =>
                    addImage(document.querySelector("input[name='imageUrl']").value)
                  }
                  className="bg-cyan-600 text-white px-6 py-2.5 rounded-lg 
                    hover:bg-cyan-700 active:bg-cyan-800 
                    transition-colors duration-200"
                >
                  Add
                </button>
              </div>
              {errors.imageUrl && (
                <p className="mt-1 text-sm text-red-500">{errors.imageUrl.message}</p>
              )}
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {images.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={url}
                      alt={`Venue ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-2 right-2 bg-white/90 text-red-500 
                      rounded-full w-6 h-6 flex items-center justify-center 
                      shadow-sm opacity-0 group-hover:opacity-100 
                      transition-opacity duration-200"
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
              active:from-cyan-800 active:to-cyan-700
              transition-all duration-200
              shadow-sm hover:shadow"
          >
            Create Venue
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateVenuePage;