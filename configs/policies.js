module.exports = {
    'POST /login': true,
    'DELETE /logout': true,
    'GET /permission': ['has-logged-in'],
    'POST /changePassword': ['has-logged-in'],
    '...': ['has-logged-in', 'has-permission'],
}
