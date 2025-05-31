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
import Landing from "./Pages/Landing"; // you'll create this
import "./App.css";
// import PrivateRoute from "./Components/PrivateRoute";
import Community from "./Pages/Community";
import { Toaster, toast } from "react-hot-toast";

const Layout = ({ children }) => {
  const location = useLocation();

  if (location.pathname.startsWith("/preview")) {
    return <>{children}</>;
  }

  // if (location.pathname.startsWith("/")) {
  //   return <>{children}</>; // no navbar for landing page
  // }

  if (
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup")
  ) {
    return <>{children}</>; // no navbar for auth pages
  }

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
  return (
    <Layout>
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
