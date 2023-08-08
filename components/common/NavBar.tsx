import { useRouter } from "next/router";
import React, { useState } from "react";
import { clearAllGlobalItem } from "@/utils/local-storage";
import { handleLogout } from "@/utils/firebase";

interface NavbarProps {
  onContentChange: (content: string) => void;
  activeContent: string;
}

const Navbar: React.FC<NavbarProps> = ({ onContentChange, activeContent }) => {
  const router = useRouter();

  return (
    <nav className="absolute top-0 left-0 right-0 bg-transparent z-10">
      <div className="max-w-6xl mx-auto px-4 py-6 ">
        <div className="flex justify-center items-center">
          <div className="flex space-x-10 my-auto text-21">
            <a
              href="#"
              className={`${
                activeContent === "home"
                  ? "bg-slate-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              } px-3 py-2 rounded-md text-sm font-medium`}
              //   onClick={() => handleTabClick("Home")}
              onClick={() => onContentChange("home")}
            >
              Home
            </a>
            <a
              href="#"
              className={`${
                activeContent === "raw"
                  ? "bg-slate-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              } px-3 py-2 rounded-md text-sm font-medium`}
              onClick={() => onContentChange("raw")}
            >
              Raw Material
            </a>
            <a
              href="#"
              className={`${
                activeContent === "dispatch"
                  ? "bg-slate-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              } px-3 py-2 rounded-md text-sm font-medium`}
              onClick={() => onContentChange("dispatch")}
            >
              Dispatch Product
            </a>
            <a
              href="#"
              className={`${
                activeContent === "company"
                  ? "bg-slate-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              } px-3 py-2 rounded-md text-sm font-medium`}
              onClick={() => onContentChange("company")}
            >
              Company
            </a>
          </div>
        </div>
        <div className="hidden md:flex space-x-4 my-auto justify-end">
          {/* <log out button></log> */}
          <button
            onClick={() => {
              clearAllGlobalItem();
              router.replace("/login");
              handleLogout();
            }}
            type="submit"
            className={`bg-neutral-50 text-neutral-950 rounded-[12px] py-3 px-5 inter-600 disabled:opacity-60 disabled:text-neutral-950 disabled:cursor-not-allowed h-[48px] hover:opacity-80 transition duration-300`}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
