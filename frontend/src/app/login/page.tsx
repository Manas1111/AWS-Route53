"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { user, isLoading, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await login(email.trim(), password);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("demo@route53.local");
    setPassword("route53");
    setError(null);
  };

  return (
    <div className="aws-login-container">
        <div className="aws-login-header">
          <div className="aws-login-logo">
            <span className="aws-header-logo-text">AWS</span>
            <span className="aws-header-divider">|</span>
            <span className="aws-header-product">Route 53</span>
          </div>
          <span className="aws-header-badge">Console Sign-in</span>
        </div>

        <div className="aws-login-card">
          <h1 className="aws-login-title">Sign in</h1>
          <p className="aws-login-subtitle">Access your Route 53 DNS resources</p>

          {error && (
            <div className="aws-alert error" style={{ marginBottom: "16px" }}>
              <span style={{ fontWeight: 700, marginRight: "4px" }}>Error:</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="aws-form-group">
              <label htmlFor="email" className="aws-label">Email address</label>
              <input
                id="email"
                type="email"
                className="aws-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="aws-form-group">
              <label htmlFor="password" className="aws-label">Password</label>
              <input
                id="password"
                type="password"
                className="aws-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              className="aws-btn aws-btn-primary aws-btn-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="aws-demo-box">
            <div className="aws-demo-header">
              <strong>Development Credentials</strong>
              <button
                type="button"
                onClick={handleFillDemo}
                className="aws-demo-fill-btn"
              >
                Fill Demo Credentials
              </button>
            </div>
            <div className="aws-demo-details">
              <div>Email: <code>demo@route53.local</code></div>
              <div>Password: <code>route53</code></div>
            </div>
          </div>
        </div>
      </div>
  );
}

