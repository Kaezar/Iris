const iris = require('../iris.js');
module.exports = {
    name: 'reminder',
    description: 'game reminder.',
    execute(message, args) {
        const channel = args[0];
		const time = args[1];
		let chan = message.channel.guild.channels.find('name', 'general');
		if (channel != null && time != null) {
			chan = message.channel.guild.channels.find('name', channel);
			if (chan !== undefined) {
				if (chan.type === 'text') {
					message.delete();
					chan.send(`Reminder: Game tonight starts at ${time}. I hope to "see" you all there!`);
				} else {
					message.reply('The channel must be a guild text channel!');
				}
			} else {
				message.reply(`I'm sorry. I can't seem to find the channel: ${channel}`);
			}
		} else {
			message.reply('You need to specify a channel name and meeting time!');
		}
    },
};