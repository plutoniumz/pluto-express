module.exports = {
    'GET /getPermission': ['has-logged-in'],
    'POST /login': true,
    'DELETE /logout': true,
    '...': ['has-logged-in', 'has-permission'],
}
