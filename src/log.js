class Log {
    constructor() {
        this.logs = {
            end: chalk.bold.green,
            info: chalk.bold.blue,
            start: chalk.bold.yellow,
            error: chalk.bold.red,
        }
    }

    init() {
        global['log'] = (message, level = 0, color) => {
            if (app.configs.general.logLevel >= level) {
                console.log(color(`${'- '.repeat(level)}${message}`))
            }
        }
        Object.entries(this.logs).forEach(([fnName, buildInChalkLog]) => {
            global[fnName] = (message, level = 0) => {
                console.log(
                    buildInChalkLog(
                        `${level ? `${level}` : ''}${'-'.repeat(
                            level,
                        )}${message}`,
                    ),
                )
            }
        })
    }
}

module.exports = new Log().init()
