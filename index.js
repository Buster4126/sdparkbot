const discord = require("discord.js");
const botConfig = require("./botconfig.json");

const fs = require("fs");
const { join } = require("path");

const active = new Map();

const client = new discord.Client();
client.commands = new discord.Collection();

client.login(process.env.token);


fs.readdir("./commands/", (err, files) => {

  if (err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    console.log("Can/'t find the commands map!");
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} was loaded!`);
    client.commands.set(props.help.name, props);
  });
});


client.on("ready", async () => {

  console.log(`${client.user.username} is online.`);

  client.user.setActivity("⭐ play.sdpark.nl", { type: "PLAYING" });

});


client.on("message", async message => {

  if (message.author.bot) return;

  if (message.channel.type === "dm") return;

  var prefix = botConfig.prefix;

  if (message.content.charAt(0) != prefix) {
    return;
  }

  var messageArray = message.content.split(" ");


  // var swearWords = JSON.parse(fs.readFileSync("./swearWords.json"));

  // var sentenceUser = "";
  // var amountSwearWords = 0;

  // for (let y = 0; y < messageArray.length; y++) {

  //   const word = messageArray[y].toLowerCase;

  //   var changeWord = "";

  //   for (let i = 0; i < swearWords["swearwords"].length; i++) {

  //     if (word.includes(swearWords["swearwords"][i])) {

  //       changeWord = word.replace(swearWords["swearwords"][i], "*******");

  //       sentenceUser += " " + changeWord;

  //       amountSwearWords++;

  //     }

  //   }

  //   if (!changeWord) {
  //     sentenceUser += " " + messageArray[y];
  //   }

  // }

  // if (amountSwearWords != 0) {

  //   message.delete();
  //   message.channel.send(sentenceUser);

  //   message.channel.send("Don't swear");

  // }


  var command = messageArray[0];

  if (!message.content.startsWith(prefix)) return;

  let args = messageArray.slice(1);

  let commandfile = client.commands.get(command.slice(prefix.length));

  var options = {

    active: active

  }

  if (commandfile) commandfile.run(client, message, args, options);

});






