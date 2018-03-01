const iris = require('../iris.js');
module.exports = {
    name: 'help',
    description: 'Send a DM with all commands or info on specific command.',
    usage: '<command> (optional)',
    execute(message, args) {
    	const { commands } = message.client;
		const data = [];
    	const prefix = iris.prefix;
        if (!args.length) {
        	data.push('Here\'s a list of all my commands:');
			data.push(iris.wrap(commands.map(command => command.name).join(', ')));
			data.push(`You can send \`${prefix}help <command>\` to get info on a specific command!`);
        } else {
        	if (message.channel.type !== 'dm') return message.reply('Please send inquiries on specific commands using a DM!');
        	if (!commands.has(args[0])) return message.reply('that\'s not a valid command!');
        	
			const command = commands.get(args[0]);

			data.push(`**Name:** ${command.name}`);
			if (command.adminOnly) data.push('**Admin Only**');
			if (command.kyleOnly) data.push('**Kyle Only**');
			if (command.description) data.push(`**Description:** ${command.description}`);
			if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
        }
        message.author.send(data, { split: true })
		    .then(() => {
		        if (message.channel.type !== 'dm') message.reply('I\'ve sent you a DM with all my commands!');
		    })
		    .catch(() => message.reply('it seems like I can\'t DM you!'));
    },
};