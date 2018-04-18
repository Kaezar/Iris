/**
* 🤖 command
* @module Commands/🤖
*/
module.exports = {
    name: '🤖',
    description: '🤖',
    aliases: ['robot', 'bot'],
    /**
    * Sends a message saying 'I am a robot! Bleep bloop!'.
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    */
    execute(message) {
        message.channel.send('I am a robot! Bleep bloop!');
    },
};
