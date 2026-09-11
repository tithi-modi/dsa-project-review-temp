import axios from "axios";

// Backend runs on port 5000 by default (see docs/api-contracts.md)
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// --- Auth ---------------------------------------------------------------
// POST /api/auth/login  { username }
export const loginStaff = (username) =>
  client.post("/api/auth/login", { username });

// --- Farmers --------------------------------------------------------------
// GET /api/farmers/:id
export const getFarmerById = (farmerId) =>
  client.get(`/api/farmers/${farmerId}`);

// POST /api/farmers/register { farmerId, name, phone, bankDetails, centerId }
export const registerFarmer = (payload) =>
  client.post("/api/farmers/register", payload);

// --- Intake (Collection Staff) --------------------------------------------
// POST /api/intake/submit { farmerId, quantityLiters, fatPercentage, snfPercentage }
export const submitIntake = (payload) =>
  client.post("/api/intake/submit", payload);

// GET /api/intake/queue
export const getQueue = () => client.get("/api/intake/queue");

// --- Manager ---------------------------------------------------------------
// GET /api/manager/analytics
export const getAnalytics = () => client.get("/api/manager/analytics");

// --- Routes ------------------------------------------------------------
// GET /api/routes/optimize
export const getOptimizedRoute = () => client.get("/api/routes/optimize");
export const getFarmerLogs = (id) => client.get(`/farmers/${id}/logs`);
export default client;
