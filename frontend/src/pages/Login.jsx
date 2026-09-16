import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { loginStaff, getFarmerById, registerFarmer } from "../api/client";
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

  // Sign-Up State (Farmer Role)
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [ifsc, setIfsc] = useState("");

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
        const res = await getFarmerById(value.trim());
        const farmer = res.data?.data ?? res.data;
        login("FARMER", { farmerId: farmer.farmerId || value.trim(), name: farmer.name });
      } else {
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
          err.response?.data?.message ||
          err.message ||
          "Something went wrong. Is the backend running on port 5000?"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim()) {
      setError("Name and Phone Number are required.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        bankAccount: bankAccount.trim(),
        ifsc: ifsc.trim(),
        centerId: "CENTER-001"
      };
      const res = await registerFarmer(payload);
      const newFarmer = res.data?.data ?? res.data;

      login("FARMER", {
        farmerId: newFarmer.farmerId,
        name: newFarmer.name
      });
      navigate(meta.dashboard);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to register farmer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <h1 className="title title--small">
        {role === "farmer" && isSignUp ? "Farmer Sign Up" : `${meta.label} Login`}
      </h1>

      {role === "farmer" && isSignUp ? (
        <form className="login-form" onSubmit={handleSignUpSubmit}>
          <label className="field-label" htmlFor="reg-name">Full Name *</label>
          <input
            id="reg-name"
            className="text-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ramesh Patel"
            required
            autoFocus
          />

          <label className="field-label" htmlFor="reg-phone" style={{ marginTop: "10px" }}>Phone Number *</label>
          <input
            id="reg-phone"
            className="text-input"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 9876543210"
            required
          />

          <label className="field-label" htmlFor="reg-bank" style={{ marginTop: "10px" }}>Bank Account No. (Optional)</label>
          <input
            id="reg-bank"
            className="text-input"
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            placeholder="1234567890"
          />

          <label className="field-label" htmlFor="reg-ifsc" style={{ marginTop: "10px" }}>IFSC Code (Optional)</label>
          <input
            id="reg-ifsc"
            className="text-input"
            value={ifsc}
            onChange={(e) => setIfsc(e.target.value)}
            placeholder="SBIN0001234"
          />

          {error && <p className="error-text" style={{ marginTop: "10px" }}>{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: "15px" }}>
            {loading ? "Registering..." : "Register & Login"}
          </button>

          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError(""); }}
            style={{ marginTop: "12px", background: "none", border: "none", color: "#2b5278", cursor: "pointer", textDecoration: "underline", display: "block", textAlign: "center", width: "100%" }}
          >
            Already have a Farmer ID? Login
          </button>
        </form>
      ) : (
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

          {role === "farmer" && (
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setError(""); }}
              style={{ marginTop: "12px", background: "none", border: "none", color: "#2b5278", cursor: "pointer", textDecoration: "underline", display: "block", textAlign: "center", width: "100%" }}
            >
              New Farmer? Sign Up Here
            </button>
          )}
        </form>
      )}

      <Link className="back-link" to="/" style={{ marginTop: "15px", display: "inline-block" }}>
        &larr; Back to role selection
      </Link>
    </div>
  );
}