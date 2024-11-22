// models/ToDo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust this import to your config path
const { all } = require('../routes/todo');

const ToDo = sequelize.define('ToDos', {
 id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  taskName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.INTEGER,
    default: 0,
    // allowNull: false
  },
  userId:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  deleteFlag: {
    type: DataTypes.INTEGER,
    default: 0,
    // allowNull: false
  }
},
{
    timestamps: true, // Enables createdAt and updatedAt
    tableName: 'ToDos', // Ensures Sequelize matches table created in migration
}
);

module.exports = ToDo;
