import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { apiPut, apiGet, apiDelete } from "../utils/apiKey";
import { useParams, useNavigate } from "react-router-dom";

const UpdateVenueSchema = Yup.object().shape({
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

const UpdateVenuePage = () => {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
    reset,
  } = useForm({
    resolver: yupResolver(UpdateVenueSchema),
  });

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this venue? This action cannot be undone."
    );
    if (!confirmDelete) return;

    await apiDelete(`/holidaze/venues/${id}`);

    alert("Venue deleted successfully.");
    navigate("/profile");
  };

  useEffect(() => {
    if (id) {
      const fetchVenue = async () => {
        try {
          const response = await apiGet(`/venues/${id}`);
          setVenue(response.data);

          reset({
            name: response.data.name,
            address: response.data.location.address,
            description: response.data.description,
            maxGuests: response.data.maxGuests,
            price: response.data.price,
          });
          setImages(response.data.media.map((item) => item.url));
        } catch (error) {
          console.error("Error fetching venue:", error);
          alert("Failed to load venue details.");
        }
      };

      fetchVenue();
    }
  }, [id, reset]);

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
      await apiPut(`/holidaze/venues/${id}`, payload);
      alert("Venue updated successfully.");

      navigate(`/venue/${id}`);
    } catch (error) {
      console.log(payload);
    }
  };

  const addImage = (url) => {
    if (url && !images.includes(url)) {
      setImages((prevImages) => [...prevImages, url]);
      resetField("imageUrl");
    }
  };

  const removeImage = (url) => {
    setImages((prevImages) => prevImages.filter((image) => image !== url));
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6 pt-24">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center text-cyan-600 mb-8">Update Venue</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Venue name
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="Norwegian Cabin"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition-all duration-200"
            />
            <p className="mt-1 text-sm text-red-500">{errors.name?.message}</p>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Address
            </label>
            <input
              type="text"
              {...register("address")}
              placeholder="Road Street 148"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition-all duration-200"
            />
            <p className="mt-1 text-sm text-red-500">{errors.address?.message}</p>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              placeholder="A lovely cabin in the mountains..."
              rows="4"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition-all duration-200"
            />
            <p className="mt-1 text-sm text-red-500">{errors.description?.message}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Max Guests
              </label>
              <input
                type="number"
                {...register("maxGuests")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition-all duration-200"
              />
              <p className="mt-1 text-sm text-red-500">{errors.maxGuests?.message}</p>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Price per night
              </label>
              <input
                type="number"
                {...register("price")}
                placeholder="$0"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition-all duration-200"
              />
              <p className="mt-1 text-sm text-red-500">{errors.price?.message}</p>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Add pictures
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                {...register("imageUrl")}
                placeholder="image.url"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition-all duration-200"
              />
              <button
                type="button"
                onClick={() =>
                  addImage(document.querySelector("input[name='imageUrl']").value)
                }
                className="px-6 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md"
              >
                Add
              </button>
            </div>
            <p className="mt-1 text-sm text-red-500">{errors.imageUrl?.message}</p>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 shadow-sm">
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
                      rounded-full w-8 h-8 flex items-center justify-center 
                      shadow-lg opacity-0 group-hover:opacity-100 
                      transition-all duration-200 hover:bg-red-50"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4 pt-4">
            <button
              type="submit"
              className="w-full py-4 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md"
            >
              Update Venue
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="w-full py-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md"
            >
              Delete Venue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateVenuePage;