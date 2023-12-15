const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { Todo } = require("./models");
app.use(express.json());

app.get("/todos", async (req, res) => {
  const data = await Todo.getAllTodos();
  res.send(data);
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
  const todo = await Todo.findByPk(req.params.id);
  try {
    const updateTodo = await todo.markAsComplete();
    return res.send(updateTodo);
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: "Internal Server Error" });
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.send(todo ? true : false);
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
