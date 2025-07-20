import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedType = localStorage.getItem("userType");

        if (storedUser && storedType) {
          const parsedUser = JSON.parse(storedUser);

          const isValidStudent = storedType === "student" && parsedUser?.student?.id;
          const isValidAdmin = storedType === "admin" && parsedUser?.admin?.id;

          if (isValidStudent || isValidAdmin) {
            setUser(parsedUser);
            setUserType(storedType);
          } else {
            console.warn("Invalid user data in storage. Logging out...");
            logout();
          }
        }
      } catch (err) {
        console.error("Auth load failed:", err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, type) => {
    try {
      if (
        !userData ||
        !type ||
        (type === "student" && !userData.student?.id) ||
        (type === "admin" && !userData.admin?.id)
      ) {
        throw new Error("Invalid user data provided for login");
      }

      setUser(userData);
      setUserType(type);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userType", type);
      console.log("Login successful for:", type, userData);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    console.log("User logged out");
  };

  const getCurrentUserId = () => {
    if (userType === "student") return user?.student?.id;
    if (userType === "admin") return user?.admin?.id;
    return null;
  };

  const getCurrentUserData = () => {
    if (userType === "student") return user?.student;
    if (userType === "admin") return user?.admin;
    return null;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userType,
        isLoading,
        isStudent: userType === "student",
        isAdmin: userType === "admin",
        currentUserId: getCurrentUserId(),
        currentUserData: getCurrentUserData(),
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
