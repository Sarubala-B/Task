//Database.js

const  Sequelize  = require('sequelize');

const sequelize = new Sequelize('todo_db', 'root', 'Sarubala', {
    host: 'localhost',
    dialect: 'mariadb'
});

module.exports =  sequelize;
