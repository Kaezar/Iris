/**
* Destroy command
* @module Commands/destroy
*/
var destroy = module.exports = {
    name: 'destroy',
    description: 'Destroy bot.',
    kyleOnly: true,
    /**
    * Destroy the bot, exit process via SIGINT signal.
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    execute(message, args) {
        message.reply("You may destroy me, but you'll never destroy my love for Kat!")
        .then( () => {
            message.client.destroy();
            process.exit();
        })
        .catch((error) => console.error(error));
    },
};
