/**
* Resume command
* @module Commands/resume
*/
const iris = require('../iris.js');
module.exports = {
    name: 'resume',
    description: 'Resume audio playback.',
    guildOnly: true,
    /**
    * Resume audio playback, provided that it is paused.
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    execute(message, args) {
        const voiceConnection = message.client.voiceConnections.find(connection => connection.channel.guild.id === message.guild.id);
        if (voiceConnection === null) return message.reply("I have to be playing something to resume playing it, dummy!");

        const dispatcher = voiceConnection.dispatcher;
        if (!dispatcher.paused) return message.channel.send(iris.wrap("Playback is not paused!"));

        dispatcher.resume();
        return message.channel.send(iris.wrap("Playback resumed."));
    },
};
