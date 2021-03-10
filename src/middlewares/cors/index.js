const cors = require('cors')

class CorsMiddleware {
    init() {
        app.use(cors(this.getOptions))
        app.options('*', cors(this.getOptions))
    }

    getOptions(req, callback) {
        const allowDomains = app.configs.cors.allowDomains
        const isDev = allowDomains.indexOf(req.header('Origin')) !== -1

        callback(null, {
            origin: isDev,
            credentials: isDev,
            optionsSuccessStatus: isDev ? 200 : 500,
        })
    }
}

module.exports = new CorsMiddleware().init()
