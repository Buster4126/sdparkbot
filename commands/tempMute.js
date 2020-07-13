const discord = require("discord.js");
const ms = require("ms");

module.exports.run = async(bot, message, args) => {

    if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("You need more permissions!");

    if (!args[0]) return message.reply("Please write an username!");

    if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("No permissions");

    
    var mutePerson = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

    if (!mutePerson) return message.reply("Couldn't find that user!");

    if (mutePerson.hasPermission("MANAGE_MESSAGES")) return message.reply("You cannot mute this member!");

    var muteRole = message.guild.roles.cache.get('732190781728620626');
    if(!muteRole) return message.channel.send("There is no mute role!");

    var muteTime = args[1];

    if (!muteTime) return message.channel.send("Please write how long that player should get muted! Example: !tempmute @player 1m");

    await(mutePerson.roles.add(muteRole.id));
    message.channel.send(`${mutePerson} got muted for ${muteTime}`);

    setTimeout(() => {

        mutePerson.roles.remove(muteRole.id);

        message.channel.send(`${mutePerson} got unmuted! Please read the #regels`);

    }, ms(muteTime));


}

module.exports.help = {
    name: "tempmute"
}