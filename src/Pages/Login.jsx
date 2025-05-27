import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.identifier || !form.password) {
      setError("Please enter username/email and password.");
      return;
    }

    try {
      // Step 1: Login and get token
      // const res = await axios.post(
      //   "http://localhost:5000/api/auth/login",
      //   form
      // );

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        form
      );

      const { token } = res.data;

      // Step 2: Fetch full user profile using token
      // const profileRes = await axios.get("http://localhost:5000/api/auth/me", {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      const profileRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Step 3: Save token + full user info to localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          token,
          ...profileRes.data,
        })
      );

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8FD] flex items-center justify-center">
      <div className="relative w-[900px] h-[560px] overflow-hidden rounded-2xl shadow-xl bg-white flex">
        {/* LOGIN FORM */}
        <div className="w-1/2 p-10 flex flex-col justify-center bg-white">
          <h2 className="text-3xl font-bold text-[#6D6AEF] mb-6 text-center">
            Login to Your Account
          </h2>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Username or Email
              </label>
              <input
                type="text"
                placeholder="Enter your username or email"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6D6AEF]"
                value={form.identifier}
                onChange={(e) =>
                  setForm({ ...form, identifier: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6D6AEF]"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#6D6AEF] text-white py-2 rounded-md hover:bg-[#5a58d6] transition"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center mt-6">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-[#6D6AEF] font-medium hover:underline"
            >
              Sign Up
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
          <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-center text-sm px-4">
            To keep connected with us please login with your credentials
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
