const iris = require('../iris.js');
module.exports = {
    name: 'avatar',
    description: 'Send a link to user\'s avatar, or avatar\'s of those in @mentions.',
    usage: '@<user> (optional, any number)',
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