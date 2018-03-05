const iris = require('../iris.js');
const Rolls = require('../dbObjects.js');
module.exports = {
    name: 'deleteroll',
    description: 'Delete a custom roll.',
    args: true,
    usage: '<name>',
    execute(message, args) {
		Rolls.destroy({ where: { name: args[0] } })
			.then((rowCount) => {
				if (!rowCount) return message.reply('That roll does not exist!');
				return message.channel.send(iris.wrap(`Deleted roll: ${args[0]}`));
			})
			.catch((error) => console.error(error));
    },
};