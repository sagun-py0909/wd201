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
    


    static  remove (id) {
      const todo = Todo.destroy({
        where: {
          id: id,
        },
      });
      return todo
    }
    static getAllTodos() {
      const todos = this.findAll();
      return todos;
    }

    static addTodo({ title, dueDate }) {
      return this.create({ title, dueDate: dueDate, completed: false });
    }
    async statusChange(status){
      return this.update({completed : !this.completed})
    }
    async markAsCompleted() {
      return this.update({ completed: true });
    }
    
    async markAsIncompleted() {
      return this.update({ completed: false });
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
    }
  );
  return Todo;
};
