/**
* Join command
* @module Commands/join
*/
module.exports = {
    name: 'join',
    description: 'Join voice channel.',
    guildOnly: true,
    /**
    * Have the bot join the same voice channel as the user, provided they are in a voice channel.
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    execute(message, args) {
        if (message.member.voiceChannel) message.member.voiceChannel.join();
        else message.reply('You need to join a voice channel first!');
    },
};
