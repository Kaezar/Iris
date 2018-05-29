/**
* Pause command
* @module Commands/pause
*/
const iris = require('../iris.js');
module.exports = {
    name: 'pause',
    description: 'Pause audio playback.',
    guildOnly: true,
    /**
    * Pause audio playback if audio is playing.
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    execute(message, args) {
        const voiceConnection = message.client.voiceConnections.find(connection => connection.channel.guild.id === message.guild.id);
        if (voiceConnection === null) return message.reply("I have to be playing something to pause it, dummy!");
        const dispatcher = voiceConnection.dispatcher;
        if (!dispatcher.paused) {
            dispatcher.pause();
            message.channel.send(iris.wrap("Playback paused."));
        } else message.channel.send(iris.wrap("Playback is already paused!"));
    },
};
