import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();
export const useUserContext = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Persist user to localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // Save entire user (after creating new user)
  const saveUser = (userData) => {
    setUser(userData);
  };

  // 🔥 Update or insert an address
  const updateAddress = (updatedAddress) => {
    setUser((prev) => {
      if (!prev) return prev;

      const exists = prev.addresses?.some(a => a._id === updatedAddress._id);

      return {
        ...prev,
        addresses: exists
          ? prev.addresses.map((a) =>
              a._id === updatedAddress._id ? updatedAddress : a
            )
          : [...(prev.addresses || []), updatedAddress],
      };
    });
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("addressId");
  };

  return (
    <UserContext.Provider value={{ user, saveUser, updateAddress, logout }}>
      {children}
    </UserContext.Provider>
  );
}
