const iris = require('../iris.js');
module.exports = {
    name: 'rocks',
    description: 'Rocks fall. Everyone dies.',
    execute(message) {
        message.channel.send(iris.wrap("Rocks fall. Everyone dies."));
    },
};