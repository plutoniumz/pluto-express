class Middlewares {
    constructor() {
        this.middlewares = app.configs.general.middlewares
        this.user_middlewares_path_name = utils.getUserPath('middlewares')
        this.default_middlewares = [
            'cors',
            'helmet',
            'body-parser',
            'session',
            'response',
            'policy',
            'route',
            'sequelize',
            'logger',
        ]
    }

    async init() {
        await async.eachOfSeries(this.middlewares, async moduleName => {
            const isDefault = this.default_middlewares.includes(moduleName)

            isDefault
                ? await this.requireDefaultModule(moduleName)
                : await this.requireUserModule(moduleName)
        })
    }

    async requireDefaultModule(moduleName) {
        await require(`./${moduleName}`)
    }

    async requireUserModule(moduleName) {
        await utils.requireUserFile(
            `${this.user_middlewares_path_name}/${moduleName}`,
        )
    }
}

module.exports = new Middlewares().init()
