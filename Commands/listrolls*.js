const iris = require('../iris.js');
const { Rolls } = require('../dbObjects.js');
module.exports = {
    name: 'listrolls*',
    description: 'Lists all custom rolls for every user.',
    kyleOnly: true,
    execute(message) {
		Rolls.findAll({ attributes: ['user_name', 'name', 'roll'] })
        	.then((rollList) => {
        		const rollString = rollList.map(t => `${t.user_name}.${t.name}: ${t.roll}`).join('\n') || 'No rolls set.';
        		return message.channel.send(iris.wrap(rollString));
        	})
        	.catch((error) => console.error(error));
    },
};