const Sequelize = require("sequelize");
const { database, user, password } = require('./config.json');

const sequelize = new Sequelize(database, user, password, {
	host: 'localhost',
	dialect: 'mysql',
	logging: false,
	operatorsAliases: false,
	charset: 'utf8mb4',
	collate: 'utf8mb4_unicode_ci',
});

const Rolls = sequelize.import('./Models/Rolls');

const Pats = sequelize.import('./Models/Pats');

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force })
.then(() => {
	console.log('Database synced!');
	sequelize.close();
}).catch(console.error);
