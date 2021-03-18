const Hook = require('../Hook')

class BodyParserHook extends Hook {
    init() {
        app.use(require('body-parser').json())
    }
}

module.exports = BodyParserHook
