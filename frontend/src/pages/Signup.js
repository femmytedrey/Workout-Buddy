import { useState } from "react";
import { useSignup } from "../hooks/useSignup";

const Signup = () => {
  const [email, SetEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(email, password);
  };
  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign up</h3>

      <label>Email:</label>
      <input
        type="email"
        onChange={(e) => SetEmail(e.target.value)}
        value={email}
      />

      <label>Password:</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <button disabled={isLoading}>
        {isLoading ? "Signing up...." : "Sign up"}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Signup;
