const app = require("../app");
const request = require("supertest");
const { createUserAndGetToken } = require("./helpers");
const mongoose = require("mongoose");

const WORKOUT_ENDPOINTS = {
  createWorkout: "/api/workouts",
  getWorkouts: "/api/workouts",
};

describe("Workout API test", () => {
  let authToken;

  beforeEach(async () => {
    const { token } = await createUserAndGetToken(
      "workoutuser@dev.co",
      "Test123@"
    );
    authToken = token;
  });

  describe("POST /api/workouts", () => {
    test("should create workout and return 201", async () => {
      const newWorkout = {
        title: "Workout title",
        reps: 12,
        load: 20,
      };

      const response = await request(app)
        .post(WORKOUT_ENDPOINTS.createWorkout)
        .send(newWorkout)
        .set("Cookie", `token=${authToken}`)
        .timeout(15000);

      console.log(response.body);

      expect(response.status).toBe(201);
    });

    test("should reject workout with missing field", async () => {
      const inCompleteWorkout = {
        title: "Push ups",
        reps: 13,
      };

      const response = await request(app)
        .post(WORKOUT_ENDPOINTS.createWorkout)
        .send(inCompleteWorkout)
        .set("Cookie", `token=${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("emptyFields");
      expect(response.body).toHaveProperty(
        "error",
        "Please fill in all the fields"
      );
    });
  });

  describe("GET /api/workouts", () => {
    test("should return empty workouts for new user", async () => {
      const response = await request(app)
        .get(WORKOUT_ENDPOINTS.getWorkouts)
        .set("Cookie", `token=${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test("should return user's workout", async () => {
      await request(app)
        .post(WORKOUT_ENDPOINTS.createWorkout)
        .set("Cookie", `token=${authToken}`)
        .send({ title: "Squat", reps: 5, load: 200 });

      const response = await request(app)
        .get(WORKOUT_ENDPOINTS.getWorkouts)
        .set("Cookie", `token=${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe("Squat");
    });
  });

  describe("GET /api/workouts/:id", () => {
    test("should return workout if id is valid", async () => {
      // Create workout
      const create = await request(app)
        .post("/api/workouts")
        .set("Cookie", `token=${authToken}`)
        .send({ title: "Test", reps: 10, load: 100 });

      const workoutId = create.body._id;

      // Get workout
      const response = await request(app)
        .get(`/api/workouts/${workoutId}`)
        .set("Cookie", `token=${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Test");
    });

    test("should return 400 if id is invalid", async () => {
      const response = await request(app)
        .get(`/api/workouts/invalidId`)
        .set("Cookie", `token=${authToken}`);

      expect(response.status).toBe(400);
    });

    test("should return 404 if workout not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/workouts/${fakeId}`)
        .set("Cookie", `token=${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/workouts/:id", () => {
    test("should delete workout if id is valid and return 200", async () => {
      const createResponse = await request(app)
        .post("/api/workouts")
        .set("Cookie", `token=${authToken}`)
        .send({ title: "Deadlift", reps: 3, load: 300 });

      const workoutId = createResponse.body._id;

      const response = await request(app)
        .delete(`/api/workouts/${workoutId}`)
        .set("Cookie", `token=${authToken}`);

      expect(response.status).toBe(200);
    });

    test("should return 400 if id provided is not valid", async () => {
      const createResponse = await request(app)
        .post("/api/workouts")
        .set("Cookie", `token=${authToken}`)
        .send({ title: "Deadlift", reps: 3, load: 300 });

      const workoutId = createResponse.body._id;

      const response = await request(app)
        .delete(`/api/workouts/${workoutId}s`)
        .set("Cookie", `token=${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Invalid ID");
    });
  });
  describe("PATCH /api/workouts/:id", () => {
    test("should update workout if data is valid", async () => {
      const create = await request(app)
        .post("/api/workouts")
        .set("Cookie", `token=${authToken}`)
        .send({ title: "Original", reps: 10, load: 100 });

      const workoutId = create.body._id;

      const response = await request(app)
        .patch(`/api/workouts/${workoutId}`)
        .set("Cookie", `token=${authToken}`)
        .send({ title: "Updated", reps: 20, load: 200 });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Updated");
      expect(response.body.reps).toBe(20);
    });

    test("should return 400 if fields are missing", async () => {
      const create = await request(app)
        .post("/api/workouts")
        .set("Cookie", `token=${authToken}`)
        .send({ title: "Test", reps: 10, load: 100 });

      const response = await request(app)
        .patch(`/api/workouts/${create.body._id}`)
        .set("Cookie", `token=${authToken}`)
        .send({ title: "Updated" });

      expect(response.status).toBe(400);
      expect(response.body.emptyFields).toEqual(["reps", "load"]);
    });

    test("should return 400 if id is invalid", async () => {
      const response = await request(app)
        .patch(`/api/workouts/invalidId`)
        .set("Cookie", `token=${authToken}`)
        .send({ title: "Test", reps: 10, load: 100 });

      expect(response.status).toBe(400);
    });

    test("should return 404 if workout not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .patch(`/api/workouts/${fakeId}`)
        .set("Cookie", `token=${authToken}`)
        .send({ title: "Test", reps: 10, load: 100 });

      expect(response.status).toBe(404);
    });
  });
});
