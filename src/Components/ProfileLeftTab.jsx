import React, { useEffect, useState } from "react";

const ProfileLeftTab = () => {
  const [user, setUser] = useState({ name: "", username: "" });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser({
        name: storedUser.name,
        username: storedUser.username,
      });
    }
  }, []);

  return (
    <div>
      <div className="mt-[30px] ml-[30px] w-[360px] h-[80vh] bg-[#6D6AEF] rounded-[50px] flex flex-col ">
        <div className="w-[360px] h-[30%] bg-red-500 rounded-t-[50px]">
          <img
            src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAT//2Q=="
            alt=""
            className="w-[100%] h-[100%] rounded-t-[50px]"
          />
        </div>
        <div className="w-[360px] h-[2px] bg-black flex justify-center items-center">
          <div className="w-[120px] h-[120px] bg-green-500 rounded-[30px]">
            <img
              src="data:image/jpeg;base64,/9j/4AAQSkZJRgABIJG//2Q=="
              alt=""
              className="w-[100%] h-[100%] rounded-[30px] border-2 border-[white]"
            />
          </div>
        </div>
        <div className="flex justify-evenly gap-42 mt-[20px] text-white">
          <div className="text-center">
            <h1>Followers</h1>
            <p>1,234</p>
          </div>
          <div className="text-center">
            <h1>Following</h1>
            <p>1,234</p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center mt-[10px] text-white">
          <h1 className="text-[25px]">{user.name}</h1>
          <h3 className="text-[15px]">@{user.username}</h3>
          <p className="text-center mt-[10px] ml-[40px] mr-[40px] text-[12px]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum
            corrupti, laboriosam iste dolore assumenda aperiam!
          </p>
        </div>

        {/* skills section remains unchanged */}
        <div className="ml-[30px] mr-[30px]">
          <h1 className="text-white">SKILLS</h1>

          <div className="grid grid-cols-4 gap-3 mt-[10px] text-[12px]">
            <div className="bg-[#ffffff] text-center px-[0.8px] py-[3px] whitespace-nowrap rounded">
              Html
            </div>
            <div className="bg-[#ffffff] text-center px-[0.8px] py-[3px] whitespace-nowrap rounded">
              Css
            </div>
            <div className="bg-[#ffffff] text-center px-[0.8px] py-[3px] whitespace-nowrap rounded">
              JavaScript
            </div>
            <div className="bg-[#ffffff] text-center px-[0.8px] py-[3px] whitespace-nowrap rounded">
              React
            </div>
            <div className="bg-[#ffffff] text-center px-[0.8px] py-[3px] whitespace-nowrap rounded">
              Tailwind
            </div>
            <div className="bg-[#ffffff] text-center px-[0.8px] py-[3px] whitespace-nowrap rounded">
              Gsap
            </div>
            <div className="bg-[#ffffff] text-center px-[0.8px] py-[3px] whitespace-nowrap rounded">
              Python
            </div>
            <div className="bg-[#ffffff] text-center px-[0.8px] py-[3px] whitespace-nowrap rounded">
              Java
            </div>
            <div className="bg-[#ffffff] text-center px-[0.8px] py-[3px] whitespace-nowrap rounded">
              Ui/Ux
            </div>
            <div className="bg-[#ffffff] text-center px-[0.8px] py-[3px] whitespace-nowrap rounded">
              HTML
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLeftTab;
