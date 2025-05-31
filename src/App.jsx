import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import SideNav from "./Components/SideNav";
import Dashboard from "./Pages/Dashboard";
import CodeEditor from "./Pages/CodeEditor";
import EditorPage from "./Pages/EditorPage";
import Preview from "./Pages/Preview";
import ChatBot from "./Pages/ChatBot";
import Profile from "./Pages/Profile";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Landing from "./Pages/Landing";
import Community from "./Pages/Community";
import io from "socket.io-client";
import { Toaster, toast } from "react-hot-toast";

import "./App.css";

// ✅ Create socket connection
const socket = io(
  process.env.REACT_APP_API_URL || "https://yugen-service.onrender.com"
);

const baseURL =
  process.env.REACT_APP_API_URL || "https://yugen-service.onrender.com";

const Layout = ({ children }) => {
  const location = useLocation();

  if (location.pathname.startsWith("/preview")) return <>{children}</>;
  if (
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup")
  )
    return <>{children}</>;

  return (
    <>
      <Navbar />
      <div className="flex">
        <SideNav />
        <div className="flex-grow">{children}</div>
      </div>
    </>
  );
};

const App = () => {
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?._id) return;

    socket.emit("register-user", storedUser._id);

    // ✅ Only one listener
    socket.on("new-notification", (data) => {
      const { message, type, user } = data;

      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <img
                  className="h-10 w-10 rounded-full"
                  src={user?.profileImageUrl || "/default_pfp.jpg"}
                  onError={(e) => {
                    e.target.src = "/default_pfp.jpg";
                  }}
                  alt={user.name}
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="mt-1 text-sm text-gray-500 whitespace-pre-line">
                  {message}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ));
    });

    return () => {
      socket.off("new-notification");
    };
  }, []);

  return (
    <Layout>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/testing1" element={<CodeEditor />} />
        <Route path="/testing2" element={<Profile />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            // <PrivateRoute>
            <Dashboard />
            // </PrivateRoute>
          }
        />
        <Route
          path="/editor"
          element={
            // <PrivateRoute>
            <CodeEditor />
            // </PrivateRoute>
          }
        />
        <Route
          path="/editor/:taskId"
          element={
            // <PrivateRoute>
            <CodeEditor />
            // </PrivateRoute>
          }
        />
        <Route
          path="/editor-preview/:taskId"
          element={
            // <PrivateRoute>
            <EditorPage />
            // </PrivateRoute>
          }
        />
        <Route
          path="/preview/:taskId"
          element={
            // <PrivateRoute>
            <Preview />
            // </PrivateRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            // <PrivateRoute>
            <ChatBot />
            // </PrivateRoute>
          }
        />
        <Route
          path="/community"
          element={
            // <PrivateRoute>
            <Community />
            // </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            // <PrivateRoute>
            <Profile />
            // </PrivateRoute>
          }
        />
      </Routes>
    </Layout>
  );
};

export default App;
