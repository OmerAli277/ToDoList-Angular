import {Sequelize} from "sequelize-typescript"

export const sequlize = new Sequelize({
    database: 'toDoListDB',
    dialect: 'mysql',
    username: 'toDoListUser',
    password: 'dummypass',
    storage: ':memory:',
    models: [__dirname + '/models']
});