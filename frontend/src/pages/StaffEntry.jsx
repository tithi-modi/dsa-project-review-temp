import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { submitIntake, getQueue } from "../api/client";
import PageHeader from "../components/PageHeader";

export default function StaffDesk() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const [farmerId, setFarmerId] = useState("");
  const [liters, setLiters] = useState("");
  const [fat, setFat] = useState("");
  const [snf, setSnf] = useState("");

  const [queue, setQueue] = useState([]);
  const [logStatus, setLogStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchQueue = async () => {
    try {
      const res = await getQueue();
      const queueData = res.data?.queue || res.data?.data || [];
      setQueue(queueData);
    } catch (err) {
      console.error("Failed to load queue", err);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleSelectFarmer = (id) => {
    setFarmerId(id);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLogStatus("");

    const parsedLiters = parseFloat(liters);
    const parsedFat = parseFloat(fat);
    const parsedSnf = parseFloat(snf);

    if (!farmerId || isNaN(parsedLiters) || isNaN(parsedFat) || isNaN(parsedSnf)) {
      setError("Please provide valid numeric values for Liters, Fat %, and SNF %.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        farmerId: farmerId.trim(),
        liters: parsedLiters,
        fat: parsedFat,
        snf: parsedSnf
      };

      const res = await submitIntake(payload);
      const createdLog = res.data?.data || res.data;

      setLogStatus(`Logged: ${createdLog.logId || "LOG-SUCCESS"} — ${parsedLiters} L`);

      // Optimistically remove from queue in React state
      setQueue((prevQueue) => prevQueue.filter((item) => item.farmerId !== farmerId.trim()));

      setFarmerId("");
      setLiters("");
      setFat("");
      setSnf("");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to submit milk intake.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Collection Staff — Entry Desk"
        subtitle={auth?.username || auth?.staffId || "Logged in as Staff"}
        onLogout={handleLogout}
      />

      <div className="card-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Milk Entry Form */}
        <div className="info-card" style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
          <h3>Submit Milk Intake</h3>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <label>
              Farmer ID
              <input
                type="text"
                value={farmerId}
                onChange={(e) => setFarmerId(e.target.value)}
                placeholder="e.g. FARM-001"
                required
                style={{ width: "100%", padding: "8px", marginTop: "4px" }}
              />
            </label>

            <label>
              Quantity (liters)
              <input
                type="number"
                step="0.1"
                value={liters}
                onChange={(e) => setLiters(e.target.value)}
                placeholder="15.5"
                required
                style={{ width: "100%", padding: "8px", marginTop: "4px" }}
              />
            </label>

            <label>
              Fat %
              <input
                type="number"
                step="0.1"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                placeholder="4.2"
                required
                style={{ width: "100%", padding: "8px", marginTop: "4px" }}
              />
            </label>

            <label>
              SNF %
              <input
                type="number"
                step="0.1"
                value={snf}
                onChange={(e) => setSnf(e.target.value)}
                placeholder="8.5"
                required
                style={{ width: "100%", padding: "8px", marginTop: "4px" }}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: "#4a7c59",
                color: "#fff",
                padding: "10px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "10px"
              }}
            >
              {loading ? "Submitting..." : "Submit Intake"}
            </button>
          </form>

          {logStatus && (
            <div style={{ marginTop: "15px", padding: "10px", background: "#eaf4ec", borderRadius: "4px" }}>
              <strong>{logStatus}</strong>
            </div>
          )}
        </div>

        {/* Live Queue Panel */}
        <div className="info-card" style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Live Queue</h3>
            <button onClick={fetchQueue} style={{ padding: "4px 8px", cursor: "pointer" }}>Refresh</button>
          </div>

          <table style={{ width: "100%", textAlign: "left", marginTop: "15px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <th style={{ padding: "8px" }}>Farmer ID</th>
                <th style={{ padding: "8px" }}>Name</th>
                <th style={{ padding: "8px" }}>Arrival</th>
              </tr>
            </thead>
            <tbody>
              {queue.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ padding: "12px", textAlign: "center", color: "#888" }}>
                    No farmers in queue.
                  </td>
                </tr>
              ) : (
                queue.map((item) => (
                  <tr
                    key={item.farmerId}
                    onClick={() => handleSelectFarmer(item.farmerId)}
                    style={{ borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}
                    title="Click to select this farmer"
                  >
                    <td style={{ padding: "8px", fontWeight: "bold", color: "#2b5278" }}>{item.farmerId}</td>
                    <td style={{ padding: "8px" }}>{item.name || item.farmerName}</td>
                    <td style={{ padding: "8px" }}>{item.arrivalTime || item.arrival || "Now"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}