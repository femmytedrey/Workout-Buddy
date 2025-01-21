import { useEffect, useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const WorkoutForm = ({ editWorkout, setEditWorkout }) => {
  const { dispatch } = useWorkoutsContext();
  const [title, setTitle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    if (editWorkout) {
      setTitle(editWorkout.title);
      setLoad(editWorkout.load);
      setReps(editWorkout.reps);
    } else {
      setTitle("");
      setLoad("");
      setReps("");
    }
  }, [editWorkout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in");
      return;
    }
    const workout = { title, load, reps };

    let response;
    let json;
    if (editWorkout) {
      response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/workouts/${editWorkout._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(workout)
      });
      json = await response.json()

      if(!response.ok){
        setError(json.error)
        setEmptyFields(json.emptyFields || [])
      }

      if(response.ok){
        dispatch({type: 'UPDATE_WORKOUT', payload: json})
        setEditWorkout(null)
      }
    } else {
      response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/workouts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(workout),
      });
      json = await response.json();

      if (!response.ok) {
        setError(json.error);
        setEmptyFields(json.emptyFields || []);
      }

      if (response.ok) {
        setTitle("");
        setLoad("");
        setReps("");
        setError(null);
        setEmptyFields([]);
        dispatch({ type: "CREATE_WORKOUT", payload: json });
      }
    }
  };
  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>{editWorkout ? 'Update Workout' : 'Add a new workout'}</h3>

      <label>Exercise Title:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes("title") ? "error" : ""}
      />

      <label>Load (in kg):</label>
      <input
        type="number"
        onChange={(e) => setLoad(e.target.value)}
        value={load}
        className={emptyFields.includes("load") ? "error" : ""}
      />

      <label>Reps (in kg):</label>
      <input
        type="number"
        onChange={(e) => setReps(e.target.value)}
        value={reps}
        className={emptyFields.includes("reps") ? "error" : ""}
      />

      <button>{editWorkout ? 'Update workout' : 'Add workout'}</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
