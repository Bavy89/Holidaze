import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import FilterButton from "../components/FilterBtn";
import FilterOverlay from "../components/FilterOverlay";

const HomePage = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    rating: "",
    guests: "",
    price: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("idle");

  const openFilter = () => setIsFilterOpen(true);
  const closeFilter = () => setIsFilterOpen(false);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const parallaxBg = document.querySelector('.parallax-bg');
      if (parallaxBg) {
        parallaxBg.style.transform = `translate3d(0, ${scrolled * 0.5}px, 0)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchVenues = async () => {
      setStatus("loading");
      try {
        const response = await fetch(
          "https://v2.api.noroff.dev/holidaze/venues?sort=created"
        );
        if (!response.ok) throw new Error("Failed to fetch venues");
        const data = await response.json();
        const sortedVenues = data.data.sort(
          (a, b) => new Date(b.created) - new Date(a.created)
        );

        setVenues(sortedVenues);
        setFilteredVenues(sortedVenues);
        setStatus("success");
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    };

    fetchVenues();
  }, []);

  const applyFiltersAndSearch = () => {
    const filtered = venues.filter((venue) => {
      const searchMatch = searchValue 
        ? venue.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
          venue.location?.city?.toLowerCase().includes(searchValue.toLowerCase()) ||
          venue.location?.country?.toLowerCase().includes(searchValue.toLowerCase())
        : true;

      const matchesLocation = filters.location
        ? venue.location?.city
            ?.toLowerCase()
            .includes(filters.location.toLowerCase())
        : true;
      const matchesRating = filters.rating
        ? venue.rating >= filters.rating
        : true;
      const matchesGuests = filters.guests
        ? venue.maxGuests >= parseInt(filters.guests)
        : true;
      const matchesPrice = filters.price
        ? venue.price <= parseInt(filters.price)
        : true;

      return searchMatch && matchesLocation && matchesRating && matchesGuests && matchesPrice;
    });
    setFilteredVenues(filtered);
  };

  useEffect(() => {
    applyFiltersAndSearch();
  }, [searchValue, filters]);

  return (
    <div>
<div className="relative h-[50vh] -mt-[4rem] mb-4 overflow-hidden">
  <div 
    className="absolute inset-0 bg-cover bg-center parallax-bg"
    style={{
      backgroundImage: 'url("https://images.unsplash.com/photo-1567697764010-09b279bc568d?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
      transform: 'translate3d(0, 0, 0)',
      height: '120%',
      top: '-10%'
    }}
  >
    <div className="absolute inset-0 bg-black/30"></div>
  </div>

  <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 sm:px-6 md:px-8">
    <div className="text-center space-y-20 sm:space-y-8 max-w-3xl w-full"> {/* Increased space on mobile */}
      <h2 className="text-6xl sm:text-6xl md:text-7xl lg:text-8xl font-bold border-2 border-white px-4 sm:px-8 md:px-12 lg:px-16 py-4 sm:py-6 md:py-8 inline-block shadow-[0_0_15px_rgba(255,255,255,0.3)]">
        HoliDaze
      </h2>
            
      <div className="relative w-full px-0 mx-auto sm:px-0 sm:max-w-2xl">
        <input
          type="text"
          placeholder="Search venues by name, location, or price..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-none sm:rounded-full text-gray-900"
        />
      </div>
    </div>
  </div>
</div>

      <div id="venues-section" className="p-6">
        <div className="mt-2">
          {status === "loading" && (
            <div className="flex items-center justify-center w-full h-48">
              <div className="spinner"></div>
            </div>
          )}
          {status === "error" && (
            <p>Failed to load venues. Please try again later.</p>
          )}
          {status === "success" && venues.length === 0 && (
            <p>No venues available.</p>
          )}
          {status === "success" && venues.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="mb-6 w-full max-w-7xl">
                <FilterButton onClick={openFilter} />
              </div>

              <FilterOverlay
                isOpen={isFilterOpen}
                onClose={closeFilter}
                filters={filters}
                setFilters={setFilters}
                onFilterApply={applyFiltersAndSearch}
              />
              <div className="mt-6 flex justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-6">
                  {filteredVenues.map((venue) => (
                    <Card
                      key={venue.id}
                      id={venue.id}
                      media={
                        venue.media && venue.media.length > 0
                          ? venue.media[0].url
                          : "https://picsum.photos/200/300"
                      }
                      title={venue.name}
                      location={venue.location?.city}
                      address={venue.location?.address}
                      rating={venue.rating}
                      price={venue.price}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
