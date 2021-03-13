const { DataTypes } = Sequelize

module.exports = {
    attributes: {
        access: {
            type: DataTypes.TINYINT,
            required: true,
            defaultValue: true,
        },
    },
}
