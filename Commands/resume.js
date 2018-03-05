const iris = require('../iris.js');
module.exports = {
    name: 'resume',
    description: 'Resume audio playback.',
    guildOnly: true,
    execute(message, args) {
    	const voiceConnection = iris.bot.voiceConnections.find(val => val.channel.guild.id === message.guild.id);
		if (voiceConnection === null) return message.reply("I have to be playing something to resume playing it, dummy!");

		const dispatcher = voiceConnection.dispatcher;
		if (!dispatcher.paused) return message.channel.send(iris.wrap("Playback is not paused!"));

		dispatcher.resume();
		return message.channel.send(iris.wrap("Playback resumed."));
	},
};