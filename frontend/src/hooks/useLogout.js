import { useAuthContext } from "./useAuthContext";
import {useWorkoutsContext} from '../hooks/useWorkoutsContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const {dispatch: workoutContext} = useWorkoutsContext();

  const logout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/user/logout`,{
        method: "POST",
        credentials: 'include',
      })
      if(response.ok){
        dispatch({ type: "LOGOUT" });
        workoutContext({type:'SET_WORKOUTS', payload: null})
      }
    } catch (error) {
      console.log('Logout failed', error)
    }
  };
  return { logout };
};
