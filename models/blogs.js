const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BlogModel = new Schema({
  title: {
    type: String,
    required: [true, "Blog title is required"],
    unique: [true, "Blog title must be unique"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  tags: {
    type: [String],
    required: [true, "Tags are required"],
  },
  author: {
    type: String,
    required: [true, "Author is required"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  state: {
    type: String,
    required: [true, "Blog state is required"],
    enum: {
      values: ["draft", "published"],
      message: "State must be either 'draft' or 'published'",
    },
    default: "draft",
  },
  readCount: {
    type: Number,
    default: 0,
  },
  readTime: {
    type: Number,
    default: "0",
  },
  body: {
    type: String,
    required: [true, "Blog body is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now,
  },
});

BlogModel.pre("save", async function (next) {
  try {
    // Calculate word count and read time with the assumption that it takes one second to read four words
    const wordCount = (
      this.title +
      " " +
      this.description +
      " " +
      this.body
    ).split(/\s+/).length;
    this.readTime = wordCount * 0.25;
    this.lastUpdatedAt = Date.now();
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Blogs", BlogModel);
