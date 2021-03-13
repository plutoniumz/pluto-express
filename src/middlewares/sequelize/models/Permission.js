const { DataTypes } = Sequelize

module.exports = {
    attributes: {
        access: {
            type: DataTypes.TINYINT,
            required: true,
            defaultValue: true,
        },
    },

    options: {
        customMethods: {
            getOne: async (app_id, employee_id, company_id) => {
                return await Permission.findOne({
                    where: {
                        AppId: app_id,
                        EmployeeId: employee_id,
                        CompanyId: company_id,
                    },
                })
            },
        },
    },
}
