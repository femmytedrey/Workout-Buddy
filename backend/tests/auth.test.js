const app = require("../app");
const request = require("supertest");
const { createUserAndGetToken } = require("./helpers");

const AUTH_ENDPOINTS = {
  signup: "/api/user/signup",
  login: "/api/user/login",
  checkAuth: "/api/user/check-auth",
};

describe("GET /", () => {
  test("check if api is live", async () => {
    const response = await request(app).get("/");

    expect(response.body.mssg).toBe("Welcome to the app");
  });
});

describe("Authentication API", () => {
  describe("POST /api/auth/signup", () => {
    test("should signup a user and return a token", async () => {
      const userData = {
        email: "fem@dev.co",
        password: "Test123@",
      };

      const response = await request(app)
        .post(AUTH_ENDPOINTS.signup)
        .send(userData);

      expect(response.status).toBe(909);
      expect(response.body).toHaveProperty("email", userData.email);
      expect(response.body).toHaveProperty("token");
      expect(typeof response.body.token).toBe("string");
    });

    test("should return 400 if user is not submitting the right data", async () => {
      const incompleteUserData = {
        email: "email@dev.co",
      };
      const response = await request(app)
        .post(AUTH_ENDPOINTS.signup)
        .send(incompleteUserData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("All fields must be filled");
    });

    test("should check if incoming email is valid", async () => {
      const userData = {
        email: "invalid-email",
        password: "Test123@",
      };

      const response = await request(app)
        .post(AUTH_ENDPOINTS.signup)
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Email is not valid");
    });

    test("should check if incoming password is strong enough", async () => {
      const userData = {
        email: "email1@dev.co",
        password: "weak",
      };

      const response = await request(app)
        .post(AUTH_ENDPOINTS.signup)
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Password is too weak");
    });

    test("should prevent duplicate email registration", async () => {
      const userData = {
        email: "fem1@dev.co",
        password: "Test123@",
      };

      const response = await request(app)
        .post(AUTH_ENDPOINTS.signup)
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("email", userData.email);

      const reRegisterUser = await request(app)
        .post(AUTH_ENDPOINTS.signup)
        .send(userData);

      expect(reRegisterUser.status).toBe(400);
      expect(reRegisterUser.body.error).toBe("Email already in use");
    });
  });

  describe("POST /auth/user/login", () => {
    const userCredentials = {
      email: "logintest@dev.co",
      password: "Test123@",
    };
    beforeEach(async () => {
      await request(app).post(AUTH_ENDPOINTS.signup).send(userCredentials);
    });

    test("should login successfully with valid credentials", async () => {
      const response = await request(app)
        .post(AUTH_ENDPOINTS.login)
        .send(userCredentials);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("email", "logintest@dev.co");
      expect(response.body).toHaveProperty("token");
      expect(typeof response.body.token).toBe("string");
    });

    test("should return 400 if email or password is missing", async () => {
      const response = await request(app).post(AUTH_ENDPOINTS.login).send({
        email: "loginTest@gmail.com",
        //missing password
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("All fields must be filled");
    });

    test("should reject login with incorrect password", async () => {
      const response = await request(app).post(AUTH_ENDPOINTS.login).send({
        email: "logintest@dev.co",
        password: "WrongPassword123@",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
      expect(response.body.token).toBeUndefined();
      expect(response.body.email).toBeUndefined();
    });

    test("should reject login with non-existent email", async () => {
      const response = await request(app).post(AUTH_ENDPOINTS.login).send({
        email: "notexist@dev.co",
        password: "Test123@",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Email not found");
    });
  });

  describe("GET /auth/user/check-auth", () => {
    test("should check and return user successfully with 200 response code", async () => {
      const userCredentials = {
        email: "logintest@dev.co",
        password: "Test123@",
      };
      const { token, email } = await createUserAndGetToken(
        userCredentials.email,
        userCredentials.password
      );

      const response = await request(app)
        .get(AUTH_ENDPOINTS.checkAuth)
        .set("Cookie", `token=${token}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe(userCredentials.email);
    });

    test("should return 401 if no token provided", async () => {
      const userCredentials = {
        email: "logintest@dev.co",
        password: "Test123@",
      };

      const { token } = await createUserAndGetToken(userCredentials);
      const response = await request(app).get(AUTH_ENDPOINTS.checkAuth);

      expect(response.status).toBe(401);
      expect(response.body.error).toBeDefined;
    });

    test("should return 401 if provided token is invalid", async () => {
      const userCredentials = {
        email: "logintest@dev.co",
        password: "Test123@",
      };

      const { token } = await createUserAndGetToken(userCredentials);
      const response = await request(app)
        .get(AUTH_ENDPOINTS.checkAuth)
        .set("Cookie", `token=${token}s`);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Invalid token or unauthorized request");
    });
  });
});
