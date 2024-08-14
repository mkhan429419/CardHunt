import React from "react";
import { PiMagnifyingGlass } from "react-icons/pi";

const Generate = () => {
  return (
    <div className="rounded-full flex items-center p-5 h-16 text-gray-500 ml-4 bg-[#f5f8ff] relative">
      <PiMagnifyingGlass className="ml-2 text-red" />
      <input
        type="text"
        placeholder="Enter topic..."
        className="p-2 rounded-full text-xs focus:outline-none bg-[#f5f8ff]"
      />
    </div>
  );
};

export default Generate;
