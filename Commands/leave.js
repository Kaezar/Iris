module.exports = {
    name: 'leave',
    description: 'Leave voice channel.',
    guildOnly: true,
    execute(message, args) {
        if (message.member.voiceChannel) message.member.voiceChannel.leave();
        else message.reply('You need to join a voice channel first!');
    },
};