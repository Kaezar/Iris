const iris = require('../iris.js');
const snekfetch = require('snekfetch');
var Cat = module.exports = {
    name: 'kyle',
    description: 'Tell a totally true fact about kyle.',
    execute(message) {
        snekfetch.get('http://api.icndb.com/jokes/random').query({ firstName: 'Kyle', lastName: 'Drum' })
            .then((joke) => {
                message.channel.send(joke.body.value.joke)
            })
            .catch((error) => {
                console.log(error);
            });
    },
};