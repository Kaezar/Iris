const iris = require('../iris.js');
module.exports = {
    name: 'reminder',
    description: 'Game reminder.',
    args: true,
    usage: '<channel> <time>',
    guildOnly: true,
    execute(message, args) {
    	// fetch arguments and check they've been provided
    	const [ channel, time ] = args;
		if (channel == null || time == null) return message.reply('You need to specify a channel name and meeting time!');

		let targetChannel = message.channel.guild.channels.find('name', channel);
		if (targetChannel === undefined) return message.reply(`I'm sorry. I can't seem to find the channel: ${channel}`);
		if (targetChannel.type !== 'text') return message.reply('The channel must be a guild text channel!');

		message.delete();
		return targetChannel.send(`Reminder: Game tonight starts at ${time}. I hope to "see" you all there!`);
    },
};