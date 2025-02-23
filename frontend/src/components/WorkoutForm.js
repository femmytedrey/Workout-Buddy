import { useEffect, useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useMutation } from "@tanstack/react-query";

const WorkoutForm = ({ editWorkout, setEditWorkout }) => {
  const { dispatch } = useWorkoutsContext();
  const [title, setTitle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const { user } = useAuthContext();

  const createWorkout = async (workout) => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/workouts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(workout),
      }
    );
    const json = await response.json();

    if (!response.ok) {
      throw { error: json.error, emptyFields: json.emptyFields };
    }

    return json;
  };

  const updateWorkout = async ({ id, workout }) => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/workouts/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(workout),
      }
    );
    const json = await response.json();

    if (!response.ok) {
      throw { error: json.error, emptyFields: json.emptyFields };
    }

    return json;
  };

  const {
    mutate: create,
    isLoading: isCreating,
    error: createError,
  } = useMutation({
    mutationFn: createWorkout,
    onSuccess: (data) => {
      dispatch({ type: "CREATE_WORKOUT", payload: data });
      setTitle("");
      setLoad("");
      setReps("");
      setEmptyFields([]);
    },
    onError: (error) => {
      setEmptyFields(error.emptyFields || []);
    },
  });

  const {
    mutate: update,
    isLoading: isUpdating,
    error: updateError,
  } = useMutation({
    mutationFn: updateWorkout,
    onSuccess: (data) => {
      dispatch({ type: "UPDATE_WORKOUT", payload: data });
      setEditWorkout(null);
    },
    onError: (error) => {
      setEmptyFields(error.emptyFields || []);
    },
  });

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

    if (editWorkout) {
      update({ id: editWorkout._id, workout });
    } else {
      create(workout);
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>{editWorkout ? "Update Workout" : "Add a new workout"}</h3>

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

      <button disabled={isCreating || isUpdating}>
        {isCreating
          ? "Adding..."
          : isUpdating
          ? "Updating..."
          : editWorkout
          ? "Update workout"
          : "Add workout"}
      </button>
      {(createError || updateError) && (
        <div className="error">{createError?.error || updateError?.error}</div>
      )}
    </form>
  );
};

export default WorkoutForm;
