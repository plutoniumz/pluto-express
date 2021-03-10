class ResponseMiddleware {
    constructor() {
        this.moduleNames = app.configs.responses
        this.user_modules_path = utils.getUserPath('responses')
        this.default_module_names = [
            'ok',
            'forbidden',
            'sendMessage',
            'unauthorized',
        ]
    }

    init() {
        this.moduleNames.forEach(moduleName => {
            const isDefault = this.default_module_names.includes(moduleName)

            app.response[moduleName] = isDefault
                ? this.requireDefaultModule(moduleName)
                : this.requireUserModule(moduleName)
        })
    }

    requireDefaultModule(moduleName) {
        return require(`./responses/${moduleName}`)
    }

    requireUserModule(moduleName) {
        return utils.requireUserFile(`${this.user_modules_path}/${moduleName}`)
    }
}

module.exports = new ResponseMiddleware().init()
