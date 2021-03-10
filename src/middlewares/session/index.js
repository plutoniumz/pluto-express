const index = require('express-session')
const MySQLStore = require('express-mysql-session')(index)

class SessionMiddleware {
    constructor() {
        const {
            session: { database: sessionDbName, secret, expiration },
            sequelize: { databases: sequelizeDbs },
        } = app.configs

        this.store = MySQLStore
        this.secret = secret
        this.expiration = expiration
        this.sessionDbName = sessionDbName
        this.database = sequelizeDbs[this.sessionDbName]
        this.defineGlobalSessionStore()
        this.clearAllOldSessions()
    }

    defineGlobalSessionStore() {
        global.sessionStore = new MySQLStore({
            ...this.configs,
            ...this.database,
        })
    }

    clearAllOldSessions() {
        sessionStore.clear()
    }

    init() {
        app.use(
            index({
                store: sessionStore,
                resave: false,
                saveUninitialized: false,
                secret: this.secret,
                cookie: {
                    maxAge: this.expiration,
                },
            }),
        )
    }
}

module.exports = new SessionMiddleware().init()
