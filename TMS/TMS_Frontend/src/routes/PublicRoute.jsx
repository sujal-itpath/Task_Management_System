import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // or use AuthContext/Zustand

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
