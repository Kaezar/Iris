const iris = require('../iris.js');
const { Pats } = require('../dbObjects.js');
var pat = module.exports = {
    name: 'pat',
    description: 'Gives a head pat. Additional pats after first increase count accordingly.',
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