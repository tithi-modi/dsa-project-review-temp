import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { loginStaff, getFarmerById } from "../api/client";
import { useAuth } from "../context/AuthContext";

const ROLE_META = {
  manager: {
    label: "Operations Manager",
    fieldLabel: "Username",
    placeholder: "e.g. manager01",
    dashboard: "/manager",
  },
  staff: {
    label: "Collection Staff",
    fieldLabel: "Username",
    placeholder: "e.g. staff01",
    dashboard: "/staff",
  },
  farmer: {
    label: "Farmer",
    fieldLabel: "Farmer ID",
    placeholder: "e.g. FARM-001",
    dashboard: "/farmer",
  },
};

export default function Login() {
  const { role } = useParams();
  const meta = ROLE_META[role];
  const navigate = useNavigate();
  const { login } = useAuth();

  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!meta) {
    return (
      <div className="page-center">
        <p>Unknown role.</p>
        <Link to="/">Back to home</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!value.trim()) {
      setError(`Please enter a ${meta.fieldLabel.toLowerCase()}.`);
      return;
    }

    setLoading(true);
    try {
      if (role === "farmer") {
        // No dedicated farmer login endpoint exists yet, so we verify the
        // farmer record exists via GET /api/farmers/:id.
        const res = await getFarmerById(value.trim());
        const farmer = res.data?.data ?? res.data; // handle either envelope
        login("FARMER", { farmerId: farmer.farmerId || value.trim(), name: farmer.name });
      } else {
        // Staff / Manager both use the shared stub login endpoint.
        const res = await loginStaff(value.trim());
        const user = res.data?.user ?? {};
        login(role === "manager" ? "MANAGER" : "STAFF", {
          username: user.username || value.trim(),
          centerId: user.centerId,
        });
      }
      navigate(meta.dashboard);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.message ||
          "Something went wrong. Is the backend running on port 5000?"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <h1 className="title title--small">{meta.label} Login</h1>

      <form className="login-form" onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="login-value">
          {meta.fieldLabel}
        </label>
        <input
          id="login-value"
          className="text-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={meta.placeholder}
          autoFocus
        />

        {error && <p className="error-text">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Checking..." : "Continue"}
        </button>
      </form>

      <Link className="back-link" to="/">
        &larr; Back to role selection
      </Link>
    </div>
  );
}
