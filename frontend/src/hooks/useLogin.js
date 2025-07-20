import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "./useAuthContext";

const login = async ({email, password}) => {
  const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error)
  }

  return json;
};

export const useLogin = () => {
  const { dispatch } = useAuthContext();

  

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      dispatch({ type: "LOGIN", payload: { email: data.email } });
    },
    onError: (error) => {
      console.log(error);
    }
  });
};
