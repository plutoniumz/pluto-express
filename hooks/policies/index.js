module.exports = {
    modules: require('./rules'),
    configs: {
        '...': ['has-logged-in', 'has-permission'],
    },
}
