const Hook = require('../Hook')

class CorsHook extends Hook {
    init() {
        const { allow_domains } = this.configs
        const getOptions = function (req, callback) {
            const isDev = allow_domains.indexOf(req.header('Origin')) !== -1

            callback(null, {
                origin: isDev,
                credentials: isDev,
                optionsSuccessStatus: isDev ? 200 : 500,
            })
        }

        const cors = require('cors')(getOptions)

        app.use(cors)
        app.options('*', cors)
    }
}

module.exports = CorsHook
