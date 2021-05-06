const Hook = require('../Hook')
const { json } = require('express')

class BodyParserHook extends Hook {
    init() {
        app.use(json())
    }
}

module.exports = BodyParserHook
