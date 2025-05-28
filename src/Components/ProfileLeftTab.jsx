import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";

const ProfileLeftTab = ({
  onEditClick,
  refreshKey,
  selectedUser,
  onCloseClick,
}) => {
  const baseURL =
    process.env.REACT_APP_API_URL || "https://yugen-service.onrender.com";

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
    if (!storedUser?.token && !selectedUser) return;

    try {
      const baseURL =
        process.env.REACT_APP_API_URL || "https://yugen-service.onrender.com";

      let res;

      if (selectedUser) {
        // ✅ Corrected route for viewing another user's profile
        // res = await axios.get(
        //   `http://localhost:5000/api/auth/user/${selectedUser}`
        // );

        res = await axios.get(`${baseURL}/api/auth/user/${selectedUser}`);
      } else {
        // res = await axios.get("http://localhost:5000/api/auth/me", {
        //   headers: {
        //     Authorization: `Bearer ${storedUser.token}`,
        //   },
        // });

        res = await axios.get(`${baseURL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${storedUser.token}`,
          },
        });
      }

      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  };

  useEffect(() => {
    fetchUserData();
    window.addEventListener("profile-updated", fetchUserData);
    return () => window.removeEventListener("profile-updated", fetchUserData);
  }, [refreshKey, selectedUser]);

  // const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  return (
    <div className="mt-[30px] ml-[30px] w-[360px] h-[80vh] bg-[#6D6AEF] rounded-[50px] flex flex-col">
      {/* Banner */}
      <div className="w-[360px] h-[30%] rounded-t-[50px] relative overflow-hidden">
        <img
          // src={`${API_BASE_URL}${user.bannerImage || "/default_banner.png"}`}
          src={`${baseURL}/api/auth/image/${userId}/bannerImage`}
          alt="banner"
          className="w-full h-full object-cover rounded-t-[50px]"
        />

        {selectedUser ? (
          <div
            className="bg-white w-[30px] h-[30px] rounded-[12px] flex justify-center items-center absolute top-[20px] right-[20px] cursor-pointer"
            onClick={onCloseClick}
          >
            <IoClose size={20} />
          </div>
        ) : (
          <div
            className="bg-white w-[30px] h-[30px] rounded-[12px] flex justify-center items-center absolute top-[20px] right-[20px] cursor-pointer"
            onClick={onEditClick}
          >
            <img
              src="/edit-black.png"
              alt="edit"
              className="w-[20px] h-[20px]"
            />
          </div>
        )}
      </div>

      {/* Profile Picture */}
      <div className="flex justify-center items-center relative -mt-[60px] z-10">
        <div className="w-[120px] h-[120px] rounded-[30px] border-4 border-white overflow-hidden shadow-lg">
          <img
            src={`${baseURL}/api/auth/image/${userId}/profileImage`}
            alt="Profile"
            className="w-full h-full rounded-[30px] object-cover"
          />
        </div>
      </div>

      {/* Stats */}
      {/* Stats */}
      <div className="flex justify-evenly gap-42 relative mt-[-40px] text-white">
        <div className="text-center">
          <h1>Followers</h1>
          <p>{user.followers}</p>
        </div>
        <div className="text-center">
          <h1>Following</h1>
          <p>{user.following}</p>
        </div>
      </div>

      {/* Name, Handle, Bio */}
      <div className="flex flex-col justify-center items-center mt-[10px] text-white">
        <h1 className="text-[25px]">{user.name}</h1>
        <h3 className="text-[15px]">@{user.username}</h3>
        <p className="text-center mt-[10px] ml-[40px] mr-[40px] text-[12px]">
          {user.bio || "No bio provided."}
        </p>
      </div>

      {/* Skills */}
      <div className="ml-[30px] mr-[30px] mt-[20px]">
        <h1 className="text-white font-semibold mb-[8px]">SKILLS</h1>
        <div className="grid grid-cols-4 gap-3 text-[12px]">
          {(user.skills || []).map((skill, index) => (
            <div
              key={index}
              className="bg-white text-center px-[6px] py-[4px] rounded"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileLeftTab;
