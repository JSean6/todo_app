"use client";

import { useState } from "react";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

  const handleRegister = async () => {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (res.ok) {
    window.location.href = "/";
  } else {
    alert("Registration failed");
  }
};


return (
    <div>
        <h2>Register</h2>
        <input placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        />
        <input 
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
         />
         <button onClick={handleRegister}>Register</button>
    </div>
)
}