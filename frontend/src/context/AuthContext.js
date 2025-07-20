import { createContext, useEffect, useReducer } from "react";

export const AuthContext = createContext();

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, {
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/user/check-auth`,
          {
            credentials: "include",
          },
        );
        if (response.ok) {
          const user = await response.json();
          dispatch({ type: "LOGIN", payload: user });
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    checkAuth();
  }, []);

  if (state.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
      {/* children */}
    </AuthContext.Provider>
  );
};
