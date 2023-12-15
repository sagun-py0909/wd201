"use strict";
const { Model, where } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static getAllTods() {
      return this.findAll();
    }

    static addTodo({ title, dueDate }) {
      return this.create({ title, dueDate: dueDate, completed: false });
    }
    static markAsComplete(id) {
      return this.update(
        { completed: true },
        {
          where: { id: id },
        }
      );
    }
    static deleteTodo(id) {
      return this.destroy({
        where: {
          id: id,
        },
      });
    }
    static showList() {}
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
    }
  );
  return Todo;
};
