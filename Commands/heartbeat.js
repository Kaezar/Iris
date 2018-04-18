/**
* heartbeat command
* @module Commands/heartbeat
*/
var heartbeat = module.exports = {
    name: 'heartbeat',
    description: 'Get heartbeat ping.',
    /**
    * Sends message containing the websocket heartbeat ping.
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    execute(message, args) {
        message.channel.send(`❤ Current heartbeat: ${message.client.ping}`);
    },
};
