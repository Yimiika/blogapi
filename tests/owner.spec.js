const request = require("supertest");
const express = require("express");
const ownerRouter = require("../routes/owners");

// Mock controllers
jest.mock("../controllers/ownerControllers", () => ({
  getAllUserBlogs: jest.fn((req, res) =>
    res.status(200).json({ status: true })
  ),
  getBlogById: jest.fn((req, res) => res.status(200).json({ status: true })),
  createBlog: jest.fn((req, res) =>
    res.status(201).json({ status: true, message: "Blog created" })
  ),
  updateBlog: jest.fn((req, res) =>
    res.status(200).json({ status: true, message: "Blog updated" })
  ),
  editBlog: jest.fn((req, res) =>
    res.status(200).json({ status: true, message: "Blog edited" })
  ),
  deleteBlog: jest.fn((req, res) =>
    res.status(200).json({ status: true, message: "Blog deleted" })
  ),
}));

const app = express();
app.use(express.json());
app.use("/owners", ownerRouter);

// Add a 404 handler
app.use((req, res) => res.status(404).json({ message: "route not found" }));

describe("Owner Route", () => {
  it("Should return status true for GET /owners", async () => {
    const response = await request(app)
      .get("/owners")
      .set("content-type", "application/json");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: true });
  });

  it("Should return status true for GET /owners/:id", async () => {
    const response = await request(app)
      .get("/owners/123")
      .set("content-type", "application/json");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: true });
  });

  it("Should return status true for POST /owners/create", async () => {
    const response = await request(app)
      .post("/owners/create")
      .send({ name: "New Blog" })
      .set("content-type", "application/json");
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ status: true, message: "Blog created" });
  });

  it("Should return status true for PUT /owners/update/:id", async () => {
    const response = await request(app)
      .put("/owners/update/123")
      .send({ name: "Updated Blog" })
      .set("content-type", "application/json");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: true, message: "Blog updated" });
  });

  it("Should return status true for PUT /owners/edit/:id", async () => {
    const response = await request(app)
      .put("/owners/edit/123")
      .send({ name: "Edited Blog" })
      .set("content-type", "application/json");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: true, message: "Blog edited" });
  });

  it("Should return status true for DELETE /owners/:id", async () => {
    const response = await request(app)
      .delete("/owners/123")
      .set("content-type", "application/json");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: true, message: "Blog deleted" });
  });

  it("Should return error for undefined route", async () => {
    const response = await request(app)
      .post("/owners/undefined-route")
      .set("content-type", "application/json");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "route not found" });
  });

  // Tests for correct path but wrong method
  it("Should return 404 for POST /owners", async () => {
    const response = await request(app)
      .post("/owners")
      .set("content-type", "application/json");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "route not found" });
  });

  it("Should return 404 for PUT /owners/:id", async () => {
    const response = await request(app)
      .put("/owners/123")
      .set("content-type", "application/json");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "route not found" });
  });

  it("Should return 404 for DELETE /owners", async () => {
    const response = await request(app)
      .delete("/owners")
      .set("content-type", "application/json");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "route not found" });
  });
});
