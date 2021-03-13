const userCompanyModelPath = utils.getUserPath('models/Company')

module.exports = {
    attributes: {
        ...utils.requireUserFile(userCompanyModelPath).attributes,
    },
    options: {
        customMethods: {
            getAll: async () => {
                return await Company.findAll({
                    attributes: ['id', 'name', 'code'],
                    raw: true,
                })
            },
        },
    },
}
