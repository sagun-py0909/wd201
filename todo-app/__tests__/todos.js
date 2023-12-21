const request = require("supertest");
const cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;

function extractcsrf(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
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

  test("Fetches all todos in the database using /todos endpoint", async () => {
    let res = await agent.get("/");
    await agent.post("/todos").send({
      title: "Buy xbox",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: extractcsrf(res),
    });
    res = await agent.get("/");
    await agent.post("/todos").send({
      title: "Buy ps3",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: extractcsrf(res),
    });
    const response = await agent.get("/todos");
    const parsedResponse = JSON.parse(response.text);

    expect(parsedResponse.length).toBe(2);
    expect(parsedResponse[parsedResponse.length - 1]["title"]).toBe("Buy ps3");
  });

  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const res = await agent.get("/");
    const csrf = extractcsrf(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrf,
    });
    expect(response.statusCode).toBe(302);
  });

  test("Updating a todo", async () => {
    const og = await agent.get("/todos");
    const parsedog = JSON.parse(og.text);
    const lenog = parsedog.length;

    const res = await agent.get("/");
    await agent.post("/todos").send({
      title: "Buy ps3",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: extractcsrf(res),
    });

    const response = await agent.put(`/todos/${lenog}/:x`);
    expect(response.statusCode).toBe(302);
  });

  test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
    const initialTodos = await agent.get("/todos");
    if (initialTodos.body.length > 0) {
      const todoToDelete = initialTodos.body[0];
      const response = await request(app).delete(`/todos/${todoToDelete.id}`);
      expect(response.statusCode).toBe(200);
      const updatedTodos = await db.Todo.getAllTodos();
      expect(updatedTodos.length).toBe(initialTodos.body.length - 1);
    }
  });
});
