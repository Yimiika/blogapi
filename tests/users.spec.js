const request = require("supertest");
const express = require("express");
const userRouter = require("../routes/users"); // Assuming the path to your user router
const blogController = require("../controllers/blogControllers");

// Mock controllers
jest.mock("../controllers/blogControllers", () => ({
  getAllUserBlogs: jest.fn((req, res) =>
    res.status(200).json({ status: true })
  ),
  getBlogById: jest.fn((req, res) => res.status(200).json({ status: true })),
  createBlog: jest.fn((req, res) => res.status(201).json({ status: true })),
}));

const app = express();
app.use(express.json());
app.use("/users", userRouter);

// Add a 404 handler for non-existing routes
app.use((req, res) => res.status(404).json({ message: "route not found" }));

describe("User Route", () => {
  it("Should return status true for GET /users", async () => {
    const response = await request(app)
      .get("/users")
      .set("content-type", "application/json");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: true });
  });

  it("Should return status true for GET /users/:id", async () => {
    const response = await request(app)
      .get("/users/123") // Replace 123 with any test ID
      .set("content-type", "application/json");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: true });
  });

  it("Should return 404 for undefined route POST /users/undefined", async () => {
    const response = await request(app)
      .post("/users/undefined")
      .set("content-type", "application/json");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "route not found" });
  });

  it("Should return 404 for undefined route", async () => {
    const response = await request(app)
      .post("/users/123") // Invalid POST on the /users/:id route
      .set("content-type", "application/json");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "route not found" });
  });

  it("Should create a user successfully with POST /users/create", async () => {
    const response = await request(app)
      .post("/users/create")
      .send({ username: "newUser", password: "password123" })
      .set("content-type", "application/json");
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ status: true });
  });
});
