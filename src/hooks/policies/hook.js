const Hook = require('../Hook')

class PoliciesHook extends Hook {
    init() {
        this.remain_flag = '...'
        this.routes = this.settings['routes'].configs
        this.policies = this.configs

        if (!_.isEmpty(this.policies)) {
            this.rules = Object.entries(this.getRules())

            this.rules.forEach(([address, modules]) => {
                modules.forEach(module => {
                    this.register(address, module)
                })
            })
        }
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

    register(address, module) {
        const url = address.split(' ')[1]
        const httpMethod = address.split(' ')[0].toLowerCase()

        app[httpMethod](url, module)
    }
}

module.exports = PoliciesHook
