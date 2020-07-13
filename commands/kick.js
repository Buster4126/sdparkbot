const discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    //const args = message.content.slice(prefix.lenght).split(/ +/);

    if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Sorry, jij kan dit niet doen");

    if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("Je hebt geen permissies");

    // if (args[1]) return message.reply("Please write an unsername.");
    if (!args[0]) return message.reply("Typ een gebruikersnaam!")

    // if (!args[2]) return message.reply("Please write a reason!");
    if (!args[1]) return message.reply("Geef een reden!");

    // var kickUser = message.guild.member(message.mentions.users.first() || message.guid.members.get(args[1]));
    var kickUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

    // var reason = args.slice(2).join(" ");
    var reason = args.slice(1).join(" ");

    if (!kickUser) return message.reply("Kan die gebruiker niet vinden!");

    var embed = new discord.MessageEmbed()
        .setColor("#ff0000")
        .setThumbnail(kickUser.user.displayAvatarURL)
        .setFooter(message.member.displayName, message.author.displayAvatarURL)
        .setTimestamp()
        .setDescription(`**Gekicked:** ${kickUser} (${kickUser.id})
            **Gekicked door:** ${message.author}
            **Reden: ** ${reason}`);
    var embedPrompt = new discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor("Reageer binnen 30 seconden")
        .setDescription(`Weet je zeker dat je ${kickUser} wilt kicken?`);

    message.channel.send(embedPrompt).then(async msg => {

        var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

        // We kijken dat het de gebruiker is die het als eerste heft uitgevoerd.
        // message.channel.awaitMessages(m => m.author.id == message.author.id,
        //     {max:1, time: 30000 }).then(collected => {

        //      if (collected.first().content.toLowerCase() == 'yes') {
        //      message.reply('Kick player.');
        //      }
        //      else
        //      message.reply('Canceled');

        //  }).catch(() => {
        //      message.reply('Didn't react within 30 seconds');
        //  });

        



        if (emoji === "✅") {

            msg.delete();

            kickUser.kick(reason).catch(err => {
                console.log(err);
                return;
                //if (err) return message.channel.send(`Something went wrong!`);
            });

            message.reply(embed);

        } else if (emoji === "❌") {
            
            msg.delete();

            message.reply("Kick geannuleerd").then(m => m.delete(5000));

        }
        
        
    });
}

// Emojis aan teksten kopellen.
async function promptMessage(message, author, time, reactions) {
    // We gaan eerst de tijd * 1000 doen zodat we seconden uitkomen.
    time *=1000;

    //We gaan ieder meegegeven reactie onder de reactie plaatsen.
    for (const reaction of reactions) {
        await message.react(reaction);
    }

    // Als de emoji de juiste emoji is die men heeft opgegeven en als ook de auteur die dit heeft aangemaakt er op klikt
    // dan kunnen we een bericht terug sturen.
    const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === author.id;

    // We kijken als de reactie juist is, dus met die filter en ook het aantal keren en binnen de tijd.
    // Dan kunnen we bericht terug sturen met dat iconntje dat s aangeduid.
    return message.awaitReactions(filter, {max: 1, time: time }).then(collected => collected.first() && collected.first().emoji.name);
}

module.exports.help = {
    name: "kick",
    description: "Kick an user",
    category: "Staff Commands"
}