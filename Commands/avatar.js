/**
* Avatar command
* @module Commands/avatar
*/
const iris = require('../iris.js');
var avatar = module.exports = {
    name: 'avatar',
    description: 'Send a link to user\'s avatar, or avatar\'s of those in @mentions.',
    usage: '@<user> (optional, any number)',
    /**
    * Send a link to the message author's avatar, or the avatar(s) of the user(s) that is/are mentioned in the message.
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    execute(message) {
        if (!message.mentions.users.size) {
            return message.channel.send(`Your avatar: ${message.author.displayAvatarURL}`);
        }
        const avatarList = message.mentions.users.map(user => {
            return `${user.username}'s avatar: ${user.displayAvatarURL}`;
        });
        message.channel.send(avatarList);
    },
};
