const iris = require('../iris.js');
const { translateTarget: target } = require('../config.json');
module.exports = {
    name: 'translate',
    description: 'Translate given text to English.',
    args: true,
    usage: '<text phrase>',
    cooldown: 10,
    execute(message, args) {
        const text = args.join(" ");

        iris.translate.translate(text, target)
        .then(results => {
            let translation = results[0];
            message.channel.send(`Translation: ${translation}`);
        })
        .catch((error) => console.error('ERROR:', error));
    },
};