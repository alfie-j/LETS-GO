import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { User, AppConfig } from "@/types";
import { loginUser, logoutUser } from "@/lib/auth";
import { showSuccess, showError } from "@/utils/toast";
import config from "@/config.json"; // Import the config file

interface AppContextType {
  currentUser: User | null;
  isLoggedIn: boolean;
  login: (
    email?: string,
    otp?: string,
    faceImageData?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  theme: "light" | "dark";
  toggleTheme: () => void;
  appConfig: AppConfig;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Initialize user from localStorage if available
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // Initialize theme from localStorage or default to 'dark'
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      return storedTheme as "light" | "dark";
    }
    // Default to dark mode
    return "dark"; 
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Apply theme class to body
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const login = async (
    email?: string,
    otp?: string,
    faceImageData?: string,
  ) => {
    try {
      const user = await loginUser(email, otp, faceImageData);
      setCurrentUser(user);
      navigate("/dashboard");
    } catch (error: any) {
      showError(error.message || "Login failed.");
      throw error; // Re-throw to allow LoginPage to handle specific errors
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      navigate("/login");
    } catch (error: any) {
      showError(error.message || "Logout failed.");
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const isLoggedIn = !!currentUser;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        login,
        logout,
        theme,
        toggleTheme,
        appConfig: config as AppConfig, // Cast imported config to AppConfig type
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};