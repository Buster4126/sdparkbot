const discord = require("discord.js");
const fs = require("fs");
const warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));

module.exports.run = async(bot, message, args) => {

    // !warn @playername [reason].

    if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Sorry, jij kan dit niet doen");

    if (!args[0]) return message.reply("Typ een gebruikersnaam");

    if (!args[1]) return message.reply("Geef een reden!");

    if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("Je hebt geen permissies");

    var warnUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

    var reason = args.slice(1).join(" ");

    if (!warnUser) return message.reply("Kan die gebruiker niet vinden!");

    if(warnUser.hasPermission("MANAGE_MESSAGES")) return message.reply("Sorry, je kan deze persoon niet waarschuwen!");

    if (!warns[warnUser.id]) warns [warnUser.id] = {
        warns: 0
    };

    warns[warnUser.id].warns++;

    fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
        if (err) console.log(err);
    });

    var embed = new discord.MessageEmbed()
        .setColor("#ff0000")
        .setFooter(message.member.displayname, message.author.displayAvatarURL)
        .setTimestamp()
        .setDescription(`**Warned:** ${warnUser} (${warnUser.id})
        **Warned door:** ${message.author}
        **Reden: ** ${reason}`)
        .addField("Warns:", warns[warnUser.id].warns);

    var channel = message.member.guild.channels.cache.get("732250733914750996");

    if (!channel) return("Bestaat niet");

    channel.send(embed);

    if (warns[warnUser.id].warns == 3) {

        var embed = new discord.MessageEmbed()
            .setColor("#ff0000")
            .setDescription("**Let op**")
            .addField("Bericht:", "Je kan nog maar 1 waarschuwing krijgen tot je wordt verbannen!");
        
        message.channel.send(embed);
        
    }else if (warns[warnUser.id].warns == 4) {
        message.guild.member(warnUser).ban(reason);
        message.channel.send(`${warnUser} is verbannen, hij/zij had 4 waarschuwingen!`);
    }

}

module.exports.help = {
    name: "warn"
}