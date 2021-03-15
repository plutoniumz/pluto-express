const mysql2 = require('mysql2')
const Sequelize = require('sequelize')

module.exports = {
    models: {
        Mode: 'master',
        App: 'master',
        Company: 'master',
        Employee: 'slave',
        Permission: 'master',
    },
    databases: {
        master: {
            user: 'root',
            password: 'root',
            host: 'localhost',
            port: 3306,
            database: 'pluto_core',
            dialect: 'mysql',
            dialectModule: mysql2,
            force: true,
            logging: false,
        },
        slave: {
            user: 'root',
            password: 'root',
            host: 'localhost',
            port: 3306,
            database: 'pluto_application',
            dialect: 'mysql',
            dialectModule: mysql2,
            force: true,
            logging: false,
        },
    },
    defaultAttributes: {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    },
    defineAssociations: () => {},
}
