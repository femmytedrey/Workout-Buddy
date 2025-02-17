import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useAuthContext } from "../hooks/useAuthContext";

const WorkoutDetails = ({ workout, handleEdit }) => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();

  const handleDelete = async () => {
    if (!user) {
      return;
    }
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/workouts/${workout._id}`, {
      method: "DELETE",
      credentials: 'include',
    });

    const json = await response.json();
    if (response.ok) {
      dispatch({ type: "DELETE_WORKOUT", payload: json });
    }
  };
  
  return (
    <div className="workout-details">
      <h4>{workout.title}</h4>
      <p>
        <strong>Load (kg): </strong>
        {workout.load}
      </p>
      <p>
        <strong>Reps: </strong>
        {workout.reps}
      </p>
      <p>
        created {formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}
      </p>
      <div className="function-container">
        <button className="material-symbols-outlined edit" onClick={() => handleEdit(workout)}>Edit</button>
        <button className="material-symbols-outlined delete" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default WorkoutDetails;
