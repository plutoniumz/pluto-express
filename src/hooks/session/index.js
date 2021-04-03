module.exports = {
    configs: {
        secret: '@!@3123asfda341998WEQWESDASFVZLAOP',
        charset: 'utf8_general_ci',
        connection: 'master',
        expiration: 8 * 60 * 60 * 1000,
        clearExpired: true,
        connectionLimit: 1,
        createDatabaseTable: true,
        endConnectionOnClose: true,
        checkExpirationInterval: 30 * 1000,
    },
}
