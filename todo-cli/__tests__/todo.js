const { describe, beforeAll, test, expect } = require("@jest/globals");
const { DataTypes } = require("sequelize");
const db = require("../models/index");

describe("Todolist Test Suite", () => {
  beforeAll(async () => {
    // Initialize the Todo model
    await db.Todo.init(
      {
        title: DataTypes.STRING,
        dueDate: DataTypes.DATEONLY,
        completed: DataTypes.BOOLEAN,
      },
      {
        sequelize: db.sequelize,
        modelName: "Todo",
      },
    );

    // Sync the model with the database
    await db.Todo.sync({ force: true });
  });

  test("Should add new todo", async () => {
    const todoItemsCount = await db.Todo.count();
    await db.Todo.addTask({
      title: "Test todo",
      completed: false,
      dueDate: new Date(),
    });
    const newTodoItemsCount = await db.Todo.count();
    expect(newTodoItemsCount).toBe(todoItemsCount + 1);
  });
});
