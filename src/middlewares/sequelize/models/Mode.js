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
            getIdByHttpMethod: async http_method => {
                const modeName = http_method === 'GET' ? 'read' : 'write'

                const mode = await Mode.findOne({
                    attributes: ['id'],
                    where: {
                        name: modeName,
                    },
                })

                return mode.id
            },
        },
    },
}
