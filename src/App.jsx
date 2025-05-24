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
import PrivateRoute from "./Components/PrivateRoute";
import Community from "./Pages/Community";

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
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor" element={<CodeEditor />} />
        <Route path="/editor/:taskId" element={<CodeEditor />} />
        <Route path="/editor-preview/:taskId" element={<EditorPage />} />
        <Route path="/preview/:taskId" element={<Preview />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Layout>
  );
};

export default App;
