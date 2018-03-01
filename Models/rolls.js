module.exports = (sequelize, DataTypes) => {
	return sequelize.define('rolls', {
		name: {
			type: DataTypes.STRING,
			unique: 'compositeIndex',
		},
		roll: DataTypes.STRING,
		user_name: DataTypes.STRING,
		user_id: {
			type: DataTypes.STRING,
			unique: 'compositeIndex',
		},
	});
}