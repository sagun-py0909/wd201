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
      await this.overdue();
      console.log("\n");

      console.log("Due Today");
      await this.dueToday();
      console.log("\n");

      console.log("Due Later");
      await this.dueLater();
    }

    static async overdue() {
      const data = await this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),
          },
          completed: false,
        },
      });
      console.log(this.displayableString(data));
    }

    static async dueToday() {
      const data = await this.findAll({
        where: {
          dueDate: new Date(),
        },
      });
      console.log(this.displayableString(data));
    }

    static async dueLater() {
      const data = await this.findAll({
        where: {
          dueDate: tomorrow,
          completed: false,
        },
      });
      console.log(this.displayableString(data));
    }

    static async markAsComplete(id) {
      const todo = await Todo.findByPk(id);

      if (todo) {
        todo.completed = true;
        await todo.save();
      }
    }

    static displayableString(data) {
      let result = "";
      for (const task of data) {
        let checkbox = task.completed ? "[x]" : "[ ]";
        result += `${task.id}. ${checkbox} ${task.title} ${task.dueDate}\n`;
      }
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
