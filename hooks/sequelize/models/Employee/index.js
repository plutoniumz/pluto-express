const { DataTypes } = Sequelize

module.exports = {
    data: require('./data'),
    attributes: {
        name: {
            type: DataTypes.STRING(50),
        },
        full_name: {
            type: DataTypes.STRING(255),
        },
        title: {
            type: DataTypes.STRING(50),
        },
        phone_number: {
            type: DataTypes.STRING(100),
        },
        current_address: {
            type: DataTypes.STRING(100),
        },
        permanent_address: {
            type: DataTypes.STRING(100),
        },
        birthday: {
            type: DataTypes.DATEONLY,
        },
        start_date: {
            type: DataTypes.DATEONLY,
        },
        barista: {
            type: DataTypes.TINYINT,
            defaultValue: false,
        },
        cashier: {
            type: DataTypes.TINYINT,
            defaultValue: false,
        },
        developer: {
            type: DataTypes.TINYINT,
            defaultValue: false,
        },
        photographer: {
            type: DataTypes.TINYINT,
            defaultValue: false,
        },
        server: {
            type: DataTypes.TINYINT,
            defaultValue: false,
        },
        supervisor: {
            type: DataTypes.TINYINT,
            defaultValue: false,
        },
        trainer: {
            type: DataTypes.TINYINT,
            defaultValue: false,
        },
    },
    options: {
        tableName: 'staff',
    },
}
