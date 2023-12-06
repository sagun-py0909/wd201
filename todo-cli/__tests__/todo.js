const todoList = require("../todo");
const formattedDate = (d) => {
  return d.toISOString().split("T")[0];
};

var dateToday = new Date();
const today = formattedDate(dateToday);
const yesterday = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() - 1)),
);
const tomorrow = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() + 1)),
);
const { all, markAsComplete, overdue, dueLater, dueToday, add } = todoList();

describe("The test part -1", () => {
  beforeAll(() => {
    add({ title: "File taxes", dueDate: tomorrow, completed: false });
  });
  test("A test that checks creating a new todo?", () => {
    expect(all.length).toBe(1);
  });
  test("checks marking a todo as completed?", () => {
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
});

describe("Test part-2", () => {
  beforeAll(() => {
    add({ title: "Submit assignment", dueDate: yesterday, completed: false });
    add({ title: "Pay rent", dueDate: today, completed: true });
    add({ title: "Service Vehicle", dueDate: today, completed: false });
    add({ title: "File taxes", dueDate: tomorrow, completed: false });
    add({ title: "Pay electric bill", dueDate: tomorrow, completed: false });
  });

  test("checks retrieval of overdue items?", () => {
    const list = overdue();
    expect(list.length).toBe(1);
  });
  test("checks retrieval of due today items?", () => {
    const list = dueToday();
    expect(list.length).toBe(2);
  });
  test("checks retrieval of due later items?", () => {
    const list = dueLater();
    expect(list.length).toBe(3);
  });
});
