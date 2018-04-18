/**
* Get command
* @module Commands/get
*/
const iris = require('../iris.js');
const fs = require('fs');
const Discord = require("discord.js");
var get = module.exports = {
    name: 'get',
    description: 'get a file from folder',
    args: true,
    usage: '<file>',
    kyleOnly: true,
    /**
    * Searches for a file with the given name within the Files directory, and if found, sends it as an attachment. (use of .. to enter
    * the parent directory is checked for and disallowed)
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    async execute(message, args) {
        const fileName = args.join(' ');
        // check if user is trying to enter parent directory
        if (fileName.includes('../')) {
            const boi = message.client.emojis.find('name', 'boi')
            await message.react(boi);
            return message.reply("You can't enter the parent directory, asshole!");
        }

        if (!fs.existsSync('./Files/' + fileName)) return message.reply('I could not find a file with that name!');

        const filePath = './Files/' + fileName;
        const fileAttach = new Discord.Attachment(filePath, fileName);

        message.channel.send(fileAttach)
        .catch((error) => {
            if (error.message.includes('file could not be found')) return message.reply('I could not find a file with that name!');
            else console.error('error');
        });
    }
};
