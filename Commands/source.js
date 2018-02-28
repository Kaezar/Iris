const iris = require('../iris.js');
module.exports = {
    name: 'source',
    description: 'Send source',
    args: false,
    execute(message) {
        message.channel.send(iris.source, { code: 'javascript', split: true });
    },
};