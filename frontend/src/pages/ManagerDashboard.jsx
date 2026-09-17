import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAnalytics } from "../api/client";
import PageHeader from "../components/PageHeader";

export default function ManagerDashboard() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const getTodayString = () => new Date().toISOString().split("T")[0];

  const [fromDate, setFromDate] = useState(getTodayString());
  const [toDate, setToDate] = useState(getTodayString());
  const [analytics, setAnalytics] = useState(null);
  const [analyticsError, setAnalyticsError] = useState("");
  const [loading, setLoading] = useState(true);

  const userCenterId = auth?.centerId || "ALL";

  const fetchAnalyticsData = (from, to) => {
    setLoading(true);
    setAnalyticsError("");
    getAnalytics(from, to, userCenterId)
      .then((res) => {
        setAnalytics(res.data?.data ?? res.data);
      })
      .catch((err) => {
        setAnalyticsError(
          err.response?.data?.error?.message || err.message
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!auth || (auth.role !== "MANAGER" && auth.role !== "manager")) {
      navigate("/login/manager");
      return;
    }

    fetchAnalyticsData(fromDate, toDate);
  }, [auth, navigate, userCenterId]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchAnalyticsData(fromDate, toDate);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const metrics = analytics?.metrics || analytics || {};
  const farmerBreakdown = analytics?.farmerBreakdown || [];

  return (
    <div className="page">
      <PageHeader
        title={`Operations Manager Dashboard (${userCenterId})`}
        subtitle={auth?.username ? `Logged in as ${auth.username}` : ""}
        onLogout={handleLogout}
      />

      {/* Date Range Selector */}
      <div className="info-card" style={{ marginBottom: "20px" }}>
        <form
          onSubmit={handleFilterSubmit}
          style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}
        >
          <label style={{ fontWeight: "600" }}>
            From:{" "}
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{ padding: "6px 10px", marginLeft: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </label>
          <label style={{ fontWeight: "600" }}>
            To:{" "}
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{ padding: "6px 10px", marginLeft: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </label>
          <button type="submit" style={{ padding: "6px 16px", cursor: "pointer" }}>
            Apply Filter
          </button>
        </form>
      </div>

      {loading && <p>Loading dashboard...</p>}
      {analyticsError && <p className="error-text">{analyticsError}</p>}

      {!loading && (
        <>
          <div className="card-grid">
            {/* Metrics Card */}
            <div className="info-card">
              <h3>
                Metrics ({fromDate === toDate ? fromDate : `${fromDate} to ${toDate}`})
              </h3>
              <div className="stat-grid">
                <Stat label="Total Liters" value={metrics.totalLiters ?? 0} />
                <Stat label="Avg Fat %" value={metrics.averageFat ?? metrics.avgFat ?? 0} />
                <Stat label="Avg SNF %" value={metrics.averageSnf ?? metrics.avgSnf ?? 0} />
                <Stat
                  label="Total Payout"
                  value={`₹${(metrics.totalPayoutINR ?? metrics.totalPayout ?? 0).toLocaleString()}`}
                />
                <Stat
                  label="Active Farmers"
                  value={metrics.activeFarmersToday ?? metrics.activeFarmers ?? 0}
                />
              </div>
            </div>

            {/* Tanker Route Activity 4 Notice */}
            <div className="info-card">
              <h3>Tanker Route</h3>
              <p className="muted" style={{ marginTop: "15px", lineHeight: "1.6" }}>
                Route optimization (Graph + Dijkstra + tanker capacity planning) is scheduled for Activity 4 so not yet implemented.
              </p>
            </div>
          </div>

          {/* Farmer Breakdown Table */}
          <div className="info-card" style={{ marginTop: "20px" }}>
            <h3>Farmer Summary</h3>
            {farmerBreakdown.length === 0 ? (
              <p className="muted" style={{ marginTop: "10px" }}>
                No farmer records found for this date range.
              </p>
            ) : (
              <div style={{ overflowX: "auto", marginTop: "15px" }}>
                <table className="simple-table">
                  <thead>
                    <tr>
                      <th>Farmer Name</th>
                      <th>Farmer ID</th>
                      <th>Liters</th>
                      <th>Avg Fat %</th>
                      <th>Avg SNF %</th>
                      <th>Payout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmerBreakdown.map((farmer, idx) => (
                      <tr key={farmer.farmerId || idx}>
                        <td>{farmer.name || farmer.farmerName || "—"}</td>
                        <td>{farmer.farmerId || "—"}</td>
                        <td>{farmer.liters ?? farmer.totalLiters ?? 0} L</td>
                        <td>{farmer.avgFat ?? farmer.averageFat ?? 0}%</td>
                        <td>{farmer.avgSnf ?? farmer.averageSnf ?? 0}%</td>
                        <td style={{ fontWeight: "bold" }}>
                          ₹{farmer.payout ?? farmer.totalPayout ?? 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <div className="stat__value">{value ?? "—"}</div>
      <div className="stat__label">{label}</div>
    </div>
  );
}