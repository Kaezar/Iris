/**
* Joke command
* @module Commands/joke
*/
const iris = require('../iris.js');
const snekfetch = require('snekfetch');
const Promise = require('bluebird');
var Cat = module.exports = {
    name: 'joke',
    description: 'Get a joke from the random joke API.',
    cooldown: 10,
    /**
    * Use {@link https://snekfetch.js.org/ snekfetch} to get a random joke from
    * {@link https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_joke}.
    * First, send the setup. Then, set status to typing. After 3 seconds, send punchline
    * and stop typing.
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
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
