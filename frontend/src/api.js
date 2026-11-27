import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { Accept: 'application/json' },
});

// Avant chaque requête : ajoute le token s'il existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
export function messageErreur(erreur) {
  console.error("Erreur API :", erreur);
  const data = erreur.response?.data;
  if (data?.errors) return Object.values(data.errors).flat()[0];
  if (data?.message) return data.message;
  if (erreur.response) return `Erreur serveur (${erreur.response.status})`;
  if (erreur.request) return "Impossible de joindre le serveur (Laravel arrêté ou CORS)";
  return `Erreur dans l'application : ${erreur.message}`;
}