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
// POST /api/intake/arrive { farmerId, centerId }
export const arriveFarmer = (farmerId, centerId) =>
  client.post("/api/intake/arrive", { farmerId, centerId });

// POST /api/intake/submit { farmerId, liters, fat, snf, centerId }
export const submitIntake = (payload) =>
  client.post("/api/intake/submit", payload);

// GET /api/intake/queue?centerId=...
export const getQueue = (centerId) =>
  client.get("/api/intake/queue", { params: { centerId } });

// GET /api/intake/history?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&centerId=...
export const getIntakeHistory = (startDate, endDate, centerId) =>
  client.get("/api/intake/history", { params: { startDate, endDate, centerId } });

// --- Manager ---------------------------------------------------------------
// GET /api/manager/analytics?centerId=...
export const getAnalytics = (centerId) =>
  client.get("/api/manager/analytics", { params: { centerId } });

// --- Routes ------------------------------------------------------------
// GET /api/routes/optimize
export const getOptimizedRoute = () => client.get("/api/routes/optimize");

// GET /api/farmers/:id/logs
export const getFarmerLogs = (id) => client.get(`/api/farmers/${id}/logs`);

export default client;