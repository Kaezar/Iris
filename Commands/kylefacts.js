const iris = require('../iris.js');
const snekfetch = require('snekfetch');
var Cat = module.exports = {
    name: 'kylefacts',
    description: 'Tell a totally true fact about Kyle.',
    execute(message) {
        snekfetch.get('http://api.icndb.com/jokes/random').query({ firstName: 'Kyle', lastName: 'Drum' })
            .then((joke) => message.channel.send(joke.body.value.joke))
            .catch((error) => console.error(error));
    },
};