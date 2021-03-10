class PolicyMiddleware {
    constructor() {
        this.routes = app.configs.routes
        this.policies = app.configs.policies
        this.remain_flag = '...'
        this.user_modules_path = utils.getUserPath('policies')
        this.default_module_names = ['has-logged-in', 'has-permission']
        this.modules = this.requireModules()
        this.rules = Object.entries(this.getRules())
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
        return _.chain(this.policies)
            .pickBy(_.isArray)
            .values()
            .flattenDeep()
            .uniq()
            .value()
    }

    requireDefaultModule(moduleName) {
        return require(`./policies/${moduleName}`)
    }

    requireUserModule(moduleName) {
        return utils.requireUserFile(`${this.user_modules_path}/${moduleName}`)
    }

    getRules() {
        const specificRules = this.getSpecificRules()
        const remainRules = this.getRemainRules()

        return { ...specificRules, ...remainRules }
    }

    getSpecificRules() {
        const addresses = this.getSpecificAddresses()

        return this.assignAddressesModules(addresses)
    }

    getSpecificAddresses() {
        return _.chain(this.policies)
            .pickBy(_.isArray)
            .omit(this.remain_flag)
            .keys()
            .value()
    }

    getRemainRules() {
        const addresses = this.getRemainAddresses()

        return this.assignAddressesModules(addresses, this.remain_flag)
    }

    getRemainAddresses() {
        return _.difference(_.keys(this.routes), _.keys(this.policies))
    }

    assignAddressesModules(addresses, key = null) {
        return _.reduce(
            addresses,
            (result, address) => {
                result[address] = []

                const moduleNames = this.policies[key || address]
                moduleNames.forEach(moduleName => {
                    const module = this.modules[moduleName]
                    result[address].push(module)
                })

                return result
            },
            {},
        )
    }

    init() {
        this.rules.forEach(([address, modules]) => {
            modules.forEach(module => {
                this.register(address, module)
            })
        })
    }

    register(address, module) {
        const url = address.split(' ')[1]
        const httpMethod = address.split(' ')[0].toLowerCase()

        app[httpMethod](url, module)
    }
}

module.exports = new PolicyMiddleware().init()
