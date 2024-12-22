const express = require("express");
const blogController = require("../controllers/blogControllers");
const userRouter = express.Router();

userRouter.get("/", blogController.getAllUserBlogs);
userRouter.get("/:id", blogController.getBlogById);
userRouter.post("/create", blogController.createBlog);

module.exports = userRouter;
