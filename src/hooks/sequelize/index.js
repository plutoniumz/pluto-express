const sqlite3 = require('sqlite3')

module.exports = {
    configs: {
        modelConnections: {},
        connections: {
            master: {
                database: 'pluto_master',
                dialect: 'sqlite',
                dialectModule: sqlite3,
                storage: 'pluto_master.sqlite',
                force: true,
                logging: false,
            },
            slave: {
                database: 'pluto_slave',
                dialect: 'sqlite',
                dialectModule: sqlite3,
                storage: 'pluto_slave.sqlite',
                force: true,
                logging: false,
            },
        },
        defaultAttributes: {},
        associations: () => {},
    },
}
