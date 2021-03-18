module.exports = {
    modules: require('./controllers'),
    configs: {
        // EmployeeController
        'GET /Employee': 'EmployeeController.get',
        'GET /Employee/:id': 'EmployeeController.getOne',
    },
}
