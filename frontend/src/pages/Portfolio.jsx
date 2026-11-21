import { useData } from "../context/DataContext";

const CAPITAL_INITIAL = 100000;

const format = (n) => n.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
const couleur = (n) => (n >= 0 ? "text-success" : "text-danger");

export default function Portfolio() {
  const { actions, solde, positions, transactions } = useData();

  const lignes = positions
    .map((p) => {
      const action = actions.find((a) => a.id === p.action_id);
      if (!action) return null;
      const valeur = action.prix_actuel * p.quantite;
      const gain = (action.prix_actuel - p.prix_moyen) * p.quantite;
      const pourcentage = (action.prix_actuel / p.prix_moyen - 1) * 100;
      return { ...p, action, valeur, gain, pourcentage };
    })
    .filter(Boolean);

  const valeurActions = lignes.reduce((somme, l) => somme + l.valeur, 0);
  const valeurTotale = solde + valeurActions;
  const gainGlobal = valeurTotale - CAPITAL_INITIAL;

  const historique = [...transactions].reverse();

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Mon portefeuille</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card"><div className="card-body">
            <div className="text-muted">Solde disponible</div>
            <div className="fs-5 fw-bold">{format(solde)} MAD</div>
          </div></div>
        </div>
        <div className="col-md-3">
          <div className="card"><div className="card-body">
            <div className="text-muted">Valeur des actions</div>
            <div className="fs-5 fw-bold">{format(valeurActions)} MAD</div>
          </div></div>
        </div>
        <div className="col-md-3">
          <div className="card"><div className="card-body">
            <div className="text-muted">Valeur totale</div>
            <div className="fs-5 fw-bold">{format(valeurTotale)} MAD</div>
          </div></div>
        </div>
        <div className="col-md-3">
          <div className="card"><div className="card-body">
            <div className="text-muted">Gain / perte global</div>
            <div className={`fs-5 fw-bold ${couleur(gainGlobal)}`}>
              {gainGlobal >= 0 ? "+" : ""}{format(gainGlobal)} MAD
            </div>
          </div></div>
        </div>
      </div>

      <h4>Mes positions</h4>
      {lignes.length === 0 ? (
        <p className="text-muted">Vous ne détenez aucune action pour le moment.</p>
      ) : (
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Action</th>
              <th>Quantité</th>
              <th>Prix moyen</th>
              <th>Prix actuel</th>
              <th>Valeur</th>
              <th>Gain / perte</th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((l) => (
              <tr key={l.action_id}>
                <td>{l.action.symbole} - {l.action.nom}</td>
                <td>{l.quantite}</td>
                <td>{format(l.prix_moyen)}</td>
                <td>{format(l.action.prix_actuel)}</td>
                <td>{format(l.valeur)}</td>
                <td className={couleur(l.gain)}>
                  {format(l.gain)} ({l.pourcentage.toFixed(2)} %)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h4 className="mt-4">Historique des transactions</h4>
      {historique.length === 0 ? (
        <p className="text-muted">Aucune transaction.</p>
      ) : (
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Action</th>
              <th>Quantité</th>
              <th>Prix unitaire</th>
              <th>Montant</th>
            </tr>
          </thead>
          <tbody>
            {historique.map((t) => {
              const action = actions.find((a) => a.id === t.action_id);
              return (
                <tr key={t.id}>
                  <td>{new Date(t.date).toLocaleString("fr-FR")}</td>
                  <td>
                    <span className={`badge bg-${t.type === "achat" ? "success" : "danger"}`}>
                      {t.type}
                    </span>
                  </td>
                  <td>{action ? action.symbole : "-"}</td>
                  <td>{t.quantite}</td>
                  <td>{format(t.prix_unitaire)}</td>
                  <td>{format(t.prix_unitaire * t.quantite)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}