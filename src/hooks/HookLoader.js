const BaseHook = require('./Hook')

const AFTER = 'after'
const BEFORE = 'before'
const DEFAULT_HOOKS = [
    'cors',
    'helmet',
    'session',
    'file-upload',
    'responses',
    'policies',
    'routes',
    'sequelize',
    'logger',
]

class HookLoader {
    constructor(hooks) {
        hooks = { ...this.addDefaultHooks(hooks), ...hooks }
        this.settings = this.getSettings(hooks)
        this.Hooks = this.getHooks(hooks)
    }

    addDefaultHooks(hooks) {
        return _.reduce(
            DEFAULT_HOOKS,
            (result, defaultHookName) => {
                if (
                    !Object.prototype.hasOwnProperty.call(
                        hooks,
                        defaultHookName,
                    )
                ) {
                    result[defaultHookName] = {}
                } else {
                    result[defaultHookName] = hooks[defaultHookName]
                }

                return result
            },
            {},
        )
    }

    getSettings(hooks) {
        const userSettings = this.getUserSettings(hooks)
        const builtInSettings = this.getBuiltInSettings(hooks)

        const mergeCustomizer = function (objValue, srcValue) {
            if (_.isArray(objValue)) {
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

    getHookOnData(hook) {
        if (!hook.on) {
            error(`Missing 'on' property in ${hook.name}`)
            process.exit()
        }

        const when = hook.on.split(':')[0]

        if (![AFTER, BEFORE].includes(when)) {
            error(
                `Not support for '${when}' in 'startOn' function ! Please set 'after' or 'before'`,
            )
            process.exit()
        }

        const hookName = hook.on.split(':')[1]
        const hookNames = this.Hooks.map(({ name }) => name)

        if (!hookNames.includes(hookName)) {
            error(`Hook '${hookName}' is not found`)
            process.exit()
        }

        return {
            when,
            hookName,
        }
    }

    reorderHooks() {
        this.Hooks.forEach((hook, index) => {
            if (!DEFAULT_HOOKS.includes(hook.name)) {
                this.Hooks.splice(index, 1)
                const { when, hookName } = this.getHookOnData(hook)

                const changeIndex = _.findIndex(this.Hooks, { name: hookName })

                if (when === AFTER) {
                    this.Hooks.splice(changeIndex + 1, 0, hook)
                } else if (when === BEFORE) {
                    this.Hooks.splice(changeIndex, 0, hook)
                }
            }
        })
    }

    async load() {
        this.reorderHooks()

        await async.eachOfSeries(this.Hooks, async Hook => {
            await Hook.init()
            info(Hook.name)
        })
    }
}

module.exports = HookLoader
