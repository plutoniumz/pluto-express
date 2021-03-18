const { DataTypes } = Sequelize

module.exports = {
    attributes: {
        name: {
            type: DataTypes.STRING,
            required: true,
        },
    },
    options: {
        customMethods: {
            getAll: async () => {
                return await App.findAll({
                    attributes: ['id', 'name'],
                    raw: true,
                })
            },

            getId: async name => {
                const app = await App.findOne({
                    attributes: ['id'],
                    raw: true,
                    where: {
                        name: name,
                    },
                })

                return app.id
            },
        },
    },
}
