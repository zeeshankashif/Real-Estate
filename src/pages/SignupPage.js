import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const { register, loginWithGoogleCredential } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await register(name, email, password);
      nav("/");
    } catch (ex) {
      setErr(ex.message || "Could not register");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-panel">
        <Link to="/" className="auth-back">
          ← Back to Zexan
        </Link>
        <h1 className="auth-title">Create your Zexan ID</h1>
        <p className="auth-lead">List properties, save favourites, negotiate offers, and message instantly.</p>
        {err && <div className="auth-error">{err}</div>}
        <form className="auth-form" onSubmit={onSubmit}>
          <label className="auth-label">Full name</label>
          <input className="auth-input" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
          <label className="auth-label">Email</label>
          <input className="auth-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          <label className="auth-label">Password</label>
          <input className="auth-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
          <button type="submit" className="auth-submit">
            Create account
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
                  setErr(ex.message || "Google sign-up failed");
                }
              }}
              onError={() => setErr("Google sign-in was cancelled")}
              useOneTap={false}
              theme="filled_black"
              shape="pill"
              text="signup_with"
            />
          </div>
        ) : (
          <p className="auth-hint">Google sign-up appears when REACT_APP_GOOGLE_CLIENT_ID is set.</p>
        )}
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
