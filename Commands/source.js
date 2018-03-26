const iris = require('../iris.js');
module.exports = {
    name: 'source',
    description: 'Send source code.',
    args: false,
    cooldown: 60,
    execute(message) {
        message.channel.send(iris.source, { code: 'javascript', split: true });
    },
};