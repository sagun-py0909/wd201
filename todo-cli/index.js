const { connect } = require("./connectDB");
const { Todo } = require("./gg/TodoModel");

const createTodo = async ({ title, dueDate, completed }) => {
  await connect();
  await Todo.sync();

  try {
    const todo = await Todo.addTask({
      title: title,
      dueDate: dueDate,
      completed: completed,
    });

    console.log(`created with id: ${todo.id}`);
  } catch (error) {
    console.error("Error creating todo:", error);
  }
};

const countItems = async () => {
  await connect();
  await Todo.sync();
  try {
    const counts = await Todo.count();
    console.log(`Total number of items: ${counts}`);
  } catch (error) {
    console.error("Error counting items:", error);
  }
};
const getAllTodos = async () => {
  await connect();
  await Todo.sync();
  try {
    const data = await Todo.findAll();
    const list = data.map((x) => x.displayablestring()).join("\n");
    console.log(list);
  } catch (error) {
    console.log(error);
  }
};
(async () => {
  await createTodo({ title: "sagun", dueDate: new Date(), completed: false });
  await countItems();
  await getAllTodos();
})();
