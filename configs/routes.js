module.exports = {
    // Auth
    'POST /login': 'AuthController.login',
    'GET /getPermission': 'AuthController.getPermission',
    'GET /getAllPermissions': 'AuthController.getAllPermissions',
    'POST /changePassword': 'AuthController.changePassword',
    'DELETE /logout': 'AuthController.logout',
}
