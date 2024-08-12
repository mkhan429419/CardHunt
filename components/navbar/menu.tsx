"use client";
import React, { useState } from "react";

const Menu = () => {
  const [showLaunchesMenu, setShowLaunchesMenu] = useState(false);
  return (
    <div className="hidden lg:flex items-center relative">
      <div className="space-x-6 text-gray-600 text-sm flex items-center">
        <div>Launches</div>
      </div>
    </div>
  );
};

export default Menu;
