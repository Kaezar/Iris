const iris = require('../iris.js');
module.exports = {
    name: 'translate',
    description: 'Translate given text to English.',
    args: true,
    usage: '<text phrase>',
    execute(message, args) {
        const text = args.join(" ");
        const target = "en";

        iris.translate.translate(text, target)
        .then(results => {
            let translation = results[0];
            message.channel.send(`Translation: ${translation}`);
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
    },
};