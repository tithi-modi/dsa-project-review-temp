import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getFarmerById, getFarmerLogs } from "../api/client";
import PageHeader from "../components/PageHeader";
import { formatExactTimestamp } from "../utils/formatters";

export default function FarmerDashboard() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const [farmer, setFarmer] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth?.farmerId) {
      navigate("/login/farmer");
      return;
    }

    setLoading(true);
    setError("");

    Promise.allSettled([
      getFarmerById(auth.farmerId),
      getFarmerLogs(auth.farmerId)
    ])
      .then(([farmerResult, logsResult]) => {
        if (farmerResult.status === "fulfilled") {
          setFarmer(farmerResult.value.data?.data ?? farmerResult.value.data);
        } else {
          setError(
            farmerResult.reason?.response?.data?.error?.message ||
              farmerResult.reason?.message ||
              "Failed to load farmer details"
          );
        }

        if (logsResult.status === "fulfilled") {
          setLogs(logsResult.value.data?.data ?? logsResult.value.data ?? []);
        } else {
          console.error("Delivery History fetch error:", logsResult.reason);
          setLogs([]);
        }
      })
      .finally(() => setLoading(false));
  }, [auth, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="page">
      <PageHeader
        title="Farmer Dashboard"
        subtitle={farmer?.name || auth?.name || auth?.farmerId}
        onLogout={handleLogout}
      />

      {loading && <p>Loading farmer details...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && farmer && (
        <div className="card-grid">
          <div className="info-card">
            <h3>Profile</h3>
            <dl>
              <dt>Farmer ID</dt>
              <dd>{farmer.farmerId}</dd>
              <dt>Name</dt>
              <dd>{farmer.name}</dd>
              <dt>Phone</dt>
              <dd>{farmer.phone}</dd>
              <dt>Centre</dt>
              <dd>{farmer.centerId}</dd>
            </dl>
          </div>

          <div className="info-card">
            <h3>Delivery History</h3>
            {logs.length === 0 ? (
              <p className="muted">No delivery records found.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #ddd" }}>
                      <th style={{ padding: "8px" }}>Exact Timestamp</th>
                      <th style={{ padding: "8px" }}>Liters</th>
                      <th style={{ padding: "8px" }}>Fat %</th>
                      <th style={{ padding: "8px" }}>SNF %</th>
                      <th style={{ padding: "8px" }}>Payout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, index) => {
                      const rawDate = log.date || log.createdAt || log.timestamp || log.loggedAt || log.dateTime;

                      const displayLiters = log.liters ?? log.quantity ?? log.qty ?? log.liter ?? log.litres ?? log.volume ?? 0;
                      const displayFat = log.fat ?? log.fatPercent ?? log.fatPercentage ?? 0;
                      const displaySnf = log.snf ?? log.snfPercent ?? log.snfPercentage ?? 0;
                      const displayPayout = log.payout ?? log.totalPayout ?? log.amount ?? log.totalAmount ?? log.price ?? 0;

                      return (
                        <tr
                          key={log._id || log.id || log.logId || index}
                          style={{ borderBottom: "1px solid #f0f0f0" }}
                        >
                          <td style={{ padding: "8px", fontFamily: "monospace" }}>
                            {formatExactTimestamp(rawDate)}
                          </td>
                          <td style={{ padding: "8px" }}>{displayLiters} L</td>
                          <td style={{ padding: "8px" }}>{displayFat}%</td>
                          <td style={{ padding: "8px" }}>{displaySnf}%</td>
                          <td style={{ padding: "8px", fontWeight: "bold" }}>₹{displayPayout}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}