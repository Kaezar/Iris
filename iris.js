const Discord = require("discord.js");
const bot = new Discord.Client();
const auth = require("./auth.json");
const token = auth.token;

bot.on('ready', () => {
    console.log('I am ready!');
});

bot.on('message', message => {
    if(message.content.toLowerCase().includes('thanks, iris') || message.content.toLowerCase().includes('thanks iris')) {
        let author = message.author;
        message.channel.send(`You're welcome, ${author}`);
    }


    if (message.content.substring(0,1) == "!") {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
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
                    
                    if(!isNaN(mod)){
                        result = parseInt(result);
                        mod = parseInt(mod);
                        result = result + mod;
                    }
                    message.channel.send(result);
                } else {
                    message.channel.send("Not a valid dice roll.");
                }
            } else {
                message.channel.send("Not a valid dice roll.");
            }
            break;
            case "rocks":
            message.channel.send("Rocks fall. Everyone dies.");
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
}