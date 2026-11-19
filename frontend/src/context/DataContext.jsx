import { createContext, useContext, useState } from "react";
import { actions as actionsInitiales } from "../data/mock";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [actions, setActions] = useState(actionsInitiales);
  const [solde, setSolde] = useState(100000);
  const [positions, setPositions] = useState([]); // { action_id, quantite, prix_moyen }
  const [transactions, setTransactions] = useState([]);

  const enregistrer = (action, type, quantite) => {
    setTransactions([
      ...transactions,
      {
        id: Date.now(),
        action_id: action.id,
        type,
        quantite,
        prix_unitaire: action.prix_actuel,
        date: new Date().toISOString(),
      },
    ]);
  };

  const acheter = (action, quantite) => {
    if (!Number.isInteger(quantite) || quantite <= 0) {
      return { ok: false, message: "Quantité invalide" };
    }
    const cout = action.prix_actuel * quantite;
    if (cout > solde) {
      return { ok: false, message: "Solde insuffisant" };
    }

    setSolde(solde - cout);

    const existante = positions.find((p) => p.action_id === action.id);
    if (existante) {
      const total = existante.quantite + quantite;
      const prixMoyen = (existante.quantite * existante.prix_moyen + cout) / total;
      setPositions(
        positions.map((p) =>
          p.action_id === action.id
            ? { ...p, quantite: total, prix_moyen: prixMoyen }
            : p
        )
      );
    } else {
      setPositions([
        ...positions,
        { action_id: action.id, quantite, prix_moyen: action.prix_actuel },
      ]);
    }

    enregistrer(action, "achat", quantite);
    return { ok: true, message: "Achat effectué" };
  };

  const vendre = (action, quantite) => {
    if (!Number.isInteger(quantite) || quantite <= 0) {
      return { ok: false, message: "Quantité invalide" };
    }
    const existante = positions.find((p) => p.action_id === action.id);
    if (!existante || existante.quantite < quantite) {
      return { ok: false, message: "Quantité détenue insuffisante" };
    }

    setSolde(solde + action.prix_actuel * quantite);

    const reste = existante.quantite - quantite;
    setPositions(
      reste === 0
        ? positions.filter((p) => p.action_id !== action.id)
        : positions.map((p) =>
            p.action_id === action.id ? { ...p, quantite: reste } : p
          )
    );

    enregistrer(action, "vente", quantite);
    return { ok: true, message: "Vente effectuée" };
  };

  return (
    <DataContext.Provider
      value={{ actions, setActions, solde, positions, transactions, acheter, vendre }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);