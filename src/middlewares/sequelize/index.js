const mysql = require('mysql2/promise')

class SequelizeMiddleware {
    constructor() {
        const {
            models,
            databases,
            defaultAttributes,
            defineAssociations,
        } = app.configs.sequelize

        this.models = models
        this.databases = databases
        this.connections = {}
        this.default_attributes = defaultAttributes
        this.user_models_path_name = utils.getUserPath('models')
        this.default_models = [
            'Mode',
            'App',
            'Company',
            'Employee',
            'Permission',
        ]
        this.defineUserAssociations = defineAssociations
    }

    async testConnections() {
        await async.eachOf(this.databases, async configs => {
            const { user, password, host, port, database } = configs
            const queryStr = `CREATE DATABASE IF NOT EXISTS \`${database}\`;`

            try {
                const connection = await mysql.createConnection({
                    host: host,
                    port: port,
                    user: user,
                    password: password,
                })

                await connection.query(queryStr)
            } catch (ex) {
                if (ex.code === 'ECONNREFUSED') {
                    error(
                        `Can not connect to ${database}:\n host: ${host}\n port: ${port}\n user: ${user}\n password: ${password}`,
                    )
                    process.exit()
                }
            }
        })
    }

    initConnections() {
        Object.entries(this.databases).forEach(([name, dbConfigs]) => {
            const { user, password, database, ...rest } = dbConfigs

            this.connections[name] = new Sequelize(
                database,
                user,
                password,
                rest,
            )
        })
    }

    registerModelGlobal(name, attributes, options, connection) {
        global[name] = connection.define(
            name,
            {
                ...this.default_attributes,
                ...attributes,
            },
            options,
        )
    }

    addCustomMethodsToModel(methods, model) {
        Object.assign(model, methods)
    }

    defineModels() {
        Object.entries(this.models).forEach(([name, database]) => {
            const isDefault = this.default_models.includes(name)

            const { attributes, options = {} } = isDefault
                ? this.requireDefaultModel(name)
                : this.requireUserModel(name)
            const connection = this.connections[database]

            this.registerModelGlobal(name, attributes, options, connection)
            this.addCustomMethodsToModel(options.customMethods, global[name])
        })
    }

    requireDefaultModel(modelName) {
        return require(`./models/${modelName}`)
    }

    requireUserModel(modelName) {
        return utils.requireUserFile(
            `${this.user_models_path_name}/${modelName}`,
        )
    }

    async migrateSchemas() {
        await async.eachOf(this.connections, async connection => {
            await connection.sync({
                force: connection.options.force,
            })
        })
    }

    async mockModels() {
        await async.eachOfSeries(this.models, async (model, name) => {
            if (global[name].options.sequelize.options.force) {
                const data = this.requireUserModelMockData(name)

                await global[name].bulkCreate(data)
            }
        })
    }

    requireUserModelMockData(modelName) {
        return utils.requireUserFile(
            `${this.user_models_path_name}/${modelName}/data`,
        )
    }

    defineAssociations() {
        Employee.hasMany(Permission)
        Permission.belongsTo(Employee)
        App.hasMany(Permission)
        Permission.belongsTo(App)
        Company.hasMany(Permission)
        Permission.belongsTo(Company)
        Permission.belongsTo(Mode)
    }

    async init() {
        await this.testConnections()

        this.initConnections()

        this.defineModels()

        this.defineAssociations()

        this.defineUserAssociations()

        await this.migrateSchemas()

        await this.mockModels()
    }
}

module.exports = new SequelizeMiddleware().init()
