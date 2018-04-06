module.exports = (sequelize, DataTypes) => {
	return sequelize.define('pats', {
		user_id: {
			type: DataTypes.STRING,
			unique: 'compositeIndex',
		},
		pat_count: DataTypes.INTEGER,
	});
}