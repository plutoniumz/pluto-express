const bodyParser = require('body-parser')

class BodyParserMiddleware {
    init() {
        app.use(bodyParser.json())
    }
}

module.exports = new BodyParserMiddleware().init()
