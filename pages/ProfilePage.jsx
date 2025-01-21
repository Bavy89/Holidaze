import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import Card from "../components/Card";
import { apiGet, apiPut } from "../utils/apiKey";

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editing, setEditing] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loggedInUserName = localStorage.getItem("user");

  const calculateDays = (dateFrom, dateTo) => {
    const start = new Date(dateFrom);
    const end = new Date(dateTo);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await apiGet(
          `/profiles/${id}?_venues=true&_bookings=true`
        );
        setProfile(profileData.data);
        setNewBio(profileData.data.bio || "");
        setNewAvatar(profileData.data.avatar?.url || "");

        if (profileData.data.venueManager) {
          const venuesData = await apiGet(
            `/profiles/${id}/venues?_bookings=true`
          );
          setVenues(venuesData.data || []);
        } else {
          const bookingsData = await apiGet(`/profiles/${id}?_bookings=true`);
          setBookings(bookingsData.data.bookings || []);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleProfileUpdate = async () => {
    try {
      const payload = {
        avatar: {
          url: newAvatar || profile.avatar?.url || "",
          alt: "User avatar",
        },
        bio: newBio || profile.bio || "",
      };

      const response = await apiPut(
        `/holidaze/profiles/${profile.name}`,
        payload
      );
      setProfile((prevProfile) => ({ ...prevProfile, ...response.data }));
      setEditing(false);
      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleBecomeVenueManager = async () => {
    try {
      const apiUrl = `https://v2.api.noroff.dev/holidaze/profiles/${profile.name}`;
      const payload = {
        venueManager: true,
        avatar: {
          url: profile.avatar?.url || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
          alt: "User avatar"
        }
      };
  
      const accessToken = localStorage.getItem("token");
      if (!accessToken) {
        alert("You are not logged in. Please log in to continue.");
        return;
      }
  
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Noroff-API-Key": "09c0fe67-1e49-485e-9d80-96303ed8cfec"
      };
  
      console.log("Making PUT request to:", apiUrl);
      console.log("Payload:", payload);
  
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(payload)
      });
  
      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile((prevProfile) => ({
          ...prevProfile,
          venueManager: true
        }));
        alert("You are now a venue manager!");
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        alert(`Failed to update profile: ${errorData.errors?.[0]?.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error becoming venue manager:", error);
      alert("An error occurred. Please check the console for details.");
    }
  };

  const handleStopBeingVenueManager = async () => {
    try {
      const apiUrl = `https://v2.api.noroff.dev/holidaze/profiles/${profile.name}`;
      const payload = {
        venueManager: false,
        avatar: {
          url: profile.avatar?.url || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
          alt: "User avatar"
        }
      };
  
      const accessToken = localStorage.getItem("token");
      if (!accessToken) {
        alert("You are not logged in. Please log in to continue.");
        return;
      }
  
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Noroff-API-Key": "09c0fe67-1e49-485e-9d80-96303ed8cfec"
      };
  
      console.log("Making PUT request to:", apiUrl);
      console.log("Payload:", payload);
  
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(payload)
      });
  
      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile((prevProfile) => ({
          ...prevProfile,
          venueManager: false
        }));
        alert("You are no longer a venue manager.");
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        alert(`Failed to update profile: ${errorData.errors?.[0]?.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error stopping venue manager:", error);
      alert("An error occurred. Please check the console for details.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="spinner"></div>
      </div>
    );
  if (error || !profile)
    return <p>Failed to load profile. Please try again later.</p>;

  const isOwnProfile = profile.name === loggedInUserName;

  return (
    <div className="max-w-7xl mx-auto p-6 pt-12">
<div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center mb-10 w-full">
  <img
    src={profile.avatar?.url || "https://picsum.photos/200/300"}
    alt={profile.name || "User"}
    className="w-32 h-32 object-cover rounded-full border-4 border-cyan-600 mb-4"
  />
  <h1 className="text-2xl font-semibold text-cyan-700 mb-2">
    {profile.name || "Unknown User"}
  </h1>
  {editing ? (
    <div className="w-full max-w-lg">
      <textarea
        value={newBio}
        onChange={(e) => setNewBio(e.target.value)}
        className="border border-cyan-600 rounded w-full p-2 mt-2"
        placeholder="Write your bio"
      />
      <input
        type="text"
        value={newAvatar}
        onChange={(e) => setNewAvatar(e.target.value)}
        placeholder="Avatar URL"
        className="border border-cyan-600 rounded w-full p-2 mt-2"
      />
      <div className="mt-4 space-x-2">
        <button
          onClick={handleProfileUpdate}
          className="bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700 transition"
        >
          Save Changes
        </button>
        <button
          onClick={() => setEditing(false)}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <>
      <p className="text-gray-600 mt-2 text-center">
        {profile.bio || "No bio available."}
      </p>
      {isOwnProfile && (
        <button
          onClick={() => setEditing(true)}
          className="bg-cyan-600 text-white py-2 px-4 rounded mt-4 hover:bg-cyan-700 transform hover:-translate-y-1 hover:shadow-md transition-all duration-200"
        >
          Edit Profile
        </button>
      )}
    </>
  )}
</div>


{/* Venue Manager Section */}
{profile.venueManager && (
  <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center mb-10 w-full">
    {isOwnProfile && (
      <div className="flex flex-wrap justify-center mb-6 space-x-4">
        <button
          onClick={() => navigate("/create")}
          className="bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700 transform hover:-translate-y-1 hover:shadow-md transition-all duration-200"
        >
          Create Venue
        </button>
        <button
          onClick={handleStopBeingVenueManager}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
        >
          Stop Being Venue Manager
        </button>
      </div>
    )}
    <h2 className="text-xl font-semibold text-cyan-700 mb-4 text-center">
      {profile.name}'s Venues
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {venues.map((venue) => {
        const now = new Date();
        const upcomingBookingsCount = venue.bookings?.filter(
          (booking) => new Date(booking.dateFrom) > now
        ).length;

        return (
          <div key={venue.id} className="relative w-full max-w-sm mx-auto">
            <Card
              id={venue.id}
              media={venue.media[0]?.url || "https://picsum.photos/200/300"}
              title={venue.name}
              location={venue.location?.city}
              address={venue.location?.address}
              rating={venue.rating}
              price={venue.price}
              bookingsCount={upcomingBookingsCount}
            />
            {isOwnProfile && (
              <button
                onClick={() => navigate(`/update/${venue.id}`)}
                className="absolute top-2 right-2 bg-cyan-600 text-white p-2 rounded-full shadow-lg hover:bg-cyan-700 transition"
                title="Edit Venue"
              >
                <AiOutlineEdit size={20} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}

{/* Bookings Section */}
{!profile.venueManager && (
  <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center w-full">
    {isOwnProfile && (
      <button
        onClick={handleBecomeVenueManager}
        className="bg-cyan-600 text-white py-2 px-4 rounded mt-4 hover:bg-cyan-700 transition"
      >
        Become Venue Manager
      </button>
    )}
    <h2 className="text-xl font-semibold text-cyan-700 mb-4 text-center">
      Your Bookings
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {bookings.length > 0 ? (
        bookings.map((booking) => {
          if (!booking?.venue) return null;
          const stayDuration = calculateDays(
            booking.dateFrom,
            booking.dateTo
          );

          return (
            <div key={booking.id} className="relative w-full max-w-sm mx-auto">
              <Card
                id={booking.venue.id}
                media={booking.venue.media?.[0]?.url || "https://picsum.photos/200/300"}
                title={booking.venue.name}
                location={booking.venue.location?.city}
                address={booking.venue.location?.address}
                rating={booking.venue.rating}
                price={booking.venue.price}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 rounded-b-lg">
                <p className="text-white text-sm font-medium text-center">
                  Stay duration: {stayDuration}{" "}
                  {stayDuration === 1 ? "day" : "days"}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-600 text-center">You have no bookings.</p>
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default ProfilePage;