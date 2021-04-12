const Hook = require('../Hook')

class CorsHook extends Hook {
    init() {
        const { allow_domains, allow_key } = this.configs

        const getOptions = function (req, callback) {
            if (
                req.method === 'OPTIONS' &&
                req.get('access-control-request-headers') &&
                req.get('access-control-request-headers').includes(allow_key)
            ) {
                callback(null, {
                    origin: true,
                    credentials: true,
                    optionsSuccessStatus: 200,
                })
            } else if (
                req.method !== 'OPTIONS' &&
                req.get('access-control-request-headers') === 'allow'
            ) {
                callback(null, {
                    origin: true,
                    credentials: true,
                    optionsSuccessStatus: 200,
                })
            } else {
                const isDev = allow_domains.indexOf(req.header('Origin')) !== -1

                callback(null, {
                    origin: isDev,
                    credentials: isDev,
                    optionsSuccessStatus: isDev ? 200 : 500,
                })
            }
        }

        const cors = require('cors')(getOptions)

        app.use(cors)
        app.options('*', cors)
    }
}

module.exports = CorsHook
