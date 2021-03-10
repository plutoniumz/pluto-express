const helmet = require('helmet')

class HelmetMiddleware {
    init() {
        app.use(helmet())
    }
}

module.exports = new HelmetMiddleware().init()
