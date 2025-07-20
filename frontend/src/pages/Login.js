import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import useOAuth from "../hooks/useOAuth";
import { GoogleIcon } from "../components/GoogleIcon";

const Login = () => {
  const [email, SetEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isLoading, isError, error } = useLogin();
  const {
    loginWithGoogle,
    isLoading: isGoogleLoading,
    error: oauthError,
    authSuccess,
  } = useOAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login({ email, password });
  };

  const displayError = isError ? error.message : oauthError;

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

      <div className="login-btn-container">
        <button disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div className="divider">
          <span>or</span>
        </div>
        
        <button
          type="button"
          onClick={loginWithGoogle}
          className="google-login-btn"
        >
          <GoogleIcon />
          {isGoogleLoading ? "Signing in with Google" : "Sign in with Google"}
        </button>
      </div>

      {authSuccess && (
        <div className="success">
          Login successful! You will be redirected shortly.
        </div>
      )}
      {displayError && <div className="error">{displayError}</div>}
    </form>
  );
};

export default Login;
