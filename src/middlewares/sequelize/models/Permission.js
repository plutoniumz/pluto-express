module.exports = {
    attributes: {},

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
