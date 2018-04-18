/**
* Source command
* @module Commands/source
*/
const iris = require('../iris.js');
module.exports = {
    name: 'source',
    description: 'Send source code.',
    args: false,
    cooldown: 60,
    /**
    * Send a message containing iris' source code
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    execute(message) {
        message.channel.send(iris.source, { code: 'javascript', split: true });
    },
};
