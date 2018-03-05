const iris = require('../iris.js');
const { Pats } = require('../dbObjects.js');
module.exports = {
    name: 'pats',
    description: 'Give head pat count.',
    execute(message, args) {
    	var replyList = [];

        Pats.sum('pat_count')
        	.then((sum) => {
        		let patSum = 0;
        		if (sum) patSum = sum;
        		replyList[0] = `Total pats: ${patSum}`
        		Pats.findOne({ where: { user_id: message.author.id } })
        			.then((selected) => {
        				let patCount = 0;
        				if (selected) patCount = selected.get('pat_count');
        				replyList[1] = `Pats from ${message.author.username}: ${patCount}`;
        				const replyString = replyList.join('\n');
        				message.channel.send(iris.wrap(replyString));
        			})
        	})
        	.catch((error) => console.error(error));
        
        
    },
};