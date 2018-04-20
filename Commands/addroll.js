/**
* Addroll command
* @module Commands/addroll
*/
const iris = require('../iris.js');
const { Rolls } = require('../dbObjects.js');
const rollCommand = require('./roll.js');
var addroll = module.exports = {
    name: 'addroll',
    description: 'Add a custom roll to the database.',
    args: true,
    usage: '<name> <x>d<y>+<mod> (+mod optional)',
    /**
    * Check to make sure that input is a valid dice roll, and if so, adds it to the database for later use with {@link module:Commands/roll roll}
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    execute(message, args) {
        const [ rollName, rollString ] = args;
        
        if (!rollCommand.diceCheck(rollString)) {
            return message.reply('You need to give a valid dice roll of the form <x>d<y>+<mod> (+mod optional)!');
        }
        // add roll to DB
        Rolls.create({
            name: rollName,
            roll: rollString,
            user_name: message.author.username,
            user_id: message.author.id,
        })
        .then(() => {
            return message.channel.send(`Added ${rollName}: ${rollString}`, { code: true });
        })
        .catch((error) => {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return message.reply('That roll already exists.');
            }
            console.error(error);
            return message.reply('Something went wrong with adding the roll.');
        });
    }
};
