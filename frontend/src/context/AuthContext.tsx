import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth.service";

interface User {
  _id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const checkAuth = async () => {
        try {
           const res = await authService.refreshToken();
           if(res?.data?.accessToken) {
             const storedUser = localStorage.getItem("user");
             if (storedUser) {
                 setUser(JSON.parse(storedUser));
             }
           }
        } catch (error) {
            console.log("Not authenticated");
            localStorage.removeItem("user");
        } finally {
            setLoading(false);
        }
    };
    checkAuth();
  }, []);

  const login = async (credentials: any) => {
    const res = await authService.login(credentials);
    setUser(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  };

  const register = async (userData: any) => {
    await authService.register(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
