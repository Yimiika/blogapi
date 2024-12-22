const Blog = require("../models/blogs");
const user = require("../models/users");

//function to  retrieve all published blogs with pagination, 20 blogs per page
async function getAllUserBlogs(req, res, next) {
  try {
    const {
      cursor,
      author = "",
      title = "",
      tags = "",
      sort = "timestamp",
      order = "desc",
    } = req.query;

    let query = { state: "published" };

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
      })),
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
}

async function getBlogById(req, res, next) {
  try {
    const { id } = req.params;

    // Increment the read count and return the blog
    const blog = await Blog.findByIdAndUpdate(
      { _id: id, state: "published" },
      { $inc: { readCount: 1 } },
      { new: true }
    );

    if (!blog) {
      return res
        .status(404)
        .json({ message: "Blog not found or not published" });
    }

    return res.status(200).json({
      message: "Blog retrieved successfully",
      blog: {
        id: blog._id,
        title: blog.title,
        description: blog.description,
        tags: blog.tags,
        body: blog.body,
        author: blog.author,
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

//function to create a single blog

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

module.exports = {
  getAllUserBlogs,
  getBlogById,
  createBlog,
};
