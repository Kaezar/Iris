/**
* Help command
* @module Commands/help
*/
const iris = require('../iris.js');
var help = module.exports = {
    name: 'help',
    description: 'Send a DM with all commands or info on specific command.',
    usage: '<command> (optional)',
    /**
    * With no arguments, sends a list of all commands to the user in a direct message.
    * With a valid command name as an argument, sends the command name, permissions, description, usage,
    * and cooldown (if applicable) to the user in a direct message.
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    execute(message, args) {
        const { commands } = message.client;
        const data = [];
        const prefix = iris.prefix;
        const navi = message.client.emojis.find('name', 'navi');
        if (!args.length) {
            data.push(`${navi} Hey! Listen! ${navi}`);
            data.push('Here\'s a list of all my commands:');
            data.push(iris.wrap(commands.map(command => command.name).join(', ')));
            data.push(`You can send \`${prefix}help <command>\` to get info on a specific command!`);
        } else {
            if (message.channel.type !== 'dm') return message.reply('Please send inquiries on specific commands using a DM!');
            if (!commands.has(args[0])) return message.reply('that\'s not a valid command!');

            const command = commands.get(args[0]);

            data.push(`**Name:** ${command.name}`);
            if (command.adminOnly) data.push('**Admin Only**');
            if (command.kyleOnly) data.push('**Kyle Only**');
            if (command.description) data.push(`**Description:** ${command.description}`);
            if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
            data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
        }
        message.author.send(data, { split: true })
        .then(() => {
            if (message.channel.type !== 'dm') message.reply('I\'ve sent you a DM with all my commands!');
        })
        .catch(() => message.reply('it seems like I can\'t DM you!'));
    }
};
