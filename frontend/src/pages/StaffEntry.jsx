import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { submitIntake, getQueue, arriveFarmer, getIntakeHistory } from "../api/client";
import PageHeader from "../components/PageHeader";

export default function StaffDesk() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  // Extract logged-in staff's center ID (default to CENTER-001 fallback)
  const userCenterId = auth?.centerId || "CENTER-001";

  const [farmerId, setFarmerId] = useState("");
  const [liters, setLiters] = useState("");
  const [fat, setFat] = useState("");
  const [snf, setSnf] = useState("");

  const [queue, setQueue] = useState([]);
  const [logStatus, setLogStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Check-in (arrival) state ---
  const [arrivalId, setArrivalId] = useState("");
  const [arrivalStatus, setArrivalStatus] = useState("");
  const [arrivalError, setArrivalError] = useState("");
  const [arrivalLoading, setArrivalLoading] = useState(false);

  // --- Intake History state ---
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [historyLogs, setHistoryLogs] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  const fetchQueue = async () => {
    try {
      const res = await getQueue(userCenterId);
      const queueData = res.data?.queue || res.data?.data || [];
      setQueue(queueData);
    } catch (err) {
      console.error("Failed to load queue", err);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    setHistoryError("");
    try {
      const res = await getIntakeHistory(startDate, endDate, userCenterId);
      const logs = res.data?.data || [];
      setHistoryLogs(logs);
    } catch (err) {
      setHistoryError("Failed to fetch intake history.");
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    fetchHistory();
  }, [userCenterId]);

  const handleSelectFarmer = (id) => {
    setFarmerId(id);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleArrive = async (e) => {
    e.preventDefault();
    setArrivalError("");
    setArrivalStatus("");

    const cleanId = arrivalId.trim();
    if (!cleanId) {
      setArrivalError("Enter a Farmer ID (e.g. FARM-049).");
      return;
    }

    setArrivalLoading(true);
    try {
      await arriveFarmer(cleanId, userCenterId);
      setArrivalStatus(`${cleanId} checked in successfully.`);
      setArrivalId("");
      await fetchQueue();
    } catch (err) {
      setArrivalError(
        err.response?.data?.message || err.message || "Failed to check in farmer."
      );
    } finally {
      setArrivalLoading(false);
    }
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
        snf: parsedSnf,
        centerId: userCenterId
      };

      const res = await submitIntake(payload);
      const createdLog = res.data?.data || res.data;

      setLogStatus(`Logged: ${createdLog.logId || "LOG-SUCCESS"} — ${parsedLiters} L`);

      setQueue((prevQueue) => prevQueue.filter((item) => item.farmerId !== farmerId.trim()));

      setFarmerId("");
      setLiters("");
      setFat("");
      setSnf("");

      // Refresh history table automatically
      await fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to submit milk intake.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterHistory = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  return (
    <div className="page">
      <PageHeader
        title={`Collection Staff — Entry Desk (${userCenterId})`}
        subtitle={auth?.username || auth?.staffId || "Logged in as Staff"}
        onLogout={handleLogout}
      />

      <div className="card-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Milk Entry Form */}
        <div className="info-card" style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
          <h3>Submit Milk Intake</h3>
          {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

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
            <h3>Live Queue ({userCenterId})</h3>
            <button onClick={fetchQueue} style={{ padding: "4px 8px", cursor: "pointer" }}>Refresh</button>
          </div>

          {/* Check-in control */}
          <form
            onSubmit={handleArrive}
            style={{ display: "flex", gap: "8px", marginTop: "15px", marginBottom: "10px" }}
          >
            <input
              type="text"
              value={arrivalId}
              onChange={(e) => setArrivalId(e.target.value)}
              placeholder="Farmer ID, e.g. FARM-049"
              style={{ flex: 1, padding: "8px" }}
            />
            <button
              type="submit"
              disabled={arrivalLoading}
              style={{
                backgroundColor: "#2b5278",
                color: "#fff",
                padding: "8px 14px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              {arrivalLoading ? "Checking in..." : "Check In Farmer"}
            </button>
          </form>
          {arrivalError && <p style={{ color: "red", margin: "0 0 10px", fontWeight: "bold" }}>{arrivalError}</p>}
          {arrivalStatus && (
            <p style={{ color: "#2b5278", margin: "0 0 10px" }}>{arrivalStatus}</p>
          )}

          <table style={{ width: "100%", textAlign: "left", marginTop: "5px", borderCollapse: "collapse" }}>
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
                    No farmers in queue for {userCenterId}.
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

      {/* Intake History Table Panel */}
      <div className="info-card" style={{ background: "#fff", padding: "20px", borderRadius: "8px", marginTop: "20px" }}>
        <h3>Intake Records History ({userCenterId})</h3>

        {/* Date Range Controls */}
        <form onSubmit={handleFilterHistory} style={{ display: "flex", gap: "15px", alignItems: "center", marginBottom: "15px", marginTop: "10px" }}>
          <label style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            From:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ padding: "6px" }}
            />
          </label>
          <label style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            To:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ padding: "6px" }}
            />
          </label>
          <button
            type="submit"
            style={{
              padding: "6px 14px",
              backgroundColor: "#2b5278",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Filter Entries
          </button>
        </form>

        {historyError && <p style={{ color: "red" }}>{historyError}</p>}

        <table style={{ width: "100%", textAlign: "left", marginTop: "10px", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd", background: "#f8f9fa" }}>
              <th style={{ padding: "10px" }}>Farmer ID</th>
              <th style={{ padding: "10px" }}>Name</th>
              <th style={{ padding: "10px" }}>Litres</th>
              <th style={{ padding: "10px" }}>SNF %</th>
              <th style={{ padding: "10px" }}>Fat %</th>
              <th style={{ padding: "10px" }}>Payout (₹)</th>
              <th style={{ padding: "10px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {historyLoading ? (
              <tr>
                <td colSpan="7" style={{ padding: "15px", textAlign: "center", color: "#666" }}>
                  Loading history logs...
                </td>
              </tr>
            ) : historyLogs.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: "15px", textAlign: "center", color: "#888" }}>
                  No entries found for {userCenterId}.
                </td>
              </tr>
            ) : (
              historyLogs.map((log) => (
                <tr key={log._id || log.logId} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "10px", fontWeight: "bold" }}>{log.farmerId}</td>
                  <td style={{ padding: "10px" }}>{log.name}</td>
                  <td style={{ padding: "10px" }}>{log.liters}</td>
                  <td style={{ padding: "10px" }}>{log.snf}</td>
                  <td style={{ padding: "10px" }}>{log.fat}</td>
                  <td style={{ padding: "10px" }}>₹{log.payout}</td>
                  <td style={{ padding: "10px" }}>
                    <button
                      onClick={() => {}}
                      style={{
                        padding: "4px 10px",
                        backgroundColor: "#f0f0f0",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}