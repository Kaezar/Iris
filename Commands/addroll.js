const iris = require('../iris.js');
module.exports = {
    name: 'addroll',
    description: 'Add a custom roll to the database.',
    args: true,
    usage: '<name> <x>d<y>+<mod> (+mod optional)',
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
			iris.Rolls.create({
					name: rollName,
					roll: args[1],
					user_name: message.author.username,
					user_id: message.author.id,
				})
					.then(() => {
						return message.channel.send(iris.wrap(`Added ${rollName}: ${args[1]}`));
					})
					.catch((error) => {
						if (error.name === 'SequelizeUniqueConstraintError') {
        					return message.reply('That roll already exists.');
    					}
    					console.log(error);
    					return message.reply('Something went wrong with adding the roll.');
					});
		} else {
			return message.reply('You need to give a valid dice roll of the form <x>d<y>+<mod> (+mod optional)!');
		}
    },
};