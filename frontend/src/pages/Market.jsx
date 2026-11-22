import { useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";

export default function Market() {
  const { actions, solde, positions, acheter, vendre, simulerMarche } = useData();
  const { user } = useAuth();
  const [recherche, setRecherche] = useState("");
  const [selection, setSelection] = useState(null);
  const [type, setType] = useState("achat");
  const [quantite, setQuantite] = useState(1);
  const [message, setMessage] = useState(null);

  const peutTrader = user.role === "investisseur";

  const filtrees = actions.filter(
    (a) =>
      a.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      a.symbole.toLowerCase().includes(recherche.toLowerCase())
  );

  const ouvrir = (action, typeOperation) => {
    setSelection(action);
    setType(typeOperation);
    setQuantite(1);
    setMessage(null);
  };

  const confirmer = (e) => {
    e.preventDefault();
    const q = parseInt(quantite, 10);
    const resultat = type === "achat" ? acheter(selection, q) : vendre(selection, q);
    setMessage(resultat);
    if (resultat.ok) setSelection(null);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Marché</h2>
        {peutTrader && (
          <div>
            <button className="btn btn-outline-primary btn-sm me-3" onClick={simulerMarche}>
              Simuler le marché
            </button>
            <span className="badge bg-success fs-6">
              Solde : {solde.toLocaleString("fr-FR")} MAD
            </span>
          </div>
        )}
      </div>

      {message && (
        <div className={`alert alert-${message.ok ? "success" : "danger"}`}>
          {message.message}
        </div>
      )}

      <input
        className="form-control mb-3"
        placeholder="Rechercher une action (nom ou symbole)"
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
      />

      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>Symbole</th>
            <th>Nom</th>
            <th>Prix (MAD)</th>
            {peutTrader && <th>Détenues</th>}
            {peutTrader && <th>Opération</th>}
          </tr>
        </thead>
        <tbody>
          {filtrees.map((a) => (
            <tr key={a.id}>
              <td>{a.symbole}</td>
              <td>{a.nom}</td>
              <td>{a.prix_actuel.toLocaleString("fr-FR")}</td>
              {peutTrader && (
                <td>{positions.find((p) => p.action_id === a.id)?.quantite ?? 0}</td>
              )}
              {peutTrader && (
                <td>
                  <button className="btn btn-success btn-sm me-2"
                    onClick={() => ouvrir(a, "achat")}>Acheter</button>
                  <button className="btn btn-danger btn-sm"
                    onClick={() => ouvrir(a, "vente")}>Vendre</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {selection && (
        <div className="card mt-4">
          <div className="card-body">
            <h5>
              {type === "achat" ? "Acheter" : "Vendre"} : {selection.nom}
            </h5>
            <form onSubmit={confirmer} className="row g-2 align-items-end">
              <div className="col-auto">
                <label className="form-label">Quantité</label>
                <input type="number" min="1" className="form-control"
                  value={quantite} onChange={(e) => setQuantite(e.target.value)} />
              </div>
              <div className="col-auto">
                <p className="mb-2">
                  Total : {(selection.prix_actuel * (parseInt(quantite, 10) || 0))
                    .toLocaleString("fr-FR")} MAD
                </p>
              </div>
              <div className="col-auto">
                <button type="submit"
                  className={`btn btn-${type === "achat" ? "success" : "danger"}`}>
                  Confirmer
                </button>
                <button type="button" className="btn btn-secondary ms-2"
                  onClick={() => setSelection(null)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}