/**
* Reminder command
* @module Commands/reminder
*/
const iris = require('../iris.js');
module.exports = {
    name: 'reminder',
    description: 'Game reminder.',
    args: true,
    usage: '<channel> <time>',
    guildOnly: true,
    adminOnly: true,
    /**
    * Sends a message to the channel specified in the arguments that a game starts at
    * the time specified in the arguments.
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    execute(message, args) {
        // fetch arguments and check they've been provided
        const [ channel, time ] = args;
        if (channel == null || time == null) return message.reply('You need to specify a channel name and meeting time!');

        let targetChannel = message.channel.guild.channels.find('name', channel);
        if (targetChannel === undefined) return message.reply(`I'm sorry. I can't seem to find the channel: ${channel}`);
        if (targetChannel.type !== 'text') return message.reply('The channel must be a guild text channel!');

        message.delete();
        return targetChannel.send(`Reminder: Game starts at ${time}. I hope to "see" you all there!`);
    },
};
