import { useState } from "react";
import { useData } from "../context/DataContext";

const vide = { symbole: "", nom: "", prix_actuel: "" };

export default function AdminActions() {
  const { actions, ajouterAction, modifierAction, supprimerAction } = useData();
  const [form, setForm] = useState(vide);
  const [enEdition, setEnEdition] = useState(null);
  const [message, setMessage] = useState(null);

  const changer = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const annuler = () => {
    setEnEdition(null);
    setForm(vide);
  };

  const soumettre = (e) => {
    e.preventDefault();
    const resultat =
      enEdition === null ? ajouterAction(form) : modifierAction(enEdition, form);
    setMessage(resultat);
    if (resultat.ok) annuler();
  };

  const modifier = (a) => {
    setEnEdition(a.id);
    setForm({ symbole: a.symbole, nom: a.nom, prix_actuel: String(a.prix_actuel) });
    setMessage(null);
  };

  const supprimer = (a) => {
    if (window.confirm(`Supprimer l'action ${a.nom} ?`)) {
      setMessage(supprimerAction(a.id));
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestion des actions</h2>

      {message && (
        <div className={`alert alert-${message.ok ? "success" : "danger"}`}>
          {message.message}
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <h5>{enEdition === null ? "Ajouter une action" : "Modifier l'action"}</h5>
          <form onSubmit={soumettre} className="row g-2 align-items-end">
            <div className="col-md-2">
              <label className="form-label">Symbole</label>
              <input className="form-control" name="symbole"
                value={form.symbole} onChange={changer} />
            </div>
            <div className="col-md-5">
              <label className="form-label">Nom</label>
              <input className="form-control" name="nom"
                value={form.nom} onChange={changer} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Prix (MAD)</label>
              <input type="number" step="0.01" min="0" className="form-control"
                name="prix_actuel" value={form.prix_actuel} onChange={changer} />
            </div>
            <div className="col-md-3">
              <button type="submit" className="btn btn-primary me-2">
                {enEdition === null ? "Ajouter" : "Enregistrer"}
              </button>
              {enEdition !== null && (
                <button type="button" className="btn btn-secondary" onClick={annuler}>
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>Symbole</th>
            <th>Nom</th>
            <th>Prix (MAD)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {actions.map((a) => (
            <tr key={a.id}>
              <td>{a.symbole}</td>
              <td>{a.nom}</td>
              <td>{a.prix_actuel.toLocaleString("fr-FR")}</td>
              <td>
                <button className="btn btn-outline-primary btn-sm me-2"
                  onClick={() => modifier(a)}>Modifier</button>
                <button className="btn btn-outline-danger btn-sm"
                  onClick={() => supprimer(a)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}