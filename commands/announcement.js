const discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    // !announcement title | message | color | channel

    if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("jij kan dit niet gebruiken");

    var seperator = "|";

    if (args[0] == null) {

        var embed = new discord.MessageEmbed()
            .setTitle("Gebruik")
            .setColor("GREEN")
            .setDescription(`Maak een mededeling. Gebruik: \n !announcement titel ${seperator} bericht ${seperator} kleur ${seperator} kanaal`);

        return message.reply(embed);

    }

    var argsList = args.join(" ").split(seperator);

    if (argsList[2] === undefined) argsList[2] = "#eeeeee";
    if (argsList[3] === undefined) argsList[3] = "general";

    var options = {

        titel: argsList[0],
        message: argsList[1] || ("Er is geen bericht"),
        color: argsList[2].trim(),
        channel: argsList[3].trim()

    }

    var announceEmbed = new discord.MessageEmbed()
        .setTitle(`${options.titel}`)
        .setColor(options.color)
        .setDescription(`\n\n ${options.message}`)
        .setTimestamp();

    var channel = message.member.guild.channels.cache.find(channels => channels.name === options.channel);
    if(!channel) return message.reply("Dit kanaal bestaat niet!");

    channel.send(announceEmbed);

}

module.exports.help = {
    name: "announcement",
    description: "Make a server announcement",
    category: "Staff Commands"
}