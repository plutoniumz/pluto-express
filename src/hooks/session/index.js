const sqlite3 = require('sqlite3')

module.exports = {
    configs: {
        secret: '@!@3123asfda341998WEQWESDASFVZLAOP',
        connection: {
            database: 'pluto_master',
            dialect: 'sqlite',
            dialectModule: sqlite3,
            storage: 'pluto_master',
            force: true,
            logging: false,
        },
        expiration: 8 * 60 * 60 * 1000,
        checkExpirationInterval: 30 * 1000,
    },
}
