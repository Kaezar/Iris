const iris = require('../iris.js');
module.exports = {
    name: 'say',
    description: 'Have Iris say something.',
    args: true,
    usage: '<phrase>',
    guildOnly: true,
    execute(message, args) {
		const phrase = message.content.substring(5);

		if (message.member.voiceChannel) {
			message.member.voiceChannel.join()
				.then(connection => {
				// Connection is an instance of VoiceConnection

					// Synchronously execute a child process, which is macOS' say command. Pipes output to file.
					const execSync = require('child_process').execSync;
					const command = 'say -v victoria -o ./Audio/sayfile.mp4 ' + '"' + String(phrase) + '"';
					var child = execSync(command, (error, stdout, stderr) => {
						if(error) {
							console.error(stderr);
							return;
						}
					});
					// Stream file to voice channel
					const dispatcher = connection.playFile('./Audio/sayfile.mp4');
					dispatcher.on('error', e => {
						// Catch any errors that may arise
						console.log(e);
					});
					// Leave voice channel when done playing
					dispatcher.on('end', () => {
						message.member.voiceChannel.leave();
					});
				})
				.catch(console.log);
		} else {
			message.reply('You need to join a voice channel first!');
		}
    },
};