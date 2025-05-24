import React from "react";
import Folder from "../Components/Folder";
import NewFolder from "../Components/NewFolder";
import TodayTasks from "../Components/TodayTasks";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="ml-[50px]">
      <div className="flex flex-col lg:flex-row gap-10 mt-[40px]">
        {/* Left Section */}
        <div className="flex-1">
          <h1 className="text-4xl font-[600]">
            <div className="flex gap-2 items-center">
              <span>Hi, {"user"}!</span>
              <div className="skills flex mt-2">
                {["html.png", "html.png", "html.png"].map((src, i) => (
                  <div
                    key={i}
                    className="w-[30px] h-[30px] border border-[#dedede] rounded-full justify-center items-center flex"
                  >
                    <img src={src} className="w-[20px] h-[20px]" alt="" />
                  </div>
                ))}
              </div>
            </div>
            What are your <br />
            plans for today?
          </h1>
          <p className="mt-4 font-[400] text-[14px]">
            This platform is designed to help you manage <br /> your time and
            tasks effectively.
          </p>
        </div>

        {/* Folder Section */}
        <div className="flex  gap-4 mr-[50px]">
          <NewFolder />
          <Folder />
          <Folder />
          <Folder />
        </div>
      </div>

      {/* Today Tasks */}
      <div className="mt-[20px]">
        <TodayTasks />
      </div>
    </div>
  );
};

export default Dashboard;
