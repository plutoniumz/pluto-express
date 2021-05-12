const Hook = require('../Hook')
const session = require('express-session')
const Store = require('connect-session-sequelize')(session.Store)

class SessionHook extends Hook {
    init() {
        const {
            connection,
            secret,
            expiration,
            checkExpirationInterval,
        } = this.configs

        const { force, alter, user, password, database, ...rest } = connection

        const sessionConnection = new Sequelize(database, user, password, rest)

        const store = new Store({
            db: sessionConnection,
            checkExpirationInterval: checkExpirationInterval,
            expiration: expiration,
        })

        store.sync({
            force: force,
            alter: alter,
        })

        app.use(
            session({
                store: store,
                resave: false,
                saveUninitialized: false,
                secret: secret,
                cookie: {
                    maxAge: expiration,
                },
            }),
        )
    }
}

module.exports = SessionHook
