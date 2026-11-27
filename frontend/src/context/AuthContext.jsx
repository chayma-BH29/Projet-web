import { createContext, useContext, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);


const versUtilisateur = (u) => ({ id: u.id, nom: u.name, role: u.role });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  const ouvrirSession = ({ user: u, token }) => {
    const utilisateur = versUtilisateur(u);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(utilisateur));
    setUser(utilisateur);
    return utilisateur;
  };

  const login = async (email, password) => {
    const { data } = await api.post("/login", { email, password });
    return ouvrirSession(data);
  };

  const register = async (name, email, password, password_confirmation) => {
    const { data } = await api.post("/register", {
      name, email, password, password_confirmation,
    });
    return ouvrirSession(data);
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {
      
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);