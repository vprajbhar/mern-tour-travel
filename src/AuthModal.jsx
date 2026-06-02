import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import "./AuthModal.css";

export default function AuthModal({ mode, onClose, onSwitch }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="modal auth-modal">
        <button className="auth-modal__close" onClick={onClose} aria-label="Close">✕</button>
        <div className="auth-modal__logo">✦ WanderLux</div>
        <h2 className="auth-modal__title">
          {mode === "login" ? "Welcome back" : "Begin your journey"}
        </h2>
        <p className="auth-modal__sub">
          {mode === "login"
            ? "Sign in to access your curated experiences"
            : "Join thousands of discerning travelers worldwide"}
        </p>

        <form onSubmit={handleSubmit} className="auth-modal__form">
          {mode === "register" && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Alexandra Hartwell"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
          {error && <p className="auth-modal__error">{error}</p>}
          <button type="submit" className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="auth-modal__switch">
          {mode === "login" ? "New to WanderLux? " : "Already a member? "}
          <button onClick={() => onSwitch(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </p>
      </div>
    </>
  );
}