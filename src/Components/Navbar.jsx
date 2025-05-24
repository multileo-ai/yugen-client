import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear auth token
    navigate("/login"); // redirect to login page
  };

  useEffect(() => {
    document.body.style.backgroundColor =
      theme === "light" ? "#ffffff" : "#13133B";
  }, [theme]);

  const getTitle = () => {
    if (location.pathname === "/") return "# Dashboard";
    if (location.pathname.startsWith("/editor")) return "# Code Editor";
    if (location.pathname.startsWith("/chatbot")) return "# Chatbot";
    if (location.pathname.startsWith("/community")) return "# Community";
    if (location.pathname.startsWith("/profile")) return "# Profile";
    return "# Code Editor";
  };

  return (
    <div
      className={`flex items-center pl-[50px] pt-[30px] gap-[25%] ${
        theme === "light"
          ? "bg-[#ffffff] text-black"
          : "bg-[#13133B] text-white"
      }`}
    >
      {/* LEFT SIDE */}
      <div className="left flex gap-10 items-center">
        <div className="flex flex-col">
          <h1 className="text-xl font-medium">{getTitle()}</h1>
          <div className="h-1 w-full bg-[#716DEC] mt-1 rounded-full"></div>
        </div>
        <div
          className={`rounded-xl px-4 py-2 w-[300px] h-[40px] flex items-center gap-2 transition-all duration-300 hover:cursor-pointer ${
            theme === "light"
              ? "border border-gray-300 text-black/70 bg-white"
              : "border border-white text-white/80 bg-[#1a1a3b]"
          }`}
        >
          <img
            src={theme === "light" ? "/search-black.png" : "/search-white.png"}
            className="w-5 h-5"
            alt="search"
          />
          <input
            type="text"
            placeholder="Search"
            className={`outline-none bg-transparent w-full hover:cursor-pointer ${
              theme === "light"
                ? "text-black placeholder-black"
                : "text-white placeholder-white"
            }`}
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right flex gap-8 items-center">
        {/* Theme toggle */}
        <div
          className="theme flex gap-4 items-center bg-[#E3E5F8] rounded-xl px-4 py-2 text-center hover:cursor-pointer"
          onClick={handleToggleTheme}
        >
          <div
            className={`${
              theme === "light"
                ? "bg-[#716DEC] text-white"
                : "bg-transparent text-black"
            } rounded-xl px-4 py-2 w-[100px] flex items-center gap-2`}
          >
            <img
              src={theme === "light" ? "/sun-white.png" : "/sun-black.png"}
              className="w-5 h-5"
              alt="light"
            />
            <h1>Light</h1>
          </div>
          <div
            className={`${
              theme === "light"
                ? "bg-transparent text-black"
                : "bg-[#716DEC] text-white"
            } rounded-xl px-4 py-2 w-[100px] flex items-center gap-2`}
          >
            <img
              src={theme === "light" ? "/moon-black.png" : "/moon-white.png"}
              className="w-5 h-5"
              alt="dark"
            />
            <h1>Dark</h1>
          </div>
        </div>

        {/* Notification and settings */}
        <img
          src={
            theme === "light"
              ? "/notification-black.png"
              : "/notification-white.png"
          }
          className="w-6 h-6 hover:cursor-pointer"
          alt="notification"
        />
        <img
          src={
            theme === "light" ? "/settings-black.png" : "/settings-white.png"
          }
          className="w-6 h-6 hover:cursor-pointer"
          alt="settings"
        />

        {/* Premium */}
        <div
          className={`rounded-xl px-4 py-2 w-[100px] text-center hover:cursor-pointer ${
            theme === "light"
              ? "bg-[#E3E5F8] text-black"
              : "bg-[#716DEC] text-white"
          }`}
        >
          <h1>PREMIUM</h1>
        </div>

        {/* LOGOUT */}
        <div
          onClick={handleLogout}
          className={`rounded-xl px-4 py-2 w-[100px] text-center hover:cursor-pointer ${
            theme === "light"
              ? "bg-[#ff4141] text-white"
              : "bg-[#ffffff] text-[#ff4141]"
          }`}
        >
          <h1>LOGOUT</h1>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
