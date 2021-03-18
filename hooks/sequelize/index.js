const mysql2 = require('mysql2')

module.exports = {
    modules: require('./models'),
    configs: {
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
        modelConnections: {
            Mode: 'master',
            App: 'master',
            Company: 'master',
            Employee: 'master',
            Permission: 'master',
        },
        defaultAttributes: {},
        associations: {},
    },
}
