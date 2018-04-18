/**
* List Rolls command
* @module Commands/listrolls
*/
const iris = require('../iris.js');
const { Rolls } = require('../dbObjects.js');
module.exports = {
    name: 'listrolls',
    description: 'Lists all custom rolls for the user.',
    /**
    * List rolls in the roll table of the database that match the user.
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    execute(message) {
        Rolls.findAll({
            attributes: ['name', 'roll'],
            where: { user_id: message.author.id },
        })
        .then((rollList) => {
            const rollString = rollList.map(t => `${t.name}: ${t.roll}`).join('\n') || 'No rolls set.';
            return message.channel.send(iris.wrap(rollString));
        })
        .catch((error) => console.error(error));
    },
};
