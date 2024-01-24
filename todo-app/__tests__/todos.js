const request = require("supertest");
const cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;

function extractcsrf(res) {
  try {
    const $ = cheerio.load(res.text);
    const csrfToken = $("[name=_csrf]").val();
    console.log("CSRF Token:", csrfToken);
    return csrfToken;
  } catch (error) {
    console.error("Error extracting CSRF token:", error);
    throw error;
  }
}

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Sign up testing", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractcsrf(res);
    res = await agent.post("/users").send({
      firstName: "Test",
      lastName: "User A",
      email: "usera@gmail.com",
      password: "userARocks",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });
  test("Sign out test", async () => {
    let res = await agent.get("/todo");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
  });
  test("Sign out test", async () => {
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
  });

  test("Fetches all todos in the database using /todos endpoint", async () => {
    let res = await agent.get("/todo");
    await agent.post("/todos").send({
      title: "Buy xbox",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: extractcsrf(res),
    });
    res = await agent.get("/todo");
    await agent.post("/todos").send({
      title: "Buy ps3",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: extractcsrf(res),
    });

    // Add this line to extract CSRF token from the response
    const csrfToken = extractcsrf(res);

    // Log the response to inspect the actual content
    console.log(res.text);

    const response = await agent
      .get("/todos")
      .set("Cookie", `_csrf=${csrfToken}`);

    // Log the response to inspect the actual content
    console.log(response.text);

    const parsedResponse = JSON.parse(response.text);

    expect(parsedResponse.length).toBe(2);
    expect(parsedResponse[parsedResponse.length - 1]["title"]).toBe("Buy ps3");
  });
  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const res = await agent.get("/");
    const csrf = extractcsrf(res);

    // Log the CSRF token to inspect if it's correct
    console.log("CSRF Token:", csrf);

    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrf,
    });

    // Log the response to inspect the actual content
    console.log(response.text);

    expect(response.statusCode).toBe(201); // Adjust status code if needed
  });
  test("Updating a todo", async () => {
    const og = await agent.get("/todos");

    // Log the original response to inspect the actual content
    console.log(og.text);

    const parsedog = JSON.parse(og.text);
    const lenog = parsedog.length;

    const res = await agent.get("/");
    await agent.post("/todos").send({
      title: "Buy ps3",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: extractcsrf(res),
    });

    const response = await agent
      .put(`/todos/${lenog}/:x`)
      .send({ _csrf: extractcsrf(res) }) // Include _csrf in the request payload
      .set("Cookie", `_csrf=${extractcsrf(res)}`); // Set CSRF token in the request header

    // Log the response to inspect the actual content
    console.log(response.text);

    expect(response.statusCode).toBe(302);
  });

  test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
    const initialTodos = await agent.get("/todos");
    if (initialTodos.body.length > 0) {
      const todoToDelete = initialTodos.body[0];
      const response = await agent.delete(`/todos/${todoToDelete.id}`);
      expect(response.statusCode).toBe(200);
      const updatedTodos = await db.Todo.getAllTodos();
      expect(updatedTodos.length).toBe(initialTodos.body.length - 1);
    }
  });
});
