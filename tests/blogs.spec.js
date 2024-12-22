const request = require("supertest");
const express = require("express");
const blogRouter = require("../routes/blogs");
const userRouter = require("../routes/users");
const blogControllers = require("../controllers/blogControllers");
const Blog = require("../models/blogs");
const User = require("../models/users");

jest.mock("../models/blogs");
jest.mock("../models/users");
jest.mock("../controllers/blogControllers");

const app = express();
app.use(express.json());
app.use("/owners", userRouter);
app.use("/blogs", blogRouter);

describe("Blog Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /blogs - Get all user blogs", () => {
    it("should return a list of published blogs", async () => {
      const mockBlogs = [
        {
          _id: "blog1",
          title: "Test Blog",
          description: "A sample blog",
          state: "published",
          tags: ["test"],
          author: "Author",
          readCount: 10,
          readTime: 5,
          createdAt: new Date(),
          lastUpdatedAt: new Date(),
        },
      ];

      // Mocks the controller function
      blogControllers.getAllUserBlogs.mockImplementation((req, res) => {
        res.status(200).json({ blogs: mockBlogs });
      });

      const response = await request(app).get("/blogs");

      expect(response.status).toBe(200);
      expect(response.body.blogs).toHaveLength(1);
      expect(response.body.blogs[0].title).toBe("Test Blog");
    });

    it("should return 404 if no blogs are found", async () => {
      blogControllers.getAllUserBlogs.mockImplementation((req, res) => {
        res
          .status(404)
          .json({ message: "No blogs found matching the criteria." });
      });

      const response = await request(app).get("/blogs");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(
        "No blogs found matching the criteria."
      );
    });
  });

  describe("GET /blogs/:id - Get blog by ID", () => {
    it("should return a single blog", async () => {
      const mockBlog = {
        _id: "blog1",
        title: "Test Blog",
        description: "A sample blog",
        state: "published",
        tags: ["test"],
        author: "Author",
        readCount: 10,
        readTime: 5,
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
      };

      blogControllers.getBlogById.mockImplementation((req, res) => {
        res.status(200).json({ blog: mockBlog });
      });

      const response = await request(app).get("/blogs/blog1");

      expect(response.status).toBe(200);
      expect(response.body.blog.title).toBe("Test Blog");
    });

    it("should return 404 if blog not found", async () => {
      blogControllers.getBlogById.mockImplementation((req, res) => {
        res.status(404).json({ message: "Blog not found or not published" });
      });

      const response = await request(app).get("/blogs/nonexistent");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Blog not found or not published");
    });
  });
});
