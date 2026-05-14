import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, loginWithGoogleCredential } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(email, password);
      nav("/");
    } catch (ex) {
      setErr(ex.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-panel">
        <Link to="/" className="auth-back">
          ← Back to Zexan
        </Link>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-lead">Sign in to save listings, make offers, and chat.</p>
        {err && <div className="auth-error">{err}</div>}
        <form className="auth-form" onSubmit={onSubmit}>
          <label className="auth-label">Email</label>
          <input className="auth-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          <label className="auth-label">Password</label>
          <input className="auth-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          <button type="submit" className="auth-submit">
            Sign in
          </button>
        </form>
        {googleClientId ? (
          <div className="auth-google-wrap">
            <div className="auth-divider">
              <span>or</span>
            </div>
            <GoogleLogin
              onSuccess={async (cred) => {
                try {
                  await loginWithGoogleCredential(cred.credential);
                  nav("/");
                } catch (ex) {
                  setErr(ex.message || "Google sign-in failed");
                }
              }}
              onError={() => setErr("Google sign-in was cancelled")}
              useOneTap={false}
              theme="filled_black"
              shape="pill"
              text="continue_with"
            />
          </div>
        ) : (
          <p className="auth-hint">Add REACT_APP_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_ID on server for Gmail sign-in.</p>
        )}
        <p className="auth-footer">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
