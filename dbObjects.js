const Sequelize = require("sequelize");
const { database, user, password } = require('./auth.json');

const sequelize = new Sequelize(database, user, password, {
	host: 'localhost',
	dialect: 'mysql',
	logging: false,
	operatorsAliases: false,
});

const Rolls = sequelize.import('./Models/Rolls');

module.exports = Rolls;