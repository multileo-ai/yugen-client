import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", form);
      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8FD] flex items-center justify-center">
      <div className="relative w-[900px] h-[560px] overflow-hidden rounded-2xl shadow-xl bg-white flex">
        {/* SIGNUP FORM */}
        <div className="w-1/2 p-10 flex flex-col justify-center bg-white">
          <h2 className="text-3xl font-bold text-[#6D6AEF] mb-6 text-center">
            Create a New Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6D6AEF]"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Username
              </label>
              <input
                type="text"
                placeholder="Choose a unique username"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6D6AEF]"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6D6AEF]"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6D6AEF]"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#6D6AEF] text-white py-2 rounded-md hover:bg-[#5a58d6] transition"
            >
              Sign Up
            </button>
          </form>
          <p className="text-sm text-center mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#6D6AEF] font-medium hover:underline"
            >
              Login
            </button>
          </p>
        </div>

        {/* RIGHT BLUE PANEL */}
        <div className="w-1/2 bg-[#6D6AEF] text-white flex flex-col justify-center items-center p-10">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="User Icon"
            className="w-28 mb-4"
          />
          <h2 className="text-3xl font-bold mb-2">Hello Friend!</h2>
          <p className="text-center text-sm px-4">
            Enter your personal details and start your journey with us
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
