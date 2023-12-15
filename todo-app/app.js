const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { Todo } = require("./models");
app.use(express.json());

app.get("/todos", async (req, res) => {
  try {
    const data = Todo.getAllTodos;
    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: "Internal Server Error" });
  }
});

app.get("GET/todos", async (req, res) => {
  const data = await Todo.getAllTods();
  res.status(201).json(data);
});

app.post("/todos", async (req, res) => {
  try {
    const newTodo = await Todo.addTodo({
      title: req.body.title,
      dueDate: req.body.dueDate,
    });
    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: "Internal Server Error" });
  }
});

app.put("/todos/:id/markAsComplete", async (req, res) => {
  const todoId = req.params.id;
  try {
    const updateTodo = await Todo.markAsComplete(todoId);
    return res.json(updateTodo);
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: "Internal Server Error" });
  }
});

app.post("/todos/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await Todo.deleteTodo(id);
    return true;
  } catch (error) {
    console.log("error occurred");
    res.status(422).json({ error: "internal server error" });
    return false
  }
});

module.exports = app;
