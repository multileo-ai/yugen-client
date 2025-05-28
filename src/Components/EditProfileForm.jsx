import React, { useState, useEffect } from "react";
import axios from "axios";

const EditProfileForm = ({ onEditClick }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [skills, setSkills] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;
  const baseURL =
    process.env.REACT_APP_API_URL || "https://yugen-service.onrender.com";

  // Load current user data on mount
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${baseURL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data;
        setName(user.name || "");
        setUsername(user.username || "");
        setBio(user.bio || "");
        setPhone(user.phone || "");
        setDob(user.dob ? user.dob.split("T")[0] : "");
        setSkills(user.skills || []);
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
      });
  }, [token, baseURL]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (profileImage?.size > 500 * 1024 || bannerImage?.size > 500 * 1024) {
      alert("Image size should be under 500KB");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("bio", bio);
    formData.append("phone", phone);
    formData.append("dob", dob);
    formData.append("skills", JSON.stringify(skills));
    if (profileImage) formData.append("profileImage", profileImage);
    if (bannerImage) formData.append("bannerImage", bannerImage);

    try {
      const res = await axios.put(`${baseURL}/api/auth/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Update localStorage user info (keep token)
      const updatedUser = {
        ...storedUser,
        ...res.data,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile updated successfully!");

      setProfileImage(null);
      setBannerImage(null);
    } catch (err) {
      console.error("Update error:", err);
      alert(err.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <div className="flex gap-6 mt-[30px] ml-[30px] max-h-[80vh] overflow-y-auto overflow-x-hidden pr-2 scroll-hidden">
      <div className="w-[970px] min-h-[360px] border border-black rounded-xl p-[20px] bg-white shadow-[rgb(204,219,232)_3px_3px_6px_0px_inset,rgba(255,255,255,0.5)_-3px_-3px_6px_1px_inset] flex flex-col justify-between relative">
        {/* Close Button */}
        <div
          className="bg-white w-[30px] h-[30px] rounded-[12px] flex justify-center items-center absolute top-[20px] right-[20px] cursor-pointer"
          onClick={onEditClick}
        >
          <img
            src="cross-black.png"
            alt="close"
            className="w-[20px] h-[20px]"
          />
        </div>

        {/* Form */}
        <div className="w-full pl-10 pr-10 pt-24 flex flex-col justify-center bg-white max-h-full overflow-y-auto">
          <h2 className="text-3xl font-bold text-[#6D6AEF] mb-6 text-center">
            Personal Information
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6D6AEF]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Choose a unique username"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6D6AEF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6D6AEF]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your number"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6D6AEF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6D6AEF]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Bio</label>
              <textarea
                rows="3"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Enter your bio"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6D6AEF] resize-none"
              />
            </div>

            {/* Skills Section */}
            <div>
              <label className="block text-sm font-semibold mb-1">Skills</label>
              <input
                type="text"
                placeholder="Search a skill..."
                className="w-full border border-gray-300 rounded-md px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#6D6AEF]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {searchTerm && (
                <div className="grid grid-cols-4 gap-2 max-h-[100px] overflow-y-auto">
                  {displayedSkills
                    .filter((skill) => !selectedSkills.includes(skill))
                    .map((skill) => (
                      <div
                        key={skill}
                        onClick={() => {
                          toggleSkill(skill);
                          setSearchTerm("");
                        }}
                        className="cursor-pointer text-center px-[5px] py-[3px] rounded text-sm bg-[#f0f0f0] hover:bg-[#6D6AEF] hover:text-white"
                      >
                        {skill}
                      </div>
                    ))}
                </div>
              )}

              <div className="mt-2 flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <div
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className="bg-[#6D6AEF] text-white px-2 py-1 rounded text-xs cursor-pointer hover:bg-[#5a58d6]"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Profile and Banner Upload */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Banner Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBannerImage(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#6D6AEF] text-white py-2 rounded-md hover:bg-[#5a58d6] transition"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileForm;
