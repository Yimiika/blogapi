
Blog API
This is a RESTful API for managing blogs, built with Node.js, Express, MongoDB, and Mongoose. The API allows users to create, retrieve, and manage blog posts. It supports user authentication and provides CRUD operations for blogs.

Features
Create a new blog post
Retrieve all blogs or a specific blog by ID
Error handling for blog title duplication and user not found
Technologies Used
Node.js: JavaScript runtime for building the server-side API
Express: Web framework for Node.js
MongoDB: NoSQL database for storing blog data
Mongoose: ODM (Object Data Modeling) library for MongoDB and Node.js
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/Yimiika/blogapi.git
cd blogapi
Install the dependencies:

bash
Copy code
npm install
Set up your .env file for environment variables
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-secret-key

Start the server:
npm start
The API should now be running at http://localhost:5000 (or any port defined in your environment variables).

API Endpoints
1. Create a Blog
Endpoint: POST /owners/create or 
          POST /users/create

Description: Create a new blog post.

Request Body:
{
  "title": "Test Blog 1",
  "description": "This is a test blog",
  "tags": "Family" ,
  "body": "Test body of blog"
}
Response:

200 OK: Blog created successfully
{
  "message": "Blog created successfully",
  "blog": {
    "title": "Test Blog 1",
    "description": "This is a test blog",
    "tags": [
      "Family"
    ],
    "author": "John Doe",
    "user": "6767cf4ce279e7cd8c346ee8",
    "state": "draft",
    "readCount": 0,
    "readTime": 3,
    "body": "Test body of blog",
    "_id": "67683191dacf2e71f4910199",
    "createdAt": "2024-12-22T15:34:41.397Z",
    "lastUpdatedAt": "2024-12-22T15:34:41.398Z",
    "__v": 0
  }
}

400 Bad Request: Blog title already exists

{
  "message": "Blog title already exists"
}
404 Not Found: User not found
{
  "message": "User not found"
}
2. Get All Blogs
Endpoint: GET /owners

Description: Retrieve all blog posts in both published and draft state for ownere

Response:
[
  {
    "_id": "blog-id",
    "title": "Blog Title",
    "description": "Blog Description",
    "tags": ["tag1", "tag2"],
    "body": "Blog content here",
    "author": "User Name"
  },
  ...
]
3. Get Blog by ID
Endpoint: GET /owners/:id

Description: Retrieve a single blog post by ID.

Response:

{
  "_id": "blog-id",
  "title": "Blog Title",
  "description": "Blog Description",
  "tags": ["tag1", "tag2"],
  "body": "Blog content here",
  "author": "User Name"
}
404 Not Found: Blog not found
json
Copy code
{
  "message": "Blog not found"
}
Error Handling
The API returns appropriate status codes and messages for common errors, including:

400 Bad Request: Invalid input (e.g., duplicate blog title).
404 Not Found: User or blog not found.
500 Internal Server Error: Server-side issues.
Running Tests
To run the tests for the Blog API, make sure you have Mocha and Chai installed, then run:
npm test
This will run all the tests defined in the tests folder.
