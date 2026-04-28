import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "@/api/api";

/* =============================
   TYPES
=============================*/
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

/* =============================
   CONTEXT
=============================*/
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* =============================
   PROVIDER
=============================*/
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* =============================
     RESTORE SESSION (SAFE)
  ==============================*/
  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);

          setUser(parsedUser);

          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
        } catch (err) {
          console.error("Invalid stored auth → clearing");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  /* =============================
     LOGIN
  ==============================*/
  const login = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    const res = await api.post("/users/login", {
      email,
      password,
    });

    const { token, user } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;

    setUser(user);

    return { token, user };
  };

  /* =============================
     LOGOUT
  ==============================*/
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    delete api.defaults.headers.common["Authorization"];

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/* =============================
   HOOK
=============================*/
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};