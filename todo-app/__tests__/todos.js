const db = require("../models");
const request = require("supertest");
const app = require("../app");

describe("Test Suite one", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  test("adds todo to the table", async () => {
    const response = await request(app).post("/todos").send({
      title: "do something",
      dueDate: new Date().toISOString(),
      completed: false,
    });

    expect(response.statusCode).toBe(201);
    expect(response.header["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    const parsedResponse = response.body;
    expect(parsedResponse.id).toBeDefined();
  });

  test("should make the id 1 element to true", async () => {
    const todo = await db.Todo.findByPk(1);
    expect(todo.completed).toBe(false);

    const response = await request(app).put("/todos/1/markAsComplete");
    expect(response.body).toBeDefined();

  });

  test("should delete the element with id 1", async () => {
    await request(app).put("/todos/delete/1");
    const todos = await db.Todo.getAllTods();
    expect(todos.length).toBe(1);
  });
});
