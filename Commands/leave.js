/**
* Leave command
* @module Commands/leave
*/
module.exports = {
    name: 'leave',
    description: 'Leave voice channel.',
    guildOnly: true,
    /**
    * Have the bot leave the voice channel the user is in, provided they are in a voice channel.
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    execute(message, args) {
        if (message.member.voiceChannel) message.member.voiceChannel.leave();
        else message.reply('You need to join a voice channel first!');
    },
};
