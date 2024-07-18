import { useAuthContext } from "./useAuthContext";
import {useWorkoutsContext} from '../hooks/useWorkoutsContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const {dispatch: workoutContext} = useWorkoutsContext();

  const logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    workoutContext({type:'SET_WORKOUTS', payload: null})
  };
  return { logout };
};
