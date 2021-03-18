const Hook = require('../Hook')

class ResponsesHook extends Hook {
    init() {
        Object.assign(app.response, this.modules)
    }
}

module.exports = ResponsesHook
