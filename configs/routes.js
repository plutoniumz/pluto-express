module.exports = {
    // Auth
    'POST /login': 'AuthController.login',
    'GET /permission': 'AuthController.getPermission',
    'GET /getAllPermissions': 'AuthController.getAllPermissions',
    'POST /changePassword': 'AuthController.changePassword',
    'DELETE /logout': 'AuthController.logout',

    // Employee
    'GET /Employee': 'EmployeeController.get',
    'GET /Employee/:id': 'EmployeeController.getOne',
}
