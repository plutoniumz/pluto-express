const Hook = require('../Hook')
const expressFileUpload = require('express-fileupload')

class FileUploadHook extends Hook {
    init() {
        app.use(expressFileUpload(this.configs))
    }
}

module.exports = FileUploadHook
