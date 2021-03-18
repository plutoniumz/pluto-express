module.exports = {
    get: async (req, res) => {
        const employees = await Employee.findAll()

        return res.ok(employees)
    },

    getOne: async (req, res) => {
        const employee = await Employee.findOne({
            where: {
                id: req.params.id,
            },
        })

        return res.ok(employee)
    },
}
