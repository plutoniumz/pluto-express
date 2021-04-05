module.exports = {
    modules: require('./controllers'),
    configs: {
        // AuthController
        'POST /login': 'AuthController.login',
        'GET /permission': 'AuthController.getPermission',
        'GET /getAllPermissions': 'AuthController.getAllPermissions',
        'POST /changePassword': 'AuthController.changePassword',
        'POST /changeAvatar': 'AuthController.changeAvatar',
        'DELETE /logout': 'AuthController.logout',
    },
}
