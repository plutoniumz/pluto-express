require('./globals')
require('./log')

class App {
    constructor() {
        this.user_configs_path_name = utils.getUserPath('configs')
        this.configs = utils.requireUserFile(this.user_configs_path_name)
        this.port = this.configs.general.port
        this.initConfigs()
    }

    initConfigs() {
        app.configs = this.configs
    }

    async init() {
        start('App is starting...')

        await this.initMiddlewares()
        await app.listen(this.port)

        end(`App is started at http://localhost:${this.port}`)
    }

    async initMiddlewares() {
        await require('./middlewares')
    }
}

module.exports = (async function () {
    await new App().init()
})()
