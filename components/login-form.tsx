"use client";

import { useState } from "react";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Sign-in is not connected yet. Clerk will be configured before accounts are enabled; these credentials were not sent.");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field-group">
        <label className="field-label" htmlFor="username">Username</label>
        <input className="text-input" id="username" name="username" autoComplete="username" placeholder="Enter your username" required />
      </div>

      <div className="field-group">
        <label className="field-label" htmlFor="password">Password</label>
        <div className="password-wrap">
          <input className="text-input" id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" required />
          <button className="show-password" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div className="login-options">
        <label className="remember-option"><input type="checkbox" name="remember" /> Keep me signed in</label>
        <span className="quiet-link" aria-label="Password help is available from your administrator">Forgot password?</span>
      </div>

      <button className="primary-button" type="submit">Sign in securely</button>
      {notice && <p className="form-notice" role="status">{notice}</p>}
      <p className="login-hint">Having trouble signing in? Contact your school administrator.</p>
    </form>
  );
}
