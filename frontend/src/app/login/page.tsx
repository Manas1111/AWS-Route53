"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const LeftBgPattern = () => (
  <svg
    width="240"
    height="480"
    viewBox="0 0 240 480"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      position: "absolute",
      left: 0,
      top: "16%",
      pointerEvents: "none",
      zIndex: 0,
      opacity: 0.75,
    }}
    aria-hidden="true"
  >
    {/* Cube 1 (top-left) */}
    <g transform="translate(45, 80)">
      <polygon points="0,-35 30.3,-17.5 0,0 -30.3,-17.5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points="0,0 -30.3,-17.5 -30.3,17.5 0,35" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points="0,0 30.3,-17.5 30.3,17.5 0,35" fill="#e2e8f0" stroke="#e2e8f0" strokeWidth="1" />
    </g>
    {/* Cube 2 (center-left) */}
    <g transform="translate(105, 165)">
      <polygon points="0,-42 36.4,-21 0,0 -36.4,-21" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points="0,0 -36.4,-21 -36.4,21 0,42" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points="0,0 36.4,-21 36.4,21 0,42" fill="#e2e8f0" stroke="#e2e8f0" strokeWidth="1" />
    </g>
    {/* Cube 3 (bottom-left) */}
    <g transform="translate(45, 250)">
      <polygon points="0,-35 30.3,-17.5 0,0 -30.3,-17.5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points="0,0 -30.3,-17.5 -30.3,17.5 0,35" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points="0,0 30.3,-17.5 30.3,17.5 0,35" fill="#e2e8f0" stroke="#e2e8f0" strokeWidth="1" />
    </g>
    {/* Cube 4 (edge) */}
    <g transform="translate(0, 335)">
      <polygon points="0,-28 24.2,-14 0,0 -24.2,-14" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points="0,0 -24.2,-14 -24.2,14 0,28" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points="0,0 24.2,-14 24.2,14 0,28" fill="#e2e8f0" stroke="#e2e8f0" strokeWidth="1" />
    </g>
  </svg>
);

const RightBgPattern = () => (
  <svg
    width="240"
    height="480"
    viewBox="0 0 240 480"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      position: "absolute",
      right: 0,
      top: "26%",
      pointerEvents: "none",
      zIndex: 0,
      opacity: 0.75,
    }}
    aria-hidden="true"
  >
    {/* Cube 1 (top-right) */}
    <g transform="translate(195, 60)">
      <polygon points="0,-35 30.3,-17.5 0,0 -30.3,-17.5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points="0,0 -30.3,-17.5 -30.3,17.5 0,35" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points="0,0 30.3,-17.5 30.3,17.5 0,35" fill="#e2e8f0" stroke="#e2e8f0" strokeWidth="1" />
    </g>
    {/* Cube 2 (center-right) */}
    <g transform="translate(135, 145)">
      <polygon points="0,-42 36.4,-21 0,0 -36.4,-21" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points="0,0 -36.4,-21 -36.4,21 0,42" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points="0,0 36.4,-21 36.4,21 0,42" fill="#e2e8f0" stroke="#e2e8f0" strokeWidth="1" />
    </g>
    {/* Cube 3 (bottom-right) */}
    <g transform="translate(195, 230)">
      <polygon points="0,-35 30.3,-17.5 0,0 -30.3,-17.5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points="0,0 -30.3,-17.5 -30.3,17.5 0,35" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points="0,0 30.3,-17.5 30.3,17.5 0,35" fill="#e2e8f0" stroke="#e2e8f0" strokeWidth="1" />
    </g>
    {/* Cube 4 (edge) */}
    <g transform="translate(240, 315)">
      <polygon points="0,-28 24.2,-14 0,0 -24.2,-14" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points="0,0 -24.2,-14 -24.2,14 0,28" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points="0,0 24.2,-14 24.2,14 0,28" fill="#e2e8f0" stroke="#e2e8f0" strokeWidth="1" />
    </g>
  </svg>
);

export default function LoginPage() {
  const { user, isLoading, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("demo@route53.local");
  const [password, setPassword] = useState("route53");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  const handleSelectAdmin = () => {
    setEmail("demo@route53.local");
    setPassword("route53");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await login(email.trim(), password);
      router.replace("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Authentication failed. Please check your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="aws-login-page">
      {/* Top right utility bar */}
      <div className="aws-login-top-bar">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="aws-login-top-link"
        >
          Provide feedback
        </a>
        <span className="aws-login-top-text">Multi-session disabled ▾</span>
        <span className="aws-login-top-text">English ▾</span>
      </div>

      {/* Subtle background isometric cube patterns */}
      <LeftBgPattern />
      <RightBgPattern />

      {/* Centered AWS Logo */}
      <div className="aws-login-logo-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/aws-logo.png"
          alt="AWS"
          style={{
            width: "68px",
            height: "auto",
            display: "block",
            margin: "0 auto",
          }}
        />
      </div>

      {/* Login Card */}
      <div className="aws-login-card">
        <h1 className="aws-login-title">Sign In</h1>
        <p className="aws-login-subtitle">
          Access your AWS account by user credentials.
        </p>

        {error && (
          <div className="aws-alert error" style={{ marginBottom: "16px" }}>
            <span style={{ fontWeight: 700, marginRight: "4px" }}>Error:</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "14px" }}>
            <label htmlFor="username" className="aws-login-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="aws-login-input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter your username"
              autoComplete="username"
              required
              disabled={isSubmitting}
            />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label htmlFor="password" className="aws-login-label">
              Password
            </label>
            <div className="aws-login-password-wrap">
              <input
                id="password"
                type="password"
                className="aws-login-input"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                disabled={isSubmitting}
              />
              <span className="aws-login-lock-icon" aria-hidden="true">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0972d3"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
            </div>
          </div>

          {/* Demo Accounts Selector */}
          <div className="aws-login-demo-group">
            <div className="aws-login-demo-header">Demo accounts:</div>

            <div
              className="aws-login-demo-row selected"
              onClick={handleSelectAdmin}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleSelectAdmin();
              }}
            >
              <input
                type="radio"
                id="demo-admin"
                name="demo-account"
                checked={true}
                onChange={handleSelectAdmin}
                className="aws-login-radio"
              />
              <div className="aws-login-demo-text">
                <div className="aws-login-demo-title">Admin</div>
                <div className="aws-login-demo-sub">manas / full access</div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="aws-login-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>

          <button
            type="button"
            className="aws-login-btn-secondary"
            onClick={(e) => e.preventDefault()}
          >
            New to AWS? Sign up
          </button>
        </form>
      </div>

      {/* Footer Text */}
      <div className="aws-login-footer">
        By continuing, you agree to the{" "}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="aws-login-link"
        >
          AWS Customer Agreement
        </a>{" "}
        or other agreement for AWS services, and the{" "}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="aws-login-link"
        >
          Privacy Notice
        </a>
        . This site uses essential cookies. See our{" "}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="aws-login-link"
        >
          Cookie Notice
        </a>{" "}
        for more information.
      </div>
    </div>
  );
}
