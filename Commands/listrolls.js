const iris = require('../iris.js');
module.exports = {
    name: 'listrolls',
    description: 'Lists all custom rolls for the user.',
    execute(message) {
		iris.Rolls.findAll({ 
        	attributes: ['name', 'roll'], 
        	where: { user_id: message.author.id },
        })
        	.then((rollList) => {
        		const rollString = rollList.map(t => `${t.name}: ${t.roll}`).join('\n') || 'No rolls set.';
        		return message.channel.send(iris.wrap(rollString));
        	})
        	.catch((error) => {
				console.log(error);
			});
    },
};