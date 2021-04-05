const fs = require('fs')
const Hook = require('../Hook')
const expressFileUpload = require('express-fileupload')

class FileUploadHook extends Hook {
    init() {
        app.use(expressFileUpload(this.configs))

        const filesPath = `${process.cwd()}/files`
        if (!fs.existsSync(filesPath)) {
            fs.mkdirSync(filesPath)

            const avatarsPath = `${filesPath}/avatars`
            if (!fs.existsSync(avatarsPath)) {
                fs.mkdirSync(avatarsPath)
            }
        }
    }
}

module.exports = FileUploadHook
