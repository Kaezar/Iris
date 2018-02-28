const iris = require('../iris.js');
module.exports = {
    name: 'pause',
    description: 'Pause audio playback.',
    guildOnly: true,
    execute(message, args) {
        const voiceConnection = iris.bot.voiceConnections.find(val => val.channel.guild.id === message.guild.id);
		if (voiceConnection === null) return message.reply("I have to be playing something to pause it, dummy!");
		const dispatcher = voiceConnection.dispatcher;
		if (!dispatcher.paused) {
			dispatcher.pause();
			message.channel.send(iris.wrap("Playback paused."));
		} else {
			message.channel.send(iris.wrap("Playback is already paused!"));
		}
    },
};