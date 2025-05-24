// Components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("user"); // or your token check
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
