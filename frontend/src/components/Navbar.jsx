import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
  await logout();
  navigate("/login");
};

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">Portefeuille virtuel</Link>
      <div className="navbar-nav me-auto">
        <Link className="nav-link" to="/">Marché</Link>
        {user.role === "user" && (
          <>
            <Link className="nav-link" to="/portefeuille">Portefeuille</Link>
            <Link className="nav-link" to="/graphiques">Graphiques</Link>
          </>
        )}
        {user.role === "admin" && (
          <Link className="nav-link" to="/admin/actions">Gérer les actions</Link>
        )}
      </div>
      <span className="navbar-text me-3">{user.nom}</span>
      <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
        Se déconnecter
      </button>
    </nav>
  );
}