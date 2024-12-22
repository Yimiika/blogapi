const request = require("supertest");
const app = require("../index");
const { connect } = require("./database");
const mongoose = require("mongoose");

describe("Auth", () => {
  let conn;
  beforeAll(async () => {
    conn = await connect();
    console.log(conn.mongoServer.getUri());
  });

  afterEach(async () => {
    await conn.cleanup();
  });

  afterAll(async () => {
    await conn.disconnect();
  });
  it("should signup a user", async () => {
    const response = await request(app)
      .post("/signup")
      .set("Content-Type", "application/json")
      .send({
        username: "johnereerr1",
        password: "securePassword123",
        user_type: "owner",
        first_name: "John",
        last_name: "Doe",
        email_address: "johnereerr45@gmail.com",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "User registered Successfully"
    );
  }, 10000);

  it("should login a user", async () => {
    await request(app)
      .post("/signup")
      .set("Content-Type", "application/json")
      .send({
        username: "johnereerr13",
        password: "securePassword123",
        user_type: "owner",
        first_name: "John",
        last_name: "Doe",
        email_address: "johnereerr@gmail.com",
      });
    const response = await request(app)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({
        username: "johnereerr13",
        password: "securePassword123",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should fail to login with wrong username", async () => {
    const response = await request(app)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({
        username: "wrongusername",
        password: "securePassword123",
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "User not found");
  });
});
