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
        this.user_models_mock_data_path_name = utils.getUserPath('mock_data')
        this.default_models = ['Mode', 'App', 'Account', 'Tenant', 'Permission']
        this.defineAssociations = defineAssociations
    }

    async testConnections() {
        await async.eachOf(this.databases, async configs => {
            const { user, password, host, port, database } = configs
            const queryStr = `CREATE DATABASE IF NOT EXISTS \`${database}\`;`
            const connection = await mysql.createConnection({
                host: host,
                port: port,
                user: user,
                password: password,
            })

            await connection.query(queryStr)
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
            `${this.user_models_mock_data_path_name}/${modelName}`,
        )
    }

    async init() {
        await this.testConnections()

        this.initConnections()

        this.defineModels()

        this.defineAssociations()

        await this.migrateSchemas()

        await this.mockModels()
    }
}

module.exports = new SequelizeMiddleware().init()
