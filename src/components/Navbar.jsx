import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { apiGet } from "../utils/apiKey";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");
  const loggedInUserName = localStorage.getItem("user");
  const ref = useOutsideClick(() => {
    setMenuOpen(false);
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isLoggedIn && loggedInUserName) {
        try {
          const response = await apiGet(`/profiles/${loggedInUserName}`);
          setIsVenueManager(response.data.venueManager || false);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [isLoggedIn, loggedInUserName]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleLogoClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.location.reload();
    }
  };

  return (
    <>
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 
        ${isScrolled 
          ? 'bg-white/25 backdrop-blur-md shadow-md py-2' 
          : 'bg-gradient-to-r from-cyan-600 to-cyan-500 py-4'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <Link
            to="/"
            className={`text-2xl font-semibold transition-colors
              ${isScrolled ? 'text-cyan-600' : 'text-white'}`}
            onClick={handleLogoClick}
          >
            Holidaze
          </Link>

          <div ref={ref} className="flex items-center space-x-6">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className={`flex items-center space-x-2 rounded-full px-4 py-2
                    transition-colors duration-200
                    ${isScrolled 
                      ? 'hover:bg-cyan-50 text-cyan-600' 
                      : 'hover:bg-white/10 text-white'}`}
                >
                  <FaUserCircle className="text-2xl" />
                  <span className="font-medium">Profile</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 bg-white rounded-lg border border-gray-100 shadow-lg w-48 overflow-hidden">
                    <Link
                      to={`/profiles/${loggedInUserName}`}
                      className="block px-4 py-2.5 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    {isVenueManager && (
                      <Link
                        to="/create"
                        className="block px-4 py-2.5 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        Create Venue
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors border-t border-gray-100"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`transition-colors duration-200
                    ${isScrolled 
                      ? 'text-gray-600 hover:text-cyan-600' 
                      : 'text-white hover:text-cyan-100'}`}
                >
                  Log in
                </Link>

                <Link
                  to="/signup"
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${isScrolled 
                      ? 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm hover:shadow' 
                      : 'bg-white text-cyan-600 hover:bg-cyan-50'}`}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="h-24"></div>
    </>
  );
};

export default Navbar;
