import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { messageErreur } from "../api";

export default function Register() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [erreur, setErreur] = useState("");
  const { register} = useAuth();
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setErreur("");
  if (motDePasse.length < 8) {
    setErreur("Le mot de passe doit contenir au moins 8 caractères");
    return;
  }
  if (motDePasse !== confirmation) {
    setErreur("Les mots de passe ne sont pas identiques");
    return;
  }
  try {
    await register(nom, email, motDePasse, confirmation);
    navigate("/");
  } catch (err) {
    setErreur(messageErreur(err));
  }
};

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <h2 className="mt-5 mb-4 text-center">Inscription</h2>
      {erreur && <div className="alert alert-danger">{erreur}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nom</label>
          <input className="form-control" value={nom}
            onChange={(e) => setNom(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Mot de passe</label>
          <input type="password" className="form-control" value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirmer le mot de passe</label>
          <input type="password" className="form-control" value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-success w-100">
          Créer mon compte
        </button>
      </form>
      <p className="text-center mt-3">
        Déjà inscrit ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
}