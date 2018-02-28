module.exports = {
    name: 'destroy',
    description: 'Destroy bot.',
    kyleOnly: true,
    execute(message, args) {
		message.reply("You may destroy me, but you'll never destroy my love for Kat!")
			.then( () => {
				message.client.destroy();
			});
    },
};