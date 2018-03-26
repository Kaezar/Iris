const iris = require('../iris.js');
const { Pats } = require('../dbObjects.js');
module.exports = {
    name: 'pats',
    description: 'Give head pat count.',
    execute(message, args) {
    	var reply = [];

        Pats.sum('pat_count')
        	.then((sum) => {
        		let patSum = 0;
        		if (sum) patSum = sum;
        		reply.push(`Total pats: ${patSum}`);
        		Pats.findOne({ where: { user_id: message.author.id } })
        			.then((selected) => {
        				let patCount = 0;
        				if (selected) patCount = selected.get('pat_count');
        				reply.push(`Pats from ${message.author.username}: ${patCount}`);
        				message.channel.send(reply, { code: true } );
        			})
        	})
        	.catch((error) => console.error(error)); 
    }
};