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

* Triggering phrases: "portal", "science", "cake", "testing", "aperture", "glados"
  * Bot response: react to triggering message with custom companion cube emoji.


### Commands
The command keyword is not case-sensitive, but the subsequent arguments are.
* !ping
  * Bot response: "pong"
* !roll xdy+mod
  * x, y, and mod are integers. +mod is optional.
  * Bot simulates the roll of x y-sided die and adds mod to the result (if applicable).
  * Bot response: result
* !rocks
  * Bot response: "Rocks fall. Everyone dies."
* !playfile filename
  * filename is the name of an audio file in the bot's audio folder
  * Bot joins the voice channel the caller is in, and plays the audio file, then leaves the voice channel.
* !play url
  * url is the url of a youtube video
  * Bot joins the voice channel the caller is in, and plays the audio of the youtube video, then leaves the voice channel.
* !say phrase
  * phrase is a text phrase for the bot to say
  * Bot joins the voice channel the caller is in, says the phrase (using a tts program), then leaves the voice channel.
* !join
  * Bot joins the voice channel the caller is in.
* !leave
  * Bot leaves the voice channel the caller is in.