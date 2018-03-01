const Sequelize = require("sequelize");
const { database, user, password } = require('./auth.json');

const sequelize = new Sequelize(database, user, password, {
	host: 'localhost',
	dialect: 'mysql',
	logging: false,
	operatorsAliases: false,
});

const Rolls = sequelize.import('./Models/Rolls');

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force })
	.then(() => {
		console.log('Database synced!');
		sequelize.close();
}).catch(console.error);