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
    


    static async remove(id) {
      try {
        const todo = await Todo.destroy({
          where: {
            id: id,
          },
        });
        return todo > 0;
      } catch (error) {
        console.error(error);
        throw error; 
      }
    }
    
    static getAllTodos() {
      const todos = this.findAll();
      return todos;
    }

    static addTodo({ title, dueDate }) {
      const todo = this.create({ title, dueDate: dueDate, completed: false });
      return todo
    }
    async statusChange(status){
      console.log(this)
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
