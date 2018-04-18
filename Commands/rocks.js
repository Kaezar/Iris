/**
* Rocks command
* @module Commands/rocks
*/
const iris = require('../iris.js');
module.exports = {
    name: 'rocks',
    description: 'Rocks fall. Everyone dies.',
    /**
    * Send a message saying "Rocks fall. Everyone dies."
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    execute(message) {
        message.channel.send(iris.wrap("Rocks fall. Everyone dies."));
    },
};
