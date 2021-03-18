module.exports = {
    modules: require('./rules'),
    configs: {
        'POST /login': true,
        'DELETE /logout': true,
        'GET /permission': ['has-logged-in'],
        'POST /changePassword': ['has-logged-in'],
    },
}
