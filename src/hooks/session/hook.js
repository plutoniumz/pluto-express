const Hook = require('../Hook')
const Session = require('./Session')
const expressSession = require('express-session')
const MySQLStore = require('express-mysql-session')(expressSession)

class SessionHook extends Hook {
    init() {
        const { connection, secret, expiration } = this.configs
        const database = this.settings['sequelize'].configs.connections[
            connection
        ]
        const store = new MySQLStore(database)

        global.session = new Session(store)

        session.clearAllSessions()

        app.use(
            expressSession({
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
