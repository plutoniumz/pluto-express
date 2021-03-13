const index = require('express-session')
const Session = require('./Session')
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
    }

    defineGlobalSession() {
        const store = new MySQLStore({
            ...this.configs,
            ...this.database,
        })

        global.session = new Session(store)
    }

    init() {
        this.defineGlobalSession()

        session.clearAllSessions()

        app.use(
            index({
                store: session.store,
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
