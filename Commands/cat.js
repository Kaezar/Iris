const iris = require('../iris.js');
const snekfetch = require('snekfetch');
var Cat = module.exports = {
    name: 'cat',
    description: 'Get a cat from the random cat API.',
    execute(message) {
        snekfetch.get('https://random.cat/meow')
            .then((cat) => message.channel.send(cat.body.file))
            .catch((error) => console.error(error));
    },
};