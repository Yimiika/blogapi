const Blog = require("../models/blogs");
const user = require("../models/users");

//function to get all blogs in draft or published state
async function getAllUserBlogs(req, res, next) {
  try {
    const {
      cursor,
      author = "",
      title = "",
      tags = "",
      state = "",
      sort = "timestamp",
      order = "desc",
    } = req.query;

    let query = {};

    // Search functionality
    if (author) {
      query.author = { $regex: author, $options: "i" };
    }

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    if (tags) {
      query.tags = { $regex: tags, $options: "i" };
    }

    if (state) {
      const validStateFields = ["draft", "published"];
      if (!validStateFields.includes(state.toLowerCase())) {
        return res.status(400).json({
          status: 400,
          message: "Please enter a valid state (draft or published).",
        });
      }
      query.state = state.toLowerCase();
    }

    // If a cursor is provided, add it to the query
    if (cursor) {
      query._id = { $gt: cursor };
    }

    // Validate sort field and order
    const validSortFields = ["read_count", "reading_time", "timestamp"];
    const sortField = validSortFields.includes(sort) ? sort : "timestamp";
    const sortOrder = order === "asc" ? 1 : -1;

    // Set the limit to 20, ignoring the limit query parameter
    const limit = 20;

    // Fetch blogs with pagination, search, and sorting
    const blogs = await Blog.find(query)
      .sort({ [sortField]: sortOrder })
      .limit(limit);

    if (blogs.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No blogs found matching the criteria.",
      });
    }

    // Extract the next and previous cursor from the result
    const prevCursor = cursor && blogs.length > 0 ? blogs[0]._id : null;
    const nextCursor = blogs.length > 0 ? blogs[blogs.length - 1]._id : null;

    // Return the paginated data
    return res.status(200).json({
      status: 200,
      nextCursor,
      prevCursor,
      totalResults: blogs.length,
      blogs: blogs.map((blog) => ({
        title: blog.title,
        description: blog.description,
        tags: blog.tags,
        body: blog.body,
        author: blog.author,
        read_count: blog.readCount,
        reading_time: blog.readTime,
        id: blog.id,
        created_at: blog.createdAt,
        last_updated_at: blog.lastUpdatedAt,
      })),
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
}

//function to retrieve blog by ID
async function getBlogById(req, res, next) {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    // If no blog is found, return 404
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Increment readCount only if the blog is published
    if (blog.state === "published") {
      blog.readCount += 1;
      await blog.save(); // Save the updated readCount
    }

    // Return the blog details
    return res.status(200).json({
      message: "Blog retrieved successfully",
      blog: {
        id: blog._id,
        title: blog.title,
        description: blog.description,
        tags: blog.tags,
        body: blog.body,
        author: blog.author,
        state: blog.state,
        read_count: blog.readCount,
        reading_time: blog.readTime,
        created_at: blog.createdAt,
        last_updated_at: blog.lastUpdatedAt,
      },
    });
  } catch (err) {
    console.error("Error retrieving blog:", err);
    next(err);
  }
}

//function to create blog
async function createBlog(req, res, next) {
  try {
    const { title, description, tags, body } = req.body;

    const userId = req.user._id;
    const userData = await user.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingBlogTitle = await Blog.findOne({ title });

    if (existingBlogTitle) {
      return res.status(400).json({ message: "Blog title already exists" });
    }

    const newBlog = new Blog({
      title,
      description,
      tags,
      user: userId,
      author: `${userData.first_name} ${userData.last_name}`,
      body,
    });

    await newBlog.save();

    res.json({
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
}

//function to update blog state
async function updateBlog(req, res, next) {
  try {
    const { id } = req.params;
    const { state } = req.body;

    if (state !== "published" && state !== "draft") {
      return res.status(400).json({
        message: "Invalid state. State can only be 'draft' or 'published'.",
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Allow transition only from 'draft' to 'published'
    if (blog.state === "draft" && state === "published") {
      blog.state = "published";
    } else if (blog.state === "published" && state === "draft") {
      return res.status(400).json({
        message:
          "Invalid state transition. Cannot move from 'published' to 'draft'.",
      });
    } else if (blog.state === state) {
      return res.status(400).json({
        message:
          "No change detected. The state is already set to the provided value.",
      });
    } else {
      return res.status(400).json({
        message:
          "Invalid state transition. State can only transition from 'draft' to 'published'.",
      });
    }

    const updatedBlog = await blog.save();

    return res.status(200).json({
      message: "State updated successfully.",
      blog: {
        id: updatedBlog._id,
        title: updatedBlog.title,
        state: updatedBlog.state,
        lastUpdatedAt: updatedBlog.lastUpdatedAt,
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
}

//function to edit blog details
async function editBlog(req, res, next) {
  try {
    // Define the allowed fields for updates
    const allowedUpdates = ["title", "description", "tags", "body"];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((field) =>
      allowedUpdates.includes(field)
    );

    if (!isValidOperation) {
      return res.status(400).json({
        message:
          "Invalid updates. You can only edit title, description, tags, and body.",
      });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Update allowed fields
    updates.forEach((field) => {
      blog[field] = req.body[field];
    });

    const updatedBlog = await blog.save();

    return res.status(200).json({
      message: "Blog updated successfully.",
      blog: {
        id: updatedBlog._id,
        title: updatedBlog.title,
        description: updatedBlog.description,
        tags: updatedBlog.tags,
        body: updatedBlog.body,
        lastUpdatedAt: updatedBlog.lastUpdatedAt,
      },
    });
  } catch (err) {
    console.error("Error updating blog:", err);
    next(err);
  }
}

// function to delete blog
async function deleteBlog(req, res, next) {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    } else {
      return res.status(200).json({
        message: "Blog deleted successfully.",
        blog: {
          id: blog._id,
          title: blog.title,
          description: blog.description,
          tags: blog.tags,
          body: blog.body,
          author: blog.author,
        },
      });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllUserBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  editBlog,
  deleteBlog,
};
