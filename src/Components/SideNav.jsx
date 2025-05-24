import React from "react";
import { useNavigate } from "react-router-dom";

const SideNav = () => {
  const navigate = useNavigate();

  // Define secureNavigate inside the component so it reads current user status
  const secureNavigate = (path) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) return navigate("/login");
    navigate(path);
  };

  return (
    <div className="flex flex-col gap-4 bg-[#6D6AEF] p-4 w-[100px] h-[60vh] mt-20 pt-13 rounded-tr-[100px] rounded-br-[100px] relative left-[-10px] pl-[20px]">
      <div
        onClick={() => secureNavigate("/dashboard")}
        className="sidebar-icon w-[50px] h-[50px] border-2 border-white rounded-xl flex justify-center items-center hover:cursor-pointer hover:shadow-lg transition-all duration-300"
      >
        <img
          src="/dashboard-white.png"
          className="icon-img w-[30px] h-[30px] hover:scale-110 transition-all duration-300"
          alt="Dashboard"
        />
      </div>
      <div
        onClick={() => secureNavigate("/editor")}
        className="sidebar-icon w-[50px] h-[50px] border-2 border-white rounded-xl flex justify-center items-center hover:cursor-pointer hover:shadow-lg transition-all duration-300"
      >
        <img
          src="/code-editor-white.png"
          className="icon-img w-[30px] h-[30px] hover:scale-110 transition-all duration-300"
          alt="Editor"
        />
      </div>
      <div
        onClick={() => secureNavigate("/chatbot")}
        className="sidebar-icon w-[50px] h-[50px] border-2 border-white rounded-xl flex justify-center items-center hover:cursor-pointer hover:shadow-lg transition-all duration-300"
      >
        <img
          src="/chatbot-white.png"
          className="icon-img w-[30px] h-[30px] hover:scale-110 transition-all duration-300"
          alt="Chatbot"
        />
      </div>
      <div
        onClick={() => secureNavigate("/community")}
        className="sidebar-icon w-[50px] h-[50px] border-2 border-white rounded-xl flex justify-center items-center hover:cursor-pointer hover:shadow-lg transition-all duration-300"
      >
        <img
          src="/community-white.png"
          className="icon-img w-[30px] h-[30px] hover:scale-110 transition-all duration-300"
          alt="Community"
        />
      </div>
      <div
        onClick={() => secureNavigate("/profile")}
        className="sidebar-icon w-[50px] h-[50px] border-2 border-white rounded-xl flex justify-center items-center hover:cursor-pointer hover:shadow-lg transition-all duration-300"
      >
        <img
          src="/profile-white.png"
          className="icon-img w-[30px] h-[30px] hover:scale-110 transition-all duration-300"
          alt="Profile"
        />
      </div>
    </div>
  );
};

export default SideNav;
