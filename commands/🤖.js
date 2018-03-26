module.exports = {
    name: '🤖',
    description: '🤖',
    aliases: ['robot', 'bot'],
    execute(message) {
        message.channel.send('I am a robot! Bleep bloop!');
    },
};