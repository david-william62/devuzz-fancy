import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { appwrite } from "../../lib";
import "./index.css";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await appwrite.login(email, password);
      navigate("/admin");
    } catch (error) {
      setError("Invalid email or password");
      console.error("Login failed", error);
    }
  };

  return (
    <div className="login-wrapper">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export { Login };
