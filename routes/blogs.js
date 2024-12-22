const express = require("express");
const blogControllers = require("../controllers/blogControllers");
const blogRouter = express.Router();

blogRouter.get("/", blogControllers.getAllUserBlogs);
blogRouter.get("/:id", blogControllers.getBlogById);
module.exports = blogRouter;
