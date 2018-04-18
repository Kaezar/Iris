/**
* Edit Roll command
* @module Commands/editroll
*/
const iris = require('../iris.js');
const { Rolls } = require('../dbObjects.js');
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
            // update roll
            Rolls.update({ roll: args[1]}, {where: {
                name: rollName,
                user_id: message.author.id,
            }})
            .then((affectedRows) => {
                if (affectedRows > 0) {
                    return message.channel.send(iris.wrap(`Updated ${rollName} with new value: ${args[1]}`));
                } else {
                    return message.reply('Could not find roll with that name!');
                }
            })
            .catch((error) => console.error(error));
        } else {
            return message.reply('You need to give a valid dice roll of the form <x>d<y>+<mod> (+mod optional)!');
        }
    },
};
