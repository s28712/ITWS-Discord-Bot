// Load environment variables from .env file
const dotenv = require("dotenv")
dotenv.config()

// Import Discord Node Module
const Discord = require("discord.js");

/** The prefix that commands use. */
const commandPrefix = "!";

/** ID of the Intro to ITWS category channel */
const itwsCategoryId = "749708689212047490";

// Define Roles with id's
/** Role names matched to role IDs */
const roles = {
    Class21: "735896289711095938",
    Class22: "735896105660842055",
    Class23: "735896180084572210",
    Class24: "735896243393265754",
    Intro: "749708912021733396"
}

/** List of role names */
const roleListMessage = '**Roles**\n' + Object.keys(roles).join("\n")

/** Message to send for the help command */
const helpMessage = [
    '**List of commands:**',
    '-----------------',
    `\`${commandPrefix}help\` - bring up this prompt`,
    `\`${commandPrefix}role roleName\` - add yourself to a role (use \`${commandPrefix}role list\` to recive a direct message with a list of all of the roles`
].join("\n")

/** Bot object */
const bot = new Discord.Client();

bot.once("ready", () => {
    console.log(`Bot is ready with command prefix ${commandPrefix}`);
});

bot.on("message", (message) => {
    // Ignore non-commands
    if (!message.content.startsWith(commandPrefix)) return;

    // Divide input into parts
    // Command will be the first part and args will be the arguments
    // e.g. "!role ITWS" -> command="!role", args=["ITWS"]
    let [command, ...args] = message.content.split(" ");

    // Remove command prefix
    command = command.replace(commandPrefix, "");

    // Help command
    if (command === "help") {
        message.channel.send(helpMessage);
    }

    // Role command
    else if (command === "role") {
        const desiredRoleName = args[0]

        if (desiredRoleName == "list") {
            // List all roles
            message.member.send(roleListMessage);
        } else if (desiredRoleName in roles) {
            // User chose a valid role
            message.member.roles.add(roles[desiredRoleName])
        } else {
            // User chose an invalid role
            message.channel.send("That's not a valid role!");
        }
    } /*else if (command == "generate") {
        for (let team = 1; team <= 19; team++) {
            const textChannelName = "team-" + team;
            const voiceChannelName = "Team " + team;

            // Create text-channel
            message.guild.channels.create(textChannelName, {
                parent: itwsCategoryId,
                type: "text",
                topic: "Private discussion channel for Team " + team,
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone,
                        type: "role",
                        deny: "VIEW_CHANNEL"
                    }
                ]
            })

            message.guild.channels.create(voiceChannelName, {
                parent: itwsCategoryId,
                type: "voice",
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone,
                        type: "role",
                        deny: ["CONNECT", "VIEW_CHANNEL"]
                    }
                ]
            })
        }
    }*/ else if (command == "team") {
        const team = parseInt(args[0])

        // Validate team input
        if (team == NaN) {
            message.channel.send("That's not a valid team number!");
            return;
        }

        // Find the team channels
        const categoryChannels = message.guild.channels.cache.get(itwsCategoryId).children;
        const teamTextChannel = categoryChannels.find(channel => channel.name === "team-" + team && channel.type == "text");
        const teamVoiceChannel = categoryChannels.find(channel => channel.name === "Team " + team && channel.type == "voice");

        // If either doesn't exist, quit
        if (!teamTextChannel || !teamVoiceChannel) {
            message.channel.send("Your team channels haven't been created yet. We'll add them shortly.");
            return;
        }

        // Wait for both channel overrides to complete
        Promise.all([
            teamTextChannel.updateOverwrite(message.author.id, {
                VIEW_CHANNEL: true
            }, "Added to team text channel"),
            teamVoiceChannel.updateOverwrite(message.author.id, {
                VIEW_CHANNEL: true,
                CONNECT: true
            }, "Added to team voice channel")
        ])
            .then(() => {
                // Send success DM with link to text channel
                message.member.send("Added you to your team channels! " + teamTextChannel.toString() + " Let a moderator know if you put the wrong team.");
            })
            .catch(error => {
                console.error(error);
                message.channel.send("Failed to add you to that team... We'll look into the issue!")
            })
    }
});

// Bot login using key
bot.login(process.env.DISCORD_BOT_TOKEN);
