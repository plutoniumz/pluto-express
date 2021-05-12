const fs = require('fs')
const ora = require('ora')
const chalk = require('chalk')
const path = require('path')
const shell = require('shelljs')

module.exports = {
    command: 'new [application_name]',
    describe: 'Create a new pluto-express application',
    builder: args => {
        args.positional('application_name', {
            type: 'string',
            describe: 'Application name',
            demandOption: true,
        })
    },
    handler: ({ application_name }) => {
        if (!application_name) {
            console.log(chalk.bold.red('Please input application name !!!'))
            return
        }

        if (fs.existsSync(`./${application_name}`)) {
            console.log(
                chalk.bold.red(
                    `The "${application_name}" directory is existed`,
                ),
            )
            return
        }

        const spinner = ora(
            `Application "${application_name}" is creating...`,
        ).start()

        shell.mkdir(application_name)
        shell.cd(application_name)
        shell.exec('npm init -y', { silent: true })
        shell.exec('npm install --save pluto-express sqlite3', { silent: true })
        shell.exec(
            'npm install --save-dev eslint prettier eslint-plugin-prettier eslint-config-prettier',
            { silent: true },
        )
        shell.cp('-R', `${path.join(__dirname, '../example/*')}`, './')

        spinner.succeed(`Application "${application_name}" is created !!!`)

        console.log(
            chalk.bold.cyan('For starting the application please follow: '),
        )
        console.log(`cd ${application_name}`)
        console.log('node app.js')
    },
}
