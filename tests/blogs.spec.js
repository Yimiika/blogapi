const request = require("supertest");
const express = require("express");
const blogRouter = require("../routes/blogs");

// Mock controllers
jest.mock("../controllers/blogControllers", () => ({
  getAllUserBlogs: jest.fn((req, res) =>
    res.status(200).json({ status: true })
  ),
  getBlogById: jest.fn((req, res) => res.status(200).json({ status: true })),
}));

const app = express();
app.use(express.json());
app.use("/blogs", blogRouter);

// Add a 404 handler
app.use((req, res) => res.status(404).json({ message: "route not found" }));

describe("Blog Route", () => {
  it("Should return status true for GET /blogs", async () => {
    const response = await request(app)
      .get("/blogs")
      .set("content-type", "application/json");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: true });
  });

  it("Should return status true for GET /blogs/:id", async () => {
    const response = await request(app)
      .get("/blogs/123")
      .set("content-type", "application/json");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: true });
  });

  it("Should return error for undefined route", async () => {
    const response = await request(app)
      .post("/blogs")
      .set("content-type", "application/json");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "route not found" });
  });
});
