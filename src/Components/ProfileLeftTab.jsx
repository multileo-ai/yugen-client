import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfileLeftTab = ({ onEditClick, refreshKey }) => {
  const [user, setUser] = useState({
    name: "",
    username: "",
    bio: "",
    skills: [],
    followers: 0,
    following: 0,
    profileImage: "",
    bannerImage: "",
  });

  const fetchUserData = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?.token) return;

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${storedUser.token}`,
          },
        }
      );
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  };

  useEffect(() => {
    fetchUserData();
    window.addEventListener("profile-updated", fetchUserData);
    return () => window.removeEventListener("profile-updated", fetchUserData);
  }, [refreshKey]);

  return (
    <div>
      <div className="mt-[30px] ml-[30px] w-[360px] h-[80vh] bg-[#6D6AEF] rounded-[50px] flex flex-col ">
        <div className="w-[360px] h-[30%] rounded-t-[50px] relative overflow-hidden">
          <img
            src={`http://localhost:5000${
              user.bannerImage || "/default_banner.png"
            }`}
            alt="banner"
            className="w-[100%] h-[100%] rounded-t-[50px]"
          />

          <div className="bg-white w-[30px] h-[30px] rounded-[12px] flex justify-center items-center absolute top-[20px] right-[20px] cursor-pointer">
            <img
              src="edit-black.png"
              alt=""
              className="w-[20px] h-[20px]"
              onClick={onEditClick}
            />
          </div>
        </div>
        <div className="w-[360px] h-[2px] bg-black flex justify-center items-center">
          <div className="w-[120px] h-[120px] rounded-[30px] relative">
            <img
              src={`http://localhost:5000${
                user.profileImage || "/default_pfp.jpg"
              }`}
              alt="profile"
              className="w-[100%] h-[100%] rounded-[30px] border-2 border-[white]"
            />
          </div>
        </div>
        <div className="flex justify-evenly gap-42 mt-[20px] text-white">
          <div className="text-center">
            <h1>Followers</h1>
            <p>{user.followers}</p>
          </div>
          <div className="text-center">
            <h1>Following</h1>
            <p>{user.following}</p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center mt-[10px] text-white">
          <h1 className="text-[25px]">{user.name}</h1>
          <h3 className="text-[15px]">@{user.username}</h3>
          <p className="text-center mt-[10px] ml-[40px] mr-[40px] text-[12px]">
            {user.bio || "No bio provided."}
          </p>
        </div>

        {/* skills section remains unchanged */}
        <div className="ml-[30px] mr-[30px]">
          <h1 className="text-white">SKILLS</h1>
          <div className="grid grid-cols-4 gap-3 mt-[10px] text-[12px]">
            {user.skills.map((skill) => (
              <div
                key={skill}
                className="bg-[#ffffff] text-center px-[0.8px] py-[3px] whitespace-nowrap rounded"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLeftTab;
