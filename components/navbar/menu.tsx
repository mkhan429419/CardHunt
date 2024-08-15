"use client";

import { useState } from "react";
import LaunchesMenu from "./menus/launches-menu";
import Link from "next/link";
import AboutMenu from "./menus/about-menu";

const Menu = () => {
  const [showLaunchesMenu, setShowLaunchesMenu] = useState(false);
  const [showAboutMenu, setShowAboutMenu] = useState(false);

  return (
    <div className="hidden lg:flex items-center relative">
      <div className="space-x-6 text-gray-600 text-sm flex items-center cursor-pointer">
        <Link href={"/"} className="hover:text-[#ff6154]">
          Home
        </Link>
        <Link href={"/my-collections"} className="hover:text-[#ff6154]">
          Flashcards
        </Link>
        <Link href={"/categories"} className="hover:text-[#ff6154]">
          Categories
        </Link>
        <div
          onMouseEnter={() => setShowLaunchesMenu(true)}
          onMouseLeave={() => setShowLaunchesMenu(false)}
          className="hover:text-[#ff6154] py-4"
        >
          Launches {showLaunchesMenu && <LaunchesMenu />}
        </div>

        <Link href={"/pricing"} className="hover:text-[#ff6154]">
          Pricing
        </Link>

        <div
          onMouseEnter={() => setShowAboutMenu(true)}
          onMouseLeave={() => setShowAboutMenu(false)}
          className="hover:text-[#ff6154] py-4"
        >
          About {showAboutMenu && <AboutMenu />}
        </div>
      </div>
    </div>
  );
};

export default Menu;
