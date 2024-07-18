const express = require("express");
const {
  getWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout,
} = require("../controllers/workoutController");
const requireAuth = require('../middleware/requireAuth')

const router = express.Router();

router.use(requireAuth)

// GET all workouts
router.get("/", getWorkouts);

// GET signle workout
router.get("/:id", getWorkout);

// POST new workout
router.post("/", createWorkout);

// DELETE workout
router.delete("/:id", deleteWorkout);

// UPDATE a workout
router.patch("/:id", updateWorkout);

module.exports = router;
