const express = require("express");
const userController = require("../controllers/ownerControllers.js");
const ownerRouter = express.Router();

ownerRouter.get("/", userController.getAllUserBlogs);
ownerRouter.get("/:id", userController.getBlogById);
ownerRouter.post("/create", userController.createBlog);
ownerRouter.put("/update/:id", userController.updateBlog);
ownerRouter.put("/edit/:id", userController.editBlog);
ownerRouter.delete("/:id", userController.deleteBlog);

module.exports = ownerRouter;
