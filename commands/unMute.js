const discord = require("discord.js");

module.exports.run = async(bot, message, args) => {

    if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("You need more permissions!");

    if (!args[0]) return message.reply("Please write an username!");

    if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("No permissions");

    var mutePerson = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
   
    var muteRole = message.guild.roles.cache.get('732190781728620626');
    if(!muteRole) return message.channel.send("There is no mute role!");

    mutePerson.roles.remove(muteRole.id);

    message.channel.send(`${mutePerson} got unmuted! Please read the #regels`);

}

module.exports.help = {
    name: "unmute"
}