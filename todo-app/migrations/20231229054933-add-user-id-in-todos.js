'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('Todos' , 'userId' , {
      type: Sequelize.DataTypes.INTEGER
    })
    queryInterface.addConstraint('Todos' , {
      fields:['userId'],
      type:'foreign key',
      references:{
        table: 'user',
        field:'id'
      }
    })
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Todos' , 'userId')
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
