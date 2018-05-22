/**
* Translate command
* @module Commands/translate
*/
const iris = require('../iris.js');
const { translateTargetCode: target, translateTargetName: languageName } = require('../config.json');
const Translate = require('@google-cloud/translate');
const translate = new Translate({ keyFilename: './service-account.json' });
module.exports = {
    name: 'translate',
    description: `Translate given text to ${languageName}.`,
    args: true,
    usage: '<phrase>',
    cooldown: 60,
    /**
    * Use Google's cloud translation service to translate given text to english, if possible. Source language is
    * automatically detected.
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    The phrase to translate (array of words)
    */
    execute(message, args) {
        const text = args.join(" ");

        translate.translate(text, target)
        .then(results => {
            let translation = results[0];
            message.channel.send(`Translation: ${translation}`);
        })
        .catch((error) => console.error('ERROR:', error));
    }
};
