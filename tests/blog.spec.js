const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const blogRouter = require("../routes/blogs");
const userRouter = require("../routes/users");
const { createBlog } = require("../controllers/blogControllers");

const Blog = require("../models/blogs");
const User = require("../models/users");

jest.mock("../models/blogs");
jest.mock("../models/users");

const app = express();
app.use(express.json());
app.use("/owners", ownerRouter);

describe("Owner Controllers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /owners", () => {
    it("should return paginated blogs with search and sort functionality", async () => {
      Blog.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([
            {
              _id: "blog1",
              title: "Test Blog",
              description: "A sample blog",
              state: "draft",
              tags: ["test"],
              author: "Author",
              readCount: 10,
              readTime: 5,
              createdAt: new Date(),
              lastUpdatedAt: new Date(),
            },
          ]),
        }),
      });

      const response = await request(app).get("/owners?author=Author");

      expect(response.status).toBe(200);
      expect(response.body.blogs).toHaveLength(1);
      expect(response.body.blogs[0].author).toBe("Author");
    });

    it("should handle invalid state query gracefully", async () => {
      const response = await request(app).get("/owners?state=invalid");

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Please enter a valid state (draft or published)."
      );
    });
  });

  describe("GET /owners/:id", () => {
    it("should return a single blog by ID", async () => {
      // Mocking Blog.findById to return a mock blog
      Blog.findById.mockResolvedValue({
        _id: "blog1",
        title: "Test Blog",
        state: "published",
        readCount: 10,
        save: jest.fn(),
      });

      const response = await request(app).get("/owners/blog1");

      expect(response.status).toBe(200);
      expect(response.body.blog.title).toBe("Test Blog");
      expect(Blog.findById).toHaveBeenCalledWith("blog1");
    });

    it("should return 404 for a non-existent blog", async () => {
      Blog.findById.mockResolvedValue(null);

      const response = await request(app).get("/owners/nonexistent");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Blog not found");
    });
  });

  describe("PUT /owners/update/:id", () => {
    it("should allow state transition from 'draft' to 'published'", async () => {
      const mockBlog = {
        id: "blog1",
        state: "draft",
        save: jest.fn().mockResolvedValue({
          id: "blog1",
          state: "published",
        }),
      };

      Blog.findById.mockResolvedValue(mockBlog);

      const response = await request(app)
        .put("/owners/update/blog1")
        .send({ state: "published" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("State updated successfully.");
    });

    it("should return 400 for invalid state transitions", async () => {
      const mockBlog = { _id: "blog1", state: "published" };
      Blog.findById.mockResolvedValue(mockBlog);

      const response = await request(app)
        .put("/owners/update/blog1")
        .send({ state: "draft" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Invalid state transition. Cannot move from 'published' to 'draft'."
      );
    });
  });

  describe("PUT /owners/edit/:id", () => {
    it("should update blog fields", async () => {
      const mockBlog = {
        _id: "blog1",
        title: "Old Title",
        save: jest.fn().mockResolvedValue({
          _id: "blog1",
          title: "Updated Title",
        }),
      };

      Blog.findById.mockResolvedValue(mockBlog);

      const response = await request(app)
        .put("/owners/edit/blog1")
        .send({ title: "Updated Title" });

      expect(response.status).toBe(200);
      expect(response.body.blog.title).toBe("Updated Title");
    });
  });

  describe("DELETE /owners/:id", () => {
    it("should delete a blog", async () => {
      const mockBlog = { _id: "blog1", title: "Test Blog" };
      Blog.findByIdAndDelete.mockResolvedValue(mockBlog);

      const response = await request(app).delete("/owners/blog1");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Blog deleted successfully.");
    });

    it("should return 404 for a non-existent blog", async () => {
      Blog.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app).delete("/owners/nonexistent");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Blog not found");
    });
  });
});
