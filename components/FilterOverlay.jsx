import React from "react";
import { FaStar } from "react-icons/fa";
import { useOutsideClick } from "../hooks/useOutsideClick";

const FilterOverlay = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  onFilterApply,
}) => {
  const ref = useOutsideClick(() => {
    onClose(false);
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setFilters((prev) => ({ ...prev, rating }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50">
      <div
        ref={ref}
        className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Filter Venues</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onFilterApply();
            onClose();
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleInputChange}
              placeholder="Enter location"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:border-cyan-600 focus:ring focus:ring-cyan-200 focus:outline-none transition"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Rating
            </label>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`w-6 h-6 cursor-pointer transition-transform transform hover:scale-110 ${
                    i < filters.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => handleRatingChange(i + 1)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Guests
            </label>
            <input
              type="number"
              name="guests"
              value={filters.guests}
              onChange={handleInputChange}
              placeholder="Enter number of guests"
              min="1"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:border-cyan-600 focus:ring focus:ring-cyan-200 focus:outline-none transition"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Price Range
            </label>
            <input
              type="number"
              name="price"
              value={filters.price}
              onChange={handleInputChange}
              placeholder="Enter maximum price"
              min="0"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:border-cyan-600 focus:ring focus:ring-cyan-200 focus:outline-none transition"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-cyan-600 text-white py-2.5 rounded-md font-medium shadow-md hover:bg-cyan-700 transition-colors focus:outline-none focus:ring focus:ring-cyan-200"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterOverlay;
