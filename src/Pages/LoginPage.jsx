import React, { useState } from "react";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-[#F8F8FD] flex items-center justify-center">
      <div className="relative w-[900px] h-[560px] overflow-hidden rounded-2xl shadow-xl bg-white">
        {/* Slide Container */}
        <div
          className={`flex w-[200%] h-full transition-transform duration-700 ease-in-out ${
            isLogin ? "translate-x-0" : "-translate-x-1/2"
          }`}
        >
          {/* LOGIN SIDE */}
          <div className="w-1/2 bg-[#6D6AEF] text-white flex flex-col justify-center items-center p-10">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="User Icon"
              className="w-28 mb-4"
            />
            <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
            <p className="text-center text-sm px-4">
              To keep connected with us please login with your personal info
            </p>
          </div>

          <div className="w-1/2 p-10 flex flex-col justify-center bg-white">
            <h2 className="text-3xl font-bold text-[#6D6AEF] mb-6 text-center">
              Login to Your Account
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6D6AEF]"
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
                />
              </div>
              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="accent-[#6D6AEF]" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-[#6D6AEF] hover:underline">
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full bg-[#6D6AEF] text-white py-2 rounded-md hover:bg-[#5a58d6] transition"
              >
                Login
              </button>
            </form>
            <p className="text-sm text-center mt-6">
              Don’t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-[#6D6AEF] font-medium hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>

          {/* SIGN UP SIDE */}
          <div className="w-1/2 p-10 flex flex-col justify-center bg-white">
            <h2 className="text-3xl font-bold text-[#6D6AEF] mb-6 text-center">
              Create a New Account
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6D6AEF]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6D6AEF]"
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
                onClick={() => setIsLogin(true)}
                className="text-[#6D6AEF] font-medium hover:underline"
              >
                Login
              </button>
            </p>
          </div>

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
    </div>
  );
};

export default LoginPage;
