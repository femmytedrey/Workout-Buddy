const Workout = require("../models/workoutSchema");
const mongoose = require("mongoose");

const getWorkouts = async (req, res) => {
  const user_id = req.user._id;
  try {
    const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(400).json({ error: "Unable to fetch workouts" });
  }
};

const getWorkout = async (req, res) => {
  const { id } = req.params;
  //check for valid mongo db id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const workout = await Workout.findById(id);
    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }
    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: "Unable to fetch workout" });
  }
};

const createWorkout = async (req, res) => {
  const { title, reps, load } = req.body;
  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }
  if (!reps) {
    emptyFields.push("reps");
  }
  if (!load) {
    emptyFields.push("load");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  try {
    const user_id = req.user._id;
    const workout = await Workout.create({ title, load, reps, user_id });
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteWorkout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const workout = await Workout.findOneAndDelete({ _id: id });

    if (!workout) {
      return res.status(404).json({ error: "No workout found" });
    }

    res.status(200).json(workout);
  } catch (err) {
    res.status(400).json({ error: "Unable to delete workout" });
  }
};

const updateWorkout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const { title, reps, load } = req.body;
  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }
  if (!reps) {
    emptyFields.push("reps");
  }
  if (!load) {
    emptyFields.push("load");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );
    if (!workout) {
      return res.status(404).json({ error: "No workout found" });
    }
    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: "Unable to update workout" });
  }
};

module.exports = {
  createWorkout,
  getWorkouts,
  getWorkout,
  deleteWorkout,
  updateWorkout,
};
