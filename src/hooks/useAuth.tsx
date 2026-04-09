import { useAuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout, isLoading } =
    useAuthContext();

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    isLoading,
    isAdmin: user?.roleId === 1,
  };
};
