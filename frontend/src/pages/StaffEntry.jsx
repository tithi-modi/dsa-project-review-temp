import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { submitIntake, getQueue } from "../api/client";
import PageHeader from "../components/PageHeader";

const EMPTY_FORM = {
  farmerId: "",
  quantityLiters: "",
  fatPercentage: "",
  snfPercentage: "",
};

export default function StaffEntry() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [lastResult, setLastResult] = useState(null);

  const [queue, setQueue] = useState([]);
  const [queueLoading, setQueueLoading] = useState(true);
  const [queueError, setQueueError] = useState("");

  useEffect(() => {
    if (!auth || auth.role !== "STAFF") {
      navigate("/login/staff");
    }
  }, [auth, navigate]);

  const loadQueue = () => {
    setQueueLoading(true);
    getQueue()
      .then((res) => setQueue(res.data?.queue ?? []))
      .catch((err) =>
        setQueueError(err.response?.data?.error?.message || err.message)
      )
      .finally(() => setQueueLoading(false));
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setLastResult(null);

    if (!form.farmerId || !form.quantityLiters) {
      setSubmitError("Farmer ID and quantity are required.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        farmerId: form.farmerId.trim(),
        quantityLiters: Number(form.quantityLiters),
        fatPercentage: Number(form.fatPercentage) || 0,
        snfPercentage: Number(form.snfPercentage) || 0,
      };
      const res = await submitIntake(payload);
      setLastResult(res.data?.data ?? res.data);
      setForm(EMPTY_FORM);
      loadQueue();
    } catch (err) {
      setSubmitError(err.response?.data?.error?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="page">
      <PageHeader
        title="Collection Staff — Entry Desk"
        subtitle={auth?.username ? `Logged in as ${auth.username}` : ""}
        onLogout={handleLogout}
      />

      <div className="card-grid">
        <div className="info-card">
          <h3>Submit Milk Intake</h3>
          <form className="stacked-form" onSubmit={handleSubmit}>
            <label className="field-label">Farmer ID</label>
            <input
              className="text-input"
              value={form.farmerId}
              onChange={handleChange("farmerId")}
              placeholder="FARM-001"
            />

            <label className="field-label">Quantity (liters)</label>
            <input
              className="text-input"
              type="number"
              step="0.1"
              value={form.quantityLiters}
              onChange={handleChange("quantityLiters")}
              placeholder="15.5"
            />

            <label className="field-label">Fat %</label>
            <input
              className="text-input"
              type="number"
              step="0.1"
              value={form.fatPercentage}
              onChange={handleChange("fatPercentage")}
              placeholder="4.2"
            />

            <label className="field-label">SNF %</label>
            <input
              className="text-input"
              type="number"
              step="0.1"
              value={form.snfPercentage}
              onChange={handleChange("snfPercentage")}
              placeholder="8.5"
            />

            {submitError && <p className="error-text">{submitError}</p>}

            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Intake"}
            </button>
          </form>

          {lastResult && (
            <div className="result-box">
              <strong>Logged:</strong> {lastResult.logId} — {lastResult.quantityLiters} L
              {lastResult.calculatedPayout != null && (
                <> — payout ₹{lastResult.calculatedPayout}</>
              )}
            </div>
          )}
        </div>

        <div className="info-card">
          <div className="info-card__header">
            <h3>Live Queue</h3>
            <button className="btn btn-ghost btn-small" onClick={loadQueue}>
              Refresh
            </button>
          </div>

          {queueLoading && <p>Loading queue...</p>}
          {queueError && <p className="error-text">{queueError}</p>}

          {!queueLoading && !queueError && (
            <table className="simple-table">
              <thead>
                <tr>
                  <th>Farmer ID</th>
                  <th>Name</th>
                  <th>Arrival</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((q) => (
                  <tr key={q.farmerId}>
                    <td>{q.farmerId}</td>
                    <td>{q.name}</td>
                    <td>{q.arrivalTime}</td>
                  </tr>
                ))}
                {queue.length === 0 && (
                  <tr>
                    <td colSpan={3} className="muted">
                      Queue is empty.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
