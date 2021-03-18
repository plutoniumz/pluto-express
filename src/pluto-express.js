require('./globals')
require('./log')

const HookLoader = require('./hooks/HookLoader')

class PlutoExpress {
    constructor(settings) {
        const { port, hooks } = settings

        this.port = port
        this.loader = new HookLoader(hooks)
    }

    async start() {
        start('App is starting...')

        await this.loader.load()
        await app.listen(this.port)

        end(`App is started at http://localhost:${this.port}`)
    }
}

const Hook = require('./hooks/Hook')

module.exports = {
    Hook,
    PlutoExpress,
}
