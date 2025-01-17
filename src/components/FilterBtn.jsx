import React from "react";
import { FaSlidersH } from "react-icons/fa";

const FilterButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center bg-[#048BA8] text-white rounded-lg px-4 py-2 hover:bg-[#037893] transition-colors"
>
      <span className="mr-2">Filter venues</span>
      <FaSlidersH />
    </button>
  );
};

export default FilterButton;
