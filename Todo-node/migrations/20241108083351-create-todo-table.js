// migrations/TIMESTAMP-create-todos-table.js
'use strict';

const sequelize = require("../config/database");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ToDos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      taskName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      userId:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      deleteFlag: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ToDos');
  },
};

