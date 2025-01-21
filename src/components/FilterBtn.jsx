import React from "react";
import { FaSlidersH } from "react-icons/fa";

const FilterButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-full bg-cyan-600/80 backdrop-blur-sm text-white py-4 
                hover:bg-cyan-700/90 transition-all duration-200 border-t border-white/10"
    >
      <span className="mr-2 font-medium">Filter venues</span>
      <FaSlidersH />
    </button>
  );
};

export default FilterButton;
