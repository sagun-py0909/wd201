// initDb.js
const Todo = require("./models/todo.js"); // Adjust the path as needed

async function initializeDatabase() {
  try {
    await Todo.sync();
    console.log("Todo table synchronized successfully.");
  } catch (error) {
    console.error("Failed to synchronize Todo table:", error);
  }
}

initializeDatabase();
