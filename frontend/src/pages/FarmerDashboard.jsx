import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getFarmerById } from "../api/client";
import PageHeader from "../components/PageHeader";

export default function FarmerDashboard() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth?.farmerId) {
      navigate("/login/farmer");
      return;
    }

    getFarmerById(auth.farmerId)
      .then((res) => setFarmer(res.data?.data ?? res.data))
      .catch((err) =>
        setError(err.response?.data?.error?.message || err.message)
      )
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

      {farmer && (
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
            <p className="muted">
              The backend does not yet expose a per-farmer delivery/payout
              history endpoint (see api-contracts.md, section 12.5). Once
              that endpoint exists, wire it up here — this card is ready to
              receive a list of <code>CollectionLog</code> entries
              (liters, fat %, SNF %, payout, date).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
