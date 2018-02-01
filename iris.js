const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const bot = new Discord.Client();
const auth = require("./auth.json");
const token = auth.token;

bot.on('ready', () => {
    console.log('I am ready!');
});
// message event handler
bot.on('message', message => {
    if(message.author == bot.user) {
        return;
    }

    let author = message.author;

    let mess = message.content.toLowerCase();

    // politeness
    if(mess.includes('thanks, iris') || mess.includes('thanks iris') || mess.includes('thank you, iris') || mess.includes('thank you, iris')) {
        message.channel.send(`You're welcome, ${author}`);
    } // if

    // greeting
    if(mess.includes('hello, iris') || mess.includes('hello iris')) {
        message.channel.send(`Hello ${author}`);
    } // if

    if(mess.includes('i love you iris') || mess.includes('i love you, iris')) {
        message.channel.send(`I love you too ${author}`);
    }

    if(mess.includes('sorry, iris') || mess.includes('sorry iris')) {
        message.channel.send(`It's okay ${author}. I forgive you.`);
    } // if

    // portal jokes
    if(mess.includes('portal') || mess.includes('science') || mess.includes('cake') || mess.includes('testing') || mess.includes('aperture') || mess.includes('glados')) {
        const cube = bot.emojis.find('name', 'companioncube');
        message.react(cube);
    }

    if(mess.includes('what is my avatar') || mess.includes("what's my avatar") || mess.includes("what does my avatar look like")) {
        message.reply(message.author.avatarURL);
    }

    if (message.mentions.users.find('username', 'Iris')) {
        if(mess.includes('thanks') || mess.includes('thank you')) {
            message.channel.send(`You're welcome, ${author}`);
        } else if (mess.includes('hello')) {
            message.channel.send(`Hello ${author}`);
        } else if (mess.includes('i love you')) {
            message.channel.send(`I love you too ${author}`);
        } else if (mess.includes('sorry')) {
            message.channel.send(`It's okay ${author}. I forgive you.`);
        } else if (mess.includes('your avatar')) {
            message.reply(bot.user.avatarURL);
        } else if (mess.includes('your source')) {
            message.channel.send(getSource(), {code: 'javascript', split: true});
        }
    }

    // commands
    if (message.content.substring(0,1) == "!") {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0].toLowerCase();
        args = args.splice(1);

        switch(cmd) {
            case "ping":
            message.channel.send("pong");
            break;

            case "roll":
            if(args[0] != null) {
                let dice = args[0].split("d");
                let preMod = dice[1].split("+");
                let checker = preMod[1];
                checker = parseInt(checker);
                if(!isNaN(checker)){
                    var mod = preMod[1];
                    dice.pop();
                    dice.push(preMod[0]);
                }
                if (!isNaN(dice[0]) && !isNaN(dice[1]) && dice.length == 2){
                    var result = rollDice(dice[0],dice[1]);
                    var critCheck = result;
                    
                    if(!isNaN(mod)){
                        result = parseInt(result);
                        mod = parseInt(mod);
                        result = result + mod;
                    }
                    message.channel.send(result);
                    if (dice[0] == 1 && dice[1] == 20 && critCheck == 20) {
                        const nat20 = bot.emojis.find('name', 'nat20');
                        message.channel.send(`Natural 20! ${nat20}`);
                    }
                } else {
                    message.reply("Not a valid dice roll.");
                }
            } else {
                message.reply("Not a valid dice roll.");
            }
            break;
            case "rocks":
            message.channel.send("Rocks fall. Everyone dies.");
            break;

            case "play":
            const voiceChannel = message.member.voiceChannel;
            if (args[0] != null) {
                if (args[0].substring(0,29) == "https://www.youtube.com/watch" || args[0].substring(0,28) == "http://www.youtube.com/watch") {
                    if (voiceChannel) {
                        voiceChannel.join()
                            .then(connection => {
                                let url = String(args[0]);
                                const stream = ytdl(url, {filter: 'audioonly'});
                                const dispatcher = connection.playStream(stream);

                                dispatcher.on('error', e => {
                                    // Catch any errors that may arise
                                    console.log(e);
                                    });

                                dispatcher.on('end', () => {
                                    message.member.voiceChannel.leave();
                                });
                            })
                            .catch(console.log);
                    } else {
                        message.reply("You need to join a voice channel first!");
                    }
                } else {
                    play(message, args[0]);
                }
            } else {
                message.reply("You need to specify the url of a youtube video or the name of a file to play!");
            }
            break;

            case "say": 
            if (!message.guild) break;

            if (args[0] != null) {
                let phrase = message.content.substring(5);
                say(message,phrase);
            } else {
                message.reply("You need to specify a phrase for me to say!");
            }
            break;
            
            case "reminder":
            if (message.channel.id == '323608022377299972') {
                message.delete();
                chan = message.channel.guild.channels.find('name','general');
                chan.send("Reminder: Game tonight starts at 7:30 central. I hope to \"see\" you all there!");
            }
            break;

            case "join":
            if (message.member.voiceChannel) {
                message.member.voiceChannel.join();
            } else {
                message.reply('You need to join a voice channel first!');
            }
            break;

            case "leave":
            if (message.member.voiceChannel) {
                message.member.voiceChannel.leave();
            } else {
                message.reply('You need to join a voice channel first!');
            }
            break;

            case "help":
            let helpMessage = "Commands:\n"  +
            "Note: the command keyword is not case-sensitive, but the subsequent arguments are.\n"  +
            "* !ping\n" +
            "  * Bot response: \"pong\"\n" +
            "* !roll xdy+mod\n" +
            "  * x, y, and mod are integers. +mod is optional." +
            "  * Bot simulates the roll of x y-sided die and adds mod to the result (if applicable).\n" +
            "  * Bot response: result\n" +
            "* !rocks\n" +
            "  * Bot response: \"Rocks fall. Everyone dies.\"\n" +
            "* !play url OR !play filename\n" +
            "  * url is the url of a youtube video or filename is the name of an audio file in the bot's audio folder.\n" +
            "  * Bot joins the voice channel the caller is in, and plays the audio of the youtube video or the file, then leaves the voice channel.\n" +
            "* !say phrase\n" +
            "  * phrase is a text phrase for the bot to say\n" +
            "  * Bot joins the voice channel the caller is in, says the phrase (using a tts program), then leaves the voice channel.\n" +
            "* !join\n" +
            "  * Bot joins the voice channel the caller is in.\n" +
            "* !leave\n" +
            "  * Bot leaves the voice channel the caller is in.";
            message.channel.send(helpMessage);
            break;

            case "source":
            let sourceCode = getSource();
            message.channel.send(sourceCode, {code: 'javascript', split: true});
            break;
          }
      }
  });

