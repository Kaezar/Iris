const iris = require('../iris.js');
module.exports = {
    name: 'destroy',
    description: 'Destroy bot.',
    execute(message, args) {
        if (message.author.id !== "202228363958550529") return message.reply("Only Kyle has permission to destroy me!");
		message.reply("You may destroy me, but you'll never destroy my love for Kat!")
			.then( () => {
				iris.bot.destroy();
			});
    },
};