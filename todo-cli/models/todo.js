"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      const overdueItems = await Todo.overdue();
      console.log(overdueItems.join("\n"));
      console.log("\n");

      console.log("Due Today");
      const dueTodayItems = await Todo.dueToday();
      console.log(dueTodayItems.join("\n"));
      console.log("\n");

      console.log("Due Later");
      const dueLaterItems = await Todo.dueLater();
      console.log(dueLaterItems.join("\n"));
    }

    static async overdue() {
      const data = await Todo.findAll({
        where: {
          dueDate: {
            $lt: new Date(),
          },
          completed: false,
        },
      });

      return data.map((item, index) => {
        const isoDateString = item.dueDate.toISOString().split("T")[0];
        const status = item.completed ? "[x]" : "[ ]";
        return `${index + 1}. ${status} ${item.title} ${isoDateString}`;
      });
    }

    static async dueToday() {
      const data = await Todo.findAll({
        where: {
          dueDate: new Date(),
        },
      });

      return data.map((item, index) => {
        const isoDateString = item.dueDate.toISOString().split("T")[0];
        const status = item.completed ? "[x]" : "[ ]";
        return `${index + 1}. ${status} ${item.title} ${isoDateString}`;
      });
    }

    static async dueLater() {
      const data = await Todo.findAll({
        where: {
          dueDate: {
            $gt: new Date(),
          },
          completed: false,
        },
      });

      return data.map((item, index) => {
        const isoDateString = item.dueDate.toISOString().split("T")[0];
        const status = item.completed ? "[x]" : "[ ]";
        return `${index + 1}. ${status} ${item.title} ${isoDateString}`;
      });
    }

    static async markAsComplete(id) {
      const todo = await Todo.findByPk(id);
      if (todo) {
        todo.completed = true;
        await todo.save();
        console.log(`Task ${id} marked as complete.`);
      } else {
        console.log(`Task with id ${id} not found.`);
      }
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
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
