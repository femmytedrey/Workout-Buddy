import { useAuthContext } from "./useAuthContext";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useMutation } from "@tanstack/react-query";

const logout = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/user/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error("Logout failed");
    }

    return response.json();
  } catch (error) {
    console.log("Logout failed", error);
  }
};

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: workoutContext } = useWorkoutsContext();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      dispatch({ type: "LOGOUT" });
      workoutContext({ type: "SET_WORKOUTS", payload: null });
    },
    onError: (error) => {
      console.log("Logout failed", error);
    },
  });
};
