const BaseHook = require('./Hook')

class HookLoader {
    constructor(hooks) {
        this.settings = this.getSettings(hooks)
        this.Hooks = this.getHooks(hooks)
    }

    getSettings(hooks) {
        const userSettings = this.getUserSettings(hooks)
        const builtInSettings = this.getBuiltInSettings(hooks)

        const mergeCustomizer = function (objValue, srcValue) {
            if (_.isArray(objValue)) {
                console.log(objValue)
                return objValue.concat(srcValue)
            }
        }

        return _.mergeWith(builtInSettings, userSettings, mergeCustomizer)
    }

    getUserSettings(hooks) {
        return _.reduce(
            hooks,
            (result, hook, hookName) => {
                result[hookName] = hook

                return result
            },
            {},
        )
    }

    getBuiltInSettings(hooks) {
        return _.reduce(
            hooks,
            (result, hook, hookName) => {
                result[hookName] = this.tryRequireBuiltInSettings(hookName)

                return result
            },
            {},
        )
    }

    tryRequireBuiltInSettings(hookName) {
        let builtInSettings = {}

        try {
            builtInSettings = require(`./${hookName}`)
        } catch (ex) {}

        return builtInSettings
    }

    getHooks(hooks) {
        return _.map(hooks, (hook, hookName) => {
            const isUserHook = hook.prototype instanceof BaseHook

            if (isUserHook) {
                const UserHook = hook

                return new UserHook(this.settings, hookName)
            } else {
                const BuiltInHook = require(`./${hookName}/hook`)

                return new BuiltInHook(this.settings, hookName)
            }
        })
    }

    async load() {
        await async.eachOfSeries(this.Hooks, async Hook => {
            await Hook.init()
        })
    }
}

module.exports = HookLoader
