import { createContext, useContext, useState, useEffect } from "react";
import api from "../hooks/userApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {

    const token = localStorage.getItem("wl_token");
    const saved = localStorage.getItem("wl_user");
    if (token && saved) {
      setUser(JSON.parse(saved));
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("wl_token", res.data.token);
    localStorage.setItem("wl_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("wl_token", res.data.token);
    localStorage.setItem("wl_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("wl_token");
    localStorage.removeItem("wl_user");
    setUser(null);
  };

  const toggleWishlist = async (tourId) => {
    if (!user) return false;
    try {
      const res = await api.post(`/auth/wishlist/${tourId}`);
      setWishlist(res.data.wishlist);
      return true;
    } catch { return false; }
  };

  const isWishlisted = (tourId) => wishlist.includes(tourId);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);