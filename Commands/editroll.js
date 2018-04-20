/**
* Edit Roll command
* @module Commands/editroll
*/
const iris = require('../iris.js');
const { Rolls } = require('../dbObjects.js');
const rollCommand = require('./roll.js');
var editRoll = module.exports = {
    name: 'editroll',
    description: 'Edit a custom roll.',
    args: true,
    usage: '<name> <x>d<y>+<mod> (+mod optional)',
    /**
    * Change dice roll data in rolls database for the provided roll name.
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    execute(message, args) {
        const [ rollName, rollString ] = args;

        if (!rollCommand.diceCheck(rollString)) {
            return message.reply('You need to give a valid dice roll of the form <x>d<y>+<mod> (+mod optional)!');
        }
        // update roll
        Rolls.update({ roll: rollString}, {where: {
            name: rollName,
            user_id: message.author.id,
        }})
        .then((affectedRows) => {
            if (affectedRows > 0) {
                return message.channel.send(iris.wrap(`Updated ${rollName} with new value: ${rollString}`));
            } else {
                return message.reply('Could not find roll with that name!');
            }
        })
        .catch((error) => console.error(error));
    },
};
