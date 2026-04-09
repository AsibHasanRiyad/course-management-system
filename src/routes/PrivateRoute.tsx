/* eslint-disable @typescript-eslint/no-explicit-any */
// routes/PrivateRoute.tsx
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: any) => {
  const token = localStorage.getItem("auth_token");
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
