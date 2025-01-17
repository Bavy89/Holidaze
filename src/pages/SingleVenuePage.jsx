import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Calendar from "react-calendar";
import { apiPost, apiGet } from "../utils/apiKey";
import {
  FaStar,
  FaWifi,
  FaParking,
  FaPaw,
  FaUtensils,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";

const SingleVenuePage = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [guestCount, setGuestCount] = useState(1);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isVenueManager, setIsVenueManager] = useState(false);

  const loggedInUserName = localStorage.getItem("user");

  const openCalendar = () => setIsCalendarOpen(true);
  const closeCalendar = () => setIsCalendarOpen(false);

  const calculateTotalPrice = () => {
    if (!selectedDates[0] || !selectedDates[1] || !venue?.price) return 0;
    const nights =
      Math.ceil(
        (new Date(selectedDates[1]).getTime() -
          new Date(selectedDates[0]).getTime()) /
          (1000 * 60 * 60 * 24)
      ) || 0;
    return nights * venue.price;
  };

  const isDateDisabled = (date, disabledRanges) => {
    return disabledRanges.some(({ dateFrom, dateTo }) => {
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      return date >= fromDate && date <= toDate;
    });
  };

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}?_owner=true&_bookings=true`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch venue details");
        }
        const venueData = await response.json();

        setVenue(venueData.data);
      } catch (error) {
        console.error("Error fetching venue:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const userProfile = await apiGet(`/profiles/${loggedInUserName}`);
        setIsVenueManager(userProfile.data.venueManager);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchVenue();
    fetchUserProfile();
  }, [id, loggedInUserName]);

  const handleBooking = async () => {
    if (!selectedDates[0] || !selectedDates[1]) {
      alert("Please select a valid date range.");
      return;
    }

    const payload = {
      dateFrom: selectedDates[0].toISOString(),
      dateTo: selectedDates[1].toISOString(),
      guests: parseInt(guestCount, 10),
      venueId: id,
    };

    try {
      await apiPost(`/holidaze/bookings`, payload);
      alert("Booking successful!");
    } catch (error) {
      console.error("Error booking venue:", error);
      alert("Failed to book venue. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="spinner"></div>
      </div>
    );
  if (error || !venue)
    return <p>Failed to load venue. Please try again later.</p>;

  return (
    <div className="max-w-5xl mx-auto pt-12 p-6 grid grid-cols-1 lg:grid-cols-3 gap-14">
      <div className="lg:col-span-2">
        <img
          src={venue.media?.[0]?.url || "https://picsum.photos/200/300"}
          alt={venue.name || "Venue"}
          className="w-full h-72 object-cover rounded-xl shadow-sm"
        />

        <div className="mt-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {venue.name || "Unnamed Venue"}
          </h1>
          <p className="text-gray-600">
            {venue.location?.address || "No Address Provided"}
          </p>

          <div className="my-6 border-t border-gray-200" />

          <div className="flex items-center space-x-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-gray-700">
              <FaUser className="text-cyan-600" />
              <span>{venue.maxGuests || "N/A"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaStar className="text-yellow-400" />
              <span>{venue.rating?.toFixed(1) || "Unrated"}</span>
            </div>
            <p className="text-cyan-600 font-medium">
              ${venue.price || "N/A"} <span className="text-gray-600">/ night</span>
            </p>
          </div>

          <div className="my-6 border-t border-gray-200" />

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Amenities
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {venue.meta?.wifi && (
                <div className="flex items-center space-x-3 text-gray-700">
                  <FaWifi className="text-cyan-600" />
                  <span>Wifi</span>
                </div>
              )}
              {venue.meta?.parking && (
                <div className="flex items-center space-x-3 text-gray-700">
                  <FaParking className="text-cyan-600" />
                  <span>Parking</span>
                </div>
              )}
              {venue.meta?.pets && (
                <div className="flex items-center space-x-3 text-gray-700">
                  <FaPaw className="text-cyan-600" />
                  <span>Pet friendly</span>
                </div>
              )}
              {venue.meta?.breakfast && (
                <div className="flex items-center space-x-3 text-gray-700">
                  <FaUtensils className="text-cyan-600" />
                  <span>Breakfast</span>
                </div>
              )}
            </div>

            {!venue.meta?.wifi &&
              !venue.meta?.parking &&
              !venue.meta?.pets &&
              !venue.meta?.breakfast && (
                <p className="mt-2 text-gray-500">
                  This place offers no extra amenities.
                </p>
              )}

            <div className="my-6 border-t border-gray-200" />

            {!isVenueManager && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Book this Venue
                </h2>
                <button
                  onClick={openCalendar}
                  className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium 
                    hover:bg-cyan-700 transition-colors"
                >
                  <FaCalendarAlt className="mr-2" />
                  {selectedDates[0] && selectedDates[1]
                    ? `${selectedDates[0].toLocaleDateString()} - ${selectedDates[1].toLocaleDateString()}`
                    : "Select dates"}
                </button>

                {isCalendarOpen && (
                  <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <Calendar
                      tileDisabled={({ date }) =>
                        isDateDisabled(date, venue.bookings)
                      }
                      selectRange
                      onChange={setSelectedDates}
                      value={selectedDates}
                      tileClassName={({ date }) =>
                        isDateDisabled(date, venue.bookings)
                          ? "bg-gray-100 text-gray-400"
                          : null
                      }
                    />

                    <div className="mt-4 flex justify-between items-center">
                      <p className="text-gray-700">
                        Total: ${calculateTotalPrice()}
                      </p>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setSelectedDates([null, null])}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                          Clear
                        </button>
                        <button
                          onClick={closeCalendar}
                          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={venue?.maxGuests || 1}
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="border border-gray-200 rounded-lg px-4 py-2 w-full 
                      focus:ring-2 focus:ring-cyan-100 focus:border-cyan-600"
                  />
                </div>

                <button
                  onClick={handleBooking}
                  className="mt-4 w-full bg-gradient-to-r from-cyan-600 to-cyan-500 text-white 
                    py-3 rounded-lg font-medium hover:from-cyan-700 hover:to-cyan-600 
                    transition-all duration-200"
                >
                  Book Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:mt-0 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <Link to={`/profiles/${venue.owner?.name}`} className="flex items-center space-x-4">
            <img
              src={venue.owner?.avatar.url || "https://picsum.photos/200/300"}
              alt={venue.owner?.name || "Host"}
              className="w-16 h-16 object-cover rounded-full"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {venue.owner?.name || "Unknown Host"}
              </h3>
              <p className="text-gray-600">Host</p>
            </div>
          </Link>

          <div className="my-6 border-t border-gray-200" />

          <p className="text-gray-700 leading-relaxed">
            {venue.description || "No description available."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SingleVenuePage;