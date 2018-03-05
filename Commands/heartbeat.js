module.exports = {
    name: 'heartbeat',
    description: 'Get heartbeat ping.',
    execute(message, args) {
        message.channel.send(`❤ Current heartbeat: ${message.client.ping}`);
    },
};