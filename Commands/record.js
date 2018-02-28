const iris = require('../iris.js');
var recorder = module.exports = {
    name: 'record',
    description: 'Record audio.',
    guildOnly: true,
    adminOnly: true,
    execute(message, args) {
		if (message.member.voiceChannel) {
			const voiceChannel = message.member.voiceChannel;
			voiceChannel.join()
			.then(connection => {
			// connection is an instance of VoiceConnection
				// receiver is of the VoiceReceiver class
				const receiver = connection.createReceiver();

				// Catch any errors that may arise
				receiver.on('warn', (reason, warning) => {
					console.log(`${reason} error: ${warning}`);
				});

				connection.on('speaking', (user, speaking) => {
					// speaking is true while the user is speaking
					if (speaking) {
						// console.log('begin stream: ' + Date.now());

						// create readable stream
						const audioStream = receiver.createPCMStream(user);
						// function returns writable stream (file)
						const outputStream = recorder.generateOutputFile(voiceChannel, user);

						// write to file
						audioStream.pipe(outputStream);
						/*
						audioStream.on('end', () => {
							console.log('end stream: ' + Date.now());
						});
						*/
						}
					});
			})
			.catch(console.log);
		} else {
			message.reply("You need to join a voice channel first!");
		}
    },
    generateOutputFile(channel, user) {
  		const fileName = `./Audio/Recordings/${channel.name}-${user.username}-${Date.now()}.pcm`;
  		return fs.createWriteStream(fileName);
  	},
};