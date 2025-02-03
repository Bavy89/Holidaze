import React from "react";
import { NavLink } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const Card = ({
  id,
  media,
  title,
  location,
  address,
  rating,
  price,
  bookingsCount,
}) => {
  return (
    <NavLink to={`/venue/${id}`} className="p-4">
      <div className="group bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:border-cyan-600 transition-all duration-300">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={media || "/api/placeholder/400/320"}
            alt={title || "Venue"}
            className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full">
            <div className="flex items-center space-x-1">
              <FaStar className="text-yellow-500 mr-1" />
              <span className="text-cyan-600 font-medium">
                {rating ? rating.toFixed(1) : "Unrated"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-cyan-600 group-hover:text-cyan-700 break-words whitespace-normal">
              {title || "Unnamed Venue"}
              {location ? `, ${location}` : ""}
            </h3>
            <p className="text-gray-500">{address || "No Address Provided"}</p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <p className="font-semibold text-cyan-600">
              {price ? `$${price}` : "Price not available"}
              <span className="text-gray-500 font-normal ml-1">/ night</span>
            </p>

            {bookingsCount !== undefined && (
              <p className="text-sm bg-cyan-50 text-cyan-600 px-3 py-1 rounded-full">
                {bookingsCount} booking{bookingsCount === 1 ? "" : "s"}
              </p>
            )}
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default Card;
