module.exports = {
    name: 'join',
    description: 'Join voice channel.',
    execute(message, args) {
        if (message.member.voiceChannel) {
				message.member.voiceChannel.join();
			} else {
				message.reply('You need to join a voice channel first!');
			}
    },
};