import React from "react";

// Accept props and destructure `name`
const Folder = ({ name }) => {
  return (
    <div className="w-full h-full flex flex-col items-center hover:cursor-pointer transition-all duration-300">
      <div className="w-[220px] h-[160px] relative hover:shadow-[#4c4c4c] hover:shadow-md rounded-lg">
        {/* Top Tab - Positioned to the Left */}
        <div className="w-[35%] h-[12px] float-left border-b-[12px] border-[#6D6AEF] border-r-[12px] border-r-transparent rounded-tl-[8px]"></div>

        {/* Folder Body */}
        <div className="absolute top-[12px] w-full h-[150px] bg-[#6D6AEF] rounded-bl-[8px] rounded-br-[8px] rounded-tr-[8px]">
          <div className="mt-22 ml-[12px]">
            <p className="text-[12px] font-semibold text-white">4 Nov 2024</p>
            <h1 className="text-[20px] font-semibold text-white">
              {name}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Folder;