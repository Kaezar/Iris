const iris = require('../iris.js');
const snekfetch = require('snekfetch');
const Promise = require('bluebird');
var Cat = module.exports = {
    name: 'joke',
    description: 'Get a joke from the random joke API.',
    cooldown: 10,
    execute(message) {
        snekfetch.get('https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_joke')
            .then((joke) => {
                message.channel.send(joke.body.setup)
                    .then(() => message.channel.startTyping())
                    Promise.delay(3000).then(() => {
                        message.channel.stopTyping();
                        return message.channel.send(joke.body.punchline);
                    })
            })
            .catch((error) => {
                console.error(error);
                message.channel.stopTyping(true);
            });
    },
};