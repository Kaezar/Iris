/**
* Addroll command
* @module Commands/addroll
*/
const iris = require('../iris.js');
const { Rolls } = require('../dbObjects.js');
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
        const rollName = args[0];
        const dice = args[1].split('d');

        if (dice[1] == null) {
            return message.reply('You need to give a valid dice roll of the form <x>d<y>+<mod> (+mod optional)!');
        }
        const preMod = dice[1].split("+");
        let mod;
        if(iris.numCheck(preMod[1])) {
            mod = preMod[1];
            dice.pop();
            dice.push(preMod[0]);
        }
        if (iris.numCheck(dice[0]) && iris.numCheck(dice[1]) && dice.length === 2) {
            // add roll to DB
            Rolls.create({
                name: rollName,
                roll: args[1],
                user_name: message.author.username,
                user_id: message.author.id,
            })
            .then(() => {
                return message.channel.send(`Added ${rollName}: ${args[1]}`, { code: true });
            })
            .catch((error) => {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    return message.reply('That roll already exists.');
                }
                console.error(error);
                return message.reply('Something went wrong with adding the roll.');
            });
        } else {
            return message.reply('You need to give a valid dice roll of the form <x>d<y>+<mod> (+mod optional)!');
        }
    }
};
