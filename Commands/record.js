const iris = require('../iris.js');
var recorder = module.exports = {
    name: 'record',
    description: 'Record audio.',
    guildOnly: true,
    kyleOnly: true,
    execute(message, args) {
		if (message.member.voiceChannel) {
			const voiceChannel = message.member.voiceChannel;
			voiceChannel.join()
			.then(connection => {
			// connection is an instance of VoiceConnection
				// receiver is of the VoiceReceiver class
				const receiver = connection.createReceiver();

				// Catch any errors that may arise
				receiver.on('warn', (reason, warning) => console.error(`${reason} error: ${warning}`));

				connection.on('speaking', (user, speaking) => {
					// speaking is true while the user is speaking
					if (speaking) {
						// create readable stream
						const audioStream = receiver.createPCMStream(user);
						// create writable stream (file)
						const outputStream = recorder.generateOutputFile(voiceChannel, user);
						// write to file
						audioStream.pipe(outputStream);
						}
					});
			})
			.catch(console.log);
		} else {
			message.reply("You need to join a voice channel first!");
		}
    },
    // returns writable stream
    generateOutputFile(channel, user) {
  		const fileName = `./Audio/Recordings/${channel.name}-${user.username}-${Date.now()}.pcm`;
  		return fs.createWriteStream(fileName);
  	},
};