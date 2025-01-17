export const fetchProfile = async (userId) => {
  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/holidaze/venues/${params.id}?_owner=true&_bookings=true`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch profile data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};