bot.login(token);

function rollDice(count, sides) {
    var result = 0;
    for(i = 0; i < count; i++) {
        result += Math.floor(Math.random() * sides) + 1;
    }
    return result;
} // rollDice(count, sides)

function say(message, phrase) {
    if (message.member.voiceChannel) {
        message.member.voiceChannel.join()
                .then(connection => { // Connection is an instance of VoiceConnection
                    const execSync = require('child_process').execSync;
                    const command = 'say -o ./Audio/sayfile.mp4 ' + '\"' + String(phrase) + '\"'

                    var child = execSync(command, (error, stdout, stderr) => {
                        if(error) {
                            console.error(`exec error: ${error}`);
                            return;
                        }
                    })
                    
                    const dispatcher = connection.playFile('./Audio/sayfile.mp4');

                    dispatcher.on('error', e => {
                        // Catch any errors that may arise
                        console.log(e);
                    });

                    dispatcher.on('end', () => {
                        message.member.voiceChannel.leave()
                    });
                })
                .catch(console.log);
            } else {
                message.reply('You need to join a voice channel first!');
            } 
}

function play(message, file) {
    if (message.member.voiceChannel) {
                message.member.voiceChannel.join()
                    .then(connection => { // Connection is an instance of VoiceConnection
                        let filepath = './Audio/' + String(file);
                        const dispatcher = connection.playFile(filepath);

                        dispatcher.on('error', e => {
                            // Catch any errors that may arise
                            console.log(e);
                        });

                        dispatcher.on('end', () => {
                            message.member.voiceChannel.leave()
                        });
                    })
                    .catch(console.log);
                } else {
                  message.reply('You need to join a voice channel first!');
              } 
}

function getSource() {
    const execSync = require('child_process').execSync;
    var child = execSync('cat iris.js', (error,stdout,stderr) => {
        if(error) {
            console.error(stderr);
            return;
        }
    });
    return child;
}

