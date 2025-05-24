import React from "react";

const NewFolder = () => {
  return (
    <div className="w-full h-full flex flex-col items-center hover:cursor-pointer">
      <div className="w-[220px] h-[164px] relative hover:shadow-[#4c4c4c] hover:shadow-sm rounded-lg border-1 border-black border-dashed">
        {/* Top Tab - Positioned to the Left */}
        <div className="w-[35%] h-[12px] float-left border-b-[12px] border-[#d8d8d8] border-r-[12px] border-r-transparent rounded-tl-[8px]"></div>

        {/* Folder Body */}
        <div className="absolute top-[12px] w-full h-[150px] bg-[#d8d8d8] rounded-bl-[8px] rounded-br-[8px] rounded-tr-[8px] flex items-center justify-center">
          <h1 className="text-[40px] font-semibold text-white bg-[#6D6AEF] rounded-xl pb-[8px] w-[50px] h-[50px] flex items-center justify-center">
            +
          </h1>
        </div>
      </div>
    </div>
  );
};

export default NewFolder;
