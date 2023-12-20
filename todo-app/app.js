const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
// // app.js
// const { Sequelize } = require('sequelize');


// // Initialize and sync the model
// async function initializeModels() {
//   try {
//     await Todo.sync(); // This will create the "Todos" table if it doesn't exist
//     console.log('Models synchronized successfully.');
//   } catch (error) {
//     console.error('Error synchronizing models:', error);
//   }
// }

// // Call the function to initialize models
// initializeModels();

// ... rest of your Express app setup

app.get("/", async (request, response) => {
  const allTodos = await Todo.getAllTodos();
  if (request.accepts("html")) {
    response.render("index", {
      allTodos,
    });
  } else {
    response.json({ allTodos });
  }
});

app.get("/todos", async function (request, response) {
  console.log("Processing list of all Todos ...");
  try {
    const todo = await Todo.findAll();
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    const todo = await Todo.addTodo(request.body);
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  try {
    const todo = await Todo.destroy({
      where: {
        id: request.params.id,
      },
    });
    response.send(todo ? true : false);
  } catch (error) {
    console.error(error);
    response.status(422).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
