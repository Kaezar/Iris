const iris = require('../iris.js');
module.exports = {
    name: 'source',
    description: 'Send source',
    execute(message, args) {
        message.channel.send(iris.source, { code: 'javascript', split: true });
    },
};