const Hook = require('../Hook')
const mysql = require('mysql2/promise')

class SequelizeHook extends Hook {
    async createDatabases(connections) {
        await async.eachOf(connections, async configs => {
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

    getSequelizeConnections(connections) {
        const sequelizeConnections = {}

        Object.entries(connections).forEach(([name, dbConfigs]) => {
            const { user, password, database, ...rest } = dbConfigs

            const sequelizeConnection = new Sequelize(
                database,
                user,
                password,
                rest,
            )

            // https://github.com/sequelize/sequelize/issues/3023
            sequelizeConnection.dialect.supports.schemas = true
            sequelizeConnections[name] = sequelizeConnection
        })

        return sequelizeConnections
    }

    defineModels(
        modelConnections,
        sequelizeConnections,
        defaultAttributes,
        models,
    ) {
        Object.entries(modelConnections).forEach(
            ([modelName, connectionName]) => {
                const connection = sequelizeConnections[connectionName]
                const { attributes, options = {} } = models[modelName]

                const Model = connection.define(
                    modelName,
                    {
                        ...defaultAttributes,
                        ...attributes,
                    },
                    {
                        ...options,
                        schema: connection.config.database,
                    },
                )

                Object.assign(Model, options.customMethods)

                global[modelName] = Model
            },
        )
    }

    async migrateSchemas(sequelizeConnections) {
        await async.eachOf(sequelizeConnections, async connection => {
            await connection.sync({
                force: connection.options.force,
                alter: connection.options.alter,
            })
        })
    }

    async mockDataModels(models) {
        await async.eachOfSeries(models, async (model, modelName) => {
            if (
                global[modelName].options.sequelize.options.force &&
                Object.prototype.hasOwnProperty.call(model, 'data')
            ) {
                const { data } = model

                await global[modelName].bulkCreate(data)
            }
        })
    }

    async init() {
        const {
            connections,
            modelConnections,
            defaultAttributes,
        } = this.configs
        const models = this.modules

        await this.createDatabases(connections)

        const sequelizeConnections = this.getSequelizeConnections(connections)

        this.defineModels(
            modelConnections,
            sequelizeConnections,
            defaultAttributes,
            models,
        )

        this.configs.associations()

        await this.migrateSchemas(sequelizeConnections)

        await this.mockDataModels(models)
    }
}

module.exports = SequelizeHook
