/**
* Delete Roll command
* @module Commands/deleteroll
*/
const iris = require('../iris.js');
const { Rolls } = require('../dbObjects.js');
var deleteRoll = module.exports = {
    name: 'deleteroll',
    description: 'Delete a custom roll.',
    args: true,
    usage: '<name>',
    /**
    * Delete a roll entry from the database
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    execute(message, args) {
        Rolls.destroy({ where: { name: args[0] } })
        .then((rowCount) => {
            if (!rowCount) return message.reply('That roll does not exist!');
            return message.channel.send(iris.wrap(`Deleted roll: ${args[0]}`));
        })
        .catch((error) => console.error(error));
    },
};
