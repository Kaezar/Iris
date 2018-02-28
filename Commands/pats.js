const pat = require('./pat.js');
module.exports = {
    name: 'pats',
    description: 'Give head pat count.',
    execute(message, args) {
        message.channel.send('Pats this session: ' + pat.pats);
    },
};