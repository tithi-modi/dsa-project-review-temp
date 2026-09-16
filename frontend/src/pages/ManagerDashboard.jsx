import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAnalytics, getOptimizedRoute } from "../api/client";
import PageHeader from "../components/PageHeader";

export default function ManagerDashboard() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [analyticsError, setAnalyticsError] = useState("");
  const [route, setRoute] = useState(null);
  const [routeError, setRouteError] = useState("");
  const [loading, setLoading] = useState(true);

  const userCenterId = auth?.centerId || "ALL";

  useEffect(() => {
    if (!auth || (auth.role !== "MANAGER" && auth.role !== "manager")) {
      navigate("/login/manager");
      return;
    }

    Promise.allSettled([getAnalytics(userCenterId), getOptimizedRoute()]).then(
      ([analyticsRes, routeRes]) => {
        if (analyticsRes.status === "fulfilled") {
          setAnalytics(analyticsRes.value.data);
        } else {
          setAnalyticsError(
            analyticsRes.reason?.response?.data?.error?.message ||
              analyticsRes.reason?.message
          );
        }

        if (routeRes.status === "fulfilled") {
          setRoute(routeRes.value.data);
        } else {
          setRouteError(
            routeRes.reason?.response?.data?.error?.message ||
              routeRes.reason?.message
          );
        }
        setLoading(false);
      }
    );
  }, [auth, navigate, userCenterId]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const metrics = analytics?.metrics;

  return (
    <div className="page">
      <PageHeader
        title={`Operations Manager Dashboard (${userCenterId})`}
        subtitle={
          auth?.username ? `Logged in as ${auth.username}` : ""
        }
        onLogout={handleLogout}
      />

      {loading && <p>Loading dashboard...</p>}

      <div className="card-grid">
        <div className="info-card">
          <h3>Today's Metrics{analytics?.date ? ` — ${analytics.date}` : ""}</h3>
          {analyticsError && <p className="error-text">{analyticsError}</p>}
          {metrics && (
            <div className="stat-grid">
              <Stat label="Total Liters" value={metrics.totalLiters} />
              <Stat label="Avg Fat %" value={metrics.averageFat} />
              <Stat label="Avg SNF %" value={metrics.averageSnf} />
              <Stat
                label="Total Payout"
                value={`₹${metrics.totalPayoutINR?.toLocaleString?.() ?? metrics.totalPayoutINR}`}
              />
              <Stat label="Active Farmers" value={metrics.activeFarmersToday} />
            </div>
          )}
        </div>

        <div className="info-card">
          <h3>Tanker Route</h3>
          {routeError && <p className="error-text">{routeError}</p>}
          {route && (
            <>
              <p className="muted">
                {route.tankerId} — {route.totalDistanceKm} km total
              </p>
              <table className="simple-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Centre</th>
                    <th>Est. Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {(route.pickupOrder ?? []).map((stop) => (
                    <tr key={stop.step}>
                      <td>{stop.step}</td>
                      <td>
                        {stop.name} ({stop.centerId})
                      </td>
                      <td>{stop.estimatedVolume} L</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
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