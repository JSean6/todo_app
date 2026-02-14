"use client"; // this page runs in browser

import { useState } from "react";

export default function LoginPage() {
  // store form input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // called when form is submitted
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // redirect after login
    window.location.href = "/dashboard";
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
