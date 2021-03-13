const { DataTypes } = Sequelize

module.exports = {
    attributes: {
        name: {
            type: DataTypes.STRING,
        },
        code: {
            type: DataTypes.STRING,
        },
    },
}
