import { useEffect, useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";
import { useAuthContext } from "../hooks/useAuthContext";

const Home = () => {
  const { workouts, dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [editWorkout, setEditWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkout = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/workouts`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const json = await response.json();

        if (response.ok) {
          dispatch({ type: "SET_WORKOUTS", payload: json });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchWorkout();
    }
  }, [dispatch, user]);

  const handleEdit = (workout) => {
    setEditWorkout(workout);
  };

  return (
    <div className="home">
      <div className="workouts">
        {loading ? (
          <div>Loading...</div>
        ) : workouts.length > 0 ? (
          workouts.map((workout) => (
            <WorkoutDetails
              key={workout._id}
              workout={workout}
              handleEdit={handleEdit}
            />
          ))
        ) : (
          <p className="no-workout">No workouts at the moment</p>
        )}
      </div>

      <WorkoutForm setEditWorkout={setEditWorkout} editWorkout={editWorkout} />
    </div>
  );
};

export default Home;
