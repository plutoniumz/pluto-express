const { DataTypes } = Sequelize

module.exports = {
    attributes: {
        name: {
            type: DataTypes.STRING,
            required: true,
        },
    },
    options: {},
}
