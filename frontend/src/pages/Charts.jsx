import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { useData } from "../context/DataContext";

const COULEURS = ["#0d6efd", "#198754", "#dc3545", "#fd7e14", "#6f42c1", "#20c997", "#6c757d"];
const mad = (v) => `${Number(v).toLocaleString("fr-FR")} MAD`;

export default function Charts() {
  const { actions, solde, positions, historiquePrix, historiqueValeur } = useData();
  const [actionId, setActionId] = useState(actions[0]?.id);

  const repartition = positions
    .map((p) => {
      const a = actions.find((x) => x.id === p.action_id);
      return { name: a ? a.symbole : "?", value: a ? a.prix_actuel * p.quantite : 0 };
    })
    .concat([{ name: "Liquidités", value: solde }])
    .filter((d) => d.value > 0);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Graphiques</h2>
      <p className="text-muted">
        Astuce : cliquez plusieurs fois sur « Simuler le marché » (page Marché)
        pour voir les courbes évoluer.
      </p>

      <h5>Évolution de la valeur du portefeuille</h5>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={historiqueValeur}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip formatter={mad} />
          <Line type="monotone" dataKey="valeur" name="Valeur" stroke="#0d6efd" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>

      <div className="d-flex align-items-center gap-3 mt-5 mb-2">
        <h5 className="mb-0">Historique du prix d'une action</h5>
        <select
          className="form-select w-auto"
          value={actionId}
          onChange={(e) => setActionId(Number(e.target.value))}
        >
          {actions.map((a) => (
            <option key={a.id} value={a.id}>{a.symbole} - {a.nom}</option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={historiquePrix[actionId] ?? []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip formatter={mad} />
          <Line type="monotone" dataKey="prix" name="Prix" stroke="#198754" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>

      <h5 className="mt-5">Répartition du portefeuille</h5>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie data={repartition} dataKey="value" nameKey="name" outerRadius={110}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
            {repartition.map((d, i) => (
              <Cell key={d.name} fill={COULEURS[i % COULEURS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={mad} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}