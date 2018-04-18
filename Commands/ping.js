/**
* Ping command
* @module Commands/ping
*/
module.exports = {
    name: 'ping',
    description: 'Ping!',
    /**
    * Send message saying "Pong!"
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    execute(message, args) {
        message.channel.send('Pong!');
    },
};
