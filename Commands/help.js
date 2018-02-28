const iris = require('../iris.js');
module.exports = {
    name: 'help',
    description: 'Send help',
    execute(message, args) {
        message.channel.send(iris.help, { code: 'markdown', split: true });
    },
};