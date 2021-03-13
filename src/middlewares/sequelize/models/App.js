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
        },
    },
}
