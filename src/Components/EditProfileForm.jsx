import React, { useState, useEffect } from "react";
import axios from "axios";

const ALL_SKILLS = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "Django",
  "CSS",
  "HTML",
  "MongoDB",
  "SQL",
  "Java",
  "C++",
  "AWS",
  "Docker",
  "Kubernetes",
  "TypeScript",
  "Go",
  "Ruby",
  "Swift",
  "PHP",
  "Angular",
  "Vue.js",
]; // example skills list for search dropdown

const EditProfileForm = ({ onEditClick }) => {
  // Form state object to hold text inputs
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "", // you had email input in the second code but not in first
    phone: "",
    dob: "",
    bio: "",
  });

  // Skills state
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Image file states
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;
  const baseURL =
    process.env.REACT_APP_API_URL || "https://yugen-service.onrender.com";

  // Filter skills by searchTerm (case-insensitive)
  const displayedSkills = ALL_SKILLS.filter((skill) =>
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle skill selection
  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // Handle input change for form object
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Load current user data on mount
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${baseURL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data;
        setForm({
          name: user.name || "",
          username: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
          dob: user.dob ? user.dob.split("T")[0] : "",
          bio: user.bio || "",
        });
        setSelectedSkills(user.skills || []);
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
      });
  }, [token, baseURL]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Image size validation
    if (
      (profileImage && profileImage.size > 500 * 1024) ||
      (bannerImage && bannerImage.size > 500 * 1024)
    ) {
      alert("Image size should be under 500KB");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("username", form.username);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("dob", form.dob);
    formData.append("bio", form.bio);
    formData.append("skills", JSON.stringify(selectedSkills));
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

      // Reset images
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
          <form className="space-y-4" onSubmit={handleSubmit}>
            <h2 className="text-3xl font-bold text-[#6D6AEF] text-center mt-10">
              Personal Information
            </h2>
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
                  required
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
                  required
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
                  required
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
                        className="cursor-pointer rounded-md bg-[#6D6AEF] text-white px-2 py-1 text-center hover:bg-[#5653d4]"
                      >
                        {skill}
                      </div>
                    ))}
                </div>
              )}

              {/* Selected skills */}
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedSkills.map((skill) => (
                  <div
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className="cursor-pointer rounded-md border border-[#6D6AEF] bg-white px-3 py-1 text-[#6D6AEF] hover:bg-[#6D6AEF] hover:text-white"
                  >
                    {skill} &times;
                  </div>
                ))}
              </div>
            </div>

            {/* Image upload section */}
            <div className="flex gap-8 mt-6">
              <div>
                <label className="block font-semibold mb-1">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
                {profileImage && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected: {profileImage.name}
                  </div>
                )}
              </div>
              <div>
                <label className="block font-semibold mb-1">Banner Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBannerImage(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
                {bannerImage && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected: {bannerImage.name}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-8 py-3 rounded-md bg-[#6D6AEF] text-white font-semibold hover:bg-[#5653d4] transition"
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
