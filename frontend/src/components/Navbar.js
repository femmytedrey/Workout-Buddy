import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { user } = useAuthContext();
  const { mutate: logout, isLoading, isError, error } = useLogout();
  
  const handleLogout = () => {
    logout();
    if(isError){
      alert(error?.message || "Failed to logout. Please try again.")
    }
  };
  
  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Workout Buddy</h1>
        </Link>
        <nav>
          {user && (
            <div className="logout-container">
              <span>{user.email}</span>
              <button onClick={handleLogout} disabled={isLoading}>
                {isLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
          {!user && (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
