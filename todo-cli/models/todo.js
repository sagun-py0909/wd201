"use strict";
const { Model } = require("sequelize");
const { Op } = require("sequelize");

let today = new Date();
let tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      const overdueitems = await Todo.overdue();
      let todolist1 = overdueitems
        .map((todos) => todos.displayableString())
        .join("\n");
      console.log(todolist1);
      console.log("\n");

      console.log("Due Today");
      const duetodayItems = await Todo.dueToday();
      let todolist2 = duetodayItems
        .map((todos) => todos.displayableString())
        .join("\n");
      console.log(todolist2);

      console.log("\n");

      console.log("Due Later");
      const duelaterItems = await Todo.dueLater();
      let todolist3 = duelaterItems
        .map((todos) => todos.displayableString())
        .join("\n");
      console.log(todolist3);
    }

    static async overdue() {
      const data = await this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),
          },
        },
      });
      return data;
    }

    static async dueToday() {
      const data = await this.findAll({
        where: {
          dueDate: new Date(),
        },
      });
      return data;
    }

    static async dueLater() {
      const data = await this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
        },
      });
      return data;
    }

    static async markAsComplete(id) {
      const todo = await Todo.findByPk(id);

      if (todo) {
        todo.completed = true;
        await todo.save();
      }
    }

    displayableString() {
      let result = "";

      let checkbox = this.completed ? "[x]" : "[ ]";
      let dueDate = this.completed ? "" : ` ${this.dueDate}`;
      if (this.dueDate === new Date()) {
        result += `${this.id}. ${checkbox} ${this.title}\n`;
      }
      result += `${this.id}. ${checkbox} ${this.title}${dueDate}\n`;

      return result;
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );
  return Todo;
};
