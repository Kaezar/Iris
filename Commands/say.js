const iris = require('../iris.js');
module.exports = {
    name: 'say',
    description: 'Have Iris say something.',
    args: true,
    usage: '<phrase>',
    guildOnly: true,
    execute(message, args) {
		const phrase = args.join(" ");

		if (!message.member.voiceChannel) return message.reply('You need to join a voice channel first!');
		
		message.member.voiceChannel.join()
			.then(connection => {
			// Connection is an instance of VoiceConnection

				if (process.platform === 'darwin') {
					// Synchronously execute a child process, which is macOS' say command. Pipes output to file.
					const execSync = require('child_process').execSync;
					const command = 'say -v samantha -o ./Files/Audio/sayfile.mp4 ' + '"' + String(phrase) + '"';
					var child = execSync(command, (error, stdout, stderr) => {if (error) return console.error(stderr)});
					// Stream file to voice channel
					const dispatcher = connection.playFile('./Files/Audio/sayfile.mp4');
					dispatcher.on('error', (error) => console.error(error));
					// Leave voice channel when done playing
					dispatcher.on('end', () => message.member.voiceChannel.leave());
				}
			})
			.catch(console.log);
    },
};