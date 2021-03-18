const { DataTypes } = Sequelize

module.exports = {
    data: require('./data'),
    attributes: {
        name: {
            type: DataTypes.STRING,
        },
        code: {
            type: DataTypes.STRING,
        },
    },
}
