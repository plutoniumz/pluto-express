const mysql2 = require('mysql2')

module.exports = {
    modules: require('./models'),
    configs: {
        modelConnections: {
            Mode: 'master',
            App: 'master',
            Company: 'master',
            Employee: 'master',
            Permission: 'master',
        },
        connections: {
            master: {
                user: 'root',
                password: 'root',
                host: 'localhost',
                port: 3306,
                database: 'pluto_master',
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
                database: 'pluto_slave',
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
        associations: {
            App: ['hasMany Permission'],
            Company: ['hasMany Permission'],
            Employee: ['hasMany Permission'],
            Mode: ['hasMany Permission'],
            Permission: [
                'belongsTo App',
                'belongsTo Employee',
                'belongsTo Company',
                'belongsTo Mode',
            ],
        },
    },
}
