class RouteMiddleware {
    constructor() {
        this.routes = app.configs.routes
        this.user_modules_path = utils.getUserPath('controllers')
        this.default_module_names = ['AuthController']
        this.modules = this.requireModules()
    }

    requireModules() {
        const moduleNames = this.getModuleNames()

        return _.reduce(
            moduleNames,
            (result, moduleName) => {
                const isDefault = this.default_module_names.includes(moduleName)

                result[moduleName] = isDefault
                    ? this.requireDefaultModule(moduleName)
                    : this.requireUserModule(moduleName)

                return result
            },
            {},
        )
    }

    getModuleNames() {
        return _.chain(this.routes)
            .values()
            .map(target => target.split('.')[0])
            .uniq()
            .value()
    }

    requireDefaultModule(moduleName) {
        return require(`./controllers/${moduleName}`)
    }

    requireUserModule(moduleName) {
        return utils.requireUserFile(`${this.user_modules_path}/${moduleName}`)
    }

    init() {
        Object.entries(this.routes).forEach(([address, target]) => {
            this.register(address, target)
        })
    }

    register(address, target) {
        const url = address.split(' ')[1]
        const httpMethod = address.split(' ')[0].toLowerCase()
        const moduleName = target.split('.')[0]
        const methodName = target.split('.')[1]

        const module = this.modules[moduleName]

        app[httpMethod](url, module[methodName])
    }
}

module.exports = new RouteMiddleware().init()
