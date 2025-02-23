import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
  const [email, SetEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isLoading, isError, error } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login({email, password});
  };

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>Login</h3>

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
        {isLoading ? "Logging in..." : "Login"}
      </button>
      {isError && <div className="error">{error.message}</div>}
    </form>
  );
};

export default Login;
