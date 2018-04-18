/**
* Kyle Facts command
* @module Commands/kylefacts
*/
const iris = require('../iris.js');
const snekfetch = require('snekfetch');
var Cat = module.exports = {
    name: 'kylefacts',
    description: 'Tell a totally true fact about Kyle.',
    cooldown: 10,
    /**
    * Use {@link https://snekfetch.js.org/ snekfetch} to get a random joke from
    * {@link http://api.icndb.com/jokes/random the Internet Chuck Norris Database}.
    * Replace "Chuck Norris" with "Kyle Drum", and send.
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    execute(message) {
        snekfetch.get('http://api.icndb.com/jokes/random').query({ firstName: 'Kyle', lastName: 'Drum' })
        .then((joke) => message.channel.send(joke.body.value.joke))
        .catch((error) => console.error(error));
    }
};
