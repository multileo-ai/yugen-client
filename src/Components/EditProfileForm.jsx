import React, { useState, useEffect } from "react";
import axios from "axios";

const EditProfileForm = () => {
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              className="border p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              className="border p-2 rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone"
              className="border p-2 rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="date"
              className="border p-2 rounded"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          <textarea
            placeholder="Bio"
            className="border p-2 rounded w-full mt-4"
            rows="3"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          {/* Skills input (simplified for now) */}
          <input
            type="text"
            placeholder="Skills (comma separated)"
            className="border p-2 rounded w-full mt-4"
            value={skills.join(", ")}
            onChange={(e) =>
              setSkills(e.target.value.split(",").map((s) => s.trim()))
            }
          />

          {/* Profile & Banner Image Uploads */}
          <div className="mt-4">
            <label className="block mb-1 font-medium">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files[0])}
            />
          </div>

          <div className="mt-4">
            <label className="block mb-1 font-medium">Banner Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBannerImage(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-[#6D6AEF] text-white font-semibold py-2 rounded hover:bg-[#5a58d6] transition duration-200"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm;
