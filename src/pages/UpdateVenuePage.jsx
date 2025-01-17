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
    <div className="flex flex-col items-center min-h-screen p-6 pt-36">
      <h1 className="text-3xl text-text mb-8">Update venue</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4"
      >
        <div>
          <label className="block text-sm text-text font-medium mb-1">
            Venue name
          </label>
          <input
            type="text"
            {...register("name")}
            placeholder="Norwegian Cabin"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <p className="text-main-red text-sm">{errors.name?.message}</p>
        </div>

        <div>
          <label className="block text-sm text-text font-medium mb-1">
            Address
          </label>
          <input
            type="text"
            {...register("address")}
            placeholder="Road Street 148"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <p className="text-main-red text-sm">{errors.address?.message}</p>
        </div>

        <div>
          <label className="block text-sm text-text font-medium mb-1">
            Description
          </label>
          <textarea
            {...register("description")}
            placeholder="A lovely cabin in the mountains..."
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <p className="text-main-red text-sm">{errors.description?.message}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text font-medium mb-1">
              Max Guests
            </label>
            <input
              type="number"
              {...register("maxGuests")}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <p className="text-main-red text-sm">{errors.maxGuests?.message}</p>
          </div>
          <div>
            <label className="block text-sm text-text font-medium mb-1">
              Price per night
            </label>
            <input
              type="number"
              {...register("price")}
              placeholder="$0"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <p className="text-main-red text-sm">{errors.price?.message}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm text-text font-medium mb-1">
            Add pictures
          </label>
          <input
            type="text"
            {...register("imageUrl")}
            placeholder="image.url"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <button
            type="button"
            onClick={() =>
              addImage(document.querySelector("input[name='imageUrl']").value)
            }
            className="mt-2 bg-main-red text-background py-2 px-3 rounded"
          >
            Add Image
          </button>
          <p className="text-main-red text-sm">{errors.imageUrl?.message}</p>
        </div>

        <div className="flex space-x-4 mt-4">
          {images.map((url, index) => (
            <div key={index} className="relative w-20 h-20 bg-gray-200 rounded">
              <img
                src={url}
                alt={`Venue ${index + 1}`}
                className="w-full h-full object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-main-red text-background py-3 rounded font-semibold hover:bg-red-800 transition"
        >
          Update venue
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="bg-red-500 text-background py-2 px-4 rounded font-semibold hover:bg-red-700 transition"
        >
          Delete Venue
        </button>
      </form>
    </div>
  );
};

export default UpdateVenuePage;
