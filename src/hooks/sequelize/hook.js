const Hook = require('../Hook')

class SequelizeHook extends Hook {
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
