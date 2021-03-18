const Hook = require('../Hook')

class HelmetHook extends Hook {
    init() {
        app.use(require('helmet')())
    }
}

module.exports = HelmetHook
