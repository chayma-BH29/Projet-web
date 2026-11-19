import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { users } from "../data/mock";

export default function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trouve = users.find(
      (u) => u.email === email && u.mot_de_passe === motDePasse
    );
    if (!trouve) {
      setErreur("Email ou mot de passe incorrect");
      return;
    }
    login({ id: trouve.id, nom: trouve.nom, role: trouve.role });
    navigate(trouve.role === "admin" ? "/admin/actions" : "/");
  };

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <h2 className="mt-5 mb-4 text-center">Connexion</h2>
      {erreur && <div className="alert alert-danger">{erreur}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Mot de passe</label>
          <input
            type="password"
            className="form-control"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Se connecter
        </button>
      </form>
      <p className="text-center mt-3">
        Pas de compte ? <Link to="/register">S'inscrire</Link>
      </p>
    </div>
  );
}