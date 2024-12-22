# Blog API

This is a simple Blog API built with Node.js, Express, and MongoDB. It allows users to manage blog posts with features such as creating, reading, updating, and deleting posts. It also includes user authentication and authorization using JWT (JSON Web Token)

## Features

- **User Authentication**: Users can sign up, log in, and access the blog posts they create.
- **Blog Post Management**: Users can create, update, and delete blog posts.
- **Post Visibility**: Users can view all posts or only their own posts.
- **JWT Authentication**: Secure authentication using JSON Web Tokens (JWT).
- **Password Hashing**: User passwords are hashed and stored securely.
- **Error Handling**: Provides appropriate error messages when needed.

## Technologies Used

- **Node.js**: JavaScript runtime for building the application.
- **Express.js**: Web framework to handle routing and middleware.
- **MongoDB**: NoSQL database to store user and blog post data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **Passport.js**: Middleware for handling user authentication.
- **JWT (JSON Web Tokens)**: For securing user authentication.

## Installation

To run the Blog API locally, follow the steps below:

1. **Clone the repository**:

    ```bash
    git clone https://github.com/yourusername/blogapi.git
    cd blogapi
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Create a `.env` file** in the root directory with the following variables:

    ```env
    MONGO_URI=mongodb://localhost:27017/blogapi
    JWT_SECRET=your-jwt-secret
    ```

    - `MONGO_URI`: MongoDB connection string (use a local instance or MongoDB Atlas for cloud storage).
    - `JWT_SECRET`: Secret key for generating JWT tokens.

4. **Run the application**:

    ```bash
    npm start
    ```

    The API will be available at `http://localhost:3000`.

## Usage

### Authentication Routes

- **POST** `/signup` - User registration. Requires `username`, `email`, and `password` in the request body.
- **POST** `/login` - User login. Requires `email` and `password` in the request body. Returns a JWT token on success.

### Blog Post Routes

- **GET** `/blogs` - Get all blog posts (public).
- **GET** `/blog/:id` - Get a specific blog post by ID.
- **POST** `/users/create` - Create a new blog post (authenticated user only).
- **PUT** `/owners/:id` - Update an existing blog post (owner only).
- **DELETE** `/posts/:id` - Delete an existing blog post (authenticated user only).

### Middleware

- **authMiddleware**: Ensures that the user is authenticated by verifying the JWT token sent with the request.
- **isAuthorMiddleware**: Ensures that only the author of a blog post can update or delete it.

## Example Requests

### Sign Up

```bash
POST /signup
Content-Type: application/json

{
  "username": "test username",
  "email_address": "testmail@gmail.com",
  "first_name": "John",
  "last_name": "Doe",
  "user_type": "user",
  "password": "securePassword123"
}
