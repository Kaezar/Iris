# Iris

## Features

### Responses
None of the response triggering phrases are case-sensitive. The phrases can be part of a larger message, as long as they aren't broken up. 
The @mention to the bot (where applicable) must be at the beginning of the message and the rest of the phrase can be anywhere else in the 
message. @author is the author of the triggering message.
* Triggering phrases: "hello iris", "hello, iris", "@iris hello"
  * Bot response: "Hello @author"

* Triggering phrases: "thanks iris", "thanks, iris", "thank you iris", "thank you, iris", "@iris thanks", "@iris thank you"
  * Bot response: "You're welcome, @author"

* Triggering phrases: "i love you iris", "i love you, iris", "@iris i love you"
  * Bot response: "I love you too @author"

* Triggering phrases: "sorry iris", "sorry, iris", "@iris sorry"
  * Bot response: "It's okay @author. I forgive you."

* Triggering phrases: "portal", "science", "cake", "testing", "aperture", "glados" "you monster"
  * Bot response: react to triggering message with custom companion cube emoji.

* Triggering phrases: "what is my avatar", "what's my avatar", "what does my avatar look like", "@iris my avatar"
  * Bot response: link to url of triggering message's author's avatar.

* Triggering phrases: "what is your avatar iris", "what is your avatar, iris", "iris what is your avatar", "iris, what is your avatar", "@iris your avatar"
  * Bot response: link to url of bot's avatar.

* Triggering phrases: "@iris your source"
  * Bot response: bot source code.

### Commands
The command keyword is not case-sensitive, but the subsequent arguments are.
* !ping
  * Bot response: "pong"
* !roll xdy+mod adv
  * x, y, and mod are integers. +mod and adv are optional.
  * Bot simulates the roll of x y-sided die and adds mod to the result (if applicable). If adv and the roll is 1d20, then it rolls twice.
  * Bot response: result
* !rocks
  * Bot response: "Rocks fall. Everyone dies."
* !play url OR !play filename
  * url is the url of a youtube video or filename is the name of an audio file in the bot's audio folder.
  * Bot joins the voice channel the caller is in, and plays the audio of the youtube video or the file, then leaves the voice channel.
* !say phrase
  * phrase is a text phrase for the bot to say
  * Bot joins the voice channel the caller is in, says the phrase (using a tts program), then leaves the voice channel.
* !reminder channel time
  * channel is the name of a guild text channel and time is the time of the meeting.
  * Bot response: deletes triggering message and sends "Reminder: Game tonight starts at ${time}. I hope to "see" you all there!" to the specified channel
* !join
  * Bot joins the voice channel the caller is in.
* !leave
  * Bot leaves the voice channel the caller is in.
* !help
  * Bot response: list of commands (this one).
* !source
  * Bot response: bot source code.
* !record 
  * Bot joins the voice channel the caller is in, and begins recording any audio that is spoken on the channel. Stop recording with !leave.