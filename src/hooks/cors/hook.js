const Hook = require('../Hook')

class CorsHook extends Hook {
    init() {
        const { allow_domains, allow_key } = this.configs

        const getOptions = function (req, callback) {
            // allow_key cors configs
            if (allow_key !== null && allow_key !== '') {
                // case method OPTIONS for preflight request
                if (
                    req.method === 'OPTIONS' &&
                    req.get('access-control-request-headers') &&
                    req
                        .get('access-control-request-headers')
                        .includes(allow_key.toLowerCase())
                ) {
                    callback(null, {
                        origin: true,
                        credentials: true,
                        optionsSuccessStatus: 200,
                    })
                }

                // case another methods
                if (
                    req.method !== 'OPTIONS' &&
                    req.get(allow_key.toLowerCase()) === 'allow'
                ) {
                    callback(null, {
                        origin: true,
                        credentials: true,
                        optionsSuccessStatus: 200,
                    })
                }
            }

            // default
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
