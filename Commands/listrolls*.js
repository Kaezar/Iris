/**
* List all rolls command
* @module Commands/listrolls*
*/
const iris = require('../iris.js');
const { Rolls } = require('../dbObjects.js');
module.exports = {
    name: 'listrolls*',
    description: 'Lists all custom rolls for every user.',
    kyleOnly: true,
    /**
    * List all records in the rolls table of the database
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    */
    execute(message) {
        Rolls.findAll({ attributes: ['user_name', 'name', 'roll'] })
        .then((rollList) => {
            const rollString = rollList.map(t => `${t.user_name}.${t.name}: ${t.roll}`).join('\n') || 'No rolls set.';
            return message.channel.send(iris.wrap(rollString));
        })
        .catch((error) => console.error(error));
    },
};
