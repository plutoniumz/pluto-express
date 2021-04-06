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
        if (application_name) {
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

            shell.exec(
                `
                    mkdir ${application_name}
                    cd ${application_name}
                    npm init -y > /dev/null
                    npm install --save pluto-express > /dev/null
                    npm install --save-dev eslint prettier eslint-plugin-prettier eslint-config-prettier > /dev/null
                    cp -rf ${path.join(__dirname, '../example/')} ./
                `,
                { async: true, silent: true },
                function () {
                    spinner.succeed(
                        `Application "${application_name}" is created !!!`,
                    )
                    console.log(
                        chalk.bold.cyan(
                            'For starting the application please follow: ',
                        ),
                    )
                    console.log(`cd ${application_name}`)
                    console.log('node app.js')
                },
            )
        } else {
            console.log(chalk.bold.red('Please input application name !!!'))
        }
    },
}
