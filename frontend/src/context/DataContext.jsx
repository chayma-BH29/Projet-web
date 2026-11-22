import { createContext, useContext, useState } from "react";
import { actions as actionsInitiales } from "../data/mock";

const DataContext = createContext(null);
const CAPITAL_INITIAL = 100000;

// Génère 30 jours d'historique qui se termine au prix actuel
function genererHistorique(prixActuel) {
  const points = [];
  let prix = prixActuel;
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    points.unshift({
      date: date.toLocaleDateString("fr-FR"),
      prix: Math.round(prix * 100) / 100,
    });
    prix = prix * (1 + (Math.random() - 0.5) * 0.04);
  }
  return points;
}

export function DataProvider({ children }) {
  const [actions, setActions] = useState(actionsInitiales);
  const [solde, setSolde] = useState(CAPITAL_INITIAL);
  const [positions, setPositions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [historiquePrix, setHistoriquePrix] = useState(() => {
    const h = {};
    actionsInitiales.forEach((a) => {
      h[a.id] = genererHistorique(a.prix_actuel);
    });
    return h;
  });
  const [historiqueValeur, setHistoriqueValeur] = useState([
    { date: "Départ", valeur: CAPITAL_INITIAL },
  ]);

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

  // Fait varier chaque prix de -3 % à +3 % et enregistre l'historique
  const simulerMarche = () => {
    const etiquette = `Sim ${historiqueValeur.length}`;

    const nouvelles = actions.map((a) => {
      const variation = (Math.random() - 0.5) * 0.06;
      const prix = Math.max(1, Math.round(a.prix_actuel * (1 + variation) * 100) / 100);
      return { ...a, prix_actuel: prix };
    });
    setActions(nouvelles);

    const h = { ...historiquePrix };
    nouvelles.forEach((a) => {
      h[a.id] = [...(h[a.id] ?? []), { date: etiquette, prix: a.prix_actuel }];
    });
    setHistoriquePrix(h);

    const valeurActions = positions.reduce((somme, p) => {
      const a = nouvelles.find((x) => x.id === p.action_id);
      return somme + (a ? a.prix_actuel * p.quantite : 0);
    }, 0);
    setHistoriqueValeur([
      ...historiqueValeur,
      { date: etiquette, valeur: Math.round((solde + valeurActions) * 100) / 100 },
    ]);
  };

  const ajouterAction = ({ symbole, nom, prix_actuel }) => {
    const sym = symbole.trim().toUpperCase();
    if (!sym || !nom.trim() || !(prix_actuel > 0)) {
      return { ok: false, message: "Tous les champs sont obligatoires (prix > 0)" };
    }
    if (actions.some((a) => a.symbole === sym)) {
      return { ok: false, message: "Ce symbole existe déjà" };
    }
    const nouvelle = {
      id: Date.now(),
      symbole: sym,
      nom: nom.trim(),
      prix_actuel: Number(prix_actuel),
    };
    setActions([...actions, nouvelle]);
    setHistoriquePrix({
      ...historiquePrix,
      [nouvelle.id]: genererHistorique(nouvelle.prix_actuel),
    });
    return { ok: true, message: "Action ajoutée" };
  };

  const modifierAction = (id, { symbole, nom, prix_actuel }) => {
    const sym = symbole.trim().toUpperCase();
    if (!sym || !nom.trim() || !(prix_actuel > 0)) {
      return { ok: false, message: "Tous les champs sont obligatoires (prix > 0)" };
    }
    if (actions.some((a) => a.id !== id && a.symbole === sym)) {
      return { ok: false, message: "Ce symbole existe déjà" };
    }
    const ancienne = actions.find((a) => a.id === id);
    const nouveauPrix = Number(prix_actuel);
    setActions(
      actions.map((a) =>
        a.id === id ? { ...a, symbole: sym, nom: nom.trim(), prix_actuel: nouveauPrix } : a
      )
    );
    if (ancienne && ancienne.prix_actuel !== nouveauPrix) {
      setHistoriquePrix({
        ...historiquePrix,
        [id]: [
          ...(historiquePrix[id] ?? []),
          { date: new Date().toLocaleTimeString("fr-FR"), prix: nouveauPrix },
        ],
      });
    }
    return { ok: true, message: "Action modifiée" };
  };

  const supprimerAction = (id) => {
    const utilisee =
      positions.some((p) => p.action_id === id) ||
      transactions.some((t) => t.action_id === id);
    if (utilisee) {
      return {
        ok: false,
        message: "Suppression impossible : cette action est déjà utilisée dans des transactions",
      };
    }
    setActions(actions.filter((a) => a.id !== id));
    const h = { ...historiquePrix };
    delete h[id];
    setHistoriquePrix(h);
    return { ok: true, message: "Action supprimée" };
  };

  return (
    <DataContext.Provider
      value={{
        actions,
        setActions,
        solde,
        positions,
        transactions,
        historiquePrix,
        historiqueValeur,
        acheter,
        vendre,
        simulerMarche,
        ajouterAction,
        modifierAction,
        supprimerAction,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);