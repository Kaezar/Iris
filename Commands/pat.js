/**
* Pat command
* @module Commands/pat
*/
const iris = require('../iris.js');
const { Pats } = require('../dbObjects.js');
var pat = module.exports = {
    name: 'pat',
    description: 'Gives a head pat. Additional pats after first increase count accordingly.',
    /**
    * Increment the pat_count field in the database record corresponding to the
    * user who sent the message. Or, add the user to the database with a pat_count
    * of 1 if a record does not exist. Increment pat_count additional times for each
    * occurance of "pat" in the message (Ex: "!pat pat" adds 2 pats total).
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    execute(message, args) {
        let patCount = 1;
        for (let i = 0; i < args.length; i++) {
            if (args[i] === "pat") patCount++;
        }
        Pats.findOrCreate({ where: { user_id: message.author.id }, defaults: { pat_count: patCount } })
        .spread((user, created) => {
            if (!created) {
                Pats.increment('pat_count', { by: patCount, where: { user_id: message.author.id } });
            }
            message.react("❤");
        })
        .catch((error) => console.error(error));
    },
};
